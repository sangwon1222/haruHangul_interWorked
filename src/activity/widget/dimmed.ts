import * as PIXI from 'pixi.js'
export class Dimmed extends PIXI.Graphics {
  constructor(width: number, height: number) {
    super()
    this.beginFill(0x000000, 0.8)
    this.drawRect(0, 0, width, height)
    this.endFill()
    this.interactive = true
  }
}
