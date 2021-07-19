import Config from '@/activity/gameUtil/config'
import gsap from 'gsap'
import { App } from '@/activity/core/app'
import { ResourceManager } from '@/activity/core/resourceManager'
import { EventSprite } from '../widget/eventSprite'
import config from '@/activity/gameUtil/config'

const list = [
  'today',
  'rhythm',
  'paint',
  'partner',
  'myhangul',
  'nodak',
  'total',
  'puzzle'
]

const currentX = [20, 176, 330, 488, 646]

export class Progress extends PIXI.Sprite {
  private mName: string
  private mIndex: number
  private mCurrent: EventSprite

  constructor(gameName: string) {
    super()
    this.mName = gameName
    this.texture = ResourceManager.Handle.getCommonResource(
      `outro_stage.png`
    ).texture

    this.mIndex = 0

    for (const index of list) {
      if (this.mName == index) {
        this.mIndex = list.indexOf(index)
      }
    }
    this.mCurrent = new EventSprite(
      ResourceManager.Handle.getCommonResource(`outro_check.png`).texture
    )
    this.addChild(this.mCurrent)
    this.mCurrent.position.set(currentX[this.mIndex], this.mCurrent.height / 2)
    gsap
      .to(this.mCurrent.scale, { x: 1.4, y: 1.4, duration: 0.56 })
      .repeat(-1)
      .yoyo(true)
  }
}

export class Eop extends PIXI.Container {
  private mDimmed: PIXI.Graphics
  private mProcessBar: PIXI.Sprite
  private mEopSpine: PIXI.spine.Spine
  private mSound: {}

  constructor() {
    super()
  }

  ready(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mDimmed = new PIXI.Graphics()
      this.mDimmed.beginFill(0x000000, 1)
      this.mDimmed.drawRect(0, 0, Config.w, Config.h)
      this.mDimmed.endFill()
      this.addChild(this.mDimmed)
      this.mDimmed.alpha = 0

      this.mDimmed.interactive = true

      this.mProcessBar = new Progress(App.Handle.getSceneName())
      this.mProcessBar.position.set(
        config.w / 2 - this.mProcessBar.width / 2,
        76
      )
      this.addChild(this.mProcessBar)

      this.mEopSpine = new PIXI.spine.Spine(
        ResourceManager.Handle.getCommonResource('outro.json').spineData
      )
      this.mSound = {}
      this.mSound['com_eop_sfx'] = ResourceManager.Handle.getCommonResource(
        'com_eop_sfx.mp3'
      ).sound
      resolve()
    })
  }

  start(): Promise<void> {
    return new Promise<void>((resolve) => {
      App.Handle.modalRoot.visible = false

      const btn = new EventSprite(
        ResourceManager.Handle.getCommonResource(`outro_next_btn.png`).texture
      )
      btn.position.set(config.w / 2, config.h - btn.height / 2 - 96)
      btn.scale.set(0)
      this.addChild(btn)

      gsap
        .to(this.mDimmed, { alpha: 0.8, duration: 0.5 })
        .eventCallback('onComplete', () => {
          this.mEopSpine.position.set(config.w / 2, config.h / 2)
          this.mEopSpine.stateData.defaultMix = 0.25
          this.addChild(this.mEopSpine)

          const random = Math.ceil(Math.random() * 4)
          const snd = ResourceManager.Handle.getCommonResource(
            `com_eop_sound${random}.mp3`
          ).sound
          snd.play()
          // console.log(`${random}번째 eop`)

          this.mEopSpine.state.setAnimation(0, '01', false)
          this.mEopSpine.state.addListener({
            event: (entry, event) => {
              if (this.mSound !== undefined) {
                this.mSound[event.data.name].play()
              }
            },
            complete: () => {
              this.mEopSpine.state.setAnimation(0, '02', true)
              gsap.to(btn.scale, { x: 1, y: 1, duration: 0.5, ease: 'back' })
            }
          })

          btn.once(`pointertap`, () => {
            let snd = ResourceManager.Handle.getCommonResource(
              `com_button_click.mp3`
            ).sound
            snd.play()
            gsap.delayedCall(snd.duration, () => {
              snd = null
              this.mEopSpine.destroy()
              this.mEopSpine = null
              this.removeChildren()
              App.Handle.modalRoot.visible = true
              resolve()
            })
          })
        })
    })
  }

  nonProgress(): Promise<void> {
    return new Promise<void>((resolve) => {
      App.Handle.modalRoot.visible = false

      this.mProcessBar.visible = false

      const btn = new EventSprite(
        ResourceManager.Handle.getCommonResource(`outro_next_btn.png`).texture
      )
      btn.position.set(config.w / 2, config.h - btn.height / 2 - 96)
      btn.scale.set(0)
      this.addChild(btn)

      gsap
        .to(this.mDimmed, { alpha: 0.8, duration: 0.5 })
        .eventCallback('onComplete', () => {
          this.mEopSpine.position.set(config.w / 2, config.h / 2)
          this.mEopSpine.stateData.defaultMix = 0.25
          this.addChild(this.mEopSpine)

          const random = Math.ceil(Math.random() * 4)
          const snd = ResourceManager.Handle.getCommonResource(
            `com_eop_sound${random}.mp3`
          ).sound
          snd.play()
          // console.log(`${random}번째 eop 사운드 재생`)

          this.mEopSpine.state.setAnimation(0, '01', false)
          this.mEopSpine.state.addListener({
            event: (entry, event) => {
              // console.log(`intro spine => [${event.data.name}]`)
              if (this.mSound !== undefined) {
                this.mSound[event.data.name].play()
              }
            },
            complete: () => {
              this.mEopSpine.state.setAnimation(0, '02', true)
              gsap.to(btn.scale, { x: 1, y: 1, duration: 0.5, ease: 'back' })
            }
          })

          btn.on(`pointertap`, () => {
            const click = ResourceManager.Handle.getCommonResource(
              `com_button_click.mp3`
            ).sound
            click.play()
            gsap.delayedCall(click.duration, () => {
              // location.href = config.reload
              history.go(-1)
              resolve()
            })
          })
        })
    })
  }

  async eopPlay() {
    const name = App.Handle.getSceneName()
    await this.ready()
    if (name == 'nodak' || name == 'total' || name == 'puzzle') {
      await this.nonProgress()
    } else {
      await this.start()
    }
  }
}
