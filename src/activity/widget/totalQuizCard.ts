import { Rectangle } from 'pixi.js'
import { ResourceManager } from '../core/resourceManager'

export class TotalQuizCard extends PIXI.Container {
  private mQuizPlace: PIXI.Container
  private mMuck: PIXI.Container

  private mIndex: number
  get index(): number {
    return this.mIndex
  }
  private mCardAry: Array<PIXI.Sprite>
  private mTextAry: Array<string>
  get textAry(): Array<string> {
    return this.mTextAry
  }

  constructor(index: number, textAry: Array<string>) {
    super()
    this.mIndex = index
    this.mTextAry = []
    this.mCardAry = []
    this.createMuck()
    this.createQuizCard(textAry)

    this.interactive = true
    this.buttonMode = true
    this.hitArea = new Rectangle(0, 0, this.width, 300)
    this.on('pointertap', () => {
      this.onClick()
    })

    this.pivot.set(this.width / 2, this.height / 2)
  }

  createMuck() {
    this.mMuck = new PIXI.Container()
    this.addChild(this.mMuck)
    const eye = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`muck_eye.png`).texture
    )
    const left = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`muck_left_arm.png`).texture
    )
    const right = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`muck_right_arm.png`).texture
    )
    const body = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`muck_body.png`).texture
    )
    this.mMuck.addChild(body, left, right, eye)
  }
  createQuizCard(textAry: Array<string>) {
    this.mQuizPlace = new PIXI.Container()
    this.addChild(this.mQuizPlace)

    let offsetX = 0
    for (const text of textAry) {
      this.mTextAry.push(text)
      const card = new PIXI.Sprite(
        ResourceManager.Handle.getViewerResource(`card.png`).texture
      )
      const txt = new PIXI.Text(text, { fontSize: 100 })
      txt.pivot.set(txt.width / 2, txt.height / 2)
      txt.position.set(card.width / 2, card.height / 2)
      this.mCardAry.push(card)
      card.addChild(txt)
      card.position.set(offsetX, card.height / 2)
      offsetX += card.width + 20

      this.mQuizPlace.addChild(card)
    }
    this.mQuizPlace.pivot.x = this.mQuizPlace.width / 2
    if (this.mQuizPlace.width < this.mMuck.width) {
      this.mQuizPlace.position.set(this.mMuck.width / 2, -60)
      this.mMuck.position.set(this.width / 2 - this.mMuck.width / 2, 120)
    } else {
      this.mQuizPlace.position.set(this.mQuizPlace.width / 2, -60)
      this.mMuck.position.set(
        this.mQuizPlace.width / 2 - this.mMuck.width / 2,
        120
      )
    }
  }

  setInteractive(flag: boolean) {
    this.interactive = flag
    for (const card of this.mCardAry) {
      if (flag) {
        card.tint = 0xffffff
      } else {
        card.tint = 0xbcbcbc
      }
    }
  }
  onClick() {
    //
  }
}
