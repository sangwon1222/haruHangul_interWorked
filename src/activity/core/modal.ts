import * as PIXI from 'pixi.js'
import pixisound from 'pixi-sound'
import gsap from 'gsap'
import { Dimmed } from '../widget/dimmed'
import config from '../gameUtil/config'
import { App } from './app'
import { ResourceManager } from './resourceManager'
import { debugLine } from '../gameUtil/game'
import { MyHangul } from '../haruHangul/myHangul/myHangul'
import Axios from 'axios'

const howtoCount = {
  today: 2,
  rhythm: 3,
  paint: 4,
  partner: 3,
  myhangul: 4,
  nodak: 4,
  total: 4
}

const howtoText = {
  today: `오늘 한글 활동 방법`,
  rhythm: `리듬 한글 활동 방법`,
  paint: `색칠 한글 활동 방법`,
  partner: `짝꿍 한글 활동 방법`,
  myhangul: `나의 한글 활동 방법`,
  nodak: `노닥 한글 활동 방법`,
  total: `깨단 한글 활동 방법`
}

const howtoSubText = {
  today: [
    `오늘은 어떤 낱자를 배우게 될까요?
  오늘 배울 낱자를 짧은 영상으로 만나보아요.`,
    `오늘은 어떤 낱자를 배우게 될까요?
  오늘 배울 낱자를 짧은 영상으로 만나보아요.`
  ],
  rhythm: [
    `화면을 잘 보고 선택해야 할 낱자를 찾아보세요.`,
    `배워야 할 낱자를 잘 기억해요.`,
    `여러 낱자들 사이에서 오늘의 낱자를 찾아보세요.`
  ],
  paint: [
    `낱자에 칠하고 싶은 색을 선택해요.`,
    `낱말 쓰는 순서를 알아보아요.
  순서에 맞춰 낱자와 같은 색을 찾아보세요.`,
    `알록달록 예쁜 색으로 낱말을 완성해요.`,
    `한글 카드를 보며 배운 글자를 다시 한번 확인해요.`
  ],
  partner: [
    `완성해야 할 낱말을 확인해요. 낱말을 눌러서 활동을 시작해요.`,
    `순서대로 낱자를 선택하여 낱말을 완성해요.`,
    `낱말을 완성하면 한글 카드를 볼 수 있어요.`
  ],
  myhangul: [
    `오늘 배운 낱자를 다시 한번 살펴봐요.`,
    `오늘의 낱자를 큰 소리로 말해볼까요?`,
    `재생 버튼을 눌러 내가 말한 낱자를 들어봐요.
    (녹음이 불가능한 환경에서는 기본 사운드가 재생됩니다.)
    `,
    `오늘 배운 낱말도 큰 소리로 말하고 들어보세요.
    (녹음이 불가능한 환경에서는 기본 사운드가 재생됩니다.)
    `
  ],
  nodak: [
    `원하는 카드를 선택하세요.`,
    `글자와 소리를 확인하고 내 소리로 낱말을 말하고 들어보세요.
    (녹음이 불가능한 환경에서는 기본 사운드가 재생됩니다.)
    `,
    `낱말을 여러 가지 다양한 소리로 들어보세요.
    (녹음이 불가능한 환경에서는 기본 사운드가 재생됩니다.)
    `,
    `남은 카드 중 원하는 카드를 선택해요.`
  ],
  total: [
    `소리를 듣고 맞는 낱자를 찾아보세요.`,
    `제시에 맞는 소리를 구분하여 답을 찾아보세요.`,
    `제시에 맞는 답을 골라 선택하세요.`,
    `낱말을 확인하고 순서에 맞게 낱자를 골라 답을 완성하세요.`
  ]
}

export class PaginationCursor extends PIXI.Sprite {
  private mOn: PIXI.Texture
  private mOff: PIXI.Texture
  constructor() {
    super()
    this.mOn = ResourceManager.Handle.getCommonResource(
      'howto_pagi_on.png'
    ).texture
    this.mOff = ResourceManager.Handle.getCommonResource(
      'howto_pagi_off.png'
    ).texture

    this.texture = this.mOff
  }
  onIndex() {
    this.texture = this.mOn
  }
  offIndex() {
    this.texture = this.mOff
  }
}

export class HowTo extends PIXI.Container {
  private mPrev: PIXI.Sprite
  private mNext: PIXI.Sprite
  private mClose: PIXI.Sprite
  private mStage: PIXI.Container
  private mHowToPage: Array<PIXI.Sprite>

  private mPageText: PIXI.Text

  private mCurrentPage: number
  private mTotalPage: number

  private mPaginationStage: PIXI.Container
  private mPagination: Array<PaginationCursor>

  private mMainText: PIXI.Text
  private mGuideText: PIXI.Text
  private mSubText: PIXI.Text
  constructor() {
    super()
    /**하우투페이지 인덱스 */
    this.mCurrentPage = 0
    /**이전버튼 */
    this.mPrev = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource('btn_pre.png').texture
    )
    this.mPrev.anchor.set(0.5)
    this.mPrev.position.set(config.w / 2 - 550, config.h / 2)
    this.mPrev.interactive = true
    this.mPrev.on('pointerdown', () => {
      this.prevPage()
    })
    this.mPrev.visible = false
    /**다음버튼 */
    this.mNext = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource('btn_next.png').texture
    )
    this.mNext.anchor.set(0.5)
    this.mNext.position.set(config.w / 2 + 550, config.h / 2)
    this.mNext.interactive = true
    this.mNext.on('pointerdown', () => {
      this.nextPage()
    })
    /**닫기버튼 */
    this.mClose = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource('btn_close.png').texture
    )
    this.mClose.anchor.set(0.5)
    this.mClose.position.set(config.w - this.mClose.width, this.mClose.height)
    this.mClose.interactive = true
    this.mClose.on('pointerdown', async () => {
      gsap
        .to(this, { alpha: 0, duration: 0.25 })
        .eventCallback('onComplete', async () => {
          this.alpha = 1
          ;(this.parent as Modal).resetModal()
        })
    })

    /**딤드 & 하우투페이지그룹 */
    this.mStage = new PIXI.Container()
    const dimmed = new PIXI.Graphics()
    dimmed.beginFill(0x404a5e, 0.95)
    dimmed.drawRect(0, 0, config.w, config.h)
    dimmed.endFill()
    this.addChild(dimmed, this.mStage, this.mPrev, this.mNext, this.mClose)

    this.mHowToPage = []
  }

  settingText() {
    // 메인 텍스트 화면 상단 텍스트 생성
    this.mMainText = new PIXI.Text(
      `${howtoText[App.Handle.getSceneName()]}    `,
      {
        fontSize: 40,
        fontFamily: 'TmoneyRoundWindExtraBold',
        padding: 20,
        fill: 0xffffff
      }
    )
    this.mMainText.pivot.set(
      this.mMainText.width / 2,
      this.mMainText.height / 2
    )
    this.mMainText.position.set(config.w / 2, 86)

    /**메인텍스트의 하우투 페이지넘버를 새기는 원 */
    this.mPageText = new PIXI.Text(`${this.mCurrentPage + 1}`, {
      fontSize: 40,
      fontFamily: 'TmoneyRoundWindExtraBold',
      padding: 20,
      fill: 0xffffff
    })
    this.mPageText.pivot.set(
      this.mPageText.width / 2,
      this.mPageText.height / 2
    )
    const circle = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource('howto_index.png').texture
    )
    circle.anchor.set(0.5)
    circle.addChild(this.mPageText)

    circle.position.set(
      this.mMainText.x + this.mMainText.width / 2,
      this.mMainText.y
    )

    this.addChild(this.mMainText, circle)

    this.mGuideText = new PIXI.Text(
      howtoSubText[App.Handle.getSceneName()][0],
      {
        fontSize: 22,
        fontFamily: 'TmoneyRoundWindRegular',
        padding: 20,
        fill: 0xffffff,
        align: 'center'
      }
    )
    this.mGuideText.pivot.set(
      this.mGuideText.width / 2,
      this.mGuideText.height / 2
    )
    this.mGuideText.position.set(
      config.w / 2,
      config.h - this.mGuideText.height / 2 - 140
    )
    this.addChild(this.mGuideText)
  }

  prevPage() {
    /**이전페이지가 없을때 누르면 아무것도 안한다.*/
    if (this.mCurrentPage - 1 < 0) {
      return
    }
    this.mCurrentPage -= 1
    /** 페이지매김의 색을 바꿔준다. */
    this.chagePagiColor()
    /**메인텍스트의 하우투인덱스값을 바꿔준다 */
    this.mPageText.text = `${this.mCurrentPage + 1}`
    /**이전 하우투페이지가 없으면 이전버튼을 없앤다. */
    if (this.mCurrentPage == 0) {
      this.mPrev.visible = false
      this.mNext.visible = true
    }
    if (this.mCurrentPage + 1 < this.mTotalPage) {
      this.mNext.visible = true
    }
    /**이전 페이지이동하는 애니메이션 */
    gsap.to(this.mStage, { x: this.mStage.x + config.w, duration: 0.5 })
  }

  nextPage() {
    /**다음페이지가 없을때 누르면 아무것도 안한다.*/
    if (this.mCurrentPage + 1 >= this.mTotalPage) {
      return
    }
    this.mCurrentPage += 1

    /** 페이지매김의 색을 바꿔준다. */
    this.chagePagiColor()
    /**메인텍스트의 하우투인덱스값을 바꿔준다 */
    this.mPageText.text = `${this.mCurrentPage + 1}`
    /**다음 하우투페이지가 없으면 다음버튼을 없앤다. */
    if (this.mCurrentPage + 1 == this.mTotalPage) {
      this.mPrev.visible = true
      this.mNext.visible = false
    }
    if (this.mCurrentPage > 0) {
      this.mPrev.visible = true
    }
    /**다음 페이지이동하는 애니메이션 */
    gsap.to(this.mStage, { x: this.mStage.x - config.w, duration: 0.5 })
  }

  chagePagiColor() {
    gsap
      .to(this.mGuideText, { alpha: 0, duration: 0.2 })
      .eventCallback('onComplete', () => {
        this.mGuideText.text =
          howtoSubText[App.Handle.getSceneName()][this.mCurrentPage]
        this.mGuideText.pivot.x = this.mGuideText.width / 2
        gsap.to(this.mGuideText, { alpha: 1, duration: 0.2 })
      })
    for (const pagi of this.mPagination) {
      pagi.offIndex()
    }
    this.mPagination[this.mCurrentPage].onIndex()
  }

  // active()에서 생성
  createPagi() {
    /**하우투 하단의 페이지매김 생성 */
    this.mPaginationStage = new PIXI.Container()
    this.mPagination = []
    let offsetX = 0
    for (let i = 0; i < this.mTotalPage; i++) {
      const pagi = new PaginationCursor()
      this.mPagination.push(pagi)
      this.mPaginationStage.addChild(pagi)
      pagi.x = offsetX
      offsetX += 30
    }
    this.mPagination[0].onIndex()
    this.addChild(this.mPaginationStage)
    this.mPaginationStage.pivot.set(
      this.mPaginationStage.width / 2,
      this.mPaginationStage.height / 2
    )
    this.mPaginationStage.position.set(config.w / 2, config.h - 60)
  }

  active() {
    this.alpha = 0
    this.mTotalPage = howtoCount[App.Handle.getSceneName()]
    this.settingText()
    this.createPagi()
    // console.log(`active${this.mTotalPage}`)
    this.mStage.visible = true

    const gameName = App.Handle.getSceneName()

    for (let i = 0; i < this.mTotalPage; i++) {
      const howto = new PIXI.Sprite(
        ResourceManager.Handle.getCommonResource(
          `howto_${gameName}_${i + 1}.png`
        ).texture
      )
      this.mStage.addChild(howto)
      howto.anchor.set(0.5)
      howto.position.set(config.w / 2, config.h / 2)
      howto.x += i * config.w
      this.mHowToPage.push(howto)
    }

    // console.log(`${App.Handle.getSceneName()}의 howto갯수는 ${this.mTotalPage}개`)
    gsap.to(this, { alpha: 1, duration: 0.5 })
  }
  delete() {
    if (this.mStage) {
      gsap
        .to(this, { alpha: 0, duration: 0.5 })
        .eventCallback('onComplete', () => {
          this.mStage.visible = false
        })
    }
  }

  disable(flag: boolean) {
    if (flag == false) {
      this.active()
    } else {
      this.delete()
    }
    this.visible = !flag
  }
}
export class MenuBtn extends PIXI.Container {
  private mNormal: PIXI.Texture
  private mClicked: PIXI.Texture

  private mClickFlag: boolean
  get clickFlag(): boolean {
    return this.mClickFlag
  }
  set clickFlag(v: boolean) {
    this.mClickFlag = v
  }

  private mMenuBtn: PIXI.Sprite
  get menuBtn(): PIXI.Sprite {
    return this.mMenuBtn
  }
  private mHowToBtn: PIXI.Sprite
  private mExitBtn: PIXI.Sprite
  constructor() {
    super()

    this.mClickFlag = false

    this.mNormal = ResourceManager.Handle.getCommonResource(
      `btn_menu.png`
    ).texture
    this.mClicked = ResourceManager.Handle.getCommonResource(
      `btn_menu_dim.png`
    ).texture

    this.mMenuBtn = new PIXI.Sprite(this.mNormal)

    this.mHowToBtn = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`btn_howto.png`).texture
    )
    this.mExitBtn = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`btn_exit.png`).texture
    )

    this.addChild(this.mMenuBtn, this.mHowToBtn, this.mExitBtn)

    this.sortableChildren = true

    this.mMenuBtn.zIndex = 3
    this.mHowToBtn.zIndex = 2
    this.mExitBtn.zIndex = 1

    this.mHowToBtn.visible = false
    this.mExitBtn.visible = false

    this.registerEvent()
  }

  private registerEvent() {
    this.mMenuBtn.interactive = true
    this.mMenuBtn.buttonMode = true
    this.mMenuBtn.on('pointertap', async () => {
      await this.onClick()
    })

    this.mHowToBtn.buttonMode = true
    this.mHowToBtn.on('pointertap', () => {
      ;(this.parent as Modal).howToFlag(true)
    })

    this.mExitBtn.buttonMode = true
    this.mExitBtn.on('pointertap', async () => {
      await this.endTime()
      ;(this.parent as Modal).howToFlag(false)
      ResourceManager.Handle.exitLoad()
      App.Handle.onCloseApp()
    })
  }

  async endTime() {
    if (window['startTime'] === null) {
      return
    }
    const token = localStorage.getItem('token')
    const studyTime = Math.floor((Date.now() - window['startTime']) / 1000)
    const time = await Axios.post(
      `${config.restAPI}/learning/child/time/learned`,
      { learnedTime: studyTime },
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    )
    // console.log(
    //   `%c ${time.config.data}초 동안 액티비티를 플레이 했습니다.`,
    //   'border:2px black solid;'
    // )
  }

  // this.mClickFlag = false => 안누른 상태(팝업이 안뜬 상태)에서 클릭
  // this.mClickFlag = true => 누른 상태(팝업이 떠있는 상태)에서 클릭
  changeImg() {
    if (this.mClickFlag == false) {
      this.mMenuBtn.texture = this.mClicked
    } else {
      this.mMenuBtn.texture = this.mNormal
    }
  }

  createBtn() {
    const delay = 0.25

    if (this.mClickFlag == false) {
      this.mHowToBtn.visible = true
      this.mExitBtn.visible = true

      gsap.to(this.mHowToBtn, { y: 100, duraiton: delay })
      gsap
        .to(this.mExitBtn, { y: 200, duraiton: delay * 2 })
        .eventCallback('onComplete', () => {
          this.mHowToBtn.interactive = true
          this.mExitBtn.interactive = true
        })
    } else {
      this.mHowToBtn.interactive = false
      this.mExitBtn.interactive = false
      gsap.to(this.mHowToBtn, { y: 0, duraiton: delay })
      gsap
        .to(this.mExitBtn, { y: 0, duraiton: delay * 2 })
        .eventCallback('onComplete', () => {
          this.mHowToBtn.visible = false
          this.mExitBtn.visible = false
        })
    }
  }
  onClick() {
    //
  }
}
export class Modal extends PIXI.Container {
  private mHowTo: HowTo
  private mMenuBtn: MenuBtn
  private menuDelayFlag: boolean

  private mDimmed: Dimmed
  private mShowFlag: boolean
  constructor() {
    super()
  }

  async onInit() {
    this.removeChildren()
    // 메뉴버튼 생성
    this.mMenuBtn = new MenuBtn()
    this.mMenuBtn.position.set(20, 10)
    this.addChild(this.mMenuBtn)
    /**메뉴버튼 클릭 시 효과 */
    this.menuDelayFlag = true

    this.mMenuBtn.onClick = async () => {
      if (this.menuDelayFlag == false) {
        return
      }
      this.menuDelayFlag = false

      // 홈버튼 이미지 딤드되는 코드
      this.howToFlag(false)

      this.mMenuBtn.createBtn()
      this.mMenuBtn.changeImg()
      await this.showModal()
      this.mMenuBtn.clickFlag = !this.mMenuBtn.clickFlag
      // console.log(this.mMenuBtn.clickFlag)
      // this.mMenuBtn.clickFlag => true이면 딤드되어 있음
      // this.mMenuBtn.clickFlag => false이면 모든 버튼 들어가 있음

      gsap.delayedCall(1, () => {
        this.menuDelayFlag = true
      })
    }

    const bi = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(`bi.png`).texture
    )
    bi.position.set(config.w - 100, 0)
    this.addChild(bi)

    /**메뉴버튼을 누르면 나오는 검은 딤드 */
    this.mDimmed = new Dimmed(config.w, config.h)
    this.mDimmed.alpha = 0
    this.sortableChildren = true
    this.mDimmed.zIndex = -1

    this.mHowTo = new HowTo()
    this.mHowTo.position.set(0, 0)
    this.addChild(this.mHowTo)
    this.mHowTo.zIndex = 2
    this.mHowTo.disable(true)

    /**메뉴버튼이 활성화됐는지에 대한 flag */
    this.mShowFlag = false
  }

  howToFlag(flag: boolean) {
    this.mHowTo.disable(!flag)
  }

  async showModal() {
    if (!this.mMenuBtn.clickFlag) {
      if (window['spine']) window['spine'].state.timeScale = 0
      if (window['spineSnd']) window['spineSnd'].pause()
      await this.dimmedMotion(true)
      await this.stopAll()
    } else {
      await this.dimmedMotion(false)
      await this.resumeAll()
      if (window['spine']) window['spine'].state.timeScale = 1
      if (window['spineSnd']) window['spineSnd'].resume()
    }
  }

  async resetModal() {
    await this.onInit()
    await this.resumeAll()
  }

  private stopAll(): Promise<void> {
    return new Promise((resolve) => {
      if (window['currentVideo']) {
        window['currentVideo'].pause()
      }

      if (window['recorder']) {
        window['recorder'].pauseRecording()
      }

      pixisound.pauseAll()

      if (window['gameMotion']) {
        if (window['gameMotion'].length > 0) {
          for (const motion of window['gameMotion']) {
            motion.pause()
          }
        }
      }
      resolve()
    })
  }

  private resumeAll(): Promise<void> {
    return new Promise((resolve) => {
      if (App.Handle.getSceneName() == 'myhangul') {
        ;(App.Handle.getScene('myhangul') as MyHangul).nextRec()
      }
      if (window['currentVideo']) {
        window['currentVideo'].pause()
      }

      if (window['recorder']) {
        window['recorder'].resumeRecording()
      }
      pixisound.resumeAll()

      if (window['gameMotion']) {
        if (window['gameMotion'].length > 0) {
          for (const motion of window['gameMotion']) {
            motion.resume()
          }
        }
      }
      resolve()
    })
  }

  private dimmedMotion(flag: boolean): Promise<void> {
    return new Promise<void>((resolve) => {
      if (flag) {
        this.addChild(this.mDimmed)
        gsap
          .to(this.mDimmed, { alpha: 1, duration: 0.25 })
          .eventCallback('onComplete', () => {
            resolve()
          })
      } else {
        gsap
          .to(this.mDimmed, { alpha: 0, duration: 0.5 })
          .eventCallback('onComplete', () => {
            this.removeChild(this.mDimmed)
            resolve()
          })
      }
    })
  }
}
