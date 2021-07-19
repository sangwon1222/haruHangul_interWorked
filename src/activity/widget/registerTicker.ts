import { App } from '@/activity/core/app'

export class Ticker extends PIXI.Container {
  private mTicker: boolean
  get ticker(): boolean {
    return this.mTicker
  }
  set ticker(v: boolean) {
    this.mTicker = v
  }

  private mTickerFnc: any

  constructor() {
    super()

    this.mTicker = false
    this.mTickerFnc = (delta: number) => {
      this.update(delta)
    }
    App.Handle.ticker.add(this.mTickerFnc, PIXI.UPDATE_PRIORITY.NORMAL)
  }

  update(delta: number) {
    if (this.mTicker) {
      this.onUpdate(delta)
    }
  }

  onUpdate(delta: number) {
    // console.log(delta)
    /**over White */
  }

  removeTicker() {
    App.Handle.ticker.remove(this.mTickerFnc)
  }
}
