import gsap from 'gsap'
import { App } from '../core/app'
import config from '../gameUtil/config'

export class CloseBtn extends PIXI.Graphics {
  constructor() {
    super()
    this.beginFill(0x000000, 1)
    this.drawRect(0, 0, 50, 50)
    this.endFill()
    this.position.set(config.w - 60, 10)
    this.interactive = true
    this.buttonMode = true
    this.on('pointertap', () => {
      this.removeChildren()
      App.Handle.onCloseApp()
      // window.location.reload()
    })
  }
}
