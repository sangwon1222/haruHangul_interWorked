import config from '../gameUtil/config'
import { Dimmed } from './dimmed'
import RecordRTC from 'recordrtc'
import gsap, { Power0 } from 'gsap'
import { ResourceManager } from '../core/resourceManager'
import { EventSprite } from './eventSprite'
import { getSymbol } from '../gameUtil/game'
import { MyHangul } from '../haruHangul/myHangul/myHangul'

export class MyhangulRecord extends PIXI.Container {
  /**
   * https://www.npmjs.com/package/recordrtc
   * https://stackoverflow.com/questions/34934862/how-to-replay-an-audio-blob-in-javascript
   * https://recordrtc.org/global.html
   */
  private mQuizStep: number
  private mQuizText: string

  private mRecPlace: EventSprite
  private mRecImg: EventSprite
  private mRecWave: EventSprite
  private mRecWaveMask: PIXI.Graphics
  private mRecordMotion: any

  private mExitBtn: PIXI.Sprite

  private mAffor: PIXI.Sprite

  // 녹음한 사운드를 듣고난 후, 넘어갈 수 있을때
  private mListenComplete: boolean

  constructor(quizStep: number, text: string) {
    super()
    this.mListenComplete = false

    this.mQuizStep = quizStep
    this.mQuizText = text

    const dimmed = new Dimmed(config.w, config.h)
    dimmed.alpha = 0
    this.addChild(dimmed)
    gsap.to(dimmed, { alpha: 1, duration: 0.5 })

    this.sortableChildren = true
  }

  startRec() {
    this.mRecImg.texture = ResourceManager.Handle.getViewerResource(
      'rec_on.png'
    ).texture
    this.mRecordMotion.play()
  }

  readyRecord(): Promise<void> {
    return new Promise((resolve) => {
      window['recMotion'] = new PIXI.spine.Spine(
        ResourceManager.Handle.getCommonResource('timer_3sec.json').spineData
      )

      this.mRecPlace = new EventSprite(
        ResourceManager.Handle.getViewerResource('popup_rec_box.png').texture
      )
      this.addChild(this.mRecPlace)
      this.mRecPlace.position.set(config.w / 2, config.h / 2)

      this.setText()

      this.mRecImg = new EventSprite(
        ResourceManager.Handle.getViewerResource('rec_dim.png').texture
      )
      window['recMotion'].position.set(0, 120)
      this.mRecImg.position.set(0, 120)

      this.mRecPlace.addChild(this.mRecImg, window['recMotion'])
      this.mRecPlace.sortableChildren = true
      this.mRecPlace.interactive = false
      this.mRecPlace.zIndex = 6
      this.mRecImg.zIndex = 1
      window['recMotion'].zIndex = 2
      window['recMotion'].alpha = 0
      window['recMotion'].startWave = () => {
        this.mRecWave.tint = 0xf92121
      }
      window['recMotion'].stopWave = () => {
        this.mRecWave.tint = 0xbcbcbc
      }

      this.setRecWave()
      resolve()
    })
  }

  // 녹음 코드
  async setRecord(): Promise<void> {
    return new Promise((resolve) => {
      window['record'] = null
      if (!navigator.mediaDevices) {
        /**아래 문구만 나오는 효과 */
        const text = new PIXI.Text(
          '녹음이 불가능한 환경이므로 기본 사운드가 재생됩니다.',
          { fontSize: 30, fontFamily: 'NanumBarunGothicBold', fill: 0x86abe0 }
        )
        text.alpha = 0
        text.anchor.set(0.5)
        text.position.set(config.w / 2, config.h - 20)
        const timeline = gsap.timeline()

        window['recMotion'].alpha = 1
        window['recMotion'].state.setAnimation(0, 'animation', false)
        window['recMotion'].startWave()

        this.addChild(text)
        timeline.to(text, { alpha: 1, y: config.h - 100, duration: 1 })
        timeline.to(text, { y: config.h - 100, duration: 2 })
        timeline
          .to(text, { alpha: 0, duration: 1 })
          .eventCallback('onComplete', () => {
            window['recMotion'].alpha = 0
            window['recMotion'].stopWave()
            this.removeChild(text)
            resolve()
          })
        /**아래 문구만 나오는 효과 */
      } else {
        navigator.mediaDevices
          .getUserMedia({
            video: false,
            audio: { echoCancellation: true }
          })
          .then(async function(stream) {
            const recorder = RecordRTC(stream, {
              type: 'audio/webm',
              mimeType: 'audio/webm'
            })
            window['recorder'] = recorder

            recorder.startRecording()

            window['recMotion'].alpha = 1
            window['recMotion'].state.setAnimation(0, 'animation', false)
            window['recMotion'].startWave()

            const sleep = (m) => new Promise((r) => setTimeout(r, m))
            await sleep(3000)

            recorder.stopRecording(function() {
              const blob = recorder.getBlob()
              const audioSrc = window.URL.createObjectURL(blob)
              const audio = new Audio(audioSrc)
              window['record'] = audio
              window['recMotion'].alpha = 0
              window['recMotion'].stopWave()
              resolve()
            })
          })
          .catch((error) => {
            /**아래 문구만 나오는 효과 */
            const text = new PIXI.Text(
              '녹음이 불가능한 환경이므로 기본 사운드가 재생됩니다.',
              {
                fontSize: 30,
                fontFamily: 'NanumBarunGothicBold',
                fill: 0x86abe0
              }
            )
            text.alpha = 0
            text.anchor.set(0.5)
            text.position.set(config.w / 2, config.h - 20)
            const timeline = gsap.timeline()

            window['recMotion'].alpha = 1
            window['recMotion'].state.setAnimation(0, 'animation', false)
            window['recMotion'].startWave()

            this.addChild(text)
            timeline.to(text, { alpha: 1, y: config.h - 100, duration: 1 })
            timeline.to(text, { y: config.h - 100, duration: 2 })
            timeline
              .to(text, { alpha: 0, duration: 1 })
              .eventCallback('onComplete', () => {
                window['recMotion'].alpha = 0
                window['recMotion'].stopWave()
                this.removeChild(text)
                resolve()
              })
            /**아래 문구만 나오는 효과 */
          })
      }
    })
  }

  setRecWave() {
    if (this.mRecordMotion) {
      this.mRecordMotion.kill()
      this.mRecordMotion = null
    }

    if (this.mRecWaveMask) {
      this.mRecPlace.removeChild(this.mRecWaveMask, this.mRecWave)
      this.mRecWaveMask = null
      this.mRecWave = null
    }

    this.mRecWaveMask = new PIXI.Graphics()
    this.mRecWaveMask.beginFill(0xff0000, 1)
    this.mRecWaveMask.drawRect(0, 0, 545, 65)
    this.mRecWaveMask.endFill()
    this.mRecWaveMask.pivot.set(
      this.mRecWaveMask.width / 2,
      this.mRecWaveMask.height / 2
    )
    this.mRecWaveMask.position.set(0, 120)

    this.mRecWave = new EventSprite(
      ResourceManager.Handle.getViewerResource('sound_wave.png').texture
    )
    this.mRecWave.position.set(this.mRecWave.width / 2 - 565 / 2, 120)
    this.mRecWave.mask = this.mRecWaveMask
    this.mRecWave.tint = 0xbcbcbc

    this.mRecPlace.addChild(this.mRecWaveMask, this.mRecWave)

    // 파동 모션
    this.mRecordMotion = gsap.timeline({ repeat: -1 })
    this.mRecordMotion.to(this.mRecWave, {
      x: -this.mRecWave.width / 2 + 565,
      duration: 20,
      ease: Power0.easeNone
    })
    this.mRecordMotion.pause()
  }

  setText() {
    const text = new PIXI.Text(this.mQuizText, {
      fontSize: 120,
      fill: 0x000000,
      fontFamily: 'TmoneyRoundWindExtraBold'
    })
    text.pivot.set(text.width / 2, text.height / 2)
    text.position.set(0, -66)
    this.mRecPlace.addChild(text)
  }

  // 녹음을 실행하는 코드
  async playRecord() {
    if (this.mRecordMotion) {
      this.mRecordMotion.pause()
    }

    // 재생버튼
    this.mRecImg.texture = ResourceManager.Handle.getViewerResource(
      'btn_rec_play.png'
    ).texture
    this.mRecImg.position.set(0, 120)
    this.mRecImg.zIndex = 1
    this.mRecImg.scale.set(0.1)
    gsap.to(this.mRecImg.scale, { x: 1, y: 1, duration: 0.5, ease: 'back' })
  }

  affor(create: boolean) {
    if (this.mAffor) {
      gsap.killTweensOf(this.mAffor)
      this.mRecPlace.removeChild(this.mAffor)
      this.mAffor = null
    }
    if (create) {
      this.mAffor = new PIXI.Sprite(
        ResourceManager.Handle.getCommonResource('hand.png').texture
      )
      this.mAffor.interactive = false
      this.mAffor.anchor.set(0.5)
      this.mAffor.alpha = 0
      this.mAffor.position.set(this.mRecImg.x + 30, this.mRecImg.y + 30)

      const timeline = gsap.timeline({ repeat: -1, delay: 1 })

      // 녹음한 사운드를 들어보기 전
      if (!this.mListenComplete) {
        timeline.to(this.mAffor, { alpha: 1, duration: 0.5 })
        timeline.to(this.mAffor, { angle: -15, duration: 0.25 })
        timeline.to(this.mAffor, { angle: 0, duration: 0.25 })
        timeline.to(this.mAffor, { alpha: 0, duration: 1 })
      } else {
        // 녹음한 사운드를 들어본 후
        this.mAffor.position.set(this.mAffor.x + 500, this.mAffor.y + 150)
        timeline.to(this.mAffor, { alpha: 1, duration: 0.5 })
        timeline.to(this.mAffor, { angle: -15, duration: 0.25 })
        timeline.to(this.mAffor, { angle: 0, duration: 0.25 })
        timeline.to(this.mAffor, { alpha: 0, duration: 1 })
      }
      this.mRecPlace.addChild(this.mAffor)
      this.mAffor.zIndex = 6
    }
  }
  // 녹음이 끝난 뒤 녹음된 사운드를 재생시키는 코드
  waitRecord(): Promise<void> {
    return new Promise((resolve) => {
      this.affor(true)

      this.mRecImg.onClick = async () => {
        this.mRecImg.interactive = false
        this.affor(false)

        this.mRecImg.texture = ResourceManager.Handle.getCommonResource(
          'play.png'
        ).texture

        window['recMotion'].alpha = 1
        window['recMotion'].state.setAnimation(0, 'animation', false)

        this.setRecWave()
        this.mRecordMotion.play()
        window['recMotion'].startWave()

        if (window['record']) {
          window['record'].play()
        } else {
          window['myhangulSound'][(this.parent as MyHangul).quizStep - 1].play()
        }

        gsap.delayedCall(3.5, async () => {
          this.mRecImg.texture = ResourceManager.Handle.getViewerResource(
            'btn_rec_play.png'
          ).texture
          if (window['recMotion']) window['recMotion'].stopWave()
          if (this.mRecordMotion) this.mRecordMotion.pause()

          /**어포던스 생성 */
          this.mRecImg.interactive = true
          await this.endRecord()
          resolve()
        })
      }
    })
  }
  endRecord(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!(this.parent as MyHangul)) {
        resolve()
      }
      this.mListenComplete = true
      ;(this.parent as MyHangul).endSnd.play()

      this.mExitBtn = new PIXI.Sprite(
        ResourceManager.Handle.getViewerResource(`btn_next.png`).texture
      )
      this.addChild(this.mExitBtn)
      this.mExitBtn.position.set(
        config.w - this.mExitBtn.width - 60,
        config.h - this.mExitBtn.height - 60
      )
      this.mExitBtn.interactive = true

      this.affor(true)

      this.mExitBtn.once('pointertap', async () => {
        this.affor(false)
        // ;(this.parent as MyHangul).endSnd.play()
        this.removeChild(this.mExitBtn)
        gsap.to(this, { alpha: 0, duration: 0.25 })
        await this.destroyRec()
        this.removeChildren()
        this.destroy()
        resolve()
      })
    })
  }

  async destroyRec() {
    await this.endRec()
  }

  endRec(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.affor(false)
      if (window['record']) window['record'].pause()
      window['record'] = null
      window['recMotion'] = null
      window['recorder'] = null
      this.destroy()
      resolve()
    })
  }
}
