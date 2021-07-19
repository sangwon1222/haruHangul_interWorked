import { NodakResource } from '@/activity/core/resource/viewer/nodakResource'
import * as NodakProduct from '@/activity/core/resource/product/nodakProduct'
import { ResourceManager } from '@/activity/core/resourceManager'
import { SceneBase } from '@/activity/core/sceneBase'
import config from '@/activity/gameUtil/config'
import { debugLine, getSound, shuffleArray } from '@/activity/gameUtil/game'
import { EventSprite } from '@/activity/widget/eventSprite'
import { Intro } from '@/activity/scene/intro'
import { Record } from '@/activity/widget/record'
import gsap from 'gsap'
import { ReviewEop } from '@/activity/scene/reviewEop'
import { App } from '@/activity/core/app'
import pixisound from 'pixi-sound'
import { Eop } from '@/activity/scene/eop'
import Axios from 'axios'
import { Power0 } from 'gsap/all'
import * as Tone from 'tone'
import { isIOS } from '@/activity/gameUtil/platform'

let gameData = {}

export class NodakCard extends PIXI.Sprite {
  private mIndex: number
  get cardIndex(): number {
    return this.mIndex
  }

  private mCardPicture: EventSprite

  private mComplete: boolean
  get completed(): boolean {
    return this.mComplete
  }
  private mQuizText: string
  get quizText(): string {
    return this.mQuizText
  }

  constructor(text: string, index?: number) {
    super()
    this.mQuizText = text
    this.mComplete = false
    this.mIndex = index

    const num = getSound(this.mQuizText)
    const card = `word_${num}.png`

    this.mCardPicture = new EventSprite(
      ResourceManager.Handle.getCommonResource(card).texture
    )
    this.addChild(this.mCardPicture)
    this.mCardPicture.position.set(0, 0)

    if (index || index == 0) {
      this.texture = ResourceManager.Handle.getViewerResource(
        'small_box.png'
      ).texture
      this.mCardPicture.scale.set(0.4)
    } else {
      this.texture = ResourceManager.Handle.getViewerResource(
        'big_box.png'
      ).texture
      this.mCardPicture.scale.set(0.6)
    }
    this.anchor.set(0.5)

    this.interactive = true
    this.buttonMode = true
    this.on('pointertap', () => {
      this.onClick()
    })
  }

  disable() {
    this.interactive = false
    this.tint = 0xbcbcbc
    this.mCardPicture.alpha = 0.5
  }
  able() {
    this.interactive = true
    this.tint = 0xffffff
    this.mCardPicture.alpha = 1
  }
  onClick() {
    /** */
  }

  complete(): Promise<void> {
    return new Promise<void>((resolve) => {
      Tone.context.dispose()
      Tone.Transport.stop()

      const rotationSound = ResourceManager.Handle.getViewerResource(
        'ac6_pop.mp3'
      ).sound
      rotationSound.play()

      if (this.mComplete == false) {
        // console.log(this.mIndex, this.mQuizText)
        this.mComplete = true

        this.removeChildren()
        this.mCardPicture = null
        this.texture = ResourceManager.Handle.getViewerResource(
          `fin_box.png`
        ).texture

        const quizText = new PIXI.Text(this.mQuizText, {
          fontSize: 68,
          fontFamily: 'TmoneyRoundWindExtraBold',
          padding: 20,
          fill: 0x01c944
        })
        quizText.pivot.set(quizText.width / 2, quizText.height / 2)
        this.addChild(quizText)

        gsap
          .to(this.scale, { x: -1, duration: 0.5 })
          .eventCallback('onComplete', () => {
            gsap.to(this.scale, { x: 1, duration: 0.5 })
          })
      }
      gsap.delayedCall(rotationSound.duration + 0.5, () => {
        resolve()
      })
    })
  }
}

export class RecBtn extends PIXI.Sprite {
  private mNormal: PIXI.Texture
  private mDown: PIXI.Texture

  private mDuration: number

  private mProfile: PIXI.Sprite
  private mSound: PIXI.Sprite
  private mOnSound: PIXI.Texture
  private mOffSound: PIXI.Texture

  private mProgressBar: PIXI.Sprite
  private mProgress: PIXI.Sprite
  private mMask: PIXI.Graphics

  constructor(thema: string) {
    super()
    if (thema == 'fast' || thema == 'slow') {
      if (thema == 'fast') {
        this.mDuration = 2.4
      } else {
        this.mDuration = 3.6
      }
    } else {
      this.mDuration = 3
    }
    this.mNormal = ResourceManager.Handle.getViewerResource(
      `${thema}_btn_normal.png`
    ).texture
    this.mDown = ResourceManager.Handle.getViewerResource(
      `${thema}_btn_down.png`
    ).texture
    this.texture = this.mNormal

    this.mProfile = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`${thema}_btn_img.png`).texture
    )

    this.mOnSound = ResourceManager.Handle.getViewerResource(
      `speaker_down.png`
    ).texture
    this.mOffSound = ResourceManager.Handle.getViewerResource(
      `speaker_normal.png`
    ).texture

    this.on('pointertap', () => {
      this.onClick()
    })

    this.createElement()
  }

  // 사운드바 , 프로필 사진 , 진행바, 생성
  createElement() {
    this.mSound = new PIXI.Sprite(this.mOffSound)
    this.mSound.position.set(270, this.height / 2 - this.mSound.height / 2)

    this.mProgressBar = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`progress_bar.png`).texture
    )

    // 프로필
    this.mProfile.anchor.set(0.5)
    this.mProfile.position.set(0, this.mProgressBar.height / 2)
    // 진행바
    this.mProgressBar.position.set(
      70,
      this.height / 2 - this.mProgressBar.height / 2
    )

    this.mProgressBar.addChild(this.mProfile)

    this.addChild(this.mProgressBar, this.mSound)
  }

  onClick() {
    //
  }

  playMotion(nonRec?: number) {
    this.mSound.texture = this.mOnSound
    this.texture = this.mDown

    this.mProgress = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource('voice_place.png').texture
    )

    this.mMask = new PIXI.Graphics()
    this.mMask.beginFill(0x000000, 1)
    this.mMask.drawRect(0, 0, 150, 32)
    this.mMask.endFill()
    this.mMask.x = -this.mProgress.width

    this.mProgress.mask = this.mMask
    this.mProgressBar.addChild(this.mProgress, this.mMask)

    this.mProgressBar.sortableChildren = true
    this.mMask.zIndex = 1
    this.mProgress.zIndex = 1
    this.mProfile.zIndex = 2

    if (nonRec) {
      this.mDuration = nonRec
    }

    gsap.to(this.mMask, { x: this.mProgress.x, duration: this.mDuration + 1 })
    gsap
      .to(this.mProfile, {
        x: this.mProgressBar.width,
        duration: this.mDuration + 1
      })
      .eventCallback('onComplete', async () => {
        await this.resetState()
      })
  }

  resetState(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mProgressBar.removeChild(this.mProgress, this.mMask)
      this.mProgress = null
      this.mMask = null
      this.mSound.texture = this.mOffSound
      this.texture = this.mNormal
      this.mProfile.x = 0
      resolve()
    })
  }

  disable() {
    this.interactive = false
    this.buttonMode = false
    this.mSound.tint = 0xbcbcbc
    this.mProfile.tint = 0xbcbcbc
    this.mProgressBar.tint = 0xbcbcbc
    this.tint = 0xbcbcbc
  }

  active() {
    this.interactive = true
    this.buttonMode = true
    this.mSound.tint = 0xffffff
    this.mProfile.tint = 0xffffff
    this.mProgressBar.tint = 0xffffff
    this.tint = 0xffffff
  }
}

//카드를 누르고 들어간 후의 씬
export class CardScene extends PIXI.Container {
  private mBg: PIXI.Sprite
  private mMuck: PIXI.spine.Spine
  private mMuckSnd: {}
  private mText: PIXI.Text
  private mRecord: Record

  private mRecPlace: PIXI.Container
  private mRecSpine: PIXI.spine.Spine
  private mRecSprite: PIXI.Sprite

  private mSound: PIXI.sound.Sound

  private mBtnList: Array<RecBtn>
  private mExitBtn: PIXI.Sprite

  private mListeningCount: number
  private mAffordance: PIXI.Sprite

  private mQuizText: string
  private mCardIndex: number
  get cardIndex(): number {
    return this.mCardIndex
  }

  constructor() {
    super()
  }
  async onInit(cardIndex: number) {
    if (window['record']) {
      window['record'].pause()
    }
    this.mCardIndex = cardIndex
    this.mQuizText = gameData['words'][this.mCardIndex]

    if (isIOS()) {
      const num = getSound(this.mQuizText)
      window['fastSnd'] = ResourceManager.Handle.getCommonResource(
        `word_${num}_1.mp3`
      ).sound
      window['slowSnd'] = ResourceManager.Handle.getCommonResource(
        `word_${num}_2.mp3`
      ).sound
      window['roboSnd'] = ResourceManager.Handle.getCommonResource(
        `word_${num}_3.mp3`
      ).sound
    }

    this.interactive = true
    // console.warn(`[ ${cardIndex} ]번째 카드를 클릭`)
    this.mBg = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`bg_2.png`).texture
    )
    this.addChild(this.mBg)

    const pos = {
      1: { x: 1072, y: 540 },
      2: { x: 968, y: 620 }
    }
    for (let i = 1; i <= 2; i++) {
      const char = new PIXI.Sprite(
        ResourceManager.Handle.getViewerResource(`2_cha_${i}.png`).texture
      )
      char.position.set(pos[i].x, pos[i].y)
      this.addChild(char)
    }

    this.mMuckSnd = {}
    this.mMuckSnd['ac6_script_7'] = ResourceManager.Handle.getViewerResource(
      `ac6_script_7.mp3`
    ).sound
    this.mMuckSnd['ac6_script_8'] = ResourceManager.Handle.getViewerResource(
      `ac6_script_8.mp3`
    ).sound

    this.mMuck = new PIXI.spine.Spine(
      ResourceManager.Handle.getViewerResource(`02_baru.json`).spineData
    )
    this.mMuck.position.set(20 + this.mMuck.width, 440 + this.mMuck.height)
    this.addChild(this.mMuck)
    window['spine'] = this.mMuck

    this.mMuck.stateData.defaultMix = 0.25
    this.mMuck.state.setAnimation(0, `default`, true)

    await this.readyRec()
    await this.createText()
    await this.settingMuck()
  }

  settingMuck(): Promise<void> {
    return new Promise<void>((resolve) => {
      let name = ''
      this.mMuck.state.addListener({
        event: (entry, event) => {
          if (this.mMuckSnd !== undefined) {
            window['spineSnd'] = this.mMuckSnd[event.data.name]
            this.mMuckSnd[event.data.name].play()
            name = event.data.name
          }
        },
        complete: async () => {
          if (name == 'ac6_script_8') {
            name = null
            this.mMuck.state.setAnimation(0, `default`, true)
            await this.startRec()
            resolve()
          }
        }
      })

      this.mMuck.state.setAnimation(0, `narr`, false)
    })
  }

  createText(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mText = new PIXI.Text(gameData['words'][this.mCardIndex], {
        fontSize: 180,
        fontFamily: 'TmoneyRoundWindExtraBold',
        padding: 20,
        fill: 0xffffff
      })
      this.mText.tint = 0x333333
      this.mText.pivot.set(this.mText.width / 2, this.mText.height / 2)
      this.mText.position.set(640, 228)
      this.mText.scale.set(0)
      this.mBg.addChild(this.mText)

      gsap
        .to(this.mText.scale, { x: 1, y: 1, duration: 0.5, ease: 'back' })
        .eventCallback('onComplete', () => {
          const num = getSound(gameData['words'][this.mCardIndex])
          this.mSound = ResourceManager.Handle.getCommonResource(
            `word_${num}.mp3`
          ).sound
          this.mSound.play()
          window['nodakSnd'] = this.mSound
          gsap.delayedCall(this.mSound.duration + 1, () => {
            resolve()
          })
        })
    })
  }

  async readyRec(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mRecPlace = new PIXI.Container()
      this.mRecPlace.position.set(config.w / 2, 438)
      this.addChild(this.mRecPlace)
      this.mRecSpine = new PIXI.spine.Spine(
        ResourceManager.Handle.getViewerResource(`timer.json`).spineData
      )
      window['recSpine'] = this.mRecSpine

      this.mRecSprite = new PIXI.Sprite(
        ResourceManager.Handle.getViewerResource(`rec_dim.png`).texture
      )
      this.mRecSprite.anchor.set(0.5)
      this.mRecPlace.addChild(this.mRecSprite, this.mRecSpine)
      this.mRecSpine.visible = false
      resolve()
    })
  }

  async startRec() {
    App.Handle.modalRoot.visible = false
    this.mRecord = new Record()
    this.addChild(this.mRecord)

    this.mRecSprite.texture = ResourceManager.Handle.getViewerResource(
      `rec.png`
    ).texture
    this.mRecSpine.visible = true
    await this.mRecord.readyRecord()
    await this.mRecord.setRecord()

    this.mRecSprite.texture = ResourceManager.Handle.getViewerResource(
      `rec_dim.png`
    ).texture

    const wait = ResourceManager.Handle.getViewerResource(`play_btn.png`)
      .texture
    const play = ResourceManager.Handle.getViewerResource(`play.png`).texture

    this.mRecSprite.texture = wait

    this.mRecSprite.interactive = true
    this.mRecSprite.buttonMode = true

    gsap
      .to(this.mRecPlace.scale, {
        x: 0.8,
        y: 0.8,
        duration: 0.5,
        ease: Power0.easeNone
      })
      .yoyo(true)
      .repeat(-1)

    this.mRecSprite.once('pointertap', async () => {
      gsap.killTweensOf(this.mRecPlace.scale)
      this.mRecPlace.scale.set(1)
      this.mRecSprite.texture = play

      this.mRecSpine.state.setAnimation(0, 'animation', false)
      if (isIOS()) {
        await this.playSound('normal')
      } else {
        if (this.mRecord.posibleRecordDevice == false) {
          await this.playSound('normal')
        } else {
          await this.mRecord.reset()
          await this.mRecord.playSound('normal')
          await this.mRecord.reset()
        }
      }
      this.mRecSprite.texture = wait
      this.goPlaySoundScene()
    })
  }

  // 녹음기능이 안되는 경우 기존 사운드 플레이
  playSound(state: string): Promise<void> {
    return new Promise<void>((resolve) => {
      window['nodakSnd'] = this.mSound

      if (state == 'normal') {
        this.mSound.play()
      } else if (state == 'fast') {
        window['fastSnd'].play()
      } else if (state == 'slow') {
        window['slowSnd'].play()
      } else if (state == 'robot') {
        window['roboSnd'].play()
      }
      gsap.delayedCall(3, () => {
        resolve()
      })
    })
  }

  // 사운드씬으로가는 모션만 들어있는 함수
  // 실질적 사운드 씬은 setSoundScene()
  goPlaySoundScene() {
    if (window['record']) {
      window['record'].pause()
    }
    // this.mBg.removeChildren()
    App.Handle.modalRoot.visible = true
    const bg = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`bg_3.png`).texture
    )
    bg.x = config.w
    this.addChild(bg)

    const sound1 = ResourceManager.Handle.getViewerResource(`ac6_script_10.mp3`)
      .sound
    sound1.play()

    gsap
      .to(this, { x: -config.w, duration: 0.5 })
      .eventCallback('onComplete', () => {
        this.x = 0
        this.removeChildren()
        this.setSoundScene()
      })
  }

  setSoundScene() {
    this.mBg.texture = ResourceManager.Handle.getViewerResource(
      `bg_3.png`
    ).texture
    this.addChild(this.mBg)
    // *******************************************************************
    const card = new NodakCard(gameData['words'][this.mCardIndex])
    card.position.set(410, 258)
    card.onClick = () => {
      card.disable()
      window['nodakSnd'] = this.mSound
      this.mSound.play()
      gsap.delayedCall(this.mSound.duration, () => {
        card.able()
      })
    }
    // *****************************************************************

    this.mText.position.set(410, 520)

    this.mExitBtn = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`next_btn.png`).texture
    )
    this.mExitBtn.anchor.set(0.5)
    this.mExitBtn.scale.set(0)
    this.mExitBtn.position.set(748, 640)

    this.mExitBtn.interactive = false
    this.mExitBtn.buttonMode = false

    this.mExitBtn.once('pointertap', async () => {
      gsap
        .to(this.mExitBtn.scale, { x: 0.8, y: 0.8, duration: 0.25 })
        .repeat(1)
        .yoyo(true)
        .eventCallback('onComplete', () => {
          this.endCardScene()
        })
    })

    this.mBg.addChild(card, this.mText, this.mExitBtn)

    this.createBtn()

    this.mAffordance = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource('hand.png').texture
    )
    this.mAffordance.alpha = 0
    this.mAffordance.angle = 0
    this.mAffordance.anchor.set(0.5)
    this.mAffordance.position.set(46 / 2, 46 / 2)
    this.mExitBtn.addChild(this.mAffordance)
  }

  createBtn() {
    this.mListeningCount = 0

    const my = new RecBtn(`cha`)
    const slow = new RecBtn(`slow`)
    const fast = new RecBtn(`fast`)
    const robot = new RecBtn(`robo`)

    this.mBtnList = [my, fast, slow, robot]

    const effect = [`normal`, `fast`, `slow`, `robot`]
    const y = [130, 290, 450, 608]

    for (const btn of this.mBtnList) {
      const index = this.mBtnList.indexOf(btn)

      this.mBg.addChild(btn)

      btn.disable()

      btn.position.set(1054 - btn.width / 2, y[index] - btn.height / 2)

      // 녹음듣기 버튼 활성화
      gsap.delayedCall(2.3, () => {
        gsap
          .to(btn.scale, { x: 0.98, y: 0.98, duration: 0.25 })
          .repeat(5)
          .yoyo(true)
          .eventCallback('onComplete', () => {
            btn.active()
            // 나가기 버튼 활성화
            gsap
              .to(this.mExitBtn.scale, {
                x: 1,
                y: 1,
                duration: 0.5,
                ease: 'back'
              })
              .eventCallback('onComplete', () => {
                this.mExitBtn.interactive = true
                this.mExitBtn.buttonMode = true
              })
          })
      })

      btn.onClick = async () => {
        this.mListeningCount += 1
        // 3번 이상 음성을 들었을 때, 나가기버튼에 어포던스 생성
        if (this.mListeningCount >= 3) {
          gsap.killTweensOf(this.mAffordance)
          this.mAffordance.alpha = 0
          this.mAffordance.angle = 0
          const afforTimeline = gsap.timeline({ repeat: -1 })
          afforTimeline.to(this.mAffordance, { alpha: 0, duration: 4 })
          afforTimeline.to(this.mAffordance, { alpha: 1, duration: 0.5 })
          afforTimeline.to(this.mAffordance, { angle: -15, duration: 0.5 })
          afforTimeline.to(this.mAffordance, { angle: 0, duration: 0.5 })
          afforTimeline.to(this.mAffordance, { alpha: 0, duration: 0.5 })
        }

        this.disable(true)
        btn.active()
        btn.interactive = false

        if (isIOS()) {
          btn.playMotion()
          await this.playSound(effect[index])
        } else {
          if (this.mRecord.posibleRecordDevice == false) {
            btn.playMotion(1)
          } else {
            btn.playMotion()
          }
          await this.mRecord.playSound(effect[index])
        }
        this.disable(false)
      }
    }
  }

  deleteSound() {
    if (window['soundManager']) {
      window['soundManager'].pause()
      window['soundManager'] = null
    }
    if (window['nodakSnd']) {
      window['nodakSnd'].pause()
      window['nodakSnd'] = null
    }
  }

  disable(flag: boolean) {
    for (const btn of this.mBtnList) {
      if (flag) {
        btn.disable()
      } else {
        btn.active()
      }
      btn.interactive = !flag
    }
  }

  async endCardScene() {
    pixisound.stopAll()
    if (Tone) {
      Tone.context.dispose()
      Tone.Transport.stop()
    }
    if (this.mRecord) {
      await this.mRecord.stop()
      await this.mRecord.beforeDestroy()
      const audioCtx = new AudioContext()
      audioCtx.close().then(function() {
        //
      })
      this.mRecord.destroy()
      this.mRecord = null
    }

    ;(this.parent as GameScene).endCardScene()
  }
}

export class GameScene extends PIXI.Container {
  private mMuckState: any
  private mMuckSnd = {}
  private mMuck: PIXI.spine.Spine

  private mCardAry: Array<NodakCard>
  private mCardBackupPos: Array<number>

  private mCardScene: CardScene

  private mRecord: Record

  constructor() {
    super()
  }
  async onInit() {
    const bg = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource('bg_1.png').texture
    )
    this.addChild(bg)

    await this.createSound()

    this.mMuck = new PIXI.spine.Spine(
      ResourceManager.Handle.getViewerResource('01_baru.json').spineData
    )
    this.mMuck.position.set(config.w / 2 - 450, config.h - 140)
    this.addChild(this.mMuck)

    window['spine'] = this.mMuck
    this.mMuck.stateData.defaultMix = 0.25

    this.mMuck.state.setAnimation(0, `click_01`, false)
    let once = true
    this.mMuck.state.addListener({
      event: (entry, event) => {
        if (this.mMuckSnd !== undefined) {
          this.mMuckSnd[event.data.name].play()
        }
      },
      complete: () => {
        if (once == false) {
          return
        }
        once = false
        this.mMuck.state.setAnimation(0, `default`, true)
        this.mMuck.interactive = true
      }
    })

    this.mMuck.on('pointertap', async () => {
      // this.mMuck.interactive = false
      await this.resetMuck()
      await this.settingMuckMotion()
      // this.mMuck.interactive = true
    })
    this.createCard()
  }

  createSound(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mMuckSnd = {}
      this.mMuckSnd['ac6_script_1'] = ResourceManager.Handle.getViewerResource(
        'ac6_script_1.mp3'
      ).sound
      this.mMuckSnd['ac6_script_2'] = ResourceManager.Handle.getViewerResource(
        'ac6_script_2.mp3'
      ).sound
      this.mMuckSnd['ac6_script_3'] = ResourceManager.Handle.getViewerResource(
        'ac6_script_3.mp3'
      ).sound
      this.mMuckSnd['ac6_script_4'] = ResourceManager.Handle.getViewerResource(
        'ac6_script_4.mp3'
      ).sound
      this.mMuckSnd['ac6_script_5'] = ResourceManager.Handle.getViewerResource(
        'ac6_script_5.mp3'
      ).sound
      this.mMuckSnd['ac6_script_6'] = ResourceManager.Handle.getViewerResource(
        'ac6_script_6.mp3'
      ).sound
      resolve()
    })
  }

  async guidePickMotion() {
    // this.mMuck.interactive = false
    await this.resetMuck()
    await this.settingMuckMotion(true)
    // this.mMuck.interactive = true
  }

  resetMuck(): Promise<void> {
    return new Promise<void>((resolve) => {
      pixisound.stopAll()
      this.mMuck.state.setAnimation(0, `default`, true)
      resolve()
    })
  }

  settingMuckMotion(start?: boolean): Promise<void> {
    return new Promise<void>((resolve) => {
      if (start) {
        this.mMuck.state.setAnimation(0, `click_01`, false)
        resolve()
      } else {
        if (this.mMuckState) {
          this.mMuckState.kill()
        }

        if (this.mCardScene) {
          resolve()
        } else {
          const randomNum = Math.ceil(Math.random() * 400)
          const random = (randomNum % 4) + 1
          this.mMuck.state.setAnimation(0, `click_0${random}`, false)
          let once = true
          this.mMuck.state.addListener({
            event: (entry, event) => {
              if (this.mMuckSnd !== undefined) {
                this.mMuckSnd[event.data.name].play()
                window['spineSnd'] = this.mMuckSnd[event.data.name]
              }
            },
            complete: () => {
              if (once == false) {
                return
              }
              once = false
              this.mMuck.state.setAnimation(0, `default`, true)
              resolve()
            }
          })
        }
      }
    })
  }

  async createCard() {
    this.mCardAry = []
    this.mCardBackupPos = []

    let sound = ResourceManager.Handle.getViewerResource(`ac6_pop.mp3`).sound
    sound.play()
    sound = null

    // 카드생성
    const cardLength = gameData['words'].length

    const imgList = []
    for (const word of gameData['words']) {
      imgList.push(word)
    }

    /**배경 지렁이 ****************************************************/
    const x = [296, 364]
    const y = [200, config.h - 70]

    const char1 = new EventSprite(
      ResourceManager.Handle.getViewerResource(`1_cha_1.png`).texture
    )
    char1.position.set(config.w + char1.width, y[0])
    const char2 = new EventSprite(
      ResourceManager.Handle.getViewerResource(`1_cha_2.png`).texture
    )
    char2.position.set(config.w + char2.width, y[1])
    this.addChild(char1, char2)
    gsap.to(char1, { x: x[0], duration: 0.5 })
    gsap.to(char2, { x: x[1], duration: 0.5 })
    /**배경 지렁이 ****************************************************/

    /**카드 섞어서 뿌리기 *********************************************/

    // let randomAry = []
    // for (let i = 0; i < cardLength; i++) {
    //   randomAry.push(i)
    // }
    // randomAry = shuffleArray(randomAry)

    // for (let i = 0; i < randomAry.length; i++) {
    //   const card = new NodakCard(imgList[randomAry[i]], i)
    //   this.mCardAry.push(card)
    // }

    for (let i = 0; i < cardLength; i++) {
      const card = new NodakCard(imgList[i], i)
      this.mCardAry.push(card)
      this.addChild(this.mCardAry[i])
      const cardType = `card${cardLength}`

      const xValue = config.nodakPos[`${cardType}`][i].x
      const yValue = config.nodakPos[`${cardType}`][i].y
      this.mCardAry[i].position.set(config.w + 200, yValue)
      gsap.to(this.mCardAry[i], { x: xValue, duration: 0.5 })

      this.mCardAry[i].onClick = async () => {
        Tone.context.resume()
        await this.mMuck.state.setAnimation(0, `default`, true)
        this.cardFlag(false)
        pixisound.stopAll()
        if (this.mCardScene) {
          this.mCardScene.removeChildren()
          this.removeChild(this.mCardScene)
        }
        this.mCardScene = new CardScene()
        this.addChild(this.mCardScene)
        this.mCardScene.onInit(this.mCardAry[i].cardIndex)
        this.mCardBackupPos = [i, this.mCardAry[i].x, this.mCardAry[i].y]
      }
    }
    /**카드 섞어서 뿌리기 *********************************************/
  }

  cardFlag(flag: boolean) {
    for (const card of this.mCardAry) {
      card.interactive = flag
    }
  }

  endCardScene() {
    Tone.context.dispose()

    if (this.mCardScene) {
      if (window['soundManager']) window['soundManager'].pause()

      const delay = 0.25
      gsap.to(this.mCardScene.scale, { x: 0, y: 0, duration: delay })
      gsap
        .to(this.mCardScene, {
          x: this.mCardBackupPos[1],
          y: this.mCardBackupPos[2],
          duration: delay
        })
        .eventCallback('onComplete', async () => {
          window['spine'] = this.mMuck
          this.mCardBackupPos = []

          // console.log(`this.mCardScene.cardIndex${this.mCardScene.cardIndex}`)
          await this.mCardAry[this.mCardScene.cardIndex].complete()
          this.cardFlag(true)

          this.disableCard()

          this.mCardScene.destroy()
          this.mCardScene = null
        })
    }
  }

  async disableCard() {
    let end = true
    for (const card of this.mCardAry) {
      // console.log(card.cardIndex, card.quizText, card.completed)
      if (card.completed == false) {
        end = false
      }
      card.scale.set(1)
      card.zIndex = 0
    }
    if (end == true) {
      this.endGame()
    } else {
      this.mCardScene.removeChildren()
      this.removeChild(this.mCardScene)
      this.guidePickMotion()
    }
  }

  endGame() {
    if (window['soundManager']) window['soundManager'].pause()
    // gsap.delayedCall(1, () => {
    gsap.globalTimeline.clear()
    pixisound.stopAll()
    ;(this.parent as Nodak).endGame()
    // })
  }
}

export class Nodak extends SceneBase {
  private mMuck: PIXI.spine.Spine
  private mMuckSnd: {}
  private mGame: GameScene
  private mResource: { images: Array<string>; sounds: Array<string> }
  constructor() {
    super('nodak')
  }
  async onInit() {
    this.startTime()

    window.onkeypress = () => null
    window.onkeypress = (evt: KeyboardEvent) => {
      if (evt.key == '+') {
        this.removeChildren()
        //// pixisound.stopAll()
        gsap.globalTimeline.clear()
        this.endGame()
      }
    }
    await App.Handle.showLoadingScreen()
    // console.log(this.gamename)

    await this.getData()

    await this.loadViewerResource(NodakResource)

    await this.getResourceList()

    await this.loadCommonResource(this.mResource)

    // const num = getSound(word)
    // if (isIOS()) {
    //   window['fastSnd'] = ResourceManager.Handle.getCommonResource(`word_${num}_1.mp3`).sound
    // }

    await App.Handle.closeLoadingScreen()
  }

  private getResourceList(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mResource = { images: [], sounds: [] }
      for (const word of gameData['words']) {
        const num = getSound(word)
        const fileName = `word_${num}`
        this.mResource.images.push(fileName + `.png`)
        this.mResource.sounds.push(fileName + `.mp3`)
        if (isIOS()) {
          this.mResource.sounds.push(`${fileName}_1.mp3`) //빠른사운드
          this.mResource.sounds.push(`${fileName}_2.mp3`) //느린사운드
          this.mResource.sounds.push(`${fileName}_3.mp3`) //로봇사운드
        }
      }
      resolve()
    })
  }

  async onStart() {
    let intro = new Intro()
    this.addChild(intro)
    await intro.playIntro()
    this.removeChild(intro)
    intro = null

    const bg = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`bg_1.png`).texture
    )

    this.mMuck = new PIXI.spine.Spine(
      ResourceManager.Handle.getViewerResource('01_baru.json').spineData
    )
    this.addChild(this.mMuck)
    this.mMuck.position.set(config.w / 2, config.h - 140)

    this.mMuckSnd = {}
    this.mMuckSnd['ac6_script_1'] = ResourceManager.Handle.getViewerResource(
      `ac6_script_1.mp3`
    ).sound
    this.mMuckSnd['ac6_script_2'] = ResourceManager.Handle.getViewerResource(
      `ac6_script_2.mp3`
    ).sound

    window['spine'] = this.mMuck

    this.mMuck.stateData.defaultMix = 0.25

    this.mMuck.state.setAnimation(0, `intro`, false)
    this.addChild(bg, this.mMuck)

    this.sortableChildren = true
    this.mMuck.zIndex = 2

    let name = ''
    let once = true
    this.mMuck.state.addListener({
      event: (entry, event) => {
        if (this.mMuckSnd !== undefined) {
          window['spineSnd'] = this.mMuckSnd[event.data.name]
          this.mMuckSnd[event.data.name].play()
          name = event.data.name
        }
      },
      complete: () => {
        if (once == false) {
          return
        }
        if (name == 'ac6_script_2') {
          once = false
          gsap
            .to(this.mMuck, {
              x: config.w / 2 - 450,
              duration: 0.5
            })
            .eventCallback('onComplete', () => {
              this.setGame()
            })
        }
      }
    })

    // this.setGame()
  }

  /**
   onStart() 마지막 모션이 끝나면 호출/
   */
  async setGame() {
    if (this.mMuck) this.mMuck.destroy()
    this.mMuck = null
    this.removeChildren()
    this.x = 0
    this.mGame = new GameScene()
    this.addChild(this.mGame)
    await this.mGame.onInit()
  }

  async endGame() {
    await this.endTime()
    /**녹음하고 나오는 부분에서 보낸다. */
    window['spine'] = null
    const token = localStorage.getItem('token')

    const index = App.Handle.getSceneIndex()
    const info = await Axios.get(`${config.restAPIProd}`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    const code = info.data.result[index].cd
    const end = await Axios.post(
      `${config.restAPI}/learning/hangul/day/${config.selectDay}/activities/${code}`,
      { wrongCount: 0 },
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    )

    const eop = new Eop()
    this.addChild(eop)
    await eop.eopPlay()

    App.Handle.goMainPage()
  }

  getData(): Promise<void> {
    return new Promise<void>((resolve) => {
      const requestUrl = `${config.resource}data/nodak_data.json`
      const request = new XMLHttpRequest()
      request.open('GET', requestUrl)
      request.responseType = 'json'
      request.send()
      request.onloadend = () => {
        gameData = request.response['data'][`${config.selectDay}`]
        resolve()
      }
    })
  }
}
