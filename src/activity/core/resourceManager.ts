import { App } from '@/activity/core/app'
import Util from '@/activity/gameUtil'
import Config from '@/activity/gameUtil/config'

export interface ResourceTable {
  images?: Array<string>
  sounds?: Array<string>
  json?: Array<string>
  spine?: Array<string>
  video?: Array<string>
}

export class ResourceManager {
  //-----------------------------------
  // singleton
  private static _handle: ResourceManager
  static get Handle(): ResourceManager {
    if (ResourceManager._handle === undefined) {
      ResourceManager._handle = new ResourceManager()
    }
    return ResourceManager._handle
  }
  //-----------------------------------

  private mURLRoot = Util.Config.resource
  // Noto sans
  // private mResource: { [name: string]: PIXI.LoaderResource };
  private mCommonResource: { [name: string]: PIXI.LoaderResource }
  private mViewerResource: { [name: string]: PIXI.LoaderResource }
  private mProductResource: { [name: string]: PIXI.LoaderResource }

  get urlRoot(): string {
    return this.mURLRoot
  }

  constructor() {
    this.mCommonResource = {}
    this.mViewerResource = {}
    this.mProductResource = {}
  }

  getCommonResource(fname: string): PIXI.LoaderResource {
    return this.mCommonResource[`${fname}`]
  }
  getViewerResource(fname: string): PIXI.LoaderResource {
    return this.mViewerResource[
      `${App.Handle.currentScene.gamename.toLowerCase()}:${fname}`
    ]
  }
  getProductResource(fname: string): PIXI.LoaderResource {
    return this.mProductResource[
      `${App.Handle.currentScene.gamename.toLowerCase()}:day${
        Config.selectDay
      }:${fname}`
    ]
  }

  /**공용 리소스 */
  public async loadCommonResource(rscList: ResourceTable): Promise<void> {
    return new Promise<void>((resolve) => {
      PIXI.utils.clearTextureCache()
      PIXI.Loader.shared.destroy()
      PIXI.Loader.shared.reset()
      for (const [category, fnamelist] of Object.entries(rscList)) {
        for (const fname of fnamelist) {
          if (this.mCommonResource[`${fname}`] === undefined) {
            PIXI.Loader.shared.add(
              `${fname}`,
              `${this.mURLRoot}common/${category.toLowerCase()}/${fname}`
            )
          }
        }
      }

      PIXI.Loader.shared.load((loader, resource) => {
        for (const [key, value] of Object.entries(resource)) {
          if (this.mCommonResource[key] == undefined) {
            this.mCommonResource[key] = value
          }
        }
        // console.log(`공용리소스 로드완료`)
        resolve()
      })
    })
  }

  /**뷰어 리소스 */
  public async loadViewerResource(rscList: ResourceTable): Promise<void> {
    return new Promise<void>((resolve) => {
      // const viewer = new PIXI.Loader()
      PIXI.utils.clearTextureCache()
      PIXI.Loader.shared.destroy()
      PIXI.Loader.shared.reset()

      for (const [category, fnamelist] of Object.entries(rscList)) {
        for (const fname of fnamelist) {
          if (
            this.mViewerResource[
              `${App.Handle.currentScene.gamename.toLowerCase()}:${fname}`
            ] === undefined
          ) {
            PIXI.Loader.shared.add(
              `${App.Handle.currentScene.gamename.toLowerCase()}:${fname}`,
              `${
                this.mURLRoot
              }viewer/${App.Handle.currentScene.gamename.toLowerCase()}/${category.toLowerCase()}/${fname}`
            )
          }
        }
      }
      PIXI.Loader.shared.load((loader, resource) => {
        for (const [key, value] of Object.entries(resource)) {
          if (this.mViewerResource[key] === undefined) {
            this.mViewerResource[key] = value
          }
        }
        // console.log(`뷰어리소스 로드완료`)
        resolve()
      })
    })
  }

  /**프로덕트 리소스 */
  public async loadProductResource(rscList: ResourceTable): Promise<void> {
    return new Promise<void>((resolve) => {
      // const product = new PIXI.Loader()
      PIXI.utils.clearTextureCache()
      PIXI.Loader.shared.destroy()
      PIXI.Loader.shared.reset()
      for (const [category, fnamelist] of Object.entries(rscList)) {
        for (const fname of fnamelist) {
          if (
            this.mProductResource[
              `${App.Handle.currentScene.gamename.toLowerCase()}:day${
                Config.selectDay
              }:${fname}`
            ] == undefined
          ) {
            PIXI.Loader.shared.add(
              `${App.Handle.currentScene.gamename.toLowerCase()}:day${
                Config.selectDay
              }:${fname}`,
              `${
                this.mURLRoot
              }product/${App.Handle.currentScene.gamename.toLowerCase()}/day${
                Config.selectDay
              }/${category.toLowerCase()}/${fname}`
            )
          }
        }
      }

      PIXI.Loader.shared.load((loader, resource) => {
        for (const [key, value] of Object.entries(resource)) {
          if (this.mProductResource[key] == undefined) {
            this.mProductResource[key] = value
          }
        }
        // console.log(`프로덕트 리소스 로드완료`)
        resolve()
      })
    })
  }

  public exitLoad() {
    PIXI.Loader.shared.destroy()
    PIXI.Loader.shared.reset()
    PIXI.Loader.shared.load((loader, resource) => null)
    this.mCommonResource = {}
    this.mViewerResource = {}
    this.mProductResource = {}
  }
}
