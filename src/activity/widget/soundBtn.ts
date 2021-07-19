import gsap from 'gsap'
import { ResourceManager } from '../core/resourceManager'
import config from '../gameUtil/config'
import { EventSprite } from './eventSprite'

export class SoundBtn extends PIXI.Container {
  private mSound: PIXI.sound.Sound
  private mBtn: EventSprite
  private mNormal: PIXI.Texture
  private mOn: PIXI.Texture

  constructor(source: string) {
    super()
    this.mNormal = ResourceManager.Handle.getCommonResource(
      'btn_sound_normal.png'
    ).texture
    this.mOn = ResourceManager.Handle.getCommonResource(
      'btn_sound_on.png'
    ).texture

    this.mBtn = new EventSprite(this.mNormal, this.mOn)
    this.addChild(this.mBtn)

    this.mSound = ResourceManager.Handle.getCommonResource(`${source}`).sound

    this.mBtn.onClick = async () => {
      this.mBtn.interactive = false
      await this.clickSound()
      this.mBtn.interactive = true
    }
    this.pivot.set(this.width / 2, this.height / 2)
  }
  clickSound(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mBtn.changeTexture()
      this.mSound.play()
      gsap.delayedCall(this.mSound.duration, () => {
        this.mBtn.changeTexture()
        resolve()
      })
    })
  }
}
