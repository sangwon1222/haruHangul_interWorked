import { ResourceManager } from '@/activity/core/resourceManager'
import { RymthmResource } from '@/activity/core/resource/viewer/rhythmResource'
import { RhythmCard } from '@/activity/widget/rhythmCard'
import { SceneBase } from '@/activity/core/sceneBase'
import { Intro } from '@/activity/scene/intro'
import { EventSprite } from '@/activity/widget/eventSprite'
import Config from '@/activity/gameUtil/config'
import gsap from 'gsap'
import Util from '@/activity/gameUtil'
import {
  syllableToNum,
  getSymbol,
  shuffleArray,
  getSyllableType,
  debugLine,
  getColorByPoint
} from '@/activity/gameUtil/game'
import config from '@/activity/gameUtil/config'
import { Eop } from '@/activity/scene/eop'
import { App } from '@/activity/core/app'
import { Affordance } from '@/activity/widget/affordance'
import Axios from 'axios'
import pixisound from 'pixi-sound'

let soundList = []
let random = 3

const colorAry = [
  0x8a4dff /**보라색 */,
  0xf92121 /**빨간색 */,
  0x009b58 /**녹색 */
  // 0x23cc23 /**녹색 */
]

const font = [
  'BareunBatangOTFM',
  'TmoneyRoundWindExtraBold',
  'NanumBarunGothicBold',
  'BareunBatangOTFM'
]
const color = [0xff5e9b, 0xff5e9b, 0xff5e9b, 0xff5e9b]

/**
 * 핑크 폰트색 => 0xff5e9b
 * */

const fontAry = [
  'BareunBatangOTFM',
  'TmoneyRoundWindExtraBold',
  'NanumBarunGothicBold'
]
// const fontList = shuffleArray(fontAry)

export class Sound extends PIXI.Container {
  private mFileName: string
  private mSound: PIXI.sound.Sound

  get duration(): number {
    return this.mSound.duration
  }

  constructor(font: string) {
    super()

    if (font == 'NanumBarunGothicBold') {
      this.mFileName = soundList[0]
    }
    if (font == 'BareunBatangOTFM') {
      this.mFileName = soundList[1]
    }
    if (font == 'TmoneyRoundWindExtraBold') {
      this.mFileName = soundList[2]
    }
    this.mSound = ResourceManager.Handle.getCommonResource(this.mFileName).sound
  }
  play() {
    this.mSound.play()
    gsap.delayedCall(this.mSound.duration, () => {
      this.mSound = null
      this.mFileName = null
      this.destroy()
    })
  }
}

export class IntroScene extends PIXI.Container {
  private mColorIndexAry: Array<number>
  private mQuizIndexAry: Array<number>
  private mCurrentQuizIndex: number
  private mAffordance: Affordance

  private mCardAry: Array<RhythmCard>

  private mQuizPlace: PIXI.Container

  private mEndStep: number

  constructor() {
    super()
    this.mEndStep = 0

    // 미니게임의 게임순서
    this.mCurrentQuizIndex = 0
    // 미니게임 카드배열
    this.mCardAry = []

    const bg = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`t${random}_bg01.png`).texture
    )
    this.addChild(bg)

    // 색이 겹치지 않게 배열을 섞는다
    this.createRandomNum()
    // 게임판 생성 및 현재카드 활성화
    this.createWordPlace()
    // affordance finger motion start
    this.fingerMotion()
  }
  // 색이 겹치지 않게 배열을 섞는다
  createRandomNum() {
    this.mColorIndexAry = []

    const random = [0, 1, 2]
    this.mColorIndexAry = Util.Game.shuffleArray(random)
    this.mColorIndexAry.push(random[0], random[2], random[1])

    this.mQuizIndexAry = []
    const quizRandom = [0, 1, 2, 3, 4, 5]
    this.mQuizIndexAry = Util.Game.shuffleArray(quizRandom)
  }

  // 게임판 생성 및 현재카드 활성화
  createWordPlace() {
    this.mQuizPlace = new PIXI.Container()

    for (let i = 0; i < 6; i++) {
      const card = new RhythmCard(
        getSymbol(),
        colorAry[this.mColorIndexAry[i]],
        fontAry[this.mColorIndexAry[i]],
        i
      )
      this.mQuizPlace.addChild(card)

      card.position.set(i * (card.width + 20) + 20, 0)
      this.mCardAry.push(card)

      card.onClick = () => {
        this.decide(i)
      }
    }
    this.mCardAry[this.mQuizIndexAry[this.mCurrentQuizIndex]].focus()

    this.addChild(this.mQuizPlace)
    this.mQuizPlace.pivot.set(
      this.mQuizPlace.width / 2,
      this.mQuizPlace.height / 2
    )
    this.mQuizPlace.position.set(Config.w / 2, Config.h / 2)
  }
  // 5초동안 활동이 없을 시 손가락어포던스 활성화
  fingerMotion() {
    this.mAffordance = new Affordance(this.mQuizPlace, false)
    this.mQuizPlace.addChild(this.mAffordance)
    this.mQuizPlace.interactive = true
    this.mQuizPlace.on('pointerup', () => this.mAffordance.resetTimer())
  }

  // 카드를 클릭했을 때 카드의 정오답 결정
  decide(cardIndex: number) {
    // console.log(`cardIndex=> ${cardIndex}`)
    // console.log(`mCurrentQuizIndex=> ${this.mQuizIndexAry[this.mCurrentQuizIndex]}`)
    if (cardIndex == this.mQuizIndexAry[this.mCurrentQuizIndex]) {
      this.mCardAry[this.mQuizIndexAry[this.mCurrentQuizIndex]].destroy()
      this.correct(cardIndex)
    } else {
      this.wrong()
    }
  }
  // 선택한 카드가 정답일때
  async correct(index: number) {
    const clickSnd = new Sound(fontAry[this.mColorIndexAry[index]])
    await clickSnd.play()
    this.mCurrentQuizIndex += 1
    if (this.mCardAry[this.mQuizIndexAry[this.mCurrentQuizIndex]]) {
      this.mCardAry[this.mQuizIndexAry[this.mCurrentQuizIndex]].focus()
    } else {
      /**끝나기 전 모두 활성화(복습) */
      gsap.delayedCall(1, () => {
        this.playSound()
      })
    }
  }
  // 선택한 카드가 오답일때
  wrong() {
    let wrong = ResourceManager.Handle.getViewerResource(`ac2_wrong1.mp3`).sound
    wrong.play()
    wrong = null
    for (const card of this.mCardAry) {
      card.delayInterAction(1)
    }
  }
  /**인토르(미니게임)가 끝나면 순차적으로 재생해준 후에 본게임으로 넘어간다
   * 순차적 재생해주는 코드
   */
  async playSound() {
    await this.mAffordance.reset()
    this.mAffordance.destroy()

    App.Handle.modalRoot.visible = false
    if ((this.parent.parent as Rhythm) == null) {
      this.playSound = () => null
    }
    const sound = new Sound(
      this.mCardAry[this.mQuizIndexAry[this.mEndStep]].font
    )
    sound.play()
    this.mCardAry[this.mQuizIndexAry[this.mEndStep]].endMotion()
    gsap.delayedCall(sound.duration + 0.5, () => {
      this.mEndStep += 1
      if (this.mEndStep >= this.mCardAry.length) {
        this.endIntro()
        return
      }
      this.playSound()
    })
  }

  // 인트로(미니게임)가 끝나고 본 게임으로 넘어가는 코드
  endIntro() {
    App.Handle.modalRoot.visible = true

    if ((this.parent.parent as Rhythm) == null) {
      this.endIntro = () => null
      return
    }
    const gameBg = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`t${random}_bg02.png`).texture
    )
    this.addChild(gameBg)
    gameBg.x = Config.w
    gsap
      .to(this, { x: -Config.w, duration: 0.5 })
      .eventCallback('onComplete', () => {
        if (this.parent.parent as Rhythm) {
          ;(this.parent.parent as Rhythm).endIntro()
        }
      })
  }
}

export class QuizTarget extends PIXI.Container {
  private mText: PIXI.Text
  get text(): string {
    return this.mText.text
  }
  get textStyle(): string {
    return this.mText.style.fontFamily
  }
  private mStep: number
  private mMotion: PIXI.spine.Spine
  get motion(): PIXI.spine.Spine {
    return this.mMotion
  }

  private mAffor: PIXI.Sprite
  private mEndMotion: boolean
  set endMotion(v: boolean) {
    this.mEndMotion = v
  }

  set introMode(v: boolean) {
    this.interactive = !v
    this.buttonMode = !v
  }
  constructor(step: number, text: string) {
    super()

    this.mEndMotion = false

    this.mStep = step

    this.createMotion()

    /**퀴즈 텍스트 만들어서 스파인에 넣기 */
    this.mText = new PIXI.Text(text, {
      fontSize: 130,
      fontFamily: font[step],
      fontWeight: 'bold',
      wordWrap: true,
      wordWrapWidth: 130,
      fill: 0xffffff,
      padding: 20
    })
    // this.mText.resolution = 2
    this.mText.tint = color[step]
    this.mText.anchor.set(0.5)
    this.mText.x = 86
    this.mText.scale.x = 1
    this.mText.scale.y = -1
    this.mText.angle = -90

    const temp = this.mMotion.slotContainers[
      this.mMotion.skeleton.findSlotIndex('text')
    ]
    if (random == 2) {
      // 개구리 일때
      // 앵글을 -90도 기울여 놔서
      // x값을 + 하면 y축으로 올라가고
      // y값을 -하면 x축으로 (오른쪽으로) 간다
      this.mText.x += 6
      this.mText.y += 6
      if (this.mText.style.fontFamily == 'BareunBatangOTFM') {
        this.mText.x += 8
      }
    }
    if (random == 3) {
      // 갈매기 일때
      this.mText.x += 12
      this.mText.y -= 26
      if (this.mText.style.fontFamily == 'NanumBarunGothicBold') {
        this.mText.x -= 8
      }
    }

    temp.removeChildren()
    temp.addChild(this.mText)
    temp.updateTransform()

    /**퀴즈 텍스트 만들어서 스파인에 넣기 */

    /**이벤트 등록 */
    this.interactive = true
    this.buttonMode = true

    const area = new PIXI.Graphics()
    area.beginFill(0xff0000, 0.2)
    area.drawRect(-150, -300, 320, 320)
    area.endFill()
    // this.mMotion.addChild(area)

    this.hitArea = new PIXI.Rectangle(-150, -300, 320, 320)
    this.on('pointertap', () => {
      this.onClick()
    })
    /**이벤트 등록 */

    this.mAffor = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource('hand.png').texture
    )
    this.addChild(this.mAffor)
    this.mAffor.anchor.set(0.5)
    this.mAffor.position.set(60, -60)

    this.mAffor.alpha = 0
  }

  /**스파인 모션에 대한 설명 및 생성 */
  createMotion() {
    /**
     * default
     * => 펭귄 둥둥 떠다님
     * fail
     * => 실패
     * fail_default
     * => 실패하고 울고 있는
     * succ
     * => 성공
     */
    this.mMotion = new PIXI.spine.Spine(
      ResourceManager.Handle.getViewerResource(
        `common_penguin${random}.json`
      ).spineData
    )
    this.mMotion.state.setAnimation(0, 'default', true)

    this.addChild(this.mMotion)
  }

  success(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mEndMotion = true
      this.onClick = () => null
      this.mMotion.stateData.defaultMix = 0.25
      // this.mMotion.stateData.setMix('default', 'succ', 0.25)
      this.mMotion.state.setAnimation(0, 'succ', true)
      const delay = this.mMotion.state.data.skeletonData.findAnimation(`succ`)
        .duration
      gsap.delayedCall(delay, () => {
        resolve()
      })
    })
  }
  fail() {
    this.mEndMotion = true
    this.onClick = () => null

    // this.mMotion.stateData.setMix('default', 'fail', 0.25)
    this.mMotion.stateData.defaultMix = 0.25

    this.mMotion.state.setAnimation(0, 'fail', false)
    const delay = this.mMotion.state.data.skeletonData.findAnimation(`fail`)
      .duration
    gsap.delayedCall(delay, () => {
      // this.mMotion.stateData.setMix('fail', 'fail_default', 0.25)
      this.mMotion.state.setAnimation(0, 'fail_default', true)
    })
  }

  disable() {
    this.mMotion.stateData.defaultMix = 0.25

    const state = this.mMotion.state.tracks[0].animation.name

    if (state == 'default') {
      this.mMotion.state.setAnimation(0, 'fail', false)
      const delay = this.mMotion.state.data.skeletonData.findAnimation(`fail`)
        .duration
      gsap.delayedCall(delay, () => {
        this.mMotion.state.setAnimation(0, 'fail_default', true)
      })
    } else {
      this.mMotion.state.setAnimation(0, 'fail_default', true)
    }
    // if (state == 'fail') {
    //   this.mMotion.state.setAnimation(0, 'fail_default', false)
    // }
  }

  onClick() {
    /** */
  }

  async affordance() {
    if (this.interactive == false) {
      this.affordance = () => null
    }
    await this.deleteAffor()
    if (this.mEndMotion == false) {
      const timeline = gsap.timeline({ repeat: -1, yoyo: true, delay: 3 })
      timeline.to(this.mAffor, { alpha: 1, duration: 1 })
      timeline.to(this.mAffor, { angle: -15, duration: 0.25 })
      timeline.to(this.mAffor, { angle: 0, duration: 0.25 })
      timeline.to(this.mAffor, { alpha: 0, duration: 1 })
    } else {
      this.removeChild(this.mAffor)
      this.mAffor = null
    }
  }

  deleteAffor(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.mAffor) {
        gsap.killTweensOf(this.mAffor)
        this.mAffor.alpha = 0
        this.mAffor.angle = 0
      }
      resolve()
    })
  }
}

export class GameScene extends PIXI.Container {
  private mStep: number
  get step(): number {
    if (!this.mStep) {
      return 0
    } else {
      return this.mStep
    }
  }
  private mBg: PIXI.Sprite
  private mQuizList: Array<QuizTarget>

  private mWrongList: Array<string>

  private mCorrectSnd: PIXI.sound.Sound
  private mWrongSnd: PIXI.sound.Sound

  constructor(wrongList: Array<string>) {
    super()
    this.mWrongList = []
    this.mWrongList = wrongList
  }
  async onInit() {
    this.mCorrectSnd = ResourceManager.Handle.getViewerResource(
      `ac2_correct.mp3`
    ).sound
    this.mWrongSnd = ResourceManager.Handle.getViewerResource(
      `ac2_wrong2.mp3`
    ).sound
    this.mStep = (this.parent.parent as Rhythm).currentStep
    // console.log(`%c ${this.mStep}단계 진행중`, 'border:1px red solid;')

    let sound = ResourceManager.Handle.getViewerResource(`ac2_transition.mp3`)
      .sound
    sound.play()
    sound = null

    let gameIndex = 2
    if (this.mStep !== 0) {
      if (this.mStep % 2 == 0) {
        /**bg 왼쪽으로 이동하면서 */
        gameIndex = 2
        await (this.parent.parent as Rhythm).goLeft()
      } else {
        /**bg 오른쪽으로 이동하면서 */
        gameIndex = 3
        await (this.parent.parent as Rhythm).goRight()
      }
    }

    this.removeChildren()
    this.position.set(0, 0)

    let quizCount = 0
    if (this.mStep == 0) {
      quizCount = 1
    } else {
      quizCount = 3
    }

    this.mBg = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(
        `t${random}_bg0${gameIndex}.png`
      ).texture
    )
    this.addChild(this.mBg)
    this.mQuizList = []

    this.createTarget(quizCount)

    if (quizCount == 3) {
      this.interactive = true
      this.on('pointerup', () => {
        this.resetAffordance()
      })
    }
  }

  createTarget(quizCount: number) {
    const center = Config.w / 2
    const x = [center - 400, center, center + 400]
    const y = [560, 500, 560]
    /**본게임인지 하우투 게임인지 */
    let quizList = []
    if (quizCount == 1) {
      quizList = [getSymbol()]
    } else {
      const list = [getSymbol(), this.mWrongList[0], this.mWrongList[1]]
      quizList = shuffleArray(list)
    }
    if (window['gameMotion'] && window['gameMotion'].length > 0) {
      for (let motion of window['gameMotion']) {
        motion.kill()
        motion = null
      }
    }
    window['gameMotion'] = []

    this.sortableChildren = true
    /**본게임or 인트로 분기쳐서 퀴즈타겟(spine)생성  */
    for (let i = 0; i < quizCount; i++) {
      // const quizTarget = new QuizTarget(this.mStep, quizList[i])
      // this.mQuizList.push(quizTarget)
      // quizTarget.zIndex = 1
      // if (i == 1) {
      //   quizTarget.zIndex = 0
      // }
      // this.addChild(quizTarget)
      //(본게임의 인트로) 타겟이 하나 일때
      // 타겟 나오고 자동정답 처리 후, 넘어간다.
      if (quizCount == 1) {
        const quizTarget = new QuizTarget(2, quizList[0])
        quizTarget.zIndex = 1
        this.addChild(quizTarget)
        quizTarget.introMode = true
        quizTarget.position.set(x[1], y[1])
        gsap.delayedCall(1, () => {
          this.correct(quizTarget)
        })
      } else {
        const quizTarget = new QuizTarget(this.mStep, quizList[i])
        this.mQuizList.push(quizTarget)
        quizTarget.zIndex = 1
        if (i == 1) {
          quizTarget.zIndex = 0
        }
        this.addChild(quizTarget)
        //(본게임) 타겟이 세개 일때
        // 게임스텝이 짝수이면 가운데 타켓만 낮게 둔다. v자
        this.sortableChildren = true
        if (this.mStep % 2 == 0) {
          const subY = [500, 560, 500]
          quizTarget.zIndex = 1
          if (i == 1) {
            quizTarget.zIndex = 2
          }
          quizTarget.position.set(x[i], subY[i])
        } else {
          // 게임스텝이 홀수이면 가운데 타켓만 높이 둔다. ^자
          quizTarget.zIndex = 2
          if (i == 1) {
            quizTarget.zIndex = 1
          }
          quizTarget.position.set(x[i], y[i])
        }
        /**펭귄일 때 */
        if (random == 1) {
          quizTarget.y -= 60
        }
        /**개구리일 때 */
        if (random == 2) {
          quizTarget.y -= 40
        }
        /**갈메기일 때 */
        if (random == 3) {
          quizTarget.y -= 80
        }
        quizTarget.affordance()
        // 캐릭터를 클릭했을때 정오답 체크
        quizTarget.onClick = () => {
          if (quizTarget.text == getSymbol()) {
            for (const quiz of this.mQuizList) {
              if (quiz == quizTarget) {
                this.correct(quizTarget)
              } else {
                this.wrong(quiz, true)
              }
              quiz.interactive = false
              quiz.buttonMode = false
            }
          } else {
            this.wrong(quizTarget)
          }
        }
      }
    }
  }

  async correct(quizTarget: QuizTarget) {
    // console.log(`정답`)
    await this.endAffordance()
    this.mCorrectSnd.play()
    gsap.delayedCall(this.mCorrectSnd.duration + 0.5, () => {
      let sound = new Sound(quizTarget.textStyle)
      sound.play()
      sound = null
    })
    await quizTarget.success()
    ;(this.parent.parent as Rhythm).currentStep += 1
  }

  wrong(quizTarget: QuizTarget, disable?: boolean) {
    quizTarget.deleteAffor()
    if (disable) {
      quizTarget.disable()
    } else {
      // console.log(`오답`)
      this.mWrongSnd.play()
      quizTarget.fail()
      ;(this.parent.parent as Rhythm).wrong()
    }
  }

  async resetAffordance() {
    for (const target of this.mQuizList) {
      await target.affordance()
    }
  }

  async endAffordance() {
    for (const target of this.mQuizList) {
      target.endMotion = true
      await target.deleteAffor()
    }
  }
}

/**
 * 핑크 폰트색 => 0xff5e9b
 * */
export class ProgressBar extends PIXI.Container {
  private mOff: PIXI.Texture
  private mOn: PIXI.Texture

  private mSteps: Array<EventSprite>
  private mTextAry: Array<PIXI.Text>

  private mCurrent: number
  set current(v: number) {
    this.mCurrent = v
    for (const step of this.mSteps) {
      step.texture = this.mOff
    }
    /**진행바 폰트 스타일 */
    for (const text of this.mTextAry) {
      text.tint = 0x5fe1ff
    }
    this.mSteps[this.mCurrent].texture = this.mOn

    this.mTextAry[this.mCurrent].tint = 0xff5e9b
  }
  constructor() {
    super()
    this.mSteps = []
    this.mTextAry = []

    this.mOn = ResourceManager.Handle.getViewerResource(
      `counting_on.png`
    ).texture

    this.mOff = ResourceManager.Handle.getViewerResource(
      `counting_off.png`
    ).texture

    let offsetX = 0
    for (let i = 0; i < 3; i++) {
      const step = new EventSprite(this.mOff)
      step.position.set(offsetX + step.width / 2, step.height / 2)
      offsetX += step.width + 10
      const text = new PIXI.Text(getSymbol(), {
        fontSize: 48,
        fontWeight: 'bold',
        fill: 0xffffff,
        fontFamily: 'TmoneyRoundWindExtraBold',
        padding: 20
      })

      text.tint = 0x5fe1ff
      text.pivot.set(text.width / 2, text.height / 2)
      step.addChild(text)
      this.addChild(step)

      this.mSteps.push(step)
      this.mTextAry.push(text)
    }

    this.pivot.set(this.width / 2, this.height / 2)
  }
}

export class Rhythm extends SceneBase {
  private mProgressBar: ProgressBar
  private mSceneRoot: PIXI.Container

  private mGameScene: GameScene
  private mCurrentStep: number
  private mBgm: PIXI.sound.Sound
  get currentStep(): number {
    return this.mCurrentStep
  }
  set currentStep(v: number) {
    if (v >= 4) {
      this.endgame()
      return
    }
    if (v == 1) {
      this.setProgreesBar()
    }
    this.mCurrentStep = v
    this.setGame()
    this.mProgressBar.current = v - 1
  }

  // 오답갯수
  private mWrongCount: number

  private mWrongList: any

  private mSoundResource: Array<string>

  constructor() {
    super('rhythm')
    this.mWrongCount = 0
  }
  async onInit() {
    this.startTime()

    random = Math.ceil(Math.random() * 3)
    // random = 2
    // 1=> 팽귄
    // 2=> 개구리
    // 3=> 갈매기
    // console.log(`${random}번째 베리에이션`)
    gsap.globalTimeline.clear()
    pixisound.stopAll()
    window.onkeypress = () => null

    await App.Handle.showLoadingScreen()
    await this.getData()

    await this.getLoadResource()
    await this.loadCommonResource({
      images: ['hand.png'],
      sounds: this.mSoundResource
    })
    await this.loadViewerResource(RymthmResource)
    this.mSceneRoot = new PIXI.Container()
    this.addChild(this.mSceneRoot)
    this.mCurrentStep = 0

    await App.Handle.closeLoadingScreen()

    window.onkeypress = (evt: KeyboardEvent) => {
      if (evt.key == '+') {
        this.removeChildren()
        gsap.globalTimeline.clear()
        //// pixisound.stopAll()
        this.endgame()
      }
    }
  }

  getLoadResource(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mSoundResource = []
      const symbol = getSymbol()[0]

      for (let i = 0; i < 3; i++) {
        let phonemeType = getSyllableType(symbol)
        const num = syllableToNum(symbol)
        if (config.selectDay > 60 && config.selectDay < 82) {
          phonemeType = '3jong_'
        }
        let fileName = `${phonemeType}${num}.mp3`
        if (i > 0) {
          fileName = `${phonemeType}${num}_${i}.mp3`
        }
        this.mSoundResource.push(fileName)
      }
      soundList = this.mSoundResource
      resolve()
    })
  }

  getData(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mWrongList = []
      const requestUrl = `${config.resource}data/rhythm_data.json`
      const request = new XMLHttpRequest()
      request.open('GET', requestUrl)
      request.responseType = 'json'
      request.send()
      request.onloadend = () => {
        this.mWrongList = request.response['data'][`${config.selectDay}`]
        resolve()
      }
    })
  }

  async onStart() {
    let intro = new Intro()
    this.mSceneRoot.addChild(intro)
    await intro.playIntro()

    intro = null
    this.mSceneRoot.removeChildren()

    this.setIntro()
    this.mBgm = ResourceManager.Handle.getViewerResource(`ac2_bgm1.mp3`).sound
    this.mBgm.play({ loop: true })

    // this.setGame()
  }
  /**
   * 카드순서 맞추기
   * 미니게임 시작
   * */
  setIntro() {
    const minigame = new IntroScene()
    this.mSceneRoot.addChild(minigame)
  }
  // 미니게임이 끝나면 setGame 가동
  endIntro() {
    this.mBgm.pause()
    this.mBgm = null
    this.mSceneRoot.removeChildren()
    this.setGame()
    this.mBgm = ResourceManager.Handle.getViewerResource(`ac2_bgm2.mp3`).sound
    this.mBgm.play({ loop: true })
  }
  setProgreesBar() {
    this.mProgressBar = new ProgressBar()
    this.mProgressBar.position.set(Config.w / 2, Config.h - 60)
    this.addChild(this.mProgressBar)
  }
  async setGame() {
    this.mGameScene = null
    this.mGameScene = new GameScene(this.mWrongList)
    this.mSceneRoot.addChild(this.mGameScene)
    await this.mGameScene.onInit()
  }

  goRight(): Promise<void> {
    return new Promise<void>((resolve) => {
      const bg = new PIXI.Sprite(
        ResourceManager.Handle.getViewerResource(`t${random}_bg03.png`).texture
      )
      bg.x = Config.w
      this.mSceneRoot.addChild(bg)
      gsap
        .to(this.mSceneRoot, { x: -Config.w, duration: 0.5 })
        .eventCallback('onComplete', () => {
          this.mSceneRoot.x = 0
          this.mSceneRoot.removeChild(bg)
          resolve()
        })
    })
  }
  goLeft(): Promise<void> {
    return new Promise<void>((resolve) => {
      const bg = new PIXI.Sprite(
        ResourceManager.Handle.getViewerResource(`t${random}_bg02.png`).texture
      )
      bg.x = -Config.w
      this.mSceneRoot.addChild(bg)
      gsap
        .to(this.mSceneRoot, { x: Config.w, duration: 0.5 })
        .eventCallback('onComplete', () => {
          this.mSceneRoot.x = 0
          this.mSceneRoot.removeChild(bg)
          resolve()
        })
    })
  }
  async endgame() {
    this.onStart = () => null
    window.onkeypress = () => null

    await this.endTime()

    if (this.mBgm) {
      this.mBgm.pause()
      this.mBgm = null
    }

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

    // 게임 끝나고 홈화면으로 나간다
    // console.log(`%c 오답갯수 => [${this.mWrongCount}]`, 'border:2px red solid;')
    // console.log(`THE END`)
    const eop = new Eop()
    this.addChild(eop)
    await eop.eopPlay()
    this.destroy()
    App.Handle.nextGame()
  }

  wrong() {
    this.mWrongCount += 1
    // console.log(`%c 읽기부분 오답갯수=>[${this.mWrongCount}]`,'border:2px red solid;')
  }
}
