import pixisound from 'pixi-sound'
import { App } from '@/activity/core/app'
import { ResourceManager } from '@/activity/core/resourceManager'
import { Common } from '@/activity/core/resource/common'
import { Home } from '@/activity/home'
import { Today } from '@/activity/haruHangul/todayHangul/today'
import { MyHangul } from '@/activity/haruHangul/myHangul/myHangul'
import { Rhythm } from '@/activity/haruHangul/rhythmHangul/rhythm'
import { Paint } from '@/activity/haruHangul/paintHangul/paint'
import { Partner } from '@/activity/haruHangul/partnerHangul/partner'
import { Nodak } from '@/activity/haruHangul/nodakHangul/nodak'
import config from './activity/gameUtil/config'
// import WebFont from 'webfontloader'
import { Total } from '@/activity/haruHangul/totalHangul/total'
import { Puzzle } from './activity/puzzle/puzzle'
import { LoadingScreen } from '@/activity/scene/loading'
import gsap from 'gsap/all'

export class AramApp extends App {
  private mLoading: LoadingScreen

  constructor(canvas: HTMLCanvasElement, gameName: string, info: any) {
    super(canvas)
    if (window['currentVideo']) {
      window['currentVideo'].pause()
      window['currentVideo'] = null
    }
    document.addEventListener('visibilitychange', async () => {
      await this.visibilitychange()
    })

    this.addScene(new Home())
    this.addScene(new Today())
    this.addScene(new Rhythm())
    this.addScene(new Paint())
    this.addScene(new Partner())
    this.addScene(new MyHangul())
    this.addScene(new Nodak())
    this.addScene(new Total())
    this.addScene(new Puzzle())
    this.startApp({}, gameName, info)
  }

  async visibilitychange() {
    const gameName = App.Handle.getSceneName()
    if (gameName == 'today' || gameName == 'myhangul') {
      return
    }
    // 모든 액티비티 공통
    if (window['currentVideo']) {
      window['currentVideo'].pause()
    }
    if (document.hidden == false) {
      /**보여질 때 */
      await App.Handle.modalRoot.resetModal()
      if (window['spine']) window['spine'].state.timeScale = 1
      if (window['spineSnd']) window['spineSnd'].resume()

      gsap.globalTimeline.resume()
      pixisound.resumeAll()
    } else {
      /**안보일 때 */
      if (window['spine']) window['spine'].state.timeScale = 0
      if (window['spineSnd']) window['spineSnd'].pause()

      gsap.globalTimeline.pause()
      pixisound.pauseAll()
    }
  }

  /**App.vue에서 로딩하는걸로 수정했음. */
  // private _fontLoading(): Promise<void> {
  //   return new Promise<void>((resolve) => {
  //     WebFont.load({
  //       // google: {
  //       //   families: ['BareunBatangOTFM', 'NanumBarunGothic', 'TmoneyRoundWindRegular']
  //       // },
  //       custom: {
  //         families: [
  //           'BareunBatangOTFM',
  //           'NanumBarunGothicBold',
  //           'TmoneyRoundWindExtraBold',
  //           'TmoneyRoundWindRegular'
  //         ],
  //         urls: [`${config.resource}fonts/fonts.css`]
  //       },
  //       timeout: 2000,
  //       active: () => {
  //         // console.log(' font loaded')
  //         resolve()
  //       },

  //       fontloading: (fontname) => {
  //         // // console.log('fontLoading', fontname)
  //       }
  //     })
  //   })
  // }
  async onStartApp() {
    // await this._fontLoading()
    await this.showLoadingScreen()

    this.videoAllStop()
    //// pixisound.stopAll()
    await ResourceManager.Handle.loadCommonResource(Common)
  }

  end(): Promise<void> {
    return new Promise<void>((resolve) => {
      gsap.globalTimeline.clear()
      PIXI.utils.clearTextureCache()
      PIXI.Loader.shared.destroy()
      pixisound.stopAll()
      this.destroy(true, {
        children: true,
        texture: false,
        baseTexture: false
      })

      if (window['currentVideo']) {
        window['currentVideo'].pause()
        window['currentVideo'] = null
      }

      if (window['gameMotion']) {
        for (const motion of window['gameMotion']) {
          motion.pause()
        }
      }
      window['gameMotion'] = []

      if (window['recorder']) {
        window['recorder'].pauseRecording()
      }
      window['recorder'] = null
      window['record'] = null

      document.removeEventListener('visibilitychange', async () => {
        await this.visibilitychange()
      })
      this.visibilitychange = () => null

      document.onvisibilitychange = async () => {
        null
      }

      resolve()
    })
  }

  onCloseApp() {
    //
  }
}
