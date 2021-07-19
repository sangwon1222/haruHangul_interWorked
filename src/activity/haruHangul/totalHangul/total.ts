import { ResourceManager } from '@/activity/core/resourceManager'
import { TotalResource } from '@/activity/core/resource/viewer/totalResource'
import * as TotalProduct from '@/activity/core/resource/product/totalProduct'
import { SceneBase } from '@/activity/core/sceneBase'
import config from '@/activity/gameUtil/config'
import { Intro } from '@/activity/scene/intro'
import { Type1 } from './Type1'
import { Type2 } from './Type2'
import { Type3 } from './Type3'
import { Type4 } from './Type4'
import { QuizType } from './QuizType'
import gsap from 'gsap/all'
import { App } from '@/activity/core/app'
import {
  getCombinationType,
  getConstantVowel,
  getSound,
  getSyllableType,
  syllableToNum
} from '@/activity/gameUtil/game'
import { Eop } from '@/activity/scene/eop'
import pixisound from 'pixi-sound'
import Axios from 'axios'

export class ProgressCursor extends PIXI.Sprite {
  private mOnStep: PIXI.Texture
  private mOffStep: PIXI.Texture
  private mCurrentStep: PIXI.Texture

  private mBlink: any

  constructor() {
    super()
    this.mOffStep = ResourceManager.Handle.getViewerResource(
      `navi_01.png`
    ).texture
    this.mOnStep = ResourceManager.Handle.getViewerResource(
      `navi_02.png`
    ).texture
    this.mCurrentStep = ResourceManager.Handle.getViewerResource(
      `navi_03.png`
    ).texture

    this.texture = this.mOffStep
  }
  current() {
    // this.blinkFlag(true)
    this.texture = this.mCurrentStep
  }
  complete() {
    // this.blinkFlag(false)
    this.texture = this.mOnStep
  }
  nonComplete() {
    // this.blinkFlag(false)
    this.texture = this.mOffStep
  }

  blinkFlag(flag: boolean) {
    if (flag == true) {
      this.mBlink = gsap
        .to(this, { alpha: 0, duration: 0.8 })
        .repeat(-1)
        .yoyo(true)
    } else {
      if (this.mBlink) {
        this.mBlink.kill()
        this.mBlink = null
        gsap.to(this, { alpha: 1, duration: 0.25 })
      }
    }
  }
}

export class ProgreesBar extends PIXI.Sprite {
  private mStepAry: Array<ProgressCursor>

  constructor() {
    super()
    this.mStepAry = []

    this.texture = ResourceManager.Handle.getViewerResource(
      `navi_bar.png`
    ).texture

    // let offSetX = 55
    let offSetX = 26
    for (let i = 0; i < 15; i++) {
      const step = new ProgressCursor()
      step.anchor.set(0.5)
      step.position.set(offSetX, this.height / 2)
      offSetX += 38
      this.addChild(step)
      this.mStepAry.push(step)
    }
    this.mStepAry[0].current()
  }

  next(currentStep: number) {
    for (let i = 0; i < this.mStepAry.length; i++) {
      if (i < currentStep) {
        this.mStepAry[i].complete()
      }
      if (i == currentStep) {
        this.mStepAry[i].current()
      }
    }
  }
}

export class Total extends SceneBase {
  private mQuizData: any

  private mQuizArray: Array<QuizType>
  // 현재 무슨 타입을 진행 중인지
  private mCurrentType: number
  // 타입과 상관없이 몇번째 문제를 풀고 있는지
  private mCurrentStep: number
  get currentStep(): number {
    return this.mCurrentStep
  }
  set currentStep(v: number) {
    this.mCurrentStep = v
  }

  private mSceneRoot: PIXI.Container
  private mProgressBar: ProgreesBar

  private mWrongCount1: number
  get wrongCount1(): number {
    return this.mWrongCount1
  }
  set wrongCount1(v: number) {
    this.mWrongCount1 = v
    // console.log(`%c 듣기,쓰기 [오답 갯수]=>[${v}]`, 'border:2px red solid;')
  }

  private mWrongCount2: number
  get wrongCount2(): number {
    return this.mWrongCount2
  }
  set wrongCount2(v: number) {
    this.mWrongCount2 = v
    // console.log(`%c 쓰기 [오답 갯수]=>[${v}]`, 'border:2px red solid;')
  }

  private mImgResource: Array<string>
  private mSndResource: Array<string>

  constructor() {
    super('total')
    this.mWrongCount1 = 0
    this.mWrongCount2 = 0
  }
  async onInit() {
    this.startTime()

    window.onkeypress = () => null
    window.onkeypress = (evt: KeyboardEvent) => {
      if (evt.key == '+') {
        this.removeChildren()
        gsap.globalTimeline.clear()
        this.onEnded()
      }
    }
    //// pixisound.stopAll()
    await App.Handle.showLoadingScreen()
    this.mImgResource = []
    this.mSndResource = []

    this.mCurrentStep = 0

    this.mQuizData = {}
    await this.getData()
    if (this.mQuizData == undefined) {
      alert(`${config.selectDay}일차 데이터가 없습니다. 
      일차에 맞는 게임을 시도해주세요.`)
      // location.reload()
      history.go(-1)
    }

    //타입1 리소스 로드
    await this.loadType1()

    // 타입2 리소스 로드
    await this.loadType2()

    // 타입3 리소스 로드
    await this.loadType3()

    // 타입4 리소스 로드
    await this.loadType4()

    await ResourceManager.Handle.loadCommonResource({
      images: this.mImgResource,
      sounds: this.mSndResource
    })

    await ResourceManager.Handle.loadCommonResource({
      images: config.partnerNtotal
    })
    await this.loadViewerResource(TotalResource)
    // await this.loadCommonResource(TotalProduct[`day${config.selectDay}`])
    this.mCurrentType = 0

    await App.Handle.closeLoadingScreen()
  }

  private loadType1(): Promise<void> {
    return new Promise<void>((resolve) => {
      // 타입1 리소스 로드
      const type1Data = this.mQuizData.type1

      for (let i = 1; i <= Object.keys(type1Data).length; i++) {
        const phonemeAry = type1Data[`step${i}`].correct
        for (let j = 0; j < phonemeAry.length; j++) {
          const type = getSyllableType(phonemeAry[j])
          const num = syllableToNum(phonemeAry[j])

          const fileName = `${type}${num}.mp3`

          let already = false
          for (const snd of this.mSndResource) {
            if (snd == fileName) {
              already = true
            }
          }
          if (already == false) {
            this.mSndResource.push(fileName)
          }
        }
      }

      resolve()
    })
  }
  private loadType2(): Promise<void> {
    return new Promise<void>((resolve) => {
      const type2Data = this.mQuizData.type2

      for (let i = 1; i <= Object.keys(type2Data).length; i++) {
        const correctFile = type2Data[`step${i}`].correct
        const num = getSound(correctFile)

        const img = `word_${num}.png`
        const snd = `word_${num}.mp3`

        let imageAlready = false
        for (const file of this.mImgResource) {
          if (img == file) {
            imageAlready = true
          }
        }
        if (imageAlready == false) {
          this.mImgResource.push(img)
        }

        let soundAlready = false
        for (const file of this.mSndResource) {
          if (snd == file) {
            soundAlready = true
          }
        }
        if (soundAlready == false) {
          this.mSndResource.push(snd)
        }
      }
      for (let i = 1; i <= Object.keys(type2Data).length; i++) {
        const wrongFile = type2Data[`step${i}`].wrong
        const num = getSound(wrongFile)

        const img = `word_${num}.png`
        const snd = `word_${num}.mp3`

        let imageAlready = false
        for (const file of this.mImgResource) {
          if (img == file) {
            imageAlready = true
          }
        }
        if (imageAlready == false) {
          this.mImgResource.push(img)
        }

        let soundAlready = false
        for (const file of this.mSndResource) {
          if (snd == file) {
            soundAlready = true
          }
        }
        if (soundAlready == false) {
          this.mSndResource.push(snd)
        }
      }

      resolve()
    })
  }
  private loadType3(): Promise<void> {
    return new Promise<void>((resolve) => {
      const type3Data = this.mQuizData.type3

      for (let i = 1; i <= Object.keys(type3Data).length; i++) {
        const correctFile = type3Data[`step${i}`].correct
        const num = getSound(correctFile)

        const img = `word_${num}.png`
        const snd = `word_${num}.mp3`

        if (type3Data[`step${i}`].type == 3) {
          for (const wrongText of type3Data[`step${i}`].wrong) {
            const num = getSound(wrongText)
            const wrong = `word_${num}.png`

            let imageAlready = false
            for (const file of this.mImgResource) {
              if (wrong == file) {
                imageAlready = true
              }
            }
            if (imageAlready == false) {
              this.mImgResource.push(wrong)
            }
          }
        }

        let imageAlready = false
        for (const file of this.mImgResource) {
          if (img == file) {
            imageAlready = true
          }
        }
        if (imageAlready == false) {
          this.mImgResource.push(img)
        }

        let soundAlready = false
        for (const file of this.mSndResource) {
          if (snd == file) {
            soundAlready = true
          }
        }
        if (soundAlready == false) {
          this.mSndResource.push(snd)
        }
      }

      resolve()
    })
  }
  private loadType4(): Promise<void> {
    return new Promise<void>((resolve) => {
      const type4Data = this.mQuizData.type4

      for (let i = 1; i <= Object.keys(type4Data).length; i++) {
        const word = this.mQuizData.type4[`step${i}`].correct
        const num = getSound(word)
        const file = `word_${num}.mp3`
        const imgfile = `word_${num}.png`

        let already = false
        for (const snd of this.mSndResource) {
          if (snd == file) {
            already = true
          }
        }
        if (already == false) {
          this.mSndResource.push(file)
        }

        let imgAlready = false
        for (const img of this.mImgResource) {
          if (img == imgfile) {
            imgAlready = true
          }
        }
        if (imgAlready == false) {
          this.mImgResource.push(imgfile)
        }
        /** word = '아야' */

        for (let j = 0; j < word.length; j++) {
          const type = getCombinationType(word[j])

          const syllables = getConstantVowel(word[j])

          let syllableType = ''
          let num = ''
          for (let z = 0; z < syllables.length; z++) {
            syllableType = getSyllableType(syllables[z])
            num = syllableToNum(syllables[z])

            let fileName = `${syllableType}t${type}_${num}.png`
            if (z == 2) {
              fileName = `3jong_at_${num}.png`
            }

            let already = false

            for (const img of this.mImgResource) {
              if (img == fileName) {
                already = true
              }
            }
            if (already == false) {
              this.mImgResource.push(fileName)
            }
          }
        }
      }

      resolve()
    })
  }

  async onStart() {
    let intro = new Intro()
    this.addChild(intro)
    await intro.playIntro()
    intro = null
    this.removeChildren()

    this.mProgressBar = new ProgreesBar()
    this.mProgressBar.position.set(
      config.w / 2 - this.mProgressBar.width / 2,
      config.h - (this.mProgressBar.height + 30)
    )
    this.addChild(this.mProgressBar)

    this.mSceneRoot = new PIXI.Container()
    this.addChild(this.mSceneRoot)

    this.sortableChildren = true
    this.mSceneRoot.zIndex = 0
    this.mProgressBar.zIndex = 1

    this.createQuiz()
  }

  createQuiz() {
    const type1 = new Type1(this.mQuizData['type1'])
    const type2 = new Type2(this.mQuizData['type2'])
    const type3 = new Type3(this.mQuizData['type3'])
    const type4 = new Type4(this.mQuizData['type4'])
    this.mQuizArray = [type1, type2, type3, type4]
    // this.mQuizArray = [type4]
    this.mSceneRoot.addChild(this.mQuizArray[this.mCurrentType])
    this.mQuizArray[this.mCurrentType].onInit()
  }

  async nextType() {
    gsap.delayedCall(1, async () => {
      this.mCurrentType += 1
      this.nextStep()

      if (!this.mQuizArray[this.mCurrentType]) {
        // console.log('게임 끝')
        await this.onEnded()
      }
      this.mSceneRoot.removeChildren()
      this.mSceneRoot.addChild(this.mQuizArray[this.mCurrentType])
      this.mQuizArray[this.mCurrentType].onInit()
    })
  }

  nextStep() {
    this.mCurrentStep += 1
    if (this.mCurrentStep) this.mProgressBar.next(this.mCurrentStep)
  }

  getData(): Promise<void> {
    return new Promise<void>((resolve) => {
      const requestUrl = `${config.resource}data/total_data.json`
      const request = new XMLHttpRequest()
      request.open('GET', requestUrl)
      request.responseType = 'json'
      request.send()
      request.onloadend = () => {
        // console.error(config.selectDay)
        this.mQuizData = request.response['data'][`${config.selectDay}`]
        resolve()
      }
    })
  }

  async onEnded() {
    await this.endTime()

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
      { wrongCountsInQuiz: [this.wrongCount1, this.wrongCount2] },
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    )

    const EOP = new Eop()
    this.addChild(EOP)
    await EOP.eopPlay()

    // location.reload()
    App.Handle.goMainPage()
  }
}
