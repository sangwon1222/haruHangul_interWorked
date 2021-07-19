import { SceneBase } from '@/activity/core/sceneBase'
import { VideoControl } from '@/activity/widget/videoCont'
import Config from '@/activity/gameUtil/config'
import { HangulCard } from '@/activity/widget/hangulCard'
import { Eop } from '@/activity/scene/eop'
import { Intro } from '@/activity/scene/intro'
import { App } from '@/activity/core/app'
import config from '@/activity/gameUtil/config'
import { getSymbol } from '@/activity/gameUtil/game'
import { ResourceManager } from '@/activity/core/resourceManager'
import Axios from 'axios'
import pixisound from 'pixi-sound'
import { isIOS } from '@/activity/gameUtil/platform'
import gsap from 'gsap/all'

export class Today extends SceneBase {
  private mVideoSprite: PIXI.Sprite
  private mVideoElement: HTMLVideoElement
  private mController: VideoControl

  constructor() {
    super('today')
  }
  async onInit() {
    this.startTime()
    App.Handle.modalRoot.visible = false

    window.onkeypress = () => null

    await App.Handle.showLoadingScreen()
    await this.settingVideo()
    await App.Handle.closeLoadingScreen()

    window.onkeypress = (evt: KeyboardEvent) => {
      if (evt.key == '+') {
        this.removeChildren()
        //// pixisound.stopAll()
        gsap.globalTimeline.clear()
        this.onEnded()
      }
    }
  }

  async onStart() {
    const intro = new Intro()
    this.addChild(intro)
    await intro.playIntro()
    this.removeChild(intro)

    this.mVideoSprite.alpha = 1
    this.setCard()
  }

  settingVideo(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mVideoElement = document.createElement('video')
      this.mVideoElement.setAttribute('playsinline', '')
      this.mVideoElement.setAttribute('autoplay', '')
      this.mVideoElement.setAttribute('crossorigin', '')
      const url = `${Config.resource}product/today/video/${config.selectDay}_th.mp4`
      // const url = `${Config.resource}test.mp4`

      this.mVideoElement.src = url

      this.mVideoElement.onended = () => {
        this.onEnded()
      }

      this.mVideoElement.oncanplay = () => {
        this.mVideoSprite = new PIXI.Sprite()
        this.addChild(this.mVideoSprite)
        this.mVideoSprite.alpha = 0
        this.mVideoSprite.texture = PIXI.Texture.from(this.mVideoElement)
        this.mVideoSprite.width = config.w
        this.mVideoSprite.height = config.h
        this.mVideoElement.pause()
        this.mVideoElement.oncanplay = () => null
        resolve()
      }
    })
  }

  setCard() {
    const sound = ResourceManager.Handle.getCommonResource(`ac1_playpop.mp3`)
      .sound
    sound.play()

    this.sortableChildren = true

    const card = new HangulCard(getSymbol(), 0x000000, {
      fontSize: 180,
      fontWeight: 'bold',
      fontFamily: 'TmoneyRoundWindExtraBold'
    })
    card.changeTint(true)
    this.addChild(card)

    this.mController = new VideoControl(this.mVideoElement)
    this.addChild(this.mController)

    this.mVideoSprite.zIndex = 1
    this.mController.zIndex = 2
    card.zIndex = 3

    card.onClick = () => {
      this.mVideoElement.play()
      card.onClick = () => null
      this.mController.playControl()
      this.removeChild(card)
      App.Handle.modalRoot.visible = true

      document.onvisibilitychange = async () => {
        if (document.hidden == false) {
          /**화면 보일 때 */
        } else {
          /**화면 안보일 때 */
          await App.Handle.modalRoot.resetModal()
          if (this.mController) {
            this.mController.controllerState(false)
            this.mController.showControl()
          }
        }
      }
    }
  }

  async onEnded() {
    document.onvisibilitychange = () => null

    this.onStart = () => null
    if (this.mController) this.mController.destroy()
    this.mController = null
    if (this.mVideoElement) {
      this.mVideoElement.currentTime = 0
      this.mVideoElement.pause()
      this.mVideoElement = null
    }
    window.onkeypress = () => null

    const token = localStorage.getItem('token')

    const index = App.Handle.getSceneIndex()
    const info = await Axios.get(`${config.restAPIProd}`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    const code = info.data.result[index].cd

    // 액티비티 완료 정보 전송
    const end = await Axios.post(
      `${config.restAPI}/learning/hangul/day/${config.selectDay}/activities/${code}`,
      { wrongCount: 0 },
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    )

    // 학습시간 전송
    await this.endTime()

    const EOP = new Eop()
    EOP.zIndex = 4
    this.addChild(EOP)
    await EOP.eopPlay()

    App.Handle.nextGame()
  }
}
