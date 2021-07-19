import { ResourceManager } from '@/activity/core/resourceManager'
import config from '@/activity/gameUtil/config'
import {
  getConstantVowel,
  getCombinationType,
  getSound,
  syllableToNum,
  shuffleArray,
  debugLine
} from '@/activity/gameUtil/game'
import { Affordance } from '@/activity/widget/affordance'
import { EventSprite } from '@/activity/widget/eventSprite'
import gsap, { Power0 } from 'gsap/all'
import pixisound from 'pixi-sound'
import { QuizType } from './QuizType'
import { Total } from './total'

export class SoundBtn extends PIXI.Container {
  private mSoundBtn: PIXI.Sprite
  private mOn: PIXI.Texture
  private mOff: PIXI.Texture

  private mSound: string
  constructor(soundName: string) {
    super()
    const num = getSound(soundName)
    this.mSound = `word_${num}`

    this.mOn = ResourceManager.Handle.getCommonResource(
      `btn_sound_on.png`
    ).texture
    this.mOff = ResourceManager.Handle.getCommonResource(
      `btn_sound_normal.png`
    ).texture
    this.mSoundBtn = new PIXI.Sprite(this.mOn)
    this.mSoundBtn.anchor.set(0.5)
    this.addChild(this.mSoundBtn)

    this.on('pointertap', async () => {
      // console.log(`소리재생`)
      await this.onSound()
    })
  }

  onSound(): Promise<void> {
    return new Promise<void>((resolve) => {
      ;(this.parent.parent as GameScene).guideSnd = null
      this.interactive = false
      this.buttonMode = false
      this.mSoundBtn.texture = this.mOn

      const snd = ResourceManager.Handle.getCommonResource(`${this.mSound}.mp3`)
        .sound
      snd.play()
      gsap.delayedCall(snd.duration + 0.5, () => {
        this.interactive = true
        this.buttonMode = true
        this.mSoundBtn.texture = this.mOff
        resolve()
      })
    })
  }
}
export class QuizPlaceCard extends PIXI.Container {
  constructor(text: string) {
    super()
    const syllableType = getSound(text)

    const interval = 16

    const dimmed = new PIXI.Graphics()
    dimmed.beginFill(0x000000, 0.1)
    dimmed.drawRoundedRect(0, 0, 288 + interval / 2, 232 + interval / 2, 20)
    dimmed.endFill()
    dimmed.pivot.set(dimmed.width / 2, dimmed.height / 2)
    dimmed.position.set(300, 220)
    this.addChild(dimmed)

    const white = new PIXI.Graphics()
    white.beginFill(0xffffff, 1)
    white.drawRoundedRect(
      0,
      0,
      dimmed.width - interval,
      dimmed.height - interval,
      20
    )
    white.endFill()
    white.position.set(interval / 2, interval / 2)

    // console.error(`word_${syllableType}.png`)
    const img = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(
        `word_${syllableType}.png`
      ).texture
    )
    img.anchor.set(0.5)
    img.scale.set(0.5)
    img.position.set(dimmed.width / 2, dimmed.height / 2)

    dimmed.addChild(white, img)
  }
}

export class Phoneme extends PIXI.Sprite {
  private mType: number
  private mIndex: number
  get index(): number {
    return this.mIndex
  }

  private mPink: PIXI.Sprite
  private mDimmed: PIXI.Sprite
  private mFocus: PIXI.Sprite
  private mText: PIXI.Sprite

  private mString: string
  get text(): string {
    return this.mString
  }
  get type(): number {
    return this.mType
  }

  // private mSlicedWidth: number
  // get slicedWidth(): number {
  //   return this.mSlicedWidth
  // }
  constructor(type: number, index: number, text: string, side?: boolean) {
    super()

    // this.mSlicedWidth = 0

    this.mString = text
    this.mType = type
    this.mIndex = index

    this.texture = ResourceManager.Handle.getCommonResource(
      `type${this.mType}_${this.mIndex}default.png`
    ).texture

    let textImg = ''
    const num = syllableToNum(text)
    if (index == 1) {
      textImg = `1cho_t${type}_${num}`
    }
    if (index == 2) {
      textImg = `2jung_t${type}_${num}`
    }
    if (index == 3) {
      textImg = `3jong_at_${num}`
    }

    this.mText = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`${textImg}.png`).texture
    )
    this.mFocus = new PIXI.Sprite()
    this.mPink = new PIXI.Sprite()
    this.mDimmed = new PIXI.Sprite()

    if (side) {
      this.createSide()
    } else {
      this.createQuiz()
    }

    this.addChild(this.mDimmed, this.mPink, this.mFocus, this.mText)
  }

  createQuiz() {
    // `type${this.mType}_${this.mIndex}pink.png`
    this.mPink.texture = ResourceManager.Handle.getCommonResource(
      `type${this.mType}_${this.mIndex}pink.png`
    ).texture
    this.mFocus.texture = ResourceManager.Handle.getCommonResource(
      // `type${this.mType}_focus${this.mIndex}.png`
      `type${this.mType}_${this.mIndex}pink.png`
    ).texture
    this.mDimmed.texture = ResourceManager.Handle.getCommonResource(
      `type${this.mType}_${this.mIndex}deep.png`
    ).texture
    this.mFocus.alpha = 0
    this.mPink.alpha = 0
    this.mDimmed.alpha = 0
    this.mText.alpha = 0
  }

  createSide() {
    const guideLine = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(
        `t${this.mType}_line.png`
      ).texture
    )
    this.addChild(guideLine)

    this.mPink.texture = ResourceManager.Handle.getCommonResource(
      `side_type${this.mType}_pink${this.mIndex}.png`
    ).texture
    this.mFocus.texture = ResourceManager.Handle.getCommonResource(
      `side_type${this.mType}_pink${this.mIndex}.png`
    ).texture
    this.mDimmed.texture = ResourceManager.Handle.getCommonResource(
      `side_type${this.mType}_dim${this.mIndex}.png`
    ).texture
    this.mFocus.alpha = 0
    this.mPink.alpha = 0
    this.mDimmed.alpha = 1
    this.mText.alpha = 0.4

    // if (this.mType == 1) {
    //   this.mSlicedWidth = 100
    // }
    // if (this.mType == 3) {
    //   if (this.mIndex + 1 == 1) this.mSlicedWidth = 100
    // }

    // this.scale.set(0.8)

    this.on('pointertap', (evt: PIXI.InteractionEvent) => {
      this.onClick(evt)
    })
  }

  sideDisable(): Promise<void> {
    return new Promise<void>((resolve) => {
      gsap.killTweensOf(this.mFocus)
      gsap.killTweensOf(this.mText)
      gsap.killTweensOf(this.mDimmed)
      gsap.killTweensOf(this.mPink)
      this.interactive = false
      this.buttonMode = false
      this.mFocus.alpha = 0
      this.mPink.alpha = 0
      this.mDimmed.alpha = 1
      this.mText.alpha = 0.4
      resolve()
    })
  }

  onClick(evt: PIXI.InteractionEvent) {
    /** */
  }

  active() {
    this.mFocus.alpha = 0
    this.mDimmed.alpha = 0
    gsap.to(this.mPink, { alpha: 1, duration: 0.25 })
    gsap
      .to(this.mText, { alpha: 1, duration: 0.25 })
      .eventCallback('onComplete', () => {
        this.interactive = true
        this.buttonMode = true
      })
    // this.mPink.alpha = 1
    // this.mText.alpha = 1
  }

  focus() {
    gsap
      .to(this.mFocus, { alpha: 0.6, duration: 1, ease: Power0.easeNone })
      .repeat(-1)
      .yoyo(true)
    this.mDimmed.alpha = 1
    // gsap
    //   .to(this.mDimmed, { alpha: 1, duration: 1, ease: Power0.easeNone })
    //   .repeat(-1)
    //   .yoyo(true)
    //   .delay(1)
  }

  complete() {
    gsap.killTweensOf(this.mFocus)
    gsap.killTweensOf(this.mDimmed)
    this.mFocus.alpha = 0
    this.mPink.alpha = 1
    this.mText.alpha = 1
    this.mDimmed.alpha = 0
  }

  fix() {
    // console.log(`fix`)
    gsap.killTweensOf(this.mFocus)
    gsap.killTweensOf(this.mDimmed)
    this.mPink.alpha = 1
    this.mText.alpha = 1
    gsap.to(this.mPink, { alpha: 1, duration: 0.5 })
    gsap.to(this.mText, { alpha: 1, duration: 0.5 })
  }
}

export class Syllable extends PIXI.Sprite {
  private mStep: number
  get step(): number {
    return this.mStep
  }

  private mType: number
  get type(): number {
    return this.mType
  }

  private mPhoneme: Array<Phoneme>
  get phonemes(): Array<Phoneme> {
    return this.mPhoneme
  }

  constructor(text: Array<string>, type: number) {
    super()
    this.mType = type
    this.mStep = 0

    this.texture = ResourceManager.Handle.getCommonResource(
      `box_shadow.png`
    ).texture

    this.mPhoneme = []

    for (let i = 0; i < text.length; i++) {
      const phoneme = new Phoneme(type, i + 1, text[i])
      this.addChild(phoneme)
      this.mPhoneme.push(phoneme)
    }
  }

  next() {
    // this.complete()
    this.mStep += 1
    // this.focus()
    if (!this.mPhoneme[this.mStep]) {
      // console.error(`없다 없어 음소가 없다!!!`)
    }
  }

  // focus() {
  //   this.mPhoneme[this.mStep].focus()
  // }

  // complete() {
  //   this.mPhoneme[this.mStep].complete()
  // }
}

export class QuizPlace extends PIXI.Container {
  private mData: any

  private mSyllable: Array<string>
  private mSyllablePlace: PIXI.Container
  private mSndBtn: SoundBtn
  private mSyllableAry: Array<Syllable>

  private mSyllableStep: number
  set syllableStep(v: number) {
    this.mQuizAry[this.mQuizStep].complete()

    this.mSyllableStep = v
    if (this.mQuizStep + 1 >= this.mQuizAry.length) {
      gsap.delayedCall(1, () => {
        ;(this.parent as GameScene).next()
      })
    } else {
      this.mQuizStep += 1
      this.mQuizAry[this.mQuizStep].focus()
    }
  }
  private mQuizStep: number
  // set quizStep(v: number) {
  //   this.mQuizStep = v
  // }
  private mQuizAry: Array<Phoneme>

  get totalQuiz(): number {
    return this.mQuizAry.length - 1
  }

  get currentQuizText(): string {
    return this.mQuizAry[this.mQuizStep].text
  }

  get currentQuizType(): number {
    return this.mQuizAry[this.mQuizStep].type
  }

  get correctQuizIndex(): number {
    return this.mQuizAry[this.mQuizStep].index
  }

  constructor(data) {
    super()
    this.mData = data
    this.mSyllable = []
    this.mQuizAry = []
    this.mQuizStep = 0
    this.mSyllableStep = 0
  }

  async onInit() {
    this.removeChildren()

    this.mSndBtn = new SoundBtn(this.mData.correct)
    this.mSndBtn.position.set(100, 220)

    const card = new QuizPlaceCard(this.mData.correct)

    const equal = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`t4_equal.png`).texture
    )
    equal.anchor.set(0.5)
    equal.position.set(500, 220)

    this.addChild(this.mSndBtn, card, equal)

    this.createSyllableText()
  }

  createSyllableText() {
    /**단어를 하나씩 쪼갠다.*/
    this.mSyllablePlace = new PIXI.Container()
    this.addChild(this.mSyllablePlace)

    let offsetX = 0
    for (const syllable of this.mData.correct) {
      this.mSyllable.push(syllable)
    }
    // console.log(this.mSyllable)

    this.mSyllableAry = []

    /**
     * ex=> this.mSyllable=["아","이"]
     */
    for (let i = 0; i < this.mSyllable.length; i++) {
      const type = getCombinationType(this.mSyllable[i])
      // 한글자를 음소로 쪼갠다
      const syllable1 = getConstantVowel(this.mSyllable[i])
      // console.log(syllable1)
      /**
       * ex=> syllable1=["ㅇ","ㅏ"]
       */

      const syllable = new Syllable(syllable1, type)
      this.mSyllablePlace.addChild(syllable)
      this.mSyllableAry.push(syllable)

      syllable.x = offsetX
      offsetX += syllable.width + 10
    }

    let index = 0
    for (const i of this.mSyllableAry) {
      for (const j of i.phonemes) {
        if (this.mData['fixed']) {
          let fixFlag = false
          for (const num of this.mData['fixed']) {
            if (index == num) {
              // console.log(index)
              fixFlag = true
              j.fix()
            }
          }
          if (fixFlag == false) {
            this.mQuizAry.push(j)
          }
        } else {
          this.mQuizAry.push(j)
        }
        index += 1
      }
    }

    const syllableX = 700 + (this.mSyllable.length - 1) * 100

    this.mSyllablePlace.position.set(syllableX, 220)
    this.mSyllablePlace.pivot.set(
      this.mSyllablePlace.width / 2,
      this.mSyllablePlace.height / 2
    )

    this.mSyllablePlace.scale.set(0.8)

    this.mQuizAry[this.mQuizStep].focus()

    // console.warn(`총 퀴즈`)
    // console.log(this.mQuizAry)
    // console.warn(`갯수`)
  }

  async onSound() {
    await this.mSndBtn.onSound()
  }
}

export class SideBar extends PIXI.Sprite {
  private mData: any
  private mExamBox: PIXI.Container
  private mExamAry: Array<Phoneme>

  private mFixed: Array<Phoneme>
  get fixed(): Array<Phoneme> {
    return this.mFixed
  }

  constructor(data: any) {
    super()
    this.mFixed = []
    this.mData = data
    this.texture = ResourceManager.Handle.getViewerResource(
      `t4_bar1.png`
    ).texture

    this.anchor.set(0.5)

    this.mExamBox = new PIXI.Container()
    this.addChild(this.mExamBox)
  }
  async createExam(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mExamAry = []

      // 사이드바 텍스트보기 만들기
      let index = 0

      for (let i = 0; i < this.mData.correct.length; i++) {
        const type = getCombinationType(this.mData.correct[i])

        const ary = getConstantVowel(this.mData.correct[i])

        // 사이드바 보기 섞기
        for (let j = 0; j < ary.length; j++) {
          const exam = new Phoneme(type, j + 1, ary[j], true)

          let fixFlag = false
          if (this.mData['fixed']) {
            for (const num of this.mData['fixed']) {
              if (index == num) {
                fixFlag = true
              }
            }
            if (fixFlag == false) {
              // console.log(index)
              this.mExamAry.push(exam)
            }
            index += 1
          } else {
            this.mExamAry.push(exam)
          }

          exam.onClick = async (evt: PIXI.InteractionEvent) => {
            /**정답일때 */
            if (this.decideCorrect(type, exam.text, exam.index)) {
              this.disable()
              exam.onClick = () => null
              let sound = ResourceManager.Handle.getViewerResource(
                `ac7_correct.mp3`
              ).sound
              sound.play()
              sound = null
              exam.visible = false
              gsap.delayedCall(1, () => {
                this.active()
              })
            } else {
              /**오답일때 */
              let sound = ResourceManager.Handle.getViewerResource(
                `ac7_wrong.mp3`
              ).sound
              sound.play()
              sound = null
              await exam.sideDisable()
            }
            // }
          }
        }
      }
      resolve()
    })
  }

  async typeFixed() {
    await this.createExam()

    //사이드바 보기 x값 할당
    const randomAry = shuffleArray(this.mExamAry)

    let offSetX = 0
    //x값으로 떨어 뜨리고 부모컨테이너pivot 조정으로 가운데 정렬시킨다.
    for (let i = 0; i < randomAry.length; i++) {
      randomAry[i].position.set(offSetX, -40)
      offSetX += randomAry[i].width + 10
      this.mExamBox.addChild(randomAry[i])
    }

    this.mExamBox.pivot.set(this.mExamBox.width / 2, this.mExamBox.height / 2)
    this.mExamBox.scale.set(0.7)
  }

  active() {
    for (const ex of this.mExamAry) {
      ex.active()
    }
  }

  disable() {
    for (const ex of this.mExamAry) {
      ex.sideDisable()
    }
  }

  decideCorrect(type: number, text: string, index: number) {
    return (this.parent as GameScene).decide(type, text, index)
  }
}

export class GameScene extends PIXI.Container {
  private mData: any
  private mStep: number
  private mTotalStep: number

  private mQuizPlace: QuizPlace
  private mSideBar: SideBar

  private mGuideSnd: PIXI.sound.Sound

  private mFixed: Array<Phoneme>
  get fixed(): Array<Phoneme> {
    return this.mFixed
  }
  set guideSnd(v: PIXI.sound.Sound) {
    if (this.mGuideSnd) this.mGuideSnd.pause()
    this.mGuideSnd = v
  }

  constructor(data: any) {
    super()
    this.mData = data
    // console.log(`스텝 데이터 %c ↓`,'color:red; font-size:48px;font-weight: 800')
  }
  async onInit() {
    this.mStep = 0
    this.mTotalStep = 0
    const bg = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`t4_bg.png`).texture
    )
    this.addChild(bg)

    this.createGuideText()
    await this.createQuiz()
  }

  async createQuiz() {
    this.mFixed = []

    this.mSideBar = new SideBar(this.mData)
    this.mSideBar.position.set(
      config.w / 2,
      config.h - this.mSideBar.height / 2
    )
    this.addChild(this.mSideBar)

    await this.mSideBar.typeFixed()
    this.mFixed = this.mSideBar.fixed
    // console.log(this.mFixed)

    this.mQuizPlace = new QuizPlace(this.mData)
    this.addChild(this.mQuizPlace)
    await this.mQuizPlace.onInit()
  }

  createGuideText() {
    const text = new PIXI.Text(`순서대로 낱말을 완성해봐!`, {
      fontFamily: 'TmoneyRoundWindExtraBold',
      fontSize: 34
    })
    text.pivot.set(text.width / 2, text.height / 2)
    text.position.set(config.w / 2, 40)
    this.addChild(text)

    text.interactive = true
    text.buttonMode = true
    text.on('pointertap', () => {
      // 안내 사운드
      if (this.mGuideSnd) {
        this.mGuideSnd.pause()
      }
      this.mGuideSnd = ResourceManager.Handle.getViewerResource(
        `${this.mData['sound']}`
      ).sound
      this.mGuideSnd.play()
    })
  }

  async activeQuiz() {
    await this.mQuizPlace.onSound()
    let sound = ResourceManager.Handle.getCommonResource(`ac1_playpop.mp3`)
      .sound
    sound.play()
    sound = null
    this.mSideBar.active()
  }

  decide(type: number, text: string, index: number): boolean {
    const correctText = this.mQuizPlace.currentQuizText
    const correctType = this.mQuizPlace.currentQuizType
    const correctIndex = this.mQuizPlace.correctQuizIndex

    if (text == correctText && type == correctType && index == correctIndex) {
      this.mQuizPlace.syllableStep += 1
      // console.log(`정답`)
      return true
    } else {
      // console.log(`오답`)
      ;(this.parent as Type4).wrong()
      return false
    }
  }

  async next() {
    // this.mTotalStep = this.mQuizPlace.totalQuiz
    // this.mStep += 1
    // // console.log(`게임씬의 현재 스텝 ${this.mStep}//${this.mTotalStep}`)
    // if (this.mStep >= this.mTotalStep) {
    //   // console.error(`다음 타입으로`)
    await this.mQuizPlace.onSound()
    ;(this.parent as Type4).next()
    // } else {
    //
    // }
  }

  wrong() {
    ;(this.parent as Type4).wrong()
  }
}

export class Type4 extends QuizType {
  private mData: any
  //type4 안의 게임 순서
  private mCurrentStep: number

  private mType4GameScene: Array<GameScene>

  constructor(quizData: any) {
    super()
    this.mData = quizData
    this.mCurrentStep = 0
  }

  async onInit() {
    // console.log(`전체데이터 %c ↓`, 'color:red; font-size:48px;font-weight: 800')
    // console.log(this.mData)
    this.removeChild()

    await this.createQuiz()

    window.onkeypress = (evt: KeyboardEvent) => {
      if (evt.key == '+') {
        // this.mCurrentStep = Object.keys(this.mData).length
        this.next()
      }
    }
  }

  async createQuiz() {
    this.mType4GameScene = []
    const totalStep = Object.keys(this.mData).length
    for (let i = 1; i <= totalStep; i++) {
      this.mType4GameScene.push(new GameScene(this.mData[`step${i}`]))
    }

    this.addChild(this.mType4GameScene[this.mCurrentStep])
    await this.mType4GameScene[this.mCurrentStep].onInit()

    // 안내 사운드
    const scriptSnd = ResourceManager.Handle.getViewerResource(
      `${this.mData['step1']['sound']}`
    ).sound
    scriptSnd.play()

    gsap.delayedCall(scriptSnd.duration + 1, () => {
      this.mType4GameScene[this.mCurrentStep].activeQuiz()
    })
  }

  async next() {
    //// pixisound.stopAll()

    const total = Object.keys(this.mData).length
    this.mCurrentStep += 1
    if (this.mCurrentStep >= total) {
      window.onkeypress = () => null
      gsap.globalTimeline.clear()
      ;(this.parent.parent as Total).nextType()
      // console.log(`currentStep=>${this.mCurrentStep}`)
      // console.log(`total=>${total}`)
      // console.log(`끝`)
    } else {
      ;(this.parent.parent as Total).nextStep()
      this.removeChildren()
      this.addChild(this.mType4GameScene[this.mCurrentStep])
      await this.mType4GameScene[this.mCurrentStep].onInit()
      await this.mType4GameScene[this.mCurrentStep].activeQuiz()
    }
  }

  wrong() {
    ;(this.parent.parent as Total).wrongCount2 += 1
  }
}
