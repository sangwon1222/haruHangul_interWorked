import Config from '@/activity/gameUtil/config'
import gsap from 'gsap'
import { ResourceManager } from '@/activity/core/resourceManager'

export class ReviewEop extends PIXI.Container {
  constructor() {
    super()

    const bg = new PIXI.Graphics()
    bg.beginFill(0x000000, 1)
    bg.drawRect(0, 0, Config.w, Config.h)
    bg.endFill()
    this.addChild(bg)
    bg.alpha = 0
    gsap.to(bg, { alpha: 0.8, duration: 0.5 })
    bg.interactive = true
  }

  createMuck() {
    const body = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`muck_body.png`).texture
    )
    body.anchor.set(0.5)
    body.position.set(Config.w / 2, Config.h / 2)

    const eye = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`muck_eye.png`).texture
    )
    eye.anchor.set(0.5)

    const lHand = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`muck_left_arm.png`).texture
    )
    lHand.anchor.set(0.5)

    const RHand = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`muck_right_arm.png`).texture
    )
    RHand.anchor.set(0.5)

    const lHandBlink = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`muck_left_blink.png`).texture
    )
    lHandBlink.anchor.set(0.5)

    const RHandBlink = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`muck_right_blink.png`).texture
    )
    RHandBlink.anchor.set(0.5)

    gsap
      .to(lHandBlink, { alpha: 0, angle: 15, duration: 0.5 })
      .yoyo(true)
      .repeat(-1)
    gsap
      .to(RHandBlink, { alpha: 0, angle: -15, duration: 0.5 })
      .yoyo(true)
      .repeat(-1)

    gsap
      .to(lHand, { angle: 15, duration: 0.5 })
      .yoyo(true)
      .repeat(-1)
    gsap
      .to(RHand, { angle: -15, duration: 0.5 })
      .yoyo(true)
      .repeat(-1)

    gsap
      .to(eye, { y: -10, duration: 0.5 })
      .yoyo(true)
      .repeat(-1)

    body.addChild(lHand, RHand, lHandBlink, RHandBlink, eye)
    body.alpha = 0
    this.addChild(body)
    gsap.to(body, { alpha: 1, duration: 0.5 })
  }

  start(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.createMuck()

      const next = new PIXI.Container()
      next.position.set(Config.w / 2, Config.h / 2 + 200)

      const btn = new PIXI.Sprite(
        ResourceManager.Handle.getCommonResource(`button.png`).texture
      )
      btn.anchor.set(0.5)
      next.addChild(btn)

      const text = new PIXI.Text(`다음`, { fill: 0xffffff, fontSize: 68 })
      btn.addChild(text)
      text.pivot.set(text.width / 2, text.height / 2)

      btn.interactive = true
      btn.buttonMode = true
      btn.on(`pointertap`, () => {
        resolve()
      })

      this.addChild(next)
    })
  }
}
