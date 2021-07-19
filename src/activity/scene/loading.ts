import * as PIXI from 'pixi.js'
window.PIXI = PIXI
import gsap from 'gsap'
import { ResourceManager } from '../core/resourceManager'
import config from '../gameUtil/config'
import { App } from '../core/app'

// import 'pixi-spine'
require('pixi-spine')

export class LoadingScreen extends PIXI.Container {
  private mLoading: PIXI.spine.Spine
  constructor() {
    super()

    const background = new PIXI.Graphics()
    background.beginFill(0x3d4459, 1)
    background.drawRect(0, 0, config.w, config.h)
    background.endFill()
    this.addChild(background)

    this.mLoading = new PIXI.spine.Spine(
      ResourceManager.Handle.getCommonResource(`loading.json`).spineData
    )
    this.addChild(this.mLoading)
    this.mLoading.position.set(config.w / 2, config.h / 2)
    this.mLoading.state.setAnimation(0, 'loading', true)

    const text = new PIXI.Text(
      '로딩시간이 길어질 시 네트워크 연결상태를 확인하고 다시 시도해주세요.',
      {
        fontSize: 20,
        // fontFamily: 'NanumBarunGothicBold',
        fill: 0x86abe0
      }
    )
    text.anchor.set(0.5)
    text.position.set(config.w / 2, 536)

    const btn = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource('btn_loading-back.png').texture
    )
    btn.anchor.set(0.5)
    btn.position.set(config.w / 2, 620)
    btn.interactive = true
    btn.on('pointertap', () => {
      if (window['clickSnd']) {
        window['clickSnd'].play()
        gsap.delayedCall(1, () => {
          App.Handle.goMainPage()
        })
      } else {
        App.Handle.goMainPage()
      }
      // location.href = `${config.mainPage}/hangul`
    })

    // gsap.delayedCall(4,()=>{})
    this.addChild(text, btn)
  }

  async endLoading(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.removeChild(this.mLoading)

      gsap
        .to(this, { alpha: 0, duration: 0.25 })
        .eventCallback('onComplete', () => {
          this.mLoading.destroy()
          this.mLoading = null
          this.removeChildren()
          resolve()
        })
    })
  }
}
