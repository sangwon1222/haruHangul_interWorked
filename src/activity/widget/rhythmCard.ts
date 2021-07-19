import gsap, { Power0 } from 'gsap'
import { ResourceManager } from '../core/resourceManager'

export class RhythmCard extends PIXI.Container {
  private mID: number
  get ID(): number {
    return this.mID
  }
  /**
   * 푼 카드인지 아직 안푼 카드인지
   * this.mState = true => 풀었음
   * this.mState = false => 아직 안풀었음
   */
  private mState: boolean

  private mCard: PIXI.Sprite

  private mNormal: PIXI.Texture
  private mClicked: PIXI.Texture
  private mDisable: PIXI.Texture

  private mFocus: PIXI.Sprite

  private mText: PIXI.Text
  private mFocusAni: any
  private mColor: number
  private mFont: string
  get font(): string {
    return this.mFont
  }

  constructor(text: string, color: number, font: string, index: number) {
    super()
    this.mFont = font
    this.mState = false
    this.mColor = color
    this.mID = index
    this.createCard(text, color, font)
    this.interactive = true
    this.buttonMode = true
    this.on('pointerdown', () => {
      this.mCard.texture = this.mClicked
      this.mFocus.texture = ResourceManager.Handle.getViewerResource(
        'box_white02.png'
      ).texture
    })
    this.on('pointerup', () => {
      this.mCard.texture = this.mNormal
      this.mFocus.texture = ResourceManager.Handle.getViewerResource(
        'box_white01.png'
      ).texture
    })
    this.on('pointerout', () => {
      this.mCard.texture = this.mNormal
      this.mFocus.texture = ResourceManager.Handle.getViewerResource(
        'box_white01.png'
      ).texture
    })
    this.on('pointertap', () => {
      this.onClick()
    })
  }

  createCard(text: string, color: number, font: string) {
    this.mDisable = ResourceManager.Handle.getViewerResource(
      'box_disable.png'
    ).texture
    if (color == 0x8a4dff) {
      /**보라색 */
      this.mNormal = ResourceManager.Handle.getViewerResource(
        'box_violet01.png'
      ).texture
      this.mClicked = ResourceManager.Handle.getViewerResource(
        'box_violet02.png'
      ).texture
      this.mCard = new PIXI.Sprite(this.mNormal)
    }
    if (color == 0xf92121) {
      /**빨간색 */
      this.mNormal = ResourceManager.Handle.getViewerResource(
        'box_red01.png'
      ).texture
      this.mClicked = ResourceManager.Handle.getViewerResource(
        'box_red02.png'
      ).texture
      this.mCard = new PIXI.Sprite(this.mNormal)
    }
    if (color == 0x009b58) {
      /**녹색 */
      this.mNormal = ResourceManager.Handle.getViewerResource(
        'box_green01.png'
      ).texture
      this.mClicked = ResourceManager.Handle.getViewerResource(
        'box_green02.png'
      ).texture
      this.mCard = new PIXI.Sprite(this.mNormal)
    }

    this.mFocus = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource('box_white01.png').texture
    )
    this.mFocus.tint = color
    this.mFocus.alpha = 0

    this.mText = new PIXI.Text(text, {
      fill: 0xffffff,
      fontSize: 120,
      fontWeight: 'bold',
      fontFamily: font,
      padding: 20,
      wordWrap: true,
      wordWrapWidth: 130
    })

    this.addChild(this.mFocus, this.mCard)
    this.mCard.addChild(this.mText)

    this.mText.tint = color
    this.mText.pivot.set(this.mText.width / 2, this.mText.height / 2)
    this.mText.position.set(this.mCard.width / 2, this.mCard.height / 2 - 6)
    if (font == 'BareunBatangOTFM') {
      this.mText.y += -6
    }
  }

  onClick() {
    /**OVERWHITE */
  }
  delayInterAction(delay: number) {
    this.interactive = false
    this.buttonMode = false
    this.mCard.texture = this.mDisable
    this.mText.tint = 0xbcbcbc
    gsap.delayedCall(delay, () => {
      if (this.mState) {
        this.mCard.texture = this.mDisable
        this.mText.tint = 0xbcbcbc
      } else {
        this.mText.tint = this.mColor
        this.mCard.texture = this.mNormal
        this.interactive = true
        this.buttonMode = true
      }
    })
  }

  focus() {
    this.mFocusAni = gsap.timeline({ repeat: -1, yoyo: true })
    this.mFocusAni.to(this.mFocus, {
      alpha: 0.6,
      duration: 0.5,
      ease: Power0.easeNone
    })
    this.mFocusAni
      .to(this.mFocus, { alpha: 1, duration: 0.5, ease: Power0.easeNone })
      .delay(0.25)
    this.mFocusAni.to(this.mFocus, {
      alpha: 0.6,
      duration: 0.5,
      ease: Power0.easeNone
    })
  }

  destroy() {
    // window['gameMotion'].splice(window['gameMotion'].indexOf(this.mFocusAni), 1)
    this.mState = true
    this.interactive = false
    this.mCard.texture = this.mDisable
    this.mText.tint = 0xbcbcbc
    if (this.mFocusAni) {
      this.mFocusAni.kill()
      this.mFocusAni = null
    }
    gsap
      .to(this.mFocus, { alpha: 0, duration: 0.5 })
      .eventCallback(`onComplete`, () => {
        this.removeChild(this.mFocus)
      })
  }
  endMotion() {
    this.mState = false
    this.interactive = false
    this.mCard.texture = this.mNormal
    this.mText.tint = this.mColor
  }
}
