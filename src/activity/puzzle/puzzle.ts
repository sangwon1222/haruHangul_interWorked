import { SceneBase } from '../core/sceneBase'
import * as PuzzleProduct from '@/activity/core/resource/product/puzzleProduct'
import config from '../gameUtil/config'
import { ResourceManager } from '../core/resourceManager'
import gsap from 'gsap'
import { Dimmed } from '../widget/dimmed'
import { LoadingScreen } from '../scene/loading'
import { PuzzleResource } from '../core/resource/viewer/puzzle'
import { EventSprite } from '../widget/eventSprite'
import { debugLine, getColorByPoint, shuffleArray } from '../gameUtil/game'
import { App } from '../core/app'
import Axios from 'axios'
import { Power0 } from 'gsap/all'

const introPos = [
  { x: 192, y: 190 },
  { x: 344, y: 206 },
  { x: 494, y: 190 },
  { x: 178, y: 356 },
  { x: 344, y: 356 },
  { x: 510, y: 356 },
  { x: 192, y: 522 },
  { x: 344, y: 508 },
  { x: 494, y: 522 }
]

const waitingPos = [
  { x: 752, y: 178 },
  { x: 936, y: 178 },
  { x: 1118, y: 178 },
  { x: 752, y: 360 },
  { x: 936, y: 360 },
  { x: 1118, y: 360 },
  { x: 752, y: 542 },
  { x: 936, y: 542 },
  { x: 1118, y: 542 }
]

const completeTitle = [
  '',
  '만나서 반가워! 우리 함께 한글 공부를 하자.',
  '첫번째 차시를 완료했어! 훌륭해.',
  '10차시를 끝냈어. 대단한걸?',
  'ㄱㄴㄷㄹ 자음 속으로 출발!',
  '자음 속으로 빠져든다~',
  '자음 배우기 영차영차!',
  '자음 배우기 으쌰으쌰!',
  '짜잔! 자음을 완성했어!',
  '으앗! 벌써 반이나 학습했어!',
  '짝짝짝! 모음, 자음 모두 완성!',
  '하루 한글 기본 받침까지 완성했어!',
  '받침 속으로 빠져든다~',
  '이제 복잡한 받침도 문제없어!',
  '마지막 겹받침이야. 기를 모아라!',
  '하루 한글 완성! 최고야!'
]

const missionTitle = [
  '',
  '하루한글을 시작해볼까?',
  '1차시를 완료해보자.',
  '10차시까지 끝내자구!',
  '자율학습을 시작해봐.',
  '24차시를 완료해보자.',
  '자율학습을 꾸준히 해줘.',
  '자율학습이 얼마 안남았어.',
  '자율학습을 끝내볼까?',
  '50차시까지 앞으로!',
  '모음, 자음 모두 완성!',
  '기본받침을 모두 끝내봐.',
  '복잡한 받침을 꾸준히 해줘.',
  '복잡한 받침까지 완성해봐!',
  '겹받침을 꾸준히 해줘.',
  '한글 완성!'
]

const mission = [
  '',
  '하루한글 시작',
  '1차시 완료',
  '10차시 완료',
  '17차시 완료',
  '24차시 완료',
  '30차시 완료',
  '37차시 완료',
  '43차시 완료',
  '50차시 완료',
  '60차시 완료',
  '70차시 완료',
  '77차시 완료',
  '83차시 완료',
  '90차시 완료',
  '100차시 완료'
]

const keyword = [
  '',
  '안녕?',
  '신난다!',
  '대단해.',
  '출발!',
  '빠져든다~',
  '영차영차!',
  '흠...',
  '짜잔~',
  '놀라워!',
  '자음? 모음?',
  '재미있어!',
  '감동이야.',
  '옳지.',
  '얍!',
  '최고야!'
]

export class Piece extends PIXI.Container {
  private mIndex: number
  get index(): number {
    return this.mIndex
  }
  private mShadow: PIXI.Sprite

  private mPiece: PIXI.Sprite
  private mIntro: PIXI.Texture
  private mDragging: PIXI.Texture
  private mComplete: PIXI.Texture

  private mDragFlag: boolean

  constructor(index: number) {
    super()
    this.mDragFlag = false
    this.mIndex = index
    this.mShadow = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(
        `step1_line_shadow_${index}.png`
      ).texture
    )
    this.mPiece = new PIXI.Sprite()
    this.mIntro = ResourceManager.Handle.getCommonResource(
      `step${config.puzzleStep}_small_${this.mIndex}.png`
    ).texture
    this.mDragging = ResourceManager.Handle.getCommonResource(
      `step${config.puzzleStep}_line_${this.mIndex}.png`
    ).texture
    this.mComplete = ResourceManager.Handle.getCommonResource(
      `step${config.puzzleStep}_big_${this.mIndex}.png`
    ).texture

    this.mPiece.texture = this.mIntro

    this.mShadow.position.set(8, 8)
    this.mShadow.visible = false

    this.addChild(this.mShadow, this.mPiece)

    this.pivot.set(this.width / 2, this.height / 2)
  }

  waiting() {
    this.mPiece.texture = this.mIntro
  }

  activePiece() {
    this.interactive = true
    this.buttonMode = true

    this.on('pointerdown', (evt: PIXI.InteractionEvent) => {
      const clickColor = getColorByPoint(
        this.mPiece,
        new PIXI.Point(evt.data.global.x, evt.data.global.y)
      ).a
      if (clickColor !== 0) {
        this.onPointerDown()
      }
    })
      .on('pointermove', (evt: PIXI.InteractionEvent) => {
        if (this.mDragFlag) this.onPointerMove(evt)
      })
      .on('pointerup', () => {
        if (this.mDragFlag) this.onPointerUp()
      })
      .on('pointerupoutside', () => {
        if (this.mDragFlag) this.onPointerUp()
      })
  }

  private onPointerDown() {
    const snd = ResourceManager.Handle.getCommonResource(`com_button_click.mp3`)
      .sound
    snd.play()
    this.mDragFlag = true
    this.mShadow.visible = true
    this.mShadow.alpha = 0
    this.mPiece.texture = this.mDragging
    this.pivot.set(this.width / 2, this.height / 2)
    gsap.to(this.mShadow, { alpha: 1, duration: 0.5 })
    ;(this.parent as GameScene).setIndex(this)
  }

  private onPointerMove(evt: PIXI.InteractionEvent) {
    const x = evt.data.global.x
    const y = evt.data.global.y
    this.x = x
    this.y = y
    const distanceX = x - introPos[this.mIndex - 1].x
    const distanceY = y - introPos[this.mIndex - 1].y
    const distance = Math.pow(distanceX, 2) + Math.pow(distanceY, 2)

    if (distance < Math.pow(this.mPiece.width / 2, 2)) {
      const snd = ResourceManager.Handle.getViewerResource(`ac8_attach.mp3`)
        .sound
      snd.play()
      this.disablePiece()
      this.correct()
    }

    if (x > config.w || x < 0) {
      this.onPointerUp()
    }
    if (y > config.h || y < 0) {
      this.onPointerUp()
    }
  }

  private onPointerUp() {
    this.mDragFlag = false
    this.mPiece.texture = this.mIntro
    this.mShadow.visible = false
    this.pivot.set(this.width / 2, this.height / 2)

    const snd = ResourceManager.Handle.getViewerResource(`ac8_wrong.mp3`).sound
    snd.play()
    ;(this.parent as GameScene).returnPiece(this)
  }

  correct() {
    this.mPiece.texture = this.mComplete
    this.pivot.set(this.width / 2, this.height / 2)
    ;(this.parent as GameScene).correct(this, this.mIndex)
  }

  async fixed() {
    ;(this.parent as GameScene).fixed(this, this.mIndex)
    await this.disablePiece()
  }

  disablePiece(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mPiece.texture = this.mComplete
      this.pivot.set(this.width / 2, this.height / 2)
      this.mDragFlag = false
      this.mShadow.visible = false
      this.interactive = false
      this.buttonMode = false
      resolve()
    })
  }
}

export class OutroScene extends PIXI.Container {
  private mMuck: PIXI.Sprite
  private mSpeak: PIXI.Sprite
  private mSubTitle: PIXI.Text
  constructor() {
    super()
  }
  async onInit() {
    this.sortableChildren = true
    await this.createBackground()
  }

  createBackground(): Promise<void> {
    return new Promise<void>((resolve) => {
      // 하루한글 시작       => 1
      // 1       => 2
      // 10       => 3
      // 17       => 4
      // 24       => 5
      // 30       => 6
      // 37       => 7
      // 43       => 8
      // 50       => 9
      // 60       => 10
      // 70       => 11
      // 77       => 12
      // 83       => 13
      // 90       => 14
      // 100       => 15
      const step = config.puzzleStep
      let bgNum = 0
      // step에 따른 백그라운드 이미지 분기처리
      if (
        step == 1 ||
        step == 2 ||
        step == 5 ||
        step == 11 ||
        step == 13 ||
        step == 14
      ) {
        bgNum = 1
      }

      if (step == 8 || step == 10) {
        bgNum = 2
      }

      if (step == 4 || step == 6 || step == 12) {
        bgNum = 3
      }
      if (step == 3 || step == 7 || step == 9 || step == 15) {
        bgNum = 4
      }

      const bg = new PIXI.Sprite(
        ResourceManager.Handle.getViewerResource(`bg${bgNum}.png`).texture
      )

      this.mMuck = new PIXI.Sprite(
        ResourceManager.Handle.getCommonResource(
          `step${config.puzzleStep}_muck.png`
        ).texture
      )
      this.mMuck.anchor.set(0.5)
      this.mMuck.position.set(config.w / 2, config.h / 2)

      const title = new PIXI.Sprite(
        ResourceManager.Handle.getViewerResource(`title_text.png`).texture
      )
      title.anchor.set(0.5)
      title.position.set(config.w / 2, 70)

      this.mSubTitle = new PIXI.Text(`${completeTitle[step]}`, {
        fontSize: 36,
        fontFamily: 'TmoneyRoundWindExtraBold',
        padding: 20
      })
      this.mSubTitle.anchor.set(0.5)
      this.mSubTitle.position.set(config.w / 2, 138)

      this.mSpeak = new PIXI.Sprite(
        ResourceManager.Handle.getViewerResource(`text.png`).texture
      )
      this.mSpeak.anchor.set(0.5)
      this.mSpeak.position.set(966, 260)

      this.addChild(bg, this.mMuck, title, this.mSpeak, this.mSubTitle)
      // -------------------------------------------------------------------------
      const titleText = new PIXI.Text(`${mission[step]}`, {
        fontSize: 30,
        fontFamily: 'TmoneyRoundWindExtraBold',
        fill: 0xffffff,
        padding: 20
      })
      titleText.x = 20
      titleText.anchor.set(0.5)
      title.addChild(titleText)

      const speackText = new PIXI.Text(`${keyword[step]}`, {
        fontSize: 36,
        fontFamily: 'TmoneyRoundWindExtraBold',
        padding: 20
      })
      speackText.y = -10
      speackText.anchor.set(0.5)
      this.mSpeak.addChild(speackText)

      this.mSubTitle.alpha = 0
      this.mSpeak.alpha = 0

      resolve()
    })
  }

  playOutro(): Promise<void> {
    return new Promise<void>((resolve) => {
      // console.log(`playOutro`)
      // const shadow = new PIXI.Sprite(ResourceManager.Handle.getCommonResource().texture)
      this.mMuck.zIndex = 2

      let dropY = config.h / 2 + 80
      const step = config.puzzleStep

      if (step == 8 || step == 10) {
        dropY = config.h / 2 + 40
      }
      // 캐릭터가 위에서 떨어진다
      gsap
        .to(this.mMuck, {
          y: dropY,
          duration: 0.5,
          ease: Power0.easeNone
        })
        .eventCallback('onComplete', () => {
          // 캐릭터가 떨어지면 말풍선이 나온다.
          gsap.to(this.mSubTitle, { alpha: 1, duration: 1 })
          gsap.to(this.mSpeak, { alpha: 1, duration: 1 })

          // 8차시 => 43일차
          // 10차시 => 60일차
          if (config.puzzleStep == 8 || config.puzzleStep == 10) {
            // 8, 10 일때는 캐릭터의 그림자가 없다
            resolve()
          } else {
            // 캐릭터가 떨어지면 그림자가 생긴다.
            const shadow = new PIXI.Sprite(
              ResourceManager.Handle.getCommonResource(
                `step${config.puzzleStep}_muck_s.png`
              ).texture
            )
            shadow.zIndex = 0
            this.addChild(shadow)
            shadow.anchor.set(0.5)
            shadow.alpha = 0
            shadow.position.set(this.mMuck.x, config.h / 2 + 80)
            gsap
              .to(shadow, { alpha: 1, duration: 1 })
              .eventCallback('onComplete', async () => {
                resolve()
              })
          }
        })
    })
  }
}

export class GameScene extends PIXI.Container {
  private mBG: PIXI.Sprite
  private mLine: PIXI.Sprite
  private mBoard: PIXI.Sprite
  private mComplete: PIXI.Sprite

  private mPieceAry: Array<Piece>
  private mEndFlag: boolean

  private matchedPieces: Array<number>
  get matched(): Array<number> {
    return this.matchedPieces
  }

  constructor(completeAry: Array<number>, ary: Array<Piece>, bgname: string) {
    super()
    this.matchedPieces = completeAry

    this.mBG = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(bgname).texture
    )
    this.addChild(this.mBG)
    this.mEndFlag = false
    this.mPieceAry = []
    this.mPieceAry = ary

    this.sortableChildren = true
  }

  async onInit() {
    this.createBoard()
    await this.createPiece()
  }

  /**좌측의 퍼즐을 맞추기 위한 판 생성 >>
   * 액자+연한퍼즐사진 = [this.mBoard],
   * 퍼즐라인 = [this.mLine],
   * 게임끝났을 시 완성사진 = [this.mComplete]
   * */
  createBoard() {
    this.mBoard = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(
        `step${config.puzzleStep}_board_1.png`
      ).texture
    )
    this.mBoard.anchor.set(0.5)
    this.mBoard.position.set(344, 360)

    this.mLine = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`board_line.png`).texture
    )
    this.mLine.anchor.set(0.5)
    this.mLine.position.set(344, 360)
    this.mLine.tint = 0x000000
    this.mLine.alpha = 0.4

    this.mComplete = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(
        `step${config.puzzleStep}_board_2.png`
      ).texture
    )
    this.mComplete.anchor.set(0.5)
    this.mComplete.position.set(344, 360)
    this.mComplete.alpha = 0

    this.addChild(this.mBoard, this.mLine, this.mComplete)
  }

  /**
   * 퍼즐 조각 만들기
   * this.mPieceAry[i].waiting() => 퍼즐 대기 이미지로 유지
   * this.mPieceAry[i].activePiece() => 퍼즐에 대한 이벤트 등록 (클릭시 소리 & 이미지 교체)
   */
  private async createPiece() {
    for (let i = 0; i < this.mPieceAry.length; i++) {
      this.mPieceAry[i].position.set(waitingPos[i].x, waitingPos[i].y)
      this.addChild(this.mPieceAry[i])
      this.mPieceAry[i].waiting()
      this.mPieceAry[i].activePiece()

      // 이미 맞춘 퍼즐일 경우.
      let fixFlag = false
      for (const index of this.matchedPieces) {
        if (this.mPieceAry[i].index == index) {
          fixFlag = true
        }
      }
      if (fixFlag == true) {
        await this.mPieceAry[i].fixed()
      }
    }
  }

  /**
   *
   * 퍼즐을 클릭했을 때, index를 맨 위로 끌어 올린다.
   */
  setIndex(target: Piece) {
    for (const piece of this.mPieceAry) {
      this.mLine.zIndex = 2
      piece.zIndex = 1
    }
    target.zIndex = 3
  }

  /**
   * 정답일 때
   * 완성된 퍼즐의 인덱스를 배열에 넣고 (게임 나갈때 api송신 때문)
   *
   */
  correct(target: Piece, index: number) {
    let already = false
    for (const num of this.matchedPieces) {
      if (num == index) already = true
    }
    if (already == false) {
      this.matchedPieces.push(index)
    }

    // console.log(`완성된 퍼즐의 index => [${this.matchedPieces}]`)

    for (const piece of this.mPieceAry) {
      piece.zIndex = 1
    }

    // puzzleState[index - 1].state = true
    const completeX = introPos[index - 1].x
    const completeY = introPos[index - 1].y
    gsap
      .to(target, {
        x: completeX,
        y: completeY,
        duration: 0.1,
        ease: 'back'
      })
      .eventCallback('onComplete', async () => {
        this.mLine.zIndex = 2
        await this.checkState()
        if (this.mEndFlag == true) {
          this.goOutro()
        }
      })
  }

  fixed(target: Piece, index: number) {
    const completeX = introPos[index - 1].x
    const completeY = introPos[index - 1].y
    gsap
      .to(target, {
        x: completeX,
        y: completeY,
        duration: 1,
        ease: 'back'
      })
      .eventCallback('onComplete', async () => {
        this.mLine.zIndex = 2
      })
  }

  /**
   * api 송신을 boolean값으로 하려고 했는데 숫자배열로 바꼈음.
   */
  checkState(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mEndFlag = true
      // for (const puzzle of puzzleState) {
      //   if (puzzle.state == false) {
      //     this.mEndFlag = false
      //   }
      // }
      if (this.matchedPieces.length !== 9) {
        this.mEndFlag = false
      }

      resolve()
    })
  }

  /**
   * 틀렸을 경우,
   * 클릭하기 전에 있던 자리(원래 대기하고 있던 자리)로 퍼즐을 리턴시킨다.
   */
  returnPiece(target: Piece) {
    const index = this.mPieceAry.indexOf(target)
    gsap.to(target, {
      x: waitingPos[index].x,
      y: waitingPos[index].y,
      duration: 0.25,
      ease: 'back'
    })
  }

  /**
   * 퍼즐이 완성된 후,
   * 완성 이미지가 나오며 텍스트 뿌려준다.
   * goOutro()에서 실행.
   */
  endGameScene(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.removeChild(this.mBoard)
      this.mBoard = null
      gsap.to(this.mComplete, { alpha: 1, duration: 1 })
      for (const piece of this.mPieceAry) {
        gsap
          .to(piece, { alpha: 0, duration: 1 })
          .eventCallback('onComplete', () => {
            this.removeChild(piece)
          })
      }

      gsap.delayedCall(1, () => {
        gsap.to(this.mComplete, {
          x: config.w / 2,
          y: config.h / 2,
          duration: 0.5
        })
        gsap.to(this.mLine, {
          x: config.w / 2,
          y: config.h / 2,
          duration: 0.5
        })
        gsap.to(this.mLine, { alpha: 0, duration: 1 }).delay(1)
        gsap.delayedCall(1, () => {
          const snd = ResourceManager.Handle.getViewerResource(
            `ac8_success.mp3`
          ).sound
          snd.play()
          gsap.delayedCall(snd.duration, () => {
            resolve()
          })
        })
      })
    })
  }

  async goOutro() {
    await this.endGameScene()
    ;(this.parent as Puzzle).goOutro()
  }
}

export class IntroScene extends PIXI.Container {
  private mRandomAry: Array<Piece>
  get randomAry(): Array<Piece> {
    return this.mRandomAry
  }

  constructor() {
    super()
  }

  async onInit() {
    this.createBoard()
    this.createPiece()
  }

  createBoard() {
    const board = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(
        `step${config.puzzleStep}_board_1.png`
      ).texture
    )
    board.anchor.set(0.5)
    board.position.set(344, 360)

    const line = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`board_line.png`).texture
    )
    line.anchor.set(0.5)
    line.position.set(344, 360)
    line.tint = 0x000000
    line.alpha = 0.4

    const complete = new PIXI.Sprite(
      ResourceManager.Handle.getCommonResource(
        `step${config.puzzleStep}_board_2.png`
      ).texture
    )
    complete.anchor.set(0.5)
    complete.position.set(344, 360)

    this.addChild(board, line, complete)

    gsap
      .to(complete, { alpha: 0, duration: 1.5 })
      .eventCallback('onComplete', () => {
        gsap.to(complete, { alpha: 0, duration: 1.5 })
      })
  }

  createPiece() {
    this.mRandomAry = []
    const piececAry = []

    for (let i = 1; i <= 9; i++) {
      const piece = new Piece(i)
      piece.position.set(introPos[i - 1].x, introPos[i - 1].y)
      piece.visible = false
      this.addChild(piece)
      piececAry.push(piece)
    }
    this.mRandomAry = shuffleArray(piececAry)
    this.flying()
  }

  flying() {
    for (let i = 0; i < this.mRandomAry.length; i++) {
      gsap.delayedCall(i / 4, () => {
        this.mRandomAry[i].zIndex = 1
        this.mRandomAry[i].visible = true
        gsap
          .to(this.mRandomAry[i], {
            x: waitingPos[i].x,
            y: waitingPos[i].y,
            duration: 0.5
          })
          .eventCallback('onComplete', () => {
            this.mRandomAry[i].waiting()
          })
      })
    }
    gsap.delayedCall(3, () => {
      ;(this.parent as Puzzle).goGameScene()
    })
  }
}

export class Puzzle extends SceneBase {
  private mBg: PIXI.Sprite
  private mIntroScene: IntroScene
  private mGameScene: GameScene
  private mOutroScene: OutroScene

  private mPieceAry: Array<Piece>
  private mCompletedPieceAry: Array<number>

  private mRandomBg: number

  private mExitBtn: PIXI.Sprite

  constructor() {
    super('puzzle')
  }
  async onInit() {
    this.startTime()

    // config.puzzleStep은 activityPlayer.vue의 created에서 선언
    const token = localStorage.getItem('token')

    const index = App.Handle.getSceneIndex()
    const gameCode = await Axios.get(`${config.restAPIProd}`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })

    const info = App.Handle.getInfo()
    const code = gameCode.data.result[index]['cd']

    this.mCompletedPieceAry = info.matchedPieces
    if (info.matchedPieces.length == 9) {
      this.mCompletedPieceAry = []
    }

    // // console.log(
    //   '%c 게임 정보 ↓  ',
    //   'background: #000; color:#fff;font-size:20px;font-weight:800;letter-spacing:-4px;'
    // )
    // // console.log(info)
    // // console.log(
    //   `%c 퍼즐 리스트 ↓  `,
    //   'background: #000; color:#fff;font-size:20px;font-weight:800;letter-spacing:-4px;'
    // )
    // // console.log(this.mCompletedPieceAry)
    // // console.log(
    //   `퍼즐스텝 →  [${config.puzzleStep}]// 학습일=> [${config.studyDay}]`
    // )
    // // console.log(`게임 코드값 →  ${code}  `)

    App.Handle.modalRoot.visible = false

    await App.Handle.showLoadingScreen()

    // console.log(this.gamename)
    await this.loadViewerResource(PuzzleResource)
    const images = [
      `step${config.puzzleStep}_big_1.png`,
      `step${config.puzzleStep}_big_2.png`,
      `step${config.puzzleStep}_big_3.png`,
      `step${config.puzzleStep}_big_4.png`,
      `step${config.puzzleStep}_big_5.png`,
      `step${config.puzzleStep}_big_6.png`,
      `step${config.puzzleStep}_big_7.png`,
      `step${config.puzzleStep}_big_8.png`,
      `step${config.puzzleStep}_big_9.png`,
      `step${config.puzzleStep}_small_1.png`,
      `step${config.puzzleStep}_small_2.png`,
      `step${config.puzzleStep}_small_3.png`,
      `step${config.puzzleStep}_small_4.png`,
      `step${config.puzzleStep}_small_5.png`,
      `step${config.puzzleStep}_small_6.png`,
      `step${config.puzzleStep}_small_7.png`,
      `step${config.puzzleStep}_small_8.png`,
      `step${config.puzzleStep}_small_9.png`,
      `step${config.puzzleStep}_line_1.png`,
      `step${config.puzzleStep}_line_2.png`,
      `step${config.puzzleStep}_line_3.png`,
      `step${config.puzzleStep}_line_4.png`,
      `step${config.puzzleStep}_line_5.png`,
      `step${config.puzzleStep}_line_6.png`,
      `step${config.puzzleStep}_line_7.png`,
      `step${config.puzzleStep}_line_8.png`,
      `step${config.puzzleStep}_line_9.png`,
      `step${config.puzzleStep}_muck.png`,
      `step${config.puzzleStep}_board_1.png`,
      `step${config.puzzleStep}_board_2.png`

      // `step${config.puzzleStep}_muck_s.png`,
    ]
    if (config.puzzleStep == 8 || config.puzzleStep == 10) {
      //
    } else {
      images.push(`step${config.puzzleStep}_muck_s.png`)
    }
    await this.loadCommonResource({
      images: images,
      sounds: ['com_button_click.mp3']
    })

    await App.Handle.closeLoadingScreen()
  }

  async onStart() {
    this.sortableChildren = true
    // this.mRandomBg = Math.ceil(Math.random() * 2)
    this.mRandomBg = 1

    this.mBg = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(
        `quiz_bg${this.mRandomBg}.png`
      ).texture
    )

    this.mExitBtn = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource('button.png').texture
    )
    this.mExitBtn.anchor.set(0.5)
    this.mExitBtn.position.set(
      config.w - this.mExitBtn.width / 2 - 30,
      40 + this.mExitBtn.height / 2
    )
    this.mExitBtn.interactive = true
    this.mExitBtn.zIndex = 10
    this.mExitBtn.visible = false

    this.mExitBtn.on('pointertap', () => {
      gsap
        .to(this.mExitBtn.scale, { x: 0.8, y: 0.8, duration: 0.1 })
        .yoyo(true)
        .repeat(3)
        .eventCallback('onComplete', async () => {
          await this.endgame()
        })
    })

    this.addChild(this.mBg, this.mExitBtn)

    this.mIntroScene = new IntroScene()
    this.addChild(this.mIntroScene)
    await this.mIntroScene.onInit()

    gsap.delayedCall(3, () => {
      window.onkeypress = (evt: KeyboardEvent) => {
        if (evt.key == '+') {
          this.goOutro()
        }
      }
    })
  }

  async goGameScene() {
    this.mPieceAry = []
    this.mPieceAry = this.mIntroScene.randomAry
    this.mIntroScene.removeChildren()
    this.removeChild(this.mIntroScene)
    this.mIntroScene = null
    this.removeChild(this.mBg)

    this.mGameScene = new GameScene(
      this.mCompletedPieceAry,
      this.mPieceAry,
      `quiz_bg${this.mRandomBg}.png`
    )
    this.addChild(this.mGameScene)
    await this.mGameScene.onInit()

    this.mExitBtn.visible = true
  }

  async goOutro() {
    window.onkeypress = () => null

    this.sortableChildren = true

    this.mOutroScene = new OutroScene()
    this.addChild(this.mOutroScene)
    this.mOutroScene.zIndex = 1
    this.mGameScene.zIndex = 2

    await this.mOutroScene.onInit()

    // 게임씬이 겹치면서 아웃트로가 생긴다

    gsap
      .to(this.mGameScene, { alpha: 0, duration: 1 })
      .eventCallback('onComplete', async () => {
        await this.mOutroScene.playOutro()
      })
  }

  // async onStart()의 close를 클릭하면 실행
  async endgame() {
    await this.endTime()

    this.removeChild(this.mGameScene)

    // 게임정보를 백엔드에 쏴준다
    const token = localStorage.getItem('token')

    const index = App.Handle.getSceneIndex()
    const info = await Axios.get(`${config.restAPIProd}`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    const code = info.data.result[index].cd

    const matched = this.mGameScene.matched

    if (matched.length !== 0) {
      const day = App.Handle.getInfo()['day']
      const savePiece = await Axios.post(
        `${config.restAPI}/learning/hangul/puzzles/day/${day}`,
        { matchedPieces: matched },
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      )
      // // console.warn(end)
      // console.warn(savePiece)
    }

    App.Handle.onCloseApp()
  }
}
