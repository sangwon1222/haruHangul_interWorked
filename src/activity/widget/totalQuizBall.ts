import { ResourceManager } from '../core/resourceManager'

export class TotalQuizBall extends PIXI.Container {
  private mIndex: number
  get index(): number {
    return this.mIndex
  }

  private mBall: PIXI.Sprite
  private mSound: PIXI.Sprite
  constructor(index: number) {
    super()
    this.mIndex = index
    this.mBall = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource('ball.png').texture
    )
    this.addChild(this.mBall)
    this.mBall.interactive = true
    this.mBall.buttonMode = true
    this.mBall.on('pointertap', () => {
      this.onClick()
    })
    this.pivot.set(this.width / 2, this.height / 2)
  }
  onClick() {
    //
  }
}
