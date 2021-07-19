import gsap, { Power0 } from 'gsap'
import { ResourceManager } from '../core/resourceManager'
import config from '../gameUtil/config'
import { EventSprite } from './eventSprite'

export class Affordance extends PIXI.Container {
  private mGuideFinger: PIXI.Sprite
  private type: boolean
  private mFingerMotion: any
  private mFingerTimer: any

  constructor(target: any, row: boolean) {
    super()
    this.type = row
    const stage = new PIXI.Graphics()
    stage.beginFill(0xff0000, 0)
    stage.drawRect(0, 0, target.width, target.height)
    stage.endFill()
    /**손가락 생성 */
    this.mGuideFinger = new EventSprite(
      ResourceManager.Handle.getCommonResource(`hand.png`).texture
    )
    this.mGuideFinger.visible = false
    this.mGuideFinger.position.set(stage.width / 2, stage.height / 2)
    this.resetTimer()

    this.addChild(stage, this.mGuideFinger)

    /** 
      어포던스의 부모 = 타겟
      타겟.pointerup ()=> this.Affordance.resetTimer() 
    */

    /*
      클릭했을 때 기능 테스트
    */
    // this.interactive = true
    // this.hitArea = new Rectangle(x, y, w, h)

    // this.setMotion()
    // // console.log(`CREATE FINGER`)
    // this.on('pointerup', (evt: PIXI.InteractionEvent) => {
    //   this.resetTimer()
    // })
  }
  reset(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (window['gameMotion']) {
        for (const motion of window['gameMotion']) {
          motion.kill()
        }
      }
      window['gameMotion'] = []
      if (this.mFingerMotion) {
        this.mFingerMotion.kill()
        this.mFingerMotion = null
        this.mGuideFinger.y = 100
        this.mGuideFinger.visible = false
      }
      if (this.mFingerTimer) {
        this.mFingerTimer.kill()
        this.mFingerTimer = null
        this.mGuideFinger.visible = false
      }
      resolve()
    })
  }
  // 클릭하면 5초뒤 다시 모션
  async resetTimer() {
    await this.reset()
    this.mFingerTimer = gsap.delayedCall(5, () => {
      this.setMotion()
    })
    window['gameMotion'].push(this.mFingerTimer)
  }
  async setMotion() {
    await this.reset()
    this.mGuideFinger.visible = true
    this.mFingerMotion = gsap.timeline({ repeat: -1, yoyo: true })
    /**세로로 움직일 때
     * 짝꿍 한글
     */
    if (this.type) {
      this.mGuideFinger.y = 100

      this.mFingerMotion
        .to(this.mGuideFinger, {
          y: config.h - 100,
          duration: 2,
          ease: Power0.easeNone
        })
        .delay(0.5)
      /** */
    } else {
      /** */
      /**가로로 움직일 때
       * 색칠 한글
       */
      this.mGuideFinger.x = 100

      this.mFingerMotion.to(this.mGuideFinger, {
        x: this.width - 100,
        duration: 4,
        ease: Power0.easeNone
      })
    }
    window['gameMotion'].push(this.mFingerMotion)
  }
}
