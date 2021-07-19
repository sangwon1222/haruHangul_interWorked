import { PartnerResource } from '@/activity/core/resource/viewer/partnerResource'
import * as PartnerProduct from '@/activity/core/resource/product/partnerProduct'
import { ResourceManager } from '@/activity/core/resourceManager'
import { SceneBase } from '@/activity/core/sceneBase'
import config from '@/activity/gameUtil/config'
import {
  getCombinationType,
  getConstantVowel,
  getSound,
  getSyllableType,
  shuffleArray,
  syllableToNum
} from '@/activity/gameUtil/game'
import { Intro } from '@/activity/scene/intro'
import gsap, { Power0 } from 'gsap'
import { EventSprite } from '@/activity/widget/eventSprite'
import { Dimmed } from '@/activity/widget/dimmed'
import { Eop } from '@/activity/scene/eop'
import { App } from '@/activity/core/app'
import { Affordance } from '@/activity/widget/affordance'
import { SoundBtn } from '@/activity/widget/soundBtn'
import Axios from 'axios'
import pixisound from 'pixi-sound'

let gameData = null

let correctAry: Array<SideExam> = []
let wrongAry: Array<SideExam> = []

let quizAry: Array<Phoneme> = []

export class BgCharacter extends PIXI.Container {
  private mIndex: number
  private mCloud: PIXI.Sprite
  private mCharacter: PIXI.Sprite
  private mCloudMotion: any
  private mCharacterMotion: any
  constructor(index: number) {
    super()
    this.mIndex = index

    this.mCloud = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`cloud0${index + 1}.png`).texture
    )
    this.mCharacter = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`bg_ch${index + 1}.png`).texture
    )
    this.mCloud.position.set(60, this.mCharacter.height / 2)

    this.addChild(this.mCloud, this.mCharacter)
    this.mCloudMotion = gsap
      .to(this.mCloud, { y: 10, duration: 5 })
      .yoyo(true)
      .repeat(-1)
    // this.mCharacterMotion = gsap
    //   .to(this.mCharacter, { x: 10, duration: 5 })
    //   .yoyo(true)
    //   .repeat(-1)
  }
  async move() {
    gsap
      .to(this, { y: this.y - 10, duration: 2, ease: Power0.easeNone })
      .repeat(-1)
      .yoyo(true)
  }

  destroy() {
    this.move = () => null
    if (this.mCharacterMotion) this.mCharacterMotion.kill()
    this.mCharacterMotion = null
    if (this.mCloudMotion) this.mCloudMotion.kill()
    this.mCloudMotion = null
  }
}

export class Phoneme extends PIXI.Container {
  private mData: { type: number; index: number; phoneme: string }

  private mDefault: PIXI.Sprite
  private mFocus: PIXI.Sprite
  private mDeep: PIXI.Sprite

  private mText: PIXI.Sprite

  constructor(data: { type: number; index: number; phoneme: string }) {
    super()
    this.mData = data

    this.mDefault = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(
        `type${this.mData.type}_${this.mData.index + 1}default.png`
      ).texture
    )
    this.mFocus = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(
        // `type${this.mData.type}_focus${this.mData.index + 1}.png`
        `type${this.mData.type}_${this.mData.index + 1}pink.png`
      ).texture
    )
    this.mDeep = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(
        `type${this.mData.type}_${this.mData.index + 1}deep.png`
      ).texture
    )
    this.addChild(this.mDefault, this.mDeep, this.mFocus)

    this.createText()

    this.sortableChildren = true
    this.mText.zIndex = 4
    this.mFocus.zIndex = 3
    this.mDeep.zIndex = 2
    this.mDefault.zIndex = 1
  }

  startIntro() {
    this.mFocus.texture = ResourceManager.Handle.getCommonResource(
      `type${this.mData.type}_${this.mData.index + 1}pink.png`
    ).texture
  }

  startGame() {
    this.mText.alpha = 0
    this.mFocus.alpha = 0
    this.mDeep.alpha = 0
  }

  focus() {
    const num = syllableToNum(this.mData.phoneme)
    // 초성//중성//종성
    let sndType = getSyllableType(this.mData.phoneme)
    if (this.mData.index == 2) {
      sndType = '3jong_'
    }
    const sound = ResourceManager.Handle.getCommonResource(
      `${sndType}${num}.mp3`
    ).sound
    sound.play()

    gsap
      .to(this.mFocus, { alpha: 0.6, duration: 1, ease: Power0.easeNone })
      .repeat(-1)
      .yoyo(true)
    this.mDeep.alpha = 1

    this.interactive = true
    this.buttonMode = true
    this.on('pointertap', () => {
      this.interactive = false
      this.buttonMode = false

      sound.play()

      gsap.delayedCall(sound.duration, () => {
        this.interactive = true
        this.buttonMode = true
      })
    })
  }

  complete() {
    this.interactive = false
    this.buttonMode = false
    gsap.killTweensOf(this.mFocus)
    this.startIntro()
    gsap.to(this.mText, { alpha: 1, duration: 0.5 })
    gsap.to(this.mFocus, { alpha: 1, duration: 0.5 })
  }

  createText() {
    const t = this.mData.type
    const i = this.mData.index
    const p = this.mData.phoneme

    // 초성 중성 종성
    let phonemeType = getSyllableType(p)
    // ex=> 아=> type1 , 오=>type2
    let type = `t${t}_`

    if (i == 2) {
      phonemeType = '3jong_'
      type = 'at_'
    }
    // 음소에 매치된 숫자 가져오기
    const num = syllableToNum(p)
    const img = `${phonemeType}${type}${num}.png`
    this.mText = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(img).texture
    )
    this.addChild(this.mText)
  }
}

export class TypeBody extends PIXI.Container {
  private mText: string

  private mAffordance: PIXI.Sprite

  constructor(text: string) {
    super()
    this.mText = text
  }

  startGame(): Promise<void> {
    return new Promise<void>((resolve) => {
      // 단어를 음절로 나누고
      let offsetX = 0
      quizAry = []
      for (let i = 0; i < this.mText.length; i++) {
        const type = getCombinationType(this.mText[i])
        const syllable = getConstantVowel(this.mText[i])

        const bg = new PIXI.Sprite(
          ResourceManager.Handle.getCommonResource('box_shadow.png').texture
        )
        bg.x = offsetX
        offsetX += bg.width + 20
        this.addChild(bg)

        for (let j = 0; j < syllable.length; j++) {
          // 음절을 음소로 나누고

          // console.log(`%c ______________________`,'border-bottom:2px red solid;')
          // console.log(`syllable=>${syllable[j]}`)
          // console.log(`type=>${type}`)
          // console.log(`index=>${j}`)
          const data = { type: type, index: j, phoneme: syllable[j] }
          const phoneme = new Phoneme(data)
          bg.addChild(phoneme)
          phoneme.startGame()
          quizAry.push(phoneme)
        }
      }
      this.pivot.set(this.width / 2, this.height / 2)

      resolve()
    })
  }

  introVersion() {
    // 단어를 음절로 나누고
    let offsetX = 0
    for (let i = 0; i < this.mText.length; i++) {
      const type = getCombinationType(this.mText[i])
      const syllable = getConstantVowel(this.mText[i])

      const bg = new PIXI.Sprite(
        ResourceManager.Handle.getCommonResource('box_shadow.png').texture
      )
      bg.x = offsetX
      offsetX += bg.width + 20
      this.addChild(bg)

      for (let j = 0; j < syllable.length; j++) {
        // 음절을 음소로 나누고
        const data = { type: type, index: j, phoneme: syllable[j] }
        const phoneme = new Phoneme(data)
        bg.addChild(phoneme)
        phoneme.startIntro()
      }
    }

    this.pivot.set(this.width / 2, this.height / 2)

    gsap
      .to(this.scale, { x: 0.98, y: 0.98, duration: 1, ease: Power0.easeNone })
      .repeat(-1)
      .yoyo(true)

    this.introEvent()

    this.mAffordance = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`hand.png`).texture
    )
    this.mAffordance.position.set(this.width / 2, this.height / 2 + 50)
    this.addChild(this.mAffordance)
    this.mAffordance.zIndex = 5
    gsap
      .to(this.mAffordance, { y: this.mAffordance.y - 20, duration: 1 })
      .repeat(-1)
      .yoyo(true)
  }

  /**인트로때 클릭하면 소리나고 그냥 본게임으로 넘어간다. */
  introEvent() {
    this.interactive = true
    this.buttonMode = true
    this.on('pointertap', () => {
      if (window['clickSnd']) window['clickSnd'].play()
      this.interactive = false
      this.buttonMode = false
      gsap.killTweensOf(this.scale)
      gsap.killTweensOf(this.mAffordance)
      this.removeChild(this.mAffordance)
      this.mAffordance = null
      gsap
        .to(this.scale, { x: 1, y: 1, duration: 1, ease: Power0.easeNone })
        .eventCallback('onComplete', () => {
          const num = getSound(gameData.correct)
          const wordSnd = ResourceManager.Handle.getCommonResource(
            `word_${num}.mp3`
          ).sound
          wordSnd.play()
          gsap.delayedCall(wordSnd.duration + 1, () => {
            ;(this.parent as IntroScene).next()
          })
        })
    })
  }
}

export class IntroScene extends PIXI.Container {
  private mSideBg: PIXI.Sprite
  constructor() {
    super()
  }
  onStart() {
    this.createBg()
    this.createText()
  }

  createBg() {
    // 배경 이미지 생성
    const bg = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource('bg.png').texture
    )
    this.addChild(bg)

    // 배경 캐릭터 생성
    for (let i = 0; i < 2; i++) {
      const bgcharacter = new BgCharacter(i)
      if (i == 0) {
        bgcharacter.position.set(80, 530)
        bgcharacter.move()
      } else {
        bgcharacter.position.set(762, 140)
        bgcharacter.move()
      }
      bg.addChild(bgcharacter)
    }

    this.mSideBg = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource('intro_side_bar.png').texture
    )
    this.mSideBg.position.set(config.w, 0)
    bg.addChild(this.mSideBg)
    gsap.to(this.mSideBg, { x: config.w - this.mSideBg.width, duration: 1 })
  }

  createText() {
    const typeBody = new TypeBody(gameData.correct)
    typeBody.position.set(config.w / 2 - this.mSideBg.width / 2, config.h / 2)
    this.addChild(typeBody)
    typeBody.introVersion()
  }

  next() {
    ;(this.parent as Partner).setGame()
  }
}

export class SideExam extends PIXI.Sprite {
  private mBg: PIXI.Sprite
  private mText: PIXI.Sprite

  constructor(t: number, index: number, phoneme: string) {
    super()

    let imgType = getSyllableType(phoneme)
    let type = `t${t}_`

    this.texture = ResourceManager.Handle.getCommonResource(
      `${type}line.png`
    ).texture

    if (index == 2) {
      imgType = '3jong_'
      type = 'at_'
    }

    this.mBg = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(
        `side_type${t}_pink${index + 1}.png`
      ).texture
    )
    this.mBg.anchor.set(0.5)

    const num = syllableToNum(phoneme)

    this.mText = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(
        `${imgType}${type}${num}.png`
      ).texture
    )
    this.mText.anchor.set(0.5)

    this.addChild(this.mBg, this.mText)

    this.anchor.set(0.5)

    this.interactive = true
    this.buttonMode = true
    this.on('pointertap', () => {
      this.onClick()
    })
  }

  /**overwhite function*/

  onClick() {
    /**overwhite // from SideBar */
  }
}

export class SideBar extends PIXI.Sprite {
  private mStep: number
  private mCorrect: SideExam
  private mWrong: SideExam

  constructor() {
    super()
    this.texture = ResourceManager.Handle.getViewerResource(
      'side_bar.png'
    ).texture

    this.mStep = 0

    let index = 0
    /**정오답 퀴즈를 만들어 배열에 넣어둔다. */
    correctAry = []
    wrongAry = []
    for (let i = 0; i < gameData['correct'].length; i++) {
      const type = getCombinationType(gameData['correct'][i])
      // **********************************************************
      const wrongt = gameData.wrongType[index]
      // **********************************************************
      const ary = getConstantVowel(gameData['correct'][i])
      for (let j = 0; j < ary.length; j++) {
        correctAry.push(new SideExam(type, j, ary[j]))

        wrongAry.push(new SideExam(wrongt, j, gameData.wrong[index]))
        index += 1
      }
    }

    this.setExam()
  }

  setExam() {
    this.removeChildren()

    this.mCorrect = correctAry[this.mStep]
    this.mWrong = wrongAry[this.mStep]

    const ary = shuffleArray([this.mWrong, this.mCorrect])

    const y = [config.h / 2 + 30 - 150, config.h / 2 + 20 + 150]
    for (let i = 0; i < 2; i++) {
      ary[i].position.set(this.width / 2 + 10, config.h / 2)
      this.addChild(ary[i])
      gsap
        .to(ary[i], { y: y[i], duration: 0.5 })
        .eventCallback('onComplete', async () => {
          await this.startEvent()
        })
    }
  }

  async startEvent() {
    this.mCorrect.onClick = async () => {
      this.mCorrect.onClick = () => null
      // console.log(`정답!`)
      const correctSnd = ResourceManager.Handle.getViewerResource(
        `ac4_correct.mp3`
      ).sound
      correctSnd.play()
      await this.disableWrong()
      this.mStep += 1
      ;(this.parent as GameScene).gameStep = this.mStep
      if (this.mStep < quizAry.length) {
        this.setExam()
      } else {
        gsap.delayedCall(1, () => {
          ;(this.parent as GameScene).goOutro()
        })
      }
    }

    this.mWrong.onClick = async () => {
      this.mWrong.onClick = () => null
      // console.log(`오답!`)
      const wrongSnd = ResourceManager.Handle.getViewerResource(`ac4_wrong.mp3`)
        .sound
      wrongSnd.play()
      await this.disableWrong()
    }
  }

  disableWrong(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mWrong.interactive = false
      this.mWrong.tint = 0xbcbcbc
      this.mWrong.alpha = 0.5
      gsap
        .to(this.mWrong, { alpha: 0, duration: 0.5 })
        .delay(0.5)
        .eventCallback('onComplete', () => {
          this.removeChild(this.mWrong)
          resolve()
        })
    })
  }
}

export class GameScene extends PIXI.Container {
  private mSideBar: SideBar

  private mGameStep: number
  get gameStep(): number {
    return this.mGameStep
  }
  set gameStep(v: number) {
    quizAry[this.mGameStep].complete()
    if (quizAry[v] !== undefined) {
      this.mGameStep = v
      quizAry[this.mGameStep].focus()
    } else {
      // console.error(`게임 끝!`)
    }
  }

  constructor() {
    super()
  }
  onStart() {
    this.createBg()
    this.createQuiz()
  }

  /**백그라운드와 백그라운드 캐릭터, 사운드버튼 생성 */
  createBg() {
    const bg = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource('bg.png').texture
    )
    this.addChild(bg)
    for (let i = 0; i < 2; i++) {
      const bgcharacter = new BgCharacter(i)
      if (i == 0) {
        bgcharacter.position.set(80, 530)
        bgcharacter.move()
      } else {
        bgcharacter.position.set(762, 140)
        bgcharacter.move()
      }
      bg.addChild(bgcharacter)
    }

    // 사운드 버튼
    // const wordNum = getSound(config.quizWord)
    const wordNum = getSound(gameData.correct)
    const sndBtn = new SoundBtn(`word_${wordNum}.mp3`)
    sndBtn.position.set(config.w / 2 - 320 / 2, 150)
    this.addChild(sndBtn)
  }

  /**우측 사이드바 , 좌측 퀴즈 생성 */
  async createQuiz() {
    this.mGameStep = 0

    this.mSideBar = new SideBar()
    this.mSideBar.x = config.w - this.mSideBar.width

    const typeBody = new TypeBody(gameData.correct)
    typeBody.position.set(config.w / 2 - this.mSideBar.width / 2, config.h / 2)
    this.addChild(this.mSideBar, typeBody)
    await typeBody.startGame()
    quizAry[this.mGameStep].focus()
  }

  goOutro() {
    gsap
      .to(this.mSideBar, { x: config.w, duration: 0.5 })
      .eventCallback('onComplete', () => {
        this.removeChild(this.mSideBar)
        this.mSideBar = null
      })
    // 딤드 화면
    const dimmed = new Dimmed(config.w, config.h)

    // 아웃트로 카드
    const card = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`card.png`).texture
    )
    card.anchor.set(0.5)
    card.position.set(config.w / 2, config.h / 2)
    card.scale.set(0)

    this.addChild(dimmed, card)

    //아웃트로 카드 안의 완성이미지
    const num = getSound(gameData.correct)

    const complete = new EventSprite(
      ResourceManager.Handle.getCommonResource(`word_${num}.png`).texture
    )
    complete.position.set(-268, 0)
    complete.scale.set(0.6)

    //아웃트로 카드 안의 완성텍스트
    const text = new PIXI.Text(gameData.correct, {
      fontSize: 140,
      padding: 20,
      fontFamily: 'TmoneyRoundWindExtraBold'
    })
    text.anchor.set(0.5)
    text.position.set(210, 0)

    card.addChild(complete, text)

    const popSnd = ResourceManager.Handle.getViewerResource('ac4_cardpop.mp3')
      .sound
    popSnd.play()

    gsap.to(card.scale, { x: 1, y: 1, duration: 0.5 })
    gsap.delayedCall(popSnd.duration, () => {
      const num = getSound(gameData.correct)
      const wordSnd = ResourceManager.Handle.getCommonResource(
        `word_${num}.mp3`
      ).sound
      wordSnd.play()
      gsap
        .to(complete.scale, { x: 0.5, y: 0.5, duration: 0.5 })
        .yoyo(true)
        .repeat(1)
      gsap
        .to(text.scale, { x: 0.9, y: 0.9, duration: 0.5 })
        .yoyo(true)
        .repeat(1)
      gsap.delayedCall(wordSnd.duration + 1, () => {
        ;(this.parent as Partner).endgame()
      })
    })
  }
}

export class Partner extends SceneBase {
  private mBGM: PIXI.sound.Sound
  private mIntroScene: IntroScene
  private mGameScene: GameScene
  private mWrongCount: number

  private mGameResource: Array<string>
  private mGameSound: Array<string>

  constructor() {
    super('partner')
    this.mWrongCount = 0
  }
  async onInit() {
    gsap.globalTimeline.clear()
    //// pixisound.stopAll()
    window.onkeypress = () => null

    this.startTime()

    await App.Handle.showLoadingScreen()

    await this.getData()

    await this.getLoadResource()

    await ResourceManager.Handle.loadCommonResource({
      images: this.mGameResource,
      sounds: this.mGameSound
      // sounds: [`${phonemeType}${num}.mp3`, `word_${wordnum}.mp3`]
    })
    // // console.error(this.mGameResource)

    await ResourceManager.Handle.loadCommonResource({
      images: config.partnerNtotal
    })
    await ResourceManager.Handle.loadViewerResource(PartnerResource)

    await App.Handle.closeLoadingScreen()

    window.onkeypress = (evt: KeyboardEvent) => {
      if (evt.key == '+') {
        this.removeChildren()
        //// pixisound.stopAll()
        gsap.globalTimeline.clear()
        this.endgame()
      }
    }
  }

  async onStart() {
    let intro = new Intro()
    this.addChild(intro)
    await intro.playIntro()
    this.removeChild(intro)
    intro = null
    this.mBGM = ResourceManager.Handle.getViewerResource(`ac4_bgm.mp3`).sound
    this.mBGM.play({ loop: true })
    this.mIntroScene = new IntroScene()
    this.addChild(this.mIntroScene)
    this.mIntroScene.onStart()

    // this.setGame()
  }

  setGame() {
    this.removeChildren()
    this.mIntroScene = null
    this.mGameScene = new GameScene()
    this.addChild(this.mGameScene)
    this.mGameScene.onStart()
  }

  async endgame() {
    window.onkeypress = () => null

    await this.endTime()
    const token = localStorage.getItem('token')

    const index = App.Handle.getSceneIndex()
    const info = await Axios.get(`${config.restAPIProd}`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    const code = info.data.result[index].cd
    const end = await Axios.post(
      `${config.restAPI}/learning/hangul/day/${config.selectDay}/activities/${code}`,
      { wrongCount: this.mWrongCount },
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    )
    // console.warn(end)

    if (this.mBGM) this.mBGM.pause()
    this.mBGM = null

    let eop = new Eop()
    this.addChild(eop)
    await eop.eopPlay()
    eop = null
    this.removeChildren()
    this.destroy()
    App.Handle.nextGame()
  }

  wrong() {
    this.mWrongCount += 1
  }

  getData(): Promise<void> {
    return new Promise<void>((resolve) => {
      const requestUrl = `${config.resource}data/partner_data.json`
      const request = new XMLHttpRequest()
      request.open('GET', requestUrl)
      request.responseType = 'json'
      request.send()
      request.onloadend = () => {
        gameData = request.response['data'][`${config.selectDay}`]
        resolve()
      }
    })
  }

  getLoadResource(): Promise<void> {
    return new Promise<void>((resolve) => {
      const num = getSound(gameData.correct)
      this.mGameResource = [`word_${num}.png`]
      this.mGameSound = [`word_${num}.mp3`]

      let index = 0
      for (let i = 0; i < gameData.correct.length; i++) {
        const phoneme = getConstantVowel(gameData.correct[i])

        for (let j = 0; j < phoneme.length; j++) {
          const t = getCombinationType(gameData.correct[i])
          const correctNum = syllableToNum(phoneme[j])
          const wrongNum = syllableToNum(gameData.wrong[index])

          const wrongt = gameData.wrongType[index]

          let correctFile = ``
          let wrongFile = ``
          let soundFile = ``

          if (j == 0) {
            correctFile = `1cho_t${t}_${correctNum}.png`
            wrongFile = `1cho_t${wrongt}_${wrongNum}.png`
            soundFile = `1cho_${correctNum}.mp3`
          }
          if (j == 1) {
            correctFile = `2jung_t${t}_${correctNum}.png`
            wrongFile = `2jung_t${wrongt}_${wrongNum}.png`
            soundFile = `2jung_${correctNum}.mp3`
          }
          if (j == 2) {
            correctFile = `3jong_at_${correctNum}.png`
            wrongFile = `3jong_at_${wrongNum}.png`
            soundFile = `3jong_${correctNum}.mp3`
          }

          // 정답 이미지 넣기
          let flag = true
          for (const file of this.mGameResource) {
            if (file == correctFile) {
              flag = false
            }
          }
          if (flag == true) {
            this.mGameResource.push(correctFile)
          }
          // =================================================

          // 오답 이미지 넣기
          let wrongflag = true
          for (const file of this.mGameResource) {
            if (file == wrongFile) {
              wrongflag = false
            }
          }
          if (wrongflag == true) {
            this.mGameResource.push(wrongFile)
          }
          // =================================================

          // 사운드 넣기
          let soundflag = true
          for (const file of this.mGameSound) {
            if (file == soundFile) {
              soundflag = false
            }
          }
          if (soundflag == true) {
            this.mGameSound.push(soundFile)
          }
          // =================================================

          index += 1
        }
      }
      resolve()
    })
  }
}
