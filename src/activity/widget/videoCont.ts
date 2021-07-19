import gsap from 'gsap'
import Config from '@/activity/gameUtil/config'
import { isMobilePlatform } from '@/activity/gameUtil/platform'
import { ResourceManager } from '@/activity/core/resourceManager'
import { App } from '../core/app'

export class Cursor extends PIXI.Sprite {
  private mUnLock: PIXI.Texture
  private mLock: PIXI.Texture

  constructor(texture: string, lockTexture?: string) {
    super()
    this.mUnLock = ResourceManager.Handle.getCommonResource(texture).texture
    if (lockTexture) {
      this.mLock = ResourceManager.Handle.getCommonResource(lockTexture).texture
    }

    this.texture = this.mUnLock
    this.anchor.set(0.5)

    this.interactive = true
    this.buttonMode = true
  }

  lock() {
    this.texture = this.mLock
    gsap.to(this, { angle: 0, duration: 0.5 })
  }

  unLock() {
    if (this.mUnLock) {
      this.texture = this.mUnLock
    }
  }
}

export class VideoDuration extends PIXI.Container {
  private mTotal: PIXI.Text
  private mCurrent: PIXI.Text
  private mMinute: string
  private mSecond: string

  get minute(): string {
    return this.mMinute
  }
  set minute(v: string) {
    this.mMinute = v
    this.updateCurrentTime()
  }

  get second(): string {
    return this.mSecond
  }
  set second(v: string) {
    this.mSecond = v
    this.updateCurrentTime()
  }

  constructor() {
    super()

    let totalMinute = Math.floor(
      window['currentVideo'].duration / 60
    ).toString()
    let totalSecond = Math.floor(
      window['currentVideo'].duration % 60
    ).toString()
    if (totalMinute.length == 1) {
      totalMinute = `0` + totalMinute
    }
    if (totalSecond.length == 1) {
      totalSecond = `0` + totalSecond
    }
    this.mTotal = new PIXI.Text(totalMinute + `:` + totalSecond, {
      fill: 0x979192,
      fontSize: 24
    })
    this.mTotal.x = 100

    const wall = new PIXI.Text(`|`, {
      fill: 0xffffff,
      fontSize: 24
    })

    this.mCurrent = new PIXI.Text(`00:00`, {
      fill: 0xffffff,
      fontSize: 24
    })

    this.addChild(this.mCurrent, wall, this.mTotal)
    wall.x = this.width / 2 - wall.width / 2
  }

  updateCurrentTime() {
    if (this.mSecond === undefined) {
      return
    }
    if (this.mMinute.length == 1) {
      this.mMinute = `0` + this.mMinute
    }
    if (this.mSecond.length == 1) {
      this.mSecond = `0` + this.mSecond
    }
    this.mCurrent.text = this.mMinute + `:` + this.mSecond
  }
}

export class VideoControl extends PIXI.Container {
  private mDimmed: PIXI.Graphics

  private mPlayerRedBG: PIXI.Sprite
  private mPlayerWhiteBG: PIXI.Sprite
  private mPlayerBgMask: PIXI.Graphics

  private mVideo: HTMLVideoElement
  private mPlayer: PIXI.Sprite

  private mPlayBtn: PIXI.Sprite
  private mPlay: PIXI.Texture
  private mStop: PIXI.Texture

  // private mStopBtn: ToggleBtn

  private mPlayerBarContainer: PIXI.Container

  private mCursor: Cursor

  private mCursorFlag: boolean
  private mPlayerFlag: boolean

  private mBackUpX: number
  private mCursorX: number
  get cursorX(): number {
    return this.mCursorX
  }
  set cursorX(v: number) {
    this.mCursorX = v

    if (this.mCursor) {
      this.mPlayerBgMask.clear()
      this.mPlayerBgMask.beginFill(0xff0000, 1)

      if (this.mCursorFlag) {
        this.mCursor.x = this.mCursorX
        // 동영상 재생시 커서 위치
        this.mPlayerBgMask.drawRect(
          0,
          -10,
          this.mCursor.x,
          this.mPlayerWhiteBG.height + 20
        )
      } else {
        // 커서 클릭으로 인한 위치 변경 및 동영상 재생위치 변경
        this.mVideo.currentTime =
          (this.mCursorX / this.mPlayerWhiteBG.width) * this.mVideo.duration
        this.mPlayerBgMask.drawRect(
          0,
          -10,
          this.mCursor.x,
          this.mPlayerWhiteBG.height + 20
        )
      }

      this.mPlayerBgMask.endFill()
    }
  }

  private mVideoDuration: VideoDuration
  private mDelayTimer: any

  // private console: PIXI.Text

  constructor(video: HTMLVideoElement) {
    super()

    this.mDimmed = new PIXI.Graphics()
    this.mDimmed.beginFill(0x000000, 1)
    this.mDimmed.drawRect(0, 0, Config.w, Config.h)
    this.mDimmed.endFill()
    this.mDimmed.alpha = 0
    this.addChild(this.mDimmed)

    this.mDimmed.on('pointertap', () => {
      this.showORhide()
    })

    this.mCursorFlag = true
    this.mBackUpX = 0

    this.mVideo = video
    if (window['currentVideo']) {
      window['currentVideo'].pause()
      window['currentVideo'] = null
    }
    window['currentVideo'] = this.mVideo

    this.mPlayerFlag = false

    this.createController()
  }

  /**
   * 컨트롤러 UI 생성 코드
   * 아래 바
   */
  createController() {
    // 플레이어바 생성
    this.mPlayer = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`video_bar.png`).texture
    )
    this.mPlayer.interactive = true
    this.mPlayer.buttonMode = true
    this.mPlayer.visible = false
    this.mPlayer.position.set(0, Config.h - this.mPlayer.height)
    this.addChild(this.mPlayer)

    this.mPlayer.on('pointerup', () => {
      this.delayHide()
    })

    // =================================================================================
    // 동영상바 생성
    this.mPlayerRedBG = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`video_current.png`).texture
    )
    this.mPlayerRedBG.position.set(
      10,
      this.mPlayer.height / 2 - this.mPlayerRedBG.height / 2
    )
    this.mPlayerWhiteBG = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`video_bg.png`).texture
    )
    this.mPlayerWhiteBG.position.set(this.mPlayerRedBG.x, this.mPlayerRedBG.y)

    this.mPlayerBgMask = new PIXI.Graphics()
    this.mPlayerBgMask.beginFill(0xff0000, 1)
    this.mPlayerBgMask.drawRect(0, -10, 0, this.mPlayerWhiteBG.height + 20)
    this.mPlayerBgMask.endFill()
    this.mPlayerBgMask.position.set(this.mPlayerRedBG.x, this.mPlayerRedBG.y)
    this.mPlayerRedBG.mask = this.mPlayerBgMask
    this.mCursor = new Cursor(`cursor.png`)
    this.mCursor.y = this.mPlayer.height / 2

    // =================================================================================
    // 재생 스탑 버튼
    const playNpause = new PIXI.Container()
    playNpause.position.set(40, this.mPlayer.height / 2)

    this.mPlay = ResourceManager.Handle.getCommonResource(
      'play_button.png'
    ).texture
    this.mStop = ResourceManager.Handle.getCommonResource(
      'stop_button.png'
    ).texture
    this.mPlayBtn = new PIXI.Sprite()
    this.mPlayBtn.visible = false
    this.mPlayBtn.texture = this.mStop

    this.mPlayBtn.anchor.set(0.5)
    this.mPlayBtn.position.set(Config.w / 2, Config.h / 2)
    this.addChild(this.mPlayBtn)
    this.mPlayBtn.interactive = true
    this.mPlayBtn.buttonMode = true

    // 클릭하면 컨트롤러 보이거나 사라지거나
    this.mPlayBtn.on('pointertap', () => {
      this.controllerState(window['currentVideo'].paused)
    })

    this.mPlayerBarContainer = new PIXI.Container()
    this.mPlayerBarContainer.addChild(
      this.mPlayerWhiteBG,
      this.mPlayerRedBG,
      this.mPlayerBgMask,
      this.mCursor
    )
    this.eventClickSlider()
    this.mPlayer.addChild(this.mPlayerBarContainer)

    // 동영상 길이 텍스트
    this.mVideoDuration = new VideoDuration()
    this.mPlayer.addChild(this.mVideoDuration)
    this.mVideoDuration.position.set(20, this.mPlayer.height / 2 + 40)

    this.mPlayerBarContainer.position.set(this.mVideoDuration.width + 50, 50)
  }

  controllerState(state: boolean) {
    if (!window['currentVideo']) {
      this.destroy()
      return
    }
    if (state == true) {
      window['currentVideo'].play()
      this.mPlayBtn.texture = this.mStop
    } else {
      window['currentVideo'].pause()
      this.mPlayBtn.texture = this.mPlay
    }
  }

  destroyed() {
    // console.log(`destroy`)
    if (window['currentVideo']) {
      window['currentVideo'].pause()
      window['currentVideo'] = null
    }
    this.interactive = false
    this.mDimmed.interactive = false
    this.mPlayer.interactive = false
    this.mPlayerBarContainer.interactive = false
    if (this.mDelayTimer) this.mDelayTimer.kill()
    this.mDelayTimer = null
    this.delayHide = () => null
    this.destroy()
  }
  //  컨트롤러 3초후 자동 들어가기
  delayHide() {
    //
    if (this.mDelayTimer) {
      this.mDelayTimer.kill()
      this.mDelayTimer = undefined
    }
    if (App.Handle.getSceneName() !== 'today') {
      this.destroyed()
      return
    }

    this.mDelayTimer = gsap.globalTimeline
    this.mDelayTimer = gsap.delayedCall(3, () => {
      this.hideControl()
    })

    for (let i = 1; i < 4; i++) {
      let delay = gsap.delayedCall(i, () => {
        if (this.mCursorFlag == false || this.mPlayerFlag == false) {
          if (this.mDelayTimer) {
            this.mDelayTimer.kill()
          }
          this.mDelayTimer = undefined
          delay.kill()
          delay = undefined
          // console.log(`%c Delay Cancel`, 'color: green;font-weight: bold;')
        } else {
          // console.log(4 - i)
        }
      })
    }
  }

  // 컨트롤러 보이거나 사라지는 코드
  private showORhide() {
    if (this.mCursorFlag == false) {
      return
    }
    this.mDimmed.interactive = false

    this.mPlayerFlag = !this.mPlayerFlag

    if (this.mPlayerFlag) {
      this.showControl()
    } else {
      this.hideControl()
    }
    gsap.delayedCall(0.5, () => {
      this.mDimmed.interactive = true
      this.delayHide()
    })
  }

  showControl() {
    gsap.to(this.mDimmed, { alpha: 0.7, duration: 0.25 })
    this.mPlayerFlag = true
    this.mPlayBtn.visible = true

    gsap.to(this.mPlayBtn, { alpha: 1, duration: 0.25 })
    this.mPlayer.visible = true
    gsap.to(this.mPlayer, {
      alpha: 1,
      duration: 0.25
    })
    this.delayHide()
  }

  private hideControl() {
    this.mPlayerFlag = false

    gsap.to(this.mDimmed, { alpha: 0, duration: 0.25 })
    gsap.to(this.mPlayBtn, { alpha: 0, duration: 0.25 })
    gsap
      .to(this.mPlayer, { alpha: 0, duration: 0.25 })
      .eventCallback('onComplete', () => {
        this.mPlayBtn.visible = false
        this.mPlayer.visible = false
      })
  }

  // 동영상 시간업데이트 코드
  setCursorX() {
    this.mVideo.addEventListener('timeupdate', () => {
      if (this.mCursorFlag == false) {
        return
      }
      this.cursorX =
        (this.mVideo.currentTime / this.mVideo.duration) *
          this.mPlayerWhiteBG.width +
        this.mCursor.width / 2
      // ( this.mVideo.currentTime / this.mVideo.duration ) = (this.cursorX / this.mPlayerWhiteBG.width);
      this.mVideoDuration.minute = Math.floor(
        this.mVideo.currentTime / 60
      ).toString()
      this.mVideoDuration.second = Math.floor(
        this.mVideo.currentTime % 60
      ).toString()
    })
  }

  // 슬라이더 클릭시 이벤트
  eventClickSlider() {
    this.mPlayerBarContainer.interactive = true
    this.mPlayerBarContainer.buttonMode = true
    // console.log(` 모바일 입니까? %c ${isMobilePlatform()}`, 'color:green;')

    if (isMobilePlatform()) {
      // MOBILE일 때
      this.mPlayerBarContainer
        .on('touchstart', () => {
          this.guageDown()
        })
        .on('touchmove', (evt: PIXI.InteractionEvent) => {
          this.guageMove(evt)
        })
        .on('touchend', (evt: PIXI.InteractionEvent) => {
          this.guageUp(evt)
        })
        .on('touchendoutside', () => {
          this.guageUp()
        })
        .on('touchcancel', () => {
          this.guageUp()
        })
    } else {
      // PC일 때
      this.mPlayerBarContainer
        .on('pointerdown', () => {
          this.guageDown()
        })
        .on('pointermove', (evt: PIXI.InteractionEvent) => {
          this.guageMove(evt)
        })
        .on('pointerup', (evt: PIXI.InteractionEvent) => {
          this.guageUp(evt)
        })
        .on('pointerout', () => {
          this.guageUp()
        })
    }

    // const debug = new PIXI.Graphics();
    // debug.beginFill(0xFF0000,0.4)
    // debug.drawRect(0,0,this.mPlayerBarContainer.width,this.mPlayerBarContainer.width)
    // debug.endFill();
    // this.mPlayerBarContainer.addChild(debug)
  }

  guageDown() {
    this.mCursorFlag = false
    this.mVideo.pause()
  }

  guageMove(evt: PIXI.InteractionEvent) {
    if (this.mCursorFlag == true) {
      return
    }

    const localX = this.mPlayerWhiteBG.toLocal(evt.data.global).x

    this.moveCursor(`move`, localX)
  }

  guageUp(evt?: PIXI.InteractionEvent) {
    if (this.mCursorFlag == true) {
      return
    }
    if (evt === undefined) {
      this.moveCursor(`up`, this.mBackUpX)
    } else {
      const localX = this.mPlayerWhiteBG.toLocal(evt.data.global).x
      this.moveCursor(`up`, localX)
    }
    this.mCursorFlag = true
    this.controllerState(true)
  }

  // 커서 클릭시 커서위치 이동 코드
  moveCursor(mode: string, x: number): Promise<void> {
    return new Promise<void>((resolve) => {
      // 동영상 처음 부분
      if (x <= 10) {
        x = 10
        if (mode == `up`) {
          this.cursorX = x
        }
        if (mode == `move`) {
          this.mCursor.x = x
        }
      }
      // 동영상 끝 부분
      else if (x >= this.mPlayerWhiteBG.width) {
        x = this.mPlayerWhiteBG.width - 50
        if (mode == `up`) {
          this.cursorX = x
        }
        if (mode == `move`) {
          this.mCursor.x = x
        }
      }
      // 동영상 클릭한 부분
      else {
        if (mode == `up`) {
          this.cursorX = x
        }
        if (mode == `move`) {
          this.cursorX = x
          this.mCursor.x = x
        }
      }
      this.mBackUpX = x
      resolve()
    })
  }

  // 동영상 재생 코드
  playControl() {
    this.mDimmed.interactive = true
    this.mDimmed.buttonMode = true
    // this.mVideo.play()
    this.setCursorX()
  }
}
