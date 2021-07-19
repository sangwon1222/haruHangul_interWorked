import * as PIXI from 'pixi.js'
import 'pixi-spine'
import { App } from '@/activity/core/app'
import { ResourceManager, ResourceTable } from '@/activity/core/resourceManager'
import gsap from 'gsap'
import Axios from 'axios'
import config from '../gameUtil/config'

export class SceneBase extends PIXI.Container {
  private mName: string
  private mProductName: string

  get gamename(): string {
    return this.mName
  }

  get productName(): string {
    return this.mProductName
  }
  set productName(v: string) {
    this.mProductName = v
  }

  private mLearnTime: number

  constructor(name: string) {
    super()
    this.mName = name
    this.mProductName = ''
  }

  startTime() {
    this.mLearnTime = Date.now()
    window['startTime'] = this.mLearnTime
  }

  async endTime() {
    const token = localStorage.getItem('token')
    this.mLearnTime = Math.floor((Date.now() - this.mLearnTime) / 1000)
    const time = await Axios.post(
      `${config.restAPI}/learning/child/time/learned`,
      { learnedTime: this.mLearnTime },
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    )

    this.mLearnTime = null
    window['startTime'] = null

    // console.log(
    //   `%c ${time.config.data}초 동안 액티비티를 플레이 했습니다.`,
    //   'border:2px black solid;'
    // )
  }

  async onInit() {
    //
  }
  async onStart() {
    //
  }
  async onEnd() {
    //
  }
  async goScene(name?: string) {
    // console.error(`수정`)
    // await gsap.globalTimeline.kill()
    if (name) {
      App.Handle.goScene(name)
    } else {
      App.Handle.goScene()
    }
  }

  // async getCommonJSON() {
  //     return await ResourceManager.Handle.getCommonJSON( this.gamename.toLowerCase() );
  // }
  // async getViewerJSON() {
  //     return await ResourceManager.Handle.getViewerJSON( this.gamename.toLowerCase() );
  // }
  // async getProductJSON(){
  //     return await ResourceManager.Handle.getProductJSON( this.productName.toLowerCase(), this.gamename.toLowerCase() );
  // }
  // ------------------------------------------------------------------------------
  async loadCommonResource(rscList: ResourceTable) {
    await ResourceManager.Handle.loadCommonResource(rscList)
  }
  async loadViewerResource(rscList: ResourceTable) {
    await ResourceManager.Handle.loadViewerResource(rscList)
  }
  async loadProductResource(rscList: ResourceTable) {
    await ResourceManager.Handle.loadProductResource(rscList)
  }
  // ------------------------------------------------------------------------------
  getCommonResource(fname: string): PIXI.LoaderResource {
    return ResourceManager.Handle.getCommonResource(fname)
  }
  getViewerResource(fname: string): PIXI.LoaderResource {
    return ResourceManager.Handle.getViewerResource(fname)
  }
  getProductResource(fname: string): PIXI.LoaderResource {
    if (this.gamename == '') {
      throw 'SceneBase의 프로덕트 이름이 비어있습니다.'
      return null
    }
    return ResourceManager.Handle.getProductResource(fname)
  }
}
