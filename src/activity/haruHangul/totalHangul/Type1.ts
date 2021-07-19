import { ResourceManager } from '@/activity/core/resourceManager'
import config from '@/activity/gameUtil/config'
import {
  getSyllableType,
  shuffleArray,
  syllableToNum
} from '@/activity/gameUtil/game'
import gsap from 'gsap/all'
import pixisound from 'pixi-sound'
import { QuizType } from './QuizType'
import { Total } from './total'

export class SoundBtn extends PIXI.Container {
  private mActive: PIXI.Texture
  private mDisAble: PIXI.Texture
  private mBtn: PIXI.Sprite

  private mSoundList: Array<string>

  constructor(soundName: Array<string>) {
    super()
    this.mSoundList = soundName
    this.mActive = ResourceManager.Handle.getCommonResource(
      'btn_sound_normal.png'
    ).texture
    this.mDisAble = ResourceManager.Handle.getCommonResource(
      'btn_sound_on.png'
    ).texture
    this.mBtn = new PIXI.Sprite(this.mDisAble)
    this.mBtn.anchor.set(0.5)
    this.addChild(this.mBtn)

    this.on('pointertap', () => {
      this.onSound()
    })
  }

  onSound(): Promise<void> {
    return new Promise<void>((resolve) => {
      ;(this.parent.parent as GameScene).guideSnd = null
      this.interactive = false
      this.buttonMode = false
      if (window['totalSound']) {
        if (window['totalSound'] !== []) {
          for (let snd of window['totalSound']) {
            snd.pause()
            snd = null
          }
        }
      }
      this.mBtn.texture = this.mDisAble

      window['totalSound'] = []

      if (this.mSoundList.length == 1) {
        const snd = ResourceManager.Handle.getCommonResource(this.mSoundList[0])
          .sound
        window['totalSound'].push(snd)
        snd.play()
        gsap.delayedCall(snd.duration, () => {
          this.mBtn.texture = this.mActive
          this.interactive = true
          this.buttonMode = true
          resolve()
        })
      } else {
        for (let i = 0; i < this.mSoundList.length; i++) {
          const snd = ResourceManager.Handle.getCommonResource(
            this.mSoundList[i]
          ).sound
          window['totalSound'].push(snd)

          // if (i == 0) {
          //   snd.play()
          // } else {
          gsap.delayedCall(i, () => {
            if (i == this.mSoundList.length - 1) {
              snd.play()
              this.interactive = true
              this.buttonMode = true
              this.mBtn.texture = this.mActive
              resolve()
            } else {
              snd.play()
              resolve()
            }
          })
          // }
        }
      }
    })
  }
}

export class QuizCard extends PIXI.Container {
  private mCardAry: Array<PIXI.Sprite>

  private mTrain: PIXI.Sprite
  private mTrainText: Array<PIXI.Text>

  private mWhiteCard: PIXI.Texture
  private mActiveCard: PIXI.Texture
  private mTrainDimmedCard: PIXI.Texture
  private mDimmedCard: PIXI.Texture

  private mText: string
  private mCardTextAry: Array<PIXI.Text>
  constructor(text: string, train: boolean, correct?: boolean) {
    super()
    this.mText = text
    this.mWhiteCard = ResourceManager.Handle.getViewerResource(
      `t1_box1.png`
    ).texture
    this.mActiveCard = ResourceManager.Handle.getViewerResource(
      `t1_box2.png`
    ).texture
    this.mTrainDimmedCard = ResourceManager.Handle.getViewerResource(
      `t1_box3.png`
    ).texture
    this.mDimmedCard = ResourceManager.Handle.getViewerResource(
      `t1_box_dim.png`
    ).texture

    const cardFont = {
      fontSize: 92,
      fontWeight: 'bold',
      fontFamily: 'TmoneyRoundWindExtraBold',
      fill: 0xffffff,
      padding: 20
    }

    this.mCardAry = []

    // 문제제시 기차에 들어가는 퀴즈카드
    if (train) {
      this.mTrainText = []
      const card = new PIXI.Sprite(this.mTrainDimmedCard)
      this.mCardAry.push(card)
      this.addChild(card)

      const text = new PIXI.Text(`?`, cardFont)
      text.tint = 0x000000
      text.pivot.set(text.width / 2, text.height / 2)
      text.position.set(card.width / 2, card.height / 2 + 4)

      const textMask = new PIXI.Graphics()
      textMask.beginFill(0x000000, 0.1)
      textMask.drawRect(0, 0, card.width, card.height)
      textMask.endFill()
      text.mask = textMask

      card.addChild(text, textMask)
      card.y = -10

      this.mTrainText.push(text)
    } else {
      this.mTrain = new PIXI.Sprite()
      this.addChild(this.mTrain)

      // 두 글자 이상
      const textCount = this.mText.length
      this.mTrain.texture = ResourceManager.Handle.getViewerResource(
        `t1_train0${textCount + 1}.png`
      ).texture

      const center = this.mTrain.width / 2 - 8
      const type = {
        type1: [center],
        type2: [center - 80, center + 80],
        type3: [center - 160, center, center + 160]
      }

      this.mCardTextAry = []

      if (textCount > 1) {
        for (let i = 0; i < textCount; i++) {
          const card = new PIXI.Sprite(this.mDimmedCard)
          card.anchor.set(0.5)
          card.x = type[`type${textCount}`][i]
          card.y = this.mTrain.height / 2 - 14
          this.mCardAry.push(card)
          this.mTrain.addChild(card)

          const text = new PIXI.Text(this.mText[i], cardFont)
          text.pivot.set(text.width / 2, text.height / 2)
          text.tint = 0x000000
          this.mCardTextAry.push(text)

          const textMask = new PIXI.Graphics()
          textMask.beginFill(0x000000, 0.9)
          textMask.drawRect(0, 0, card.width, card.height)
          textMask.endFill()
          textMask.pivot.set(card.width / 2, card.height / 2)

          card.addChild(text, textMask)

          text.mask = textMask
        }
      } else {
        // type1
        // 한 글자
        const card = new PIXI.Sprite(this.mDimmedCard)
        card.anchor.set(0.5)
        card.position.set(
          this.mTrain.width / 2 - 8,
          this.mTrain.height / 2 - 14
        )
        this.mCardAry.push(card)
        this.mTrain.addChild(card)

        const text = new PIXI.Text(this.mText, cardFont)
        text.pivot.set(text.width / 2, text.height / 2)
        text.tint = 0x000000
        this.mCardTextAry.push(text)

        const textMask = new PIXI.Graphics()
        textMask.beginFill(0x000000, 0.9)
        textMask.drawRect(0, 0, card.width, card.height)
        textMask.endFill()
        textMask.pivot.set(card.width / 2, card.height / 2)

        card.addChild(text, textMask)

        text.mask = textMask
      }
    }

    // 정오답시 이벤트 등록
    if (correct !== undefined) {
      if (correct == true) {
        this.onClick = () => this.correct()
      } else {
        this.onClick = () => this.wrong()
      }
    }

    this.pivot.set(this.width / 2, this.height / 2)

    this.on('pointertap', async () => {
      this.onClick()
    })
  }
  // 정답인 기차 눌렀을때
  //  문제제시 기차의 카드? 에서 글자나오게 하는
  trainCorrect() {
    for (let i = 0; i < this.mTrainText.length; i++) {
      this.mCardAry[i].texture = this.mWhiteCard
      const centerY = this.mTrainText[i].y
      this.mTrainText[i].y = 200
      this.mTrainText[i].text = this.mText[i]
      this.mTrainText[i].pivot.set(
        this.mTrainText[i].width / 2,
        this.mTrainText[i].height / 2
      )
      gsap.to(this.mTrainText[i], { y: centerY, duration: 0.5 }).delay(1)
    }
  }

  onClick() {
    //
  }

  async correct() {
    const clickSnd = ResourceManager.Handle.getCommonResource(
      `com_button_click.mp3`
    ).sound
    clickSnd.play()
    // console.log(`정답`)
    this.correct = () => null
    await (this.parent as GameScene).deleteWrongCard()
    let correct = ResourceManager.Handle.getViewerResource(`ac7_correct.mp3`)
      .sound
    correct.play()

    for (let i = 0; i < this.mCardTextAry.length; i++) {
      gsap.to(this.mCardTextAry[i], { y: -200, duration: 1 })
    }

    gsap.delayedCall(correct.duration, () => {
      correct = null
      ;(this.parent as GameScene).next()
    })
  }

  wrong() {
    this.wrong = () => null
    ;(this.parent as GameScene).wrong()
    // console.log(`오답`)
    let snd = ResourceManager.Handle.getViewerResource(`ac7_wrong.mp3`).sound
    snd.play()
    snd = null
    for (const card of this.mCardAry) {
      card.texture = this.mDimmedCard
    }
    gsap
      .to(this, { alpha: 0, duration: 0.5 })
      .delay(0.5)
      .eventCallback('onComplete', () => {
        this.visible = false
      })
  }

  delete() {
    for (const card of this.mCardAry) {
      card.texture = this.mDimmedCard
      gsap
        .to(this, { alpha: 0, duration: 0.25 })
        .delay(0.25)
        .eventCallback('onComplete', () => {
          this.visible = false
        })
    }
  }

  disable(flag: boolean) {
    if (flag) {
      for (const card of this.mCardAry) {
        card.texture = this.mDimmedCard
      }
    } else {
      this.interactive = true
      this.buttonMode = true
      for (const card of this.mCardAry) {
        card.texture = this.mActiveCard
      }
    }
  }
}

export class Train extends PIXI.Container {
  private mData: object

  private mHeadTrain: PIXI.Sprite
  private mTextTrain: PIXI.Sprite

  private mType: Array<PIXI.Texture>
  private mSoundBtn: SoundBtn
  private mQuizCard: Array<QuizCard>

  constructor(data: object) {
    super()
    this.mData = data

    //기차 만들기
    this.createTrain()

    //문제제시카드 만들기
    this.createExmCard()

    this.pivot.set(this.width / 2, this.height / 2)
  }

  createTrain() {
    // *********************기차 생성
    this.mHeadTrain = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`t1_train01.png`).texture
    )
    this.addChild(this.mHeadTrain)

    this.mType = []
    const type1 = ResourceManager.Handle.getViewerResource(`t1_train02.png`)
      .texture
    const type2 = ResourceManager.Handle.getViewerResource(`t1_train03.png`)
      .texture
    const type3 = ResourceManager.Handle.getViewerResource(`t1_train04.png`)
      .texture
    this.mType = [type1, type2, type3]

    this.mTextTrain = new PIXI.Sprite()
    this.mTextTrain.texture = this.mType[
      Object.keys(this.mData['correct']).length - 1
    ]

    this.addChild(this.mTextTrain)

    this.mHeadTrain.position.set(this.mTextTrain.width + 78, 66)

    // *********************사운드버튼 생성
    const soundName = []
    for (const syllable of this.mData['correct']) {
      const soundType = getSyllableType(syllable)
      const num = syllableToNum(syllable)

      soundName.push(`${soundType}${num}.mp3`)
    }

    this.mSoundBtn = new SoundBtn(soundName)
    this.mSoundBtn.position.set(0, this.height / 2)

    this.addChild(this.mSoundBtn)
    this.mSoundBtn.alpha = 0

    this.mTextTrain.position.set(this.mSoundBtn.width, 0)
  }

  // 문제 제시하는 기차의 카드 생성
  createExmCard() {
    // // console.log(this.mData)
    // // console.log(`text_data=>${this.mData['correct']}`)
    this.mQuizCard = []

    let t = ''
    t = this.mData['correct'].length.toString()

    const center = this.mTextTrain.width / 2 - 8
    const type = {
      type1: [center],
      type2: [center - 80, center + 80],
      type3: [center - 160, center, center + 160]
    }

    for (let i = 0; i < this.mData['correct'].length; i++) {
      const card = new QuizCard(this.mData['correct'][i], true)
      card.position.set(+type[`type${t}`][i], this.mTextTrain.height / 2)
      this.mTextTrain.addChild(card)

      this.mQuizCard.push(card)
    }
  }

  soundBtnVisible(flag: boolean) {
    if (flag) {
      gsap.to(this.mSoundBtn, { alpha: 1, duration: 0.25 })
    } else {
      gsap.to(this.mSoundBtn, { alpha: 0, duration: 0.25 })
    }
  }

  async onSound() {
    await this.mSoundBtn.onSound()
  }

  correct() {
    for (const trainCard of this.mQuizCard) {
      trainCard.trainCorrect()
    }
  }
}

export class GameScene extends PIXI.Container {
  private mData: any

  // 문제제시 기차
  private mTrain: Train

  //문제 보기 기차
  private mExample: Array<QuizCard>

  // 오답배열
  private mWrongCard: Array<QuizCard>
  //정답카드
  private mCorrectCard: QuizCard

  private mGuideSnd: PIXI.sound.Sound
  get guideSnd(): PIXI.sound.Sound {
    return this.mGuideSnd
  }
  set guideSnd(v: PIXI.sound.Sound) {
    if (this.mGuideSnd) this.mGuideSnd.pause()
    this.mGuideSnd = v
  }
  constructor(data: any) {
    super()
    this.mData = data
  }
  async onInit() {
    const bg = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource('t1_bg.png').texture
    )
    this.addChild(bg)

    await this.createGuideText()
    await this.createTrain()

    this.mExample = []
  }

  createGuideText(): Promise<void> {
    return new Promise<void>((resolve) => {
      const text = new PIXI.Text(`소리를 듣고 알맞은 답을 찾아봐!`, {
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
          this.mGuideSnd = null
        }
        this.mGuideSnd = ResourceManager.Handle.getViewerResource(
          `ac7_script_1.mp3`
        ).sound
        this.mGuideSnd.play()
      })
      resolve()
    })
  }

  createTrain(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mTrain = new Train(this.mData)
      this.mTrain.position.set(-this.mTrain.width, config.h / 2 - 120)
      this.addChild(this.mTrain)

      let offsetX = 0
      if (this.mData['type'] == 2) {
        offsetX = config.w / 2 + 100
      } else {
        offsetX = config.w / 2 + 96
      }

      const snd = ResourceManager.Handle.getViewerResource(`ac7_trainstop.mp3`)
        .sound
      snd.play()
      gsap
        .to(this.mTrain, { x: offsetX, duration: 1 })
        .eventCallback('onComplete', () => {
          this.mTrain.soundBtnVisible(true)
          resolve()
        })
    })
  }

  createQuizCard(): Promise<void> {
    return new Promise<void>((resolve) => {
      // 타입별 보기의 간격

      const center = config.w / 2
      const examX = {
        type1: [center - 400, center, center + 400],
        type2: [center - 450, center, center + 450],
        type3: [center - 300, center + 300]
      }

      const type = this.mData['type']

      let quizCount = 1
      if (type == 1 || type == 2) {
        quizCount = 2
      }
      this.mWrongCard = []
      const ary = []
      // type이 1,2 이면 quizCount = 2
      // type이 3 이면 quizCount = 1
      if (quizCount == 2) {
        for (let i = 1; i <= quizCount; i++) {
          const wrongExm = new QuizCard(this.mData[`wrong${i}`], false, false)
          ary.push(wrongExm)
          this.mWrongCard.push(wrongExm)
        }
        this.mCorrectCard = new QuizCard(this.mData[`correct`], false, true)
        ary.push(this.mCorrectCard)

        this.mExample = shuffleArray(ary)
      } else {
        const wrongExm = new QuizCard(this.mData[`wrong`], false, false)
        ary.push(wrongExm)
        this.mWrongCard.push(wrongExm)
        this.mCorrectCard = new QuizCard(this.mData[`correct`], false, true)
        ary.push(this.mCorrectCard)

        this.mExample = shuffleArray(ary)
      }

      for (let i = 0; i < this.mExample.length; i++) {
        this.mExample[i].position.set(
          examX[`type${type}`][i],
          config.h / 2 + 150
        )
        this.addChild(this.mExample[i])
      }

      gsap.delayedCall(1, async () => {
        await this.mTrain.onSound()
        for (const card of this.mExample) {
          card.disable(false)
        }
        resolve()
      })
    })
  }

  destroyTrain(): Promise<void> {
    return new Promise<void>((resolve) => {
      const snd = ResourceManager.Handle.getViewerResource(`ac7_trainstart.mp3`)
        .sound
      snd.play()
      gsap
        .to(this.mTrain, { x: config.w * 1.5, duration: 1 })
        .eventCallback('onComplete', () => {
          this.mTrain = null
          resolve()
        })
    })
  }

  deleteWrongCard(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mTrain.soundBtnVisible(false)
      this.mTrain.correct()

      for (const wrong of this.mWrongCard) {
        wrong.delete()
      }
      gsap
        .to(this.mCorrectCard, {
          x: config.w / 2,
          duration: 0.5
        })
        .delay(0.5)
        .eventCallback('onComplete', () => {
          resolve()
        })
    })
  }

  async next() {
    await this.destroyTrain()
    ;(this.parent as Type1).next()
  }

  wrong() {
    ;(this.parent as Type1).wrong()
  }
}

export class Type1 extends QuizType {
  private mData: any
  //type1 안의 게임 순서
  private mCurrentStep: number

  private mType1GameScene: Array<GameScene>

  constructor(quizData: any) {
    super()
    this.mData = quizData
    this.mCurrentStep = 0
  }
  async onInit() {
    this.removeChild()

    this.createQuiz()

    window.onkeypress = (evt: KeyboardEvent) => {
      if (evt.key == '+') {
        // this.mCurrentStep = Object.keys(this.mData).length
        this.next()
      }
    }
  }

  async createQuiz() {
    this.mType1GameScene = []

    const totalStep = Object.keys(this.mData).length
    for (let i = 1; i <= totalStep; i++) {
      this.mType1GameScene.push(new GameScene(this.mData[`step${i}`]))
    }

    this.addChild(this.mType1GameScene[this.mCurrentStep])
    await this.mType1GameScene[this.mCurrentStep].onInit()

    // 안내 사운드
    const scriptSnd = ResourceManager.Handle.getViewerResource(
      `ac7_script_1.mp3`
    ).sound
    scriptSnd.play()

    gsap.delayedCall(scriptSnd.duration + 0.5, () => {
      this.mType1GameScene[this.mCurrentStep].createQuizCard()
    })
  }

  async next() {
    //// pixisound.stopAll()

    const total = Object.keys(this.mData).length
    this.mCurrentStep += 1
    if (this.mCurrentStep >= total) {
      gsap.globalTimeline.clear()
      window.onkeypress = () => null
      // gsap.globalTimeline.clear()
      ;(this.parent.parent as Total).nextType()
      // console.log(`currentStep=>${this.mCurrentStep}`)
      // console.log(`total=>${total}`)
    } else {
      gsap.globalTimeline.clear()
      ;(this.parent.parent as Total).nextStep()
      this.removeChildren()
      this.addChild(this.mType1GameScene[this.mCurrentStep])
      await this.mType1GameScene[this.mCurrentStep].onInit()
      await this.mType1GameScene[this.mCurrentStep].createQuizCard()
    }
  }

  wrong() {
    ;(this.parent.parent as Total).wrongCount1 += 1
  }
}
