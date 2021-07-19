<template>
  <div id="activityPlayer">
    <!-- <timerCheck /> -->
    <canvas id="stage" ref="stage" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { AramApp } from '@/AramApp'
import pixisound from 'pixi-sound'
import gsap from 'gsap'
import { isIOS, isMobilePlatform } from './gameUtil/platform'
import config from './gameUtil/config'
// import timerCheck from '@/components/timer.vue'

@Component({
  components: {
    // timerCheck
  }
})
export default class ActivityPlayer extends Vue {
  @Prop({ default: '' }) private name!: ''
  @Prop({ default: '' }) private cd!: any
  @Prop({ default: '' }) private info!: any
  private screenFlag = true

  private mAramApp: AramApp
  $refs: {
    stage: HTMLCanvasElement
  }
  created() {
    pixisound.stopAll()
    if (this.cd) {
      config.selectDay = this.cd
    }
    if (this.info) {
      config.puzzleStep = this.info.no
    }
  }
  async beforeDestroy() {
    if (this.mAramApp) {
      await this.mAramApp.end()
      this.mAramApp = null
    }
    // console.log(`Destroy`)
  }
  async _goFullScreen() {
    // if (!document.fullscreenElement) {
    // if (this.$el.requestFullscreen) {
    //   this.$el.requestFullscreen() // W3C spec
    // } else if ((this.$el as any).mozRequestFullScreen) {
    //   ;(this.$el as any).mozRequestFullScreen() // Firefox
    // } else if ((this.$el as any).webkitRequestFullscreen) {
    //   ;(this.$el as any).webkitRequestFullscreen() // Safari
    // } else if ((this.$el as any).msRequestFullscreen) {
    //   ;(this.$el as any).msRequestFullscreen() // IE/Edge
    // }
    // } else {
    // if (document.exitFullscreen) {
    //   document.exitFullscreen()
    // } else if ((document as any).mozCancelFullScreen) {
    //   ;(document as any).mozCancelFullScreen()
    // } else if ((document as any).webkitExitFullscreen) {
    //   ;(document as any).webkitExitFullscreen()
    // }
    // }
  }

  async mounted() {
    this.mAramApp = new AramApp(this.$refs.stage, this.name, this.info)

    this.mAramApp.onCloseApp = async () => {
      await this.mAramApp.timeUpdate()
      if (this.mAramApp.getSceneName() == 'puzzle') {
        this.$router.push({
          name: `main`,
          params: {
            puzzle: 'true'
          }
        })
      } else {
        this.$router.replace('/hangul')
      }
    }

    this.mAramApp.goMainPage = async () => {
      this.$router.replace('/hangul')
      location.reload()
    }

    // this.mAramApp.onFullScreen = async () => {
    //   this._goFullScreen()
    // }
  }
}
</script>

<style lang="scss" scoped>
#activityPlayer {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  /* border: 2px #000 solid; */
  background-color: rgba(0, 0, 0, 0.9);

  #stage {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    width: 100%;

    z-index: 200;
    box-sizing: border-box;
  }
  #alert {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 400;
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    > button {
      position: absolute;
      top: 50%;
      left: 50%;
      padding: 2rem;
      width: 200px;
      color: #fff;
      font-size: 1.6rem;
      background-color: green;
      border: 2px green solid;
      border-radius: 20px;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
