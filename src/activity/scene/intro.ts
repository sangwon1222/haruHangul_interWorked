import { App } from '@/activity/core/app'
import { ResourceManager } from '@/activity/core/resourceManager'
import config from '@/activity/gameUtil/config'
import { Common } from '@/activity/core/resource/common'

export class Intro extends PIXI.Container {
  private mIntroSpine: PIXI.spine.Spine
  private mSound: {}
  constructor() {
    super()
  }
  ready(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mSound = {}
      this.mSound['com_intro_bgm'] = ResourceManager.Handle.getCommonResource(
        'com_intro_bgm.mp3'
      ).sound
      this.mSound['com_intro_eff'] = ResourceManager.Handle.getCommonResource(
        'com_intro_eff.mp3'
      ).sound
      this.mSound['ac1_title'] = ResourceManager.Handle.getCommonResource(
        'ac1_title.mp3'
      ).sound
      this.mSound['ac2_title'] = ResourceManager.Handle.getCommonResource(
        'ac2_title.mp3'
      ).sound
      this.mSound['ac3_title'] = ResourceManager.Handle.getCommonResource(
        'ac3_title.mp3'
      ).sound
      this.mSound['ac4_title'] = ResourceManager.Handle.getCommonResource(
        'ac4_title.mp3'
      ).sound
      this.mSound['ac5_title'] = ResourceManager.Handle.getCommonResource(
        'ac5_title.mp3'
      ).sound
      this.mSound['ac6_title'] = ResourceManager.Handle.getCommonResource(
        'ac6_title.mp3'
      ).sound
      this.mSound['ac7_title'] = ResourceManager.Handle.getCommonResource(
        'ac7_title.mp3'
      ).sound
      resolve()
    })
  }
  intro(): Promise<void> {
    return new Promise<void>((resolve) => {
      App.Handle.modalRoot.visible = false

      this.mIntroSpine = new PIXI.spine.Spine(
        ResourceManager.Handle.getCommonResource(`intro.json`).spineData
      )
      this.addChild(this.mIntroSpine)
      this.mIntroSpine.position.set(config.w / 2, config.h / 2)
      this.mIntroSpine.state.setAnimation(
        0,
        `0${App.Handle.currentSceneIDX}`,
        false
      )

      window['spine'] = this.mIntroSpine

      this.mIntroSpine.state.addListener({
        event: (entry, event) => {
          if (this.mSound !== undefined) {
            window['spineSnd'] = this.mSound[event.data.name]
            this.mSound[event.data.name].play()
          }
        },
        complete: () => {
          window['spine'] = null
          window['spineSnd'] = null
          App.Handle.modalRoot.visible = true
          resolve()
        }
      })
    })
  }
  async playIntro() {
    await ResourceManager.Handle.loadCommonResource(Common)
    await this.ready()
    await this.intro()
  }
}
