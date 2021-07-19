import config from '@/activity/gameUtil/config'
import Config from '@/activity/gameUtil/config'
import gsap from 'gsap'
import { Power0 } from 'gsap/all'
import { ResourceManager } from '../core/resourceManager'
import { EventSprite } from './eventSprite'

export class HangulCard extends PIXI.Container {
  private mDimmed: PIXI.Graphics
  private mCard: PIXI.Container
  private mText: PIXI.Text

  private mTintColor: number

  private mPlayBtn: EventSprite

  constructor(text: string, tintColor?: number, option?: any) {
    super()

    let style = {}
    if (option) {
      style = new PIXI.TextStyle(option)
    } else {
      style = new PIXI.TextStyle({
        fontSize: 58,
        fill: 0xffffff,
        fontFamily: 'NanumBarunGothicBold'
      })
    }
    if (tintColor) {
      this.mTintColor = tintColor
    }

    this.createTextCard(text, style)
    gsap.to(this.mCard, { alpha: 1, duration: 1 })
    this.interactive = true
    this.buttonMode = true
    this.on('pointerdown', () => {
      this.interactive = false
      this.buttonMode = false

      gsap.killTweensOf(this.mPlayBtn.scale)
      this.mPlayBtn = null
      this.onClick()
    })
  }

  createTextCard(text: string, style: any) {
    /**딤드 생성 */
    this.mDimmed = new PIXI.Graphics()
    this.mDimmed.beginFill(0x000000, 1)
    this.mDimmed.drawRect(0, 0, Config.w, Config.h)
    this.mDimmed.endFill()
    this.mDimmed.alpha = 0.4
    this.mDimmed.interactive = true

    /**카드 생성 */
    this.mCard = new PIXI.Container()

    /**카드 생성 */
    const card = new EventSprite(
      ResourceManager.Handle.getCommonResource(`btn_play_bubble.png`).texture
    )
    card.position.set(config.w / 2, config.h / 2 - 100)

    this.mPlayBtn = new EventSprite(
      ResourceManager.Handle.getCommonResource('btn_play.png').texture
    )
    this.mPlayBtn.position.set(config.w / 2, config.h / 2 + 100)

    this.mText = new PIXI.Text(text, style)
    this.mText.pivot.set(this.mText.width / 2, this.mText.height / 2)
    this.mText.y = -10
    card.addChild(this.mText)

    this.mCard.addChild(card, this.mPlayBtn)

    this.addChild(this.mDimmed, this.mCard)

    this.mCard.alpha = 0

    gsap
      .to(this.mPlayBtn.scale, {
        x: 0.9,
        y: 0.9,
        duration: 0.5,
        ease: Power0.easeNone
      })
      .repeat(-1)
      .yoyo(true)
  }

  changeTint(flag: boolean) {
    if (flag) {
      this.mText.tint = this.mTintColor
    } else {
      this.mText.tint = 0xffffff
    }
  }

  onClick() {
    //
  }
}
