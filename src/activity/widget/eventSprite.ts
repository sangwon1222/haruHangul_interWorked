export class EventSprite extends PIXI.Sprite {
  private mNormal: PIXI.Texture
  private mChange: PIXI.Texture
  constructor(texture: PIXI.Texture, changeSprite?: PIXI.Texture) {
    super()

    this.mNormal = texture
    this.mChange = changeSprite
    this.texture = this.mNormal
    this.anchor.set(0.5)
    this.position.set(this.width / 2, this.height / 2)
    this.interactive = true
    this.buttonMode = true
    this.on('pointertap', () => {
      this.onClick()
    })
  }
  changeTexture() {
    if (this.texture == this.mNormal) {
      this.texture = this.mChange
    } else {
      this.texture = this.mNormal
    }
  }
  onClick() {
    /** */
  }
}
