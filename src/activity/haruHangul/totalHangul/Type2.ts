import { ResourceManager } from '@/activity/core/resourceManager'
import config from '@/activity/gameUtil/config'
import { debugLine, getSound, shuffleArray } from '@/activity/gameUtil/game'
import gsap, { Power0 } from 'gsap/all'
import pixisound from 'pixi-sound'
import { QuizType } from './QuizType'
import { Total } from './total'

export class SoundBtn extends PIXI.Container {
  private mActive: PIXI.Texture
  private mDisAble: PIXI.Texture
  private mBtn: PIXI.Sprite

  private mSoundName: string

  private mDuration: number
  get duration(): number {
    if (this.mDuration) return this.mDuration
  }

  constructor(soundName: string) {
    super()
    this.mSoundName = soundName
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

  onSound(intro?: boolean): Promise<void> {
    return new Promise<void>((resolve) => {
      ;(this.parent.parent as GameScene).guideSnd = null
      this.interactive = false
      this.buttonMode = false
      this.mBtn.texture = this.mDisAble

      // console.error(this.mSoundName)
      const snd = ResourceManager.Handle.getCommonResource(this.mSoundName)
        .sound
      snd.play()
      this.mDuration = snd.duration
      gsap.delayedCall(this.mDuration, () => {
        if (!intro) {
          this.active()
        }
        resolve()
      })
    })
  }

  active() {
    this.mBtn.texture = this.mActive
    this.interactive = true
    this.buttonMode = true
  }
}

export class Ball extends PIXI.Container {
  private mBall: PIXI.Sprite
  private mNormal: PIXI.Texture
  private mDisAble: PIXI.Texture
  private mCorrect: PIXI.Texture

  private mSoundBtn: SoundBtn
  get duration(): number {
    return this.mSoundBtn.duration
  }
  constructor(quizWord: string, correct: boolean) {
    super()
    this.mNormal = ResourceManager.Handle.getViewerResource(
      `t2_ball02.png`
    ).texture
    this.mDisAble = ResourceManager.Handle.getViewerResource(
      `t2_ball03.png`
    ).texture
    this.mCorrect = ResourceManager.Handle.getViewerResource(
      `t2_ball01.png`
    ).texture

    this.mBall = new PIXI.Sprite(this.mDisAble)
    this.mBall.anchor.set(0.5)
    this.mBall.x = 150

    const sndName = `word_${getSound(quizWord)}.mp3`
    this.mSoundBtn = new SoundBtn(sndName)
    this.mSoundBtn.y = this.mBall.height / 2 - this.mSoundBtn.height / 2

    this.addChild(this.mBall, this.mSoundBtn)

    this.pivot.set(this.width / 2, this.height / 2)

    this.mBall.on('pointertap', () => {
      this.onClick()
    })

    if (correct == true) {
      this.onClick = () => this.correct()
    } else {
      this.onClick = () => this.wrong()
    }
  }

  soundPlay(intro?: boolean) {
    if (intro) {
      this.mSoundBtn.onSound(true)
    } else {
      this.mSoundBtn.onSound()
    }
  }

  soundMotion() {
    gsap
      .to(this.mSoundBtn.scale, { x: 0.8, y: 0.8, duration: 0.25 })
      .repeat(1)
      .yoyo(true)
    gsap
      .to(this.mBall.scale, { x: 0.8, y: 0.8, duration: 0.25 })
      .repeat(1)
      .yoyo(true)
  }

  activeGame() {
    this.mSoundBtn.active()
    this.mBall.interactive = true
    this.mBall.buttonMode = true
    this.mBall.texture = this.mNormal
  }

  onClick() {
    //
  }

  correct() {
    this.correct = () => null
    this.mSoundBtn.alpha = 0
    ;(this.parent as GameScene).endMotion()
    this.mBall.texture = this.mCorrect
    this.mSoundBtn.visible = false
    // console.log(`정답`)

    let snd = ResourceManager.Handle.getViewerResource(`ac7_throw.mp3`).sound
    snd.play()

    gsap
      .to(this, { x: config.w / 2 - 10, y: 300, duration: snd.duration })
      .eventCallback('onComplete', () => {
        gsap
          .to(this, { y: 600, duration: 0.5 })
          .eventCallback('onComplete', () => {
            snd = ResourceManager.Handle.getViewerResource(`ac7_correct.mp3`)
              .sound
            snd.play()
            gsap.delayedCall(0.5, () => {
              snd = null
              ;(this.parent as GameScene).next()
            })
          })
      })
  }

  wrong() {
    this.wrong = () => null

    let sound = ResourceManager.Handle.getViewerResource(`ac7_throw.mp3`).sound
    sound.play()
    ;(this.parent as GameScene).wrong()
    // console.log(`오답`)
    this.mSoundBtn.alpha = 0
    const backupX = this.x

    let bounceX = 0
    if (this.x > config.w / 2) {
      bounceX = +200
    } else {
      bounceX = -200
    }

    gsap.to(this, {
      x: config.w / 2 + bounceX,
      y: 400,
      duration: sound.duration,
      ease: Power0.easeNone
    })
    gsap.delayedCall(sound.duration, () => {
      sound = ResourceManager.Handle.getViewerResource(`ac7_wrong.mp3`).sound
      sound.play()

      gsap
        .to(this, {
          x: backupX + bounceX * 2,
          y: 500,
          duration: 0.5,
          ease: Power0.easeNone
        })
        .eventCallback('onComplete', () => {
          sound = null
          this.visible = false
        })
    })
  }

  endMotion() {
    this.wrong = () => null
    this.mSoundBtn.visible = false
    this.mBall.texture = this.mDisAble
  }
}

export class Text extends PIXI.Container {
  private mTextAry: Array<string>
  constructor(text: Array<string>) {
    super()
    this.mTextAry = text
    this.createText()
  }
  createText() {
    let offsetX = 0
    for (let i = 0; i < this.mTextAry.length; i++) {
      const text = new PIXI.Text(this.mTextAry[i], {
        fontSize: 58,
        fill: 0xffffff,
        fontFalmily: 'TmoneyRoundWindExtraBold',
        padding: 20
      })
      this.addChild(text)
      text.position.set(offsetX, 0)
      offsetX += text.width
    }

    this.pivot.set(this.width / 2, this.height / 2)
  }
}

export class GameScene extends PIXI.Container {
  private mData: any
  private mGuideSnd: PIXI.sound.Sound
  get guideSnd(): PIXI.sound.Sound {
    return this.mGuideSnd
  }
  set guideSnd(v: PIXI.sound.Sound) {
    if (this.mGuideSnd) this.mGuideSnd.pause()
    this.mGuideSnd = v
  }

  private mImgQuiz: PIXI.Sprite
  private mTextQuiz: PIXI.Text

  private mCorrect: Ball
  private mWrong: Ball
  private mBalls: Array<Ball>

  constructor(data: any) {
    super()
    this.mData = data
  }
  async onInit() {
    const bg = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource('t2_bg.png').texture
    )
    this.addChild(bg)

    // console.log(this.mData[`type`])
    if (this.mData[`type`] == 1) {
      this.createImgQuiz()
    } else {
      this.createTextQuiz()
    }
    this.createBallQuiz()
    await this.createGuideText()

    const basket = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`t2_basket.png`).texture
    )
    basket.anchor.set(0.5)
    basket.position.set(config.w / 2, 368 + basket.height / 2)
    this.addChild(basket)
  }

  createGuideText(): Promise<void> {
    return new Promise<void>((resolve) => {
      const text = new PIXI.Text(`알맞은 소리를 찾아 넣어봐!`, {
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
          `${this.mData['sound']}`
        ).sound
        this.mGuideSnd.play()
      })
      resolve()
    })
  }

  createImgQuiz() {
    // console.log(this.mData[`correct`])
    const quizNum = getSound(this.mData[`correct`])
    // console.log(`word_${quizNum}.png`)
    this.mImgQuiz = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`word_${quizNum}.png`).texture
    )
    this.mImgQuiz.anchor.set(0.5)
    this.mImgQuiz.scale.set(0.6)
    this.mImgQuiz.position.set(config.w / 2, 240)
    this.addChild(this.mImgQuiz)
  }

  createTextQuiz() {
    this.mTextQuiz = new PIXI.Text(this.mData['correct'], {
      fontSize: 120,
      fontFamily: 'TmoneyRoundWindExtraBold',
      fill: 0xffffff,
      padding: 20
    })

    this.mTextQuiz.tint = 0x000000

    this.mTextQuiz.pivot.set(
      this.mTextQuiz.width / 2,
      this.mTextQuiz.height / 2
    )

    this.mTextQuiz.position.set(config.w / 2, 260)

    this.addChild(this.mTextQuiz)
  }

  async activeQuiz() {
    await this.playSound()
  }

  activeGame() {
    for (let i = 0; i < this.mBalls.length; i++) {
      this.mBalls[i].activeGame()
    }
  }

  playSound(): Promise<void> {
    return new Promise<void>((resolve) => {
      for (let i = 0; i < this.mBalls.length; i++) {
        gsap.delayedCall(i, () => {
          this.mBalls[i].soundMotion()
          this.mBalls[i].soundPlay(true)
        })
      }
      gsap.delayedCall(2, () => {
        this.activeGame()
        resolve()
      })
    })
  }

  createBallQuiz() {
    this.mBalls = []

    this.mCorrect = new Ball(this.mData['correct'], true)
    this.mWrong = new Ball(this.mData['wrong'], false)

    this.mBalls = shuffleArray([this.mCorrect, this.mWrong])

    const pos = [config.w / 2 - 358, config.w / 2 + 358]

    for (let i = 0; i < this.mBalls.length; i++) {
      this.mBalls[i].position.set(pos[i], 630)
      this.addChild(this.mBalls[i])
    }
  }

  endMotion() {
    this.mWrong.endMotion()
  }

  next() {
    ;(this.parent as Type2).next()
  }

  wrong() {
    ;(this.parent as Type2).wrong()
  }
}

export class Type2 extends QuizType {
  private mData: any
  //type2 안의 게임 순서
  private mCurrentStep: number

  private mType2GameScene: Array<GameScene>

  constructor(quizData: any) {
    super()
    this.mData = quizData
    this.mCurrentStep = 0
  }

  async onInit() {
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
    this.mType2GameScene = []

    const totalStep = Object.keys(this.mData).length
    for (let i = 1; i <= totalStep; i++) {
      this.mType2GameScene.push(new GameScene(this.mData[`step${i}`]))
    }

    this.addChild(this.mType2GameScene[this.mCurrentStep])

    await this.mType2GameScene[this.mCurrentStep].onInit()

    // 안내 사운드
    const scriptSnd = ResourceManager.Handle.getViewerResource(
      `${this.mData['step1']['sound']}`
    ).sound
    scriptSnd.play()
    gsap.delayedCall(scriptSnd.duration + 1, async () => {
      await this.mType2GameScene[this.mCurrentStep].activeQuiz()
    })
  }

  async next() {
    //// pixisound.stopAll()

    const total = Object.keys(this.mData).length
    this.mCurrentStep += 1
    if (this.mCurrentStep >= total) {
      window.onkeypress = () => null
      // console.log(`currentStep=>${this.mCurrentStep}`)
      // console.log(`total=>${total}`)
      gsap.delayedCall(0.5, () => {
        ;(this.parent.parent as Total).nextType()
      })
    } else {
      // console.log(`진행중인 스텝=>${this.mCurrentStep}`)

      gsap.delayedCall(0.5, async () => {
        ;(this.parent.parent as Total).nextStep()
        this.removeChildren()
        this.addChild(this.mType2GameScene[this.mCurrentStep])
        await this.mType2GameScene[this.mCurrentStep].onInit()
        await this.mType2GameScene[this.mCurrentStep].activeQuiz()
      })
    }
  }

  wrong() {
    ;(this.parent.parent as Total).wrongCount1 += 1
  }
}
