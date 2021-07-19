import config from '../gameUtil/config'
import RecordRTC from 'recordrtc'
import * as Tone from 'tone'
import gsap from 'gsap'
import { ResourceManager } from '../core/resourceManager'
import { EventSprite } from './eventSprite'
import * as pixiSound from 'pixi-sound'
import { isIOS } from '../gameUtil/platform'
import { TextStyle } from 'pixi.js'
import { debugLine } from '../gameUtil/game'

export class Record extends PIXI.Container {
  /**
   * https://www.npmjs.com/package/recordrtc
   * https://stackoverflow.com/questions/34934862/how-to-replay-an-audio-blob-in-javascript
   * https://recordrtc.org/global.html
   */
  private mRecPlace: PIXI.Container
  private mRecordMotion: any
  private mPlayBtn: EventSprite

  private mFastSnd: Tone.Player
  private mSlowSnd: Tone.Player
  private mRoboSnd: Tone.Player

  private mEffectSound: Tone.Chorus
  // 재생되고 있는 사운드
  private mCurrentRec: HTMLAudioElement

  private mPosibleRecordDevice: boolean
  get posibleRecordDevice(): boolean {
    return this.mPosibleRecordDevice
  }
  constructor() {
    super()
  }

  readyRecord(): Promise<void> {
    return new Promise((resolve) => {
      Tone.Transport.stop()
      this.mFastSnd = null
      this.mSlowSnd = null
      this.mRoboSnd = null
      resolve()
    })
  }

  async setRecord(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!navigator.mediaDevices) {
        this.mPosibleRecordDevice = false

        /**아래 문구만 나오는 효과 */
        const text = new PIXI.Text(
          '녹음이 불가능한 환경이므로 기본 사운드가 재생됩니다.',
          { fontSize: 30, fontFamily: 'NanumBarunGothicBold', fill: 0x86abe0 }
        )
        text.alpha = 0
        text.anchor.set(0.5)
        text.position.set(config.w / 2, config.h - 20)
        const timeline = gsap.timeline()

        this.addChild(text)
        window['recSpine'].state.setAnimation(0, 'animation', false)
        timeline.to(text, { alpha: 1, y: config.h - 120, duration: 1 })
        timeline.to(text, { y: config.h - 120, duration: 2 })
        timeline
          .to(text, { alpha: 0, duration: 1 })
          .eventCallback('onComplete', () => {
            this.removeChild(text)
            resolve()
          })
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

            const sleep = (m) => new Promise((r) => setTimeout(r, m))
            window['recSpine'].state.setAnimation(0, 'animation', false)

            await sleep(3000)

            await recorder.stopRecording(function() {
              if (window['record']) {
                window['record'].pause()
              }

              const blob = recorder.getBlob()
              const audioSrc = window.URL.createObjectURL(blob)
              window['audioSrc'] = audioSrc
              window['record'] = new Audio(audioSrc)
              resolve()
            })
          })
          .catch((error) => {
            this.mPosibleRecordDevice = false
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

            this.addChild(text)
            window['recSpine'].state.setAnimation(0, 'animation', false)
            timeline.to(text, { alpha: 1, y: config.h - 120, duration: 1 })
            timeline.to(text, { y: config.h - 120, duration: 2 })
            timeline
              .to(text, { alpha: 0, duration: 1 })
              .eventCallback('onComplete', () => {
                this.removeChild(text)
                resolve()
              })
            /**아래 문구만 나오는 효과 */
          })
      }
    })
  }

  playRecord(state: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.mRecordMotion) {
        this.mRecordMotion.kill()
        this.mRecordMotion = null
      }
      this.mRecPlace.removeChildren()
      // this.setText()

      // 재생버튼
      this.mPlayBtn = new EventSprite(
        ResourceManager.Handle.getCommonResource('btn_rec_play.png').texture
      )
      this.mPlayBtn.position.set(0, 120)
      this.mPlayBtn.zIndex = 1
      this.mRecPlace.addChild(this.mPlayBtn)
      this.mPlayBtn.scale.set(0.1)
      gsap.to(this.mPlayBtn.scale, { x: 1, y: 1, duration: 0.5, ease: 'back' })

      // 클릭시 재생 후 팝업 사라짐
      this.mPlayBtn.onClick = async () => {
        if (window['record']) {
          await this.playSound(state)
          resolve()
        } else {
          resolve()
        }
      }
    })
  }

  playSound(state: string): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.mCurrentRec) {
        this.mCurrentRec.pause()
        this.mCurrentRec = null
      }
      if (this.mPlayBtn) {
        this.mPlayBtn.interactive = false
        this.mPlayBtn.texture = ResourceManager.Handle.getCommonResource(
          'play.png'
        ).texture
      }

      let duration = 3
      let playRate = 1
      if (this.mPosibleRecordDevice == false) {
        window['nodakSnd'].play()
        gsap.delayedCall(2, () => {
          resolve()
        })
      } else {
        /**본 녹음 음성 */
        if (state == 'normal') {
          duration = 3
          playRate = 1
          window['record'].play()
        }

        /**빠른 음성 */
        if (state == 'fast') {
          // if(isIOS()){

          // }
          duration = 2.4
          playRate = 1.5
          // if (this.mFastSnd) {
          //   this.mFastSnd.start()
          // } else {
          const value = window['audioSrc'].slice(0)
          this.mFastSnd = new Tone.Player({
            url: value,
            autostart: true
          })
          const pitchShift1 = new Tone.PitchShift({
            pitch: 6
          }).toDestination()
          this.mFastSnd.playbackRate = 1.5
          this.mFastSnd.connect(pitchShift1)
          // }
        }

        /**느린 음성 */
        if (state == 'slow') {
          duration = 3.6
          playRate = 0.8

          // if (this.mSlowSnd) {
          //   this.mSlowSnd.start()
          // } else {
          const value = window['audioSrc'].slice(0)
          this.mSlowSnd = new Tone.Player({
            url: value,
            autostart: true
          })
          const pitchShift2 = new Tone.PitchShift({
            pitch: -2
          }).toDestination()
          this.mSlowSnd.playbackRate = 0.8
          this.mSlowSnd.connect(pitchShift2)
          // }
        }

        /**로보트 음성 */
        if (state == 'robot') {
          // if (isIOS()) {
          //   window['record'].play()
          //   const delay = window['record'].duration
          //   gsap.delayedCall(delay, () => {
          //     resolve()
          //   })
          // } else {
          duration = 3
          playRate = 1.2

          // if (this.mRoboSnd) {
          //   this.mRoboSnd.start()
          // } else {
          const value = window['audioSrc'].slice(0)
          this.mRoboSnd = new Tone.Player({
            url: value,
            autostart: true
          })

          const cheby = new Tone.Chebyshev(50).toDestination()
          const chebyChannel = new Tone.Channel({ volume: -60 }).connect(cheby)
          chebyChannel.receive('cheby')

          const reverb = new Tone.Reverb(3).toDestination()
          const reverbChannel = new Tone.Channel({ volume: 6 }).connect(reverb)
          reverbChannel.receive('reverb')

          // send the player to all of the channels
          const playerChannel = new Tone.Channel().toDestination()

          if (!isIOS()) {
            const chorus = new Tone.Chorus({
              wet: 1
            })
              .toDestination()
              .start()
            const chorusChannel = new Tone.Channel({ volume: 6 }).connect(
              chorus
            )
            chorusChannel.receive('chorus')
            playerChannel.send('chorus')
          }
          playerChannel.send('cheby')
          playerChannel.send('reverb')

          const pitchShift = new Tone.PitchShift({
            pitch: 2
          }).toDestination()

          // this.mEffectSound = chorus

          this.mRoboSnd.playbackRate = 1.2

          this.mRoboSnd.connect(pitchShift)
          this.mRoboSnd.connect(playerChannel)
          // }
          // }
        }

        pixiSound.default.context.filters = null
        pixiSound.default.speedAll = 1
        gsap.delayedCall(duration, () => {
          resolve()
        })
      }
    })
  }

  reset(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.mFastSnd) {
        this.mFastSnd.playbackRate = 1
        this.mFastSnd.stop()
        this.mFastSnd.disconnect()
        this.mFastSnd.dispose()
        this.mFastSnd = null
      }
      if (this.mSlowSnd) {
        this.mSlowSnd.playbackRate = 1
        this.mSlowSnd.stop()
        this.mSlowSnd.disconnect()
        this.mSlowSnd.dispose()
        this.mSlowSnd = null
      }
      if (this.mRoboSnd) {
        this.mRoboSnd.playbackRate = 1
        this.mRoboSnd.stop()
        this.mRoboSnd.disconnect()
        this.mRoboSnd.dispose()
        this.mRoboSnd = null
      }
      resolve()
    })
  }

  stop(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.mCurrentRec) {
        this.mCurrentRec.pause()
        this.mCurrentRec = null
      }
      if (this.mRecPlace) {
        this.removeChild(this.mRecPlace)
        this.mRecPlace = null
      }

      if (window['recorder']) {
        window['recorder'].stopRecording(function() {
          window['record'].pause()
        })
      }
      resolve()
    })
  }

  beforeDestroy(): Promise<void> {
    return new Promise<void>((resolve) => {
      // console.log(`beforeDestroy`)
      if (this.mEffectSound) {
        this.mEffectSound.stop()
        this.mEffectSound.dispose()
        this.mEffectSound = null
      }

      Tone.context.dispose()
      Tone.Transport.stop()

      if (this.mFastSnd) {
        this.mFastSnd.playbackRate = 1
        this.mFastSnd.stop()
        this.mFastSnd.disconnect()
        this.mFastSnd.dispose()
        this.mFastSnd = null
      }
      if (this.mSlowSnd) {
        this.mSlowSnd.playbackRate = 1
        this.mSlowSnd.stop()
        this.mSlowSnd.disconnect()
        this.mSlowSnd.dispose()
        this.mSlowSnd = null
      }
      if (this.mRoboSnd) {
        this.mRoboSnd.playbackRate = 1
        this.mRoboSnd.stop()
        this.mRoboSnd.disconnect()
        this.mRoboSnd.dispose()
        this.mRoboSnd = null
      }
      pixiSound.default.context.filters = null
      pixiSound.default.speedAll = 1
      this.destroy({ children: true })
      // window['audioSrc'] = null
      window['record'] = null

      resolve()
    })
  }
}
