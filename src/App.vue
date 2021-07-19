<template>
  <div id="app">
    <div id="goFullScreen" @click="goFullScreen">
      <div id="wrap">
        <router-view :key="$route.fullPath" />
      </div>
    </div>
  </div>
</template>

<script>
import jQuery from 'jquery'
import * as PIXI from 'pixi.js'
import * as pixiSound from 'pixi-sound'
import { ResourceManager } from './activity/core/resourceManager'
import { isIOS } from './activity/gameUtil/platform'
import WebFont from 'webfontloader'
import config from './activity/gameUtil/config'

const $ = jQuery
window.$ = $

export default {
  data() {
    return {
      //
    }
  },
  computed: {},
  async created() {
    await this.loadSnd()
    await this.fontLoading()
    pixiSound.default._htmlAudioContext.filters = null
    pixiSound.default.speedAll = 1
  },
  async mounted() {
    this.$el.setAttribute('style', 'display: block;')
    if (window[`currentVideo`]) {
      window[`currentVideo`].pause()
      window[`currentVideo`] = null
    }
    await this.sizeSetting()
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this
    $(window).resize(async function() {
      await _this.sizeSetting()
    })
  },
  methods: {
    sizeSetting() {
      return new Promise((resolve) => {
        const w = '128%'
        const h = $(window).height()
        const bw = window.innerWidth
        const bh = window.innerHeight

        let scale = bw / 1280
        if (720 * scale > bh) {
          scale = bh / 720
        }
        $('html').css('font-size', w)
        $('#app').css('height', h)
        $('#wrap').css('transform', `scale(${scale})`)

        resolve()
      })
    },
    goFullScreen() {
      if (!document.fullscreenElement) {
        if (this.$el.requestFullscreen) {
          this.$el.requestFullscreen() // W3C spec
        } else if (this.$el.mozRequestFullScreen) {
          this.$el.mozRequestFullScreen() // Firefox
        } else if (this.$el.webkitRequestFullscreen) {
          this.$el.webkitRequestFullscreen() // Safari
        } else if (this.$el.msRequestFullscreen) {
          this.$el.msRequestFullscreen() // IE/Edge
        }
      }
      // else {
      //   if (document.exitFullscreen) {
      //     document.exitFullscreen();
      //   } else if ((document as any).mozCancelFullScreen) {
      //     (document as any).mozCancelFullScreen();
      //   } else if ((document as any).webkitExitFullscreen) {
      //     (document as any).webkitExitFullscreen();
      //   }
      // }
    },
    async loadSnd() {
      PIXI.Loader.shared.destroy()
      PIXI.Loader.shared.reset()
      await ResourceManager.Handle.loadCommonResource({
        sounds: [`com_button_click.mp3`],
        spine: [`star_effect.json`]
      })
      const clickSnd = ResourceManager.Handle.getCommonResource(
        `com_button_click.mp3`
      ).sound
      window['clickSnd'] = clickSnd
    },
    fontLoading() {
      return new Promise((resolve) => {
        WebFont.load({
          // google: {
          //   families: ['BareunBatangOTFM', 'NanumBarunGothic', 'TmoneyRoundWindRegular']
          // },
          custom: {
            families: [
              'BareunBatangOTFM',
              'NanumBarunGothicBold',
              'TmoneyRoundWindExtraBold',
              'TmoneyRoundWindRegular'
            ],
            urls: [`${config.resource}fonts/fonts.css`]
          },
          timeout: 2000,
          active: () => {
            // console.log(' font loaded')
            resolve()
          },

          fontloading: (fontname) => {
            // // console.log('fontLoading', fontname)
          }
        })
      })
    }
    // playclickSnd() {
    //   if (window['clickSnd']) {
    //     window['clickSnd'].stop()
    //     window['clickSnd'].play()
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
#app {
  /**ios에서 확대 터치 막기 */
  touch-action: pan-y;
  /**ios에서 확대 터치 막기 */
  overflow: hidden;
  display: none;
  position: relative;
  width: 100%;
  height: 100%;
  background: $color3;
  #goFullScreen {
    overflow: hidden;
    width: 100%;
    height: 100%;
    #wrap {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 1280px;
      height: 720px;
      margin: -360px 0 0 -640px;
    }
  }
}
</style>
