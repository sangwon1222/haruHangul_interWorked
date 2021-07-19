import { App } from '@/activity/core/app'
import { MyhangulResource } from '@/activity/core/resource/viewer/myhangulResource'
import { SceneBase } from '@/activity/core/sceneBase'
import config from '@/activity/gameUtil/config'
import { Eop } from '@/activity/scene/eop'
import { HangulCard } from '@/activity/widget/hangulCard'
import { Intro } from '@/activity/scene/intro'
import { MyhangulRecord } from '@/activity/widget/myhangulRecord'
import gsap from 'gsap'
import { getSymbol, syllableToNum, getSound } from '@/activity/gameUtil/game'
import { AramApp } from '@/AramApp'
import { ResourceManager } from '@/activity/core/resourceManager'
import Axios from 'axios'
import pixisound from 'pixi-sound'

export class MyHangul extends SceneBase {
  private mVideoSprite: PIXI.Sprite
  private mVideoElement: HTMLVideoElement
  private mQuizData: any
  private mQuizStep: number
  get quizStep(): number {
    return this.mQuizStep
  }
  private mMyhangulRecord: MyhangulRecord
  private mMyhangulRecordFlag: boolean

  private mEndSnd: PIXI.sound.Sound
  get endSnd(): PIXI.sound.Sound {
    return this.mEndSnd
  }
  /**화면 보이고 안보일때 나올 딤드 */
  private mDimmed: PIXI.Container

  private visibilitychange: any

  constructor() {
    super(`myhangul`)
  }
  async onInit() {
    this.startTime()

    window.onkeypress = () => null
    document.removeEventListener('visibilitychange', null)

    await App.Handle.showLoadingScreen()

    // await this.selectDay()
    this.mQuizData = []
    await this.getData()

    const type = `${config.data[config.selectDay]['type']}`
    const wordNum = getSound(config.data[config.selectDay]['word'])
    const syllable = `${type}${syllableToNum(getSymbol())}.mp3`
    const word = `word_${wordNum}.mp3`

    await this.loadCommonResource({
      sounds: [syllable, word]
    })
    await this.loadViewerResource(MyhangulResource)
    if (window['currentVideo']) {
      window['currentVideo'].pause()
      window['currentVideo'] = null
    }
    this.mQuizStep = 0
    /**video setting */
    await this.settingVideo()
    this.mVideoSprite = new PIXI.Sprite()
    this.addChild(this.mVideoSprite)
    this.mVideoSprite.alpha = 0
    this.mVideoSprite.texture = PIXI.Texture.from(this.mVideoElement)
    this.mVideoSprite.width = config.w
    this.mVideoSprite.height = config.h
    window['currentVideo'].pause()

    await App.Handle.closeLoadingScreen()

    window.onkeypress = (evt: KeyboardEvent) => {
      if (evt.key == '+') {
        this.removeChildren()
        gsap.globalTimeline.clear()
        //// pixisound.stopAll()
        this.onEnded()
      }
    }
    // console.log('gamename =>', this.gamename)
  }

  getData(): Promise<void> {
    return new Promise<void>((resolve) => {
      const requestUrl = `${config.resource}data/myhangul_data.json`
      const request = new XMLHttpRequest()
      request.open('GET', requestUrl)
      request.responseType = 'json'
      request.send()
      request.onloadend = () => {
        this.mQuizData = request.response['data'][`${config.selectDay}`]
        resolve()
      }
    })
  }

  async onStart() {
    const type = `${config.data[config.selectDay]['type']}`
    const wordNum = getSound(config.data[config.selectDay]['word'])
    const syllable = `${type}${syllableToNum(getSymbol())}.mp3`
    const word = `word_${wordNum}.mp3`
    const sound1 = ResourceManager.Handle.getCommonResource(syllable).sound
    const sound2 = ResourceManager.Handle.getCommonResource(word).sound

    const sound = [sound1, sound2]
    window['myhangulSound'] = sound

    this.mEndSnd = ResourceManager.Handle.getViewerResource(`ac5_end.mp3`).sound
    this.mMyhangulRecordFlag = false
    /**인트로 화면 */
    const intro = new Intro()
    this.addChild(intro)
    this.mVideoSprite.alpha = 1
    await intro.playIntro()
    /**인트로 화면 나타나거나 사라지는 모션 */

    this.removeChild(intro)

    App.Handle.modalRoot.visible = false

    /**video event */
    this.mVideoElement.addEventListener('timeupdate', async () => {
      if (!this.mVideoElement) return
      const current = Math.floor(this.mVideoElement.currentTime)
      if (current >= this.mQuizData['timer'][this.mQuizStep]) {
        if (this.mMyhangulRecordFlag == true) {
          return
        }
        this.mMyhangulRecordFlag = true
        await this.startMyhangulRecord()
        this.mMyhangulRecordFlag = false
        this.mQuizStep += 1
        if (this.mQuizStep > this.mQuizData['timer'].length) {
          // console.log(this.mQuizStep)
          // console.log(`퀴즈 끝, 동영상 시청`)
        }
        //
      }
    })

    this.setCard()
  }

  settingVideo(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mVideoElement = document.createElement('video')
      this.mVideoElement.setAttribute('playsinline', '')
      this.mVideoElement.setAttribute('autoplay', '')
      const url = `${config.resource}product/myhangul/video/${config.selectDay}_mh.mp4`
      this.mVideoElement.src = url
      this.mVideoElement.crossOrigin = ''
      this.mVideoElement.autoplay = true

      window['currentVideo'] = this.mVideoElement

      window['currentVideo'].onended = () => {
        this.onEnded()
      }

      window['currentVideo'].oncanplay = () => {
        window['currentVideo'].oncanplay = null
        window['currentVideo'].pause()
        resolve()
      }
    })
  }

  setCard() {
    let sound = ResourceManager.Handle.getCommonResource(`ac1_playpop.mp3`)
      .sound
    sound.play()
    sound = null

    let card = new HangulCard(getSymbol(), 0x000000, {
      fontSize: 180,
      fontWeight: 'bold',
      fontFamily: 'TmoneyRoundWindExtraBold'
    })
    card.changeTint(true)
    this.addChild(card)
    this.mVideoSprite.alpha = 1
    // card.startMotion( 0 , config.h/2 ,2);
    card.onClick = () => {
      this.removeChild(card)
      card = null
      window['currentVideo'].play()
      App.Handle.modalRoot.visible = true

      /**탭이동을 하거나, 다시 탭으로 돌아왔을 때/ */
      document.onvisibilitychange = async () => {
        if (App.Handle.getSceneName() !== 'myhangul') {
          this.destroy({ children: true })
        }
        if (window['currentVideo']) window['currentVideo'].pause()

        if (document.hidden == false) {
          /**화면 보일 때 */
          // console.log(`화면 보일 때`)
          if (!window['recorder']) {
            await this.nextRec()
          }
        } else {
          await App.Handle.modalRoot.resetModal()
          /**화면 안보일 때 */
          if (this.mDimmed) {
            this.mDimmed.removeChildren()
            this.removeChild(this.mDimmed)
          }
        }
      }
    }
  }
  /**브라우저를 내리고 올릴때 들어가는 동영상 재생 이미지 */
  async nextRec() {
    this.mEndSnd.play()
    if (this.mDimmed) {
      this.mDimmed.removeChildren()
      this.removeChild(this.mDimmed)
      this.mDimmed = null
    }
    this.mDimmed = new PIXI.Container()
    const dimmed = new PIXI.Graphics()
    dimmed.beginFill(0x000000, 1)
    dimmed.drawRect(0, 0, config.w, config.h)
    dimmed.endFill()
    dimmed.interactive = true
    dimmed.alpha = 0
    gsap.to(dimmed, { alpha: 0.4, duration: 0.5 })

    const exit = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`btn_play.png`).texture
    )
    exit.anchor.set(0.5)
    exit.position.set(config.w / 2, config.h / 2)
    gsap
      .to(exit.scale, { x: 0.9, y: 0.9, duration: 0.5 })
      .yoyo(true)
      .repeat(-1)
    this.mDimmed.addChild(dimmed, exit)

    this.mDimmed.interactive = true
    this.mDimmed.once('pointertap', () => {
      gsap.killTweensOf(exit)
      this.mDimmed.removeChildren()
      this.removeChild(this.mDimmed)
      this.mVideoElement.play()
    })

    this.addChild(this.mDimmed)
  }

  /** 녹음 시작 */
  async startMyhangulRecord() {
    App.Handle.modalRoot.visible = false
    this.mVideoElement.pause()

    await this.recordBefore()

    this.mMyhangulRecord = new MyhangulRecord(
      this.mQuizStep,
      this.mQuizData['text'][this.mQuizStep]
    )
    this.addChild(this.mMyhangulRecord)

    await this.mMyhangulRecord.readyRecord()
    const pop = ResourceManager.Handle.getViewerResource(`ac5_pop.mp3`).sound
    pop.play()
    gsap.delayedCall(pop.duration, async () => {
      this.mMyhangulRecord.startRec()
      await this.mMyhangulRecord.setRecord()

      await this.mMyhangulRecord.playRecord()

      await this.mMyhangulRecord.waitRecord()

      // this.mMyhangulRecord.waitRecord 에서 호출
      // await this.mMyhangulRecord.endRecord()

      await this.endRecord()
    })
  }

  private endRecord(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mMyhangulRecord = null
      this.mVideoElement.play()
      App.Handle.modalRoot.visible = true

      resolve()
    })
  }

  recordBefore(): Promise<void> {
    return new Promise<void>((resolve) => {
      let sound = ResourceManager.Handle.getViewerResource(`ac5_script_1-1.mp3`)
        .sound
      sound.play()
      gsap.delayedCall(sound.duration, () => {
        sound = null
        resolve()
      })
    })
  }

  async onEnded() {
    document.onvisibilitychange = () => null

    await this.endTime()

    window.onkeypress = () => null
    if (window['recorder']) {
      window['recorder'].destroy()
      window['recorder'] = null
    }
    if (window['record']) {
      window['record'] = null
    }
    this.mVideoElement.pause()
    this.mVideoElement = null
    if (window['currentVideo']) {
      if (window['currentVideo'].paused == false) {
        window['currentVideo'].pause()
      }
      window['currentVideo'] = null
    }
    // this.mMyhangulRecord.destroy()
    this.mMyhangulRecord = null

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
      { wrongCount: 0 },
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    )
    // console.warn(end)

    const EOP = new Eop()
    this.addChild(EOP)
    await EOP.eopPlay()

    gsap
      .to(this, { y: config.h, duration: 0.5 })
      .eventCallback(`onComplete`, () => {
        this.children.forEach((element) => {
          element = null
        })
        App.Handle.goMainPage()
      })
  }
}
