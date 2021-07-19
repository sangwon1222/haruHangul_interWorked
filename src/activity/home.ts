import Config from '@/activity/gameUtil/config'
import gsap from 'gsap'
import { SceneBase } from '@/activity/core/sceneBase'
import config from '@/activity/gameUtil/config'
import Axios from 'axios'
// import * as fs from 'fs'
// const fs = require('fs')

export class Home extends SceneBase {
  constructor() {
    super(`home`)
  }

  async onInit() {
    // location.href = `${config.reload}`
    history.go(-1)
    // const info = await Axios.get(`${config.restAPIProd}`)
    // // console.error(info)

    if (window[`currentVideo`]) {
      window[`currentVideo`].pause()
      window[`currentVideo`] = null
    }

    this.alpha = 0
    const debug = new PIXI.Graphics()
    debug.beginFill(0xffffff, 1)
    debug.drawRect(0, 0, Config.w, Config.h)
    debug.endFill()
    this.addChild(debug)
  }

  async onStart() {
    gsap.to(this, { alpha: 1, duration: 0.5 })
    const selectThema = new PIXI.Container()
    selectThema.position.set(Config.w / 2, Config.h / 2)
    this.addChild(selectThema)

    const themaList1 = new PIXI.Text(`오늘한글`)
    const themaList2 = new PIXI.Text(`리듬한글`)
    const themaList3 = new PIXI.Text(`색칠한글`)
    const themaList4 = new PIXI.Text(`짝꿍한글`)
    const themaList5 = new PIXI.Text(`나의한글`)
    const themaList6 = new PIXI.Text(`노닥한글`)
    const themaList7 = new PIXI.Text(`깨단한글`)
    const themaList8 = new PIXI.Text(`그림퍼즐`)

    const thema = [
      themaList1,
      themaList2,
      themaList3,
      themaList4,
      themaList5,
      themaList6,
      themaList7,
      themaList8
    ]
    const scene = [
      `Today`,
      `Rhythm`,
      `Paint`,
      `Partner`,
      `MyHangul`,
      `nodak`,
      `total`,
      `puzzle`
    ]
    const family = [
      `BareunBatangOTFM`,
      `BareunBatangOTFM`,
      `BareunBatangOTFM`,
      `TmoneyRoundWindExtraBold`,
      `TmoneyRoundWindExtraBold`,
      `NanumBarunGothicBold`,
      `NanumBarunGothicBold`,
      `NanumBarunGothicBold`
    ]

    for (let i = 0; i < thema.length; i++) {
      if (thema[i - 1]) {
        thema[i].x = thema[i - 1].x + thema[i - 1].width + 100
      }
      thema[i].y = 0
      if (i >= 5) {
        thema[i].x = thema[i - 1 - 4].x + thema[i - 1 - 4].width + 100
        thema[i].y = 200
      }
      thema[i].style.fontFamily = family[i]

      thema[i].interactive = true
      thema[i].buttonMode = true

      thema[i].on('pointertap', () => {
        this.goScene(scene[i])
      })

      selectThema.addChild(thema[i])
      thema[i].hitArea = new PIXI.Rectangle(
        -thema[i].width / 2,
        -90,
        thema[i].width * 2,
        200
      )
      // const debug = new PIXI.Graphics()
      // debug.lineStyle(2, 0xff0000, 1)
      // debug.drawRect(-thema[i].width / 2, -90, thema[i].width * 2, 200)
      // thema[i].addChild(debug)
    }

    selectThema.pivot.set(selectThema.width / 2, selectThema.height / 2)
  }
}
