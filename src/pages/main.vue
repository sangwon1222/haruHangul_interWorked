<template>
  <div ref="wrapMain" class="wrap-main">
    <timerCheck />
    <div class="header-menu">
      <img
        src="~@/assets/images/header/img_logo.svg"
        class="logo"
        @click="reload"
      />
      <ul class="info" @click="playclickSnd">
        <li class="name" @click="profileStart">
          <img v-if="userFace !== ''" :src="userFace" />
          <span v-else class="face-default" />
          <span>{{ userName }}</span>
        </li>
        <li class="char">
          <span class="img" :class="`img${randomKey}`" />
          <span class="chat">
            {{ keyword[randomKey] }}
          </span>
        </li>
      </ul>
      <ul class="menu">
        <li
          class="oneday"
          :class="{ active: swiperIndex === 0 }"
          @click="next(0)"
        >
          <span class="name">하루 한글</span>
          <span class="ico" />
        </li>
        <li
          class="card"
          :class="{ active: swiperIndex === 1 }"
          @click="next(1)"
        >
          <span class="name">한글 카드</span>
          <span class="ico" />
        </li>
        <li
          class="mypet"
          :class="{ active: swiperIndex === 2 }"
          @click="next(2)"
        >
          <span class="name">그림 퍼즐</span>
          <span class="ico" />
        </li>
        <li class="parent" @click="parentStart()">
          <span class="name">부모님</span>
          <span class="ico" />
        </li>
      </ul>
    </div>
    <div class="swiper-wrap">
      <swiper
        ref="swiperMain"
        class="main-swiper"
        :options="swiperOption"
        @slideChangeTransitionStart="callback"
        @touchStart="startEvent"
        @touchMove="moveEvent"
        @touchEnd="endEvent"
      >
        <!-- @slideChangeTransitionEnd="callback" -->
        <swiper-slide
          ><onedayComponent @certificatePop="certificatePop"
        /></swiper-slide>
        <swiper-slide><cardComponent /></swiper-slide>
        <swiper-slide><puzzleComponent /></swiper-slide>
      </swiper>
    </div>
    <!-- 카드 팝업 -->
    <div v-if="cardPopup">
      <cardPopupComponent />
    </div>
    <!-- 이전 진도~ 팝업 -->
    <div v-if="alertPopup">
      <alertComponent />
    </div>
    <!-- 부모님 팝업 -->
    <div v-if="parentPopup">
      <parentComponent @popupClose="parentClose" />
    </div>
    <!-- 프로필 팝업 -->
    <div v-if="profilePopup">
      <profileComponent
        :name="userName"
        :face="userFace"
        :day-of-study="dayOfStudy"
        @popupClose="profileClose"
      />
    </div>

    <!-- 수료증 팝업 -->
    <div v-if="certificatePopup" class="certificate">
      <button @click="certificatePop(false)" />
      <img
        class="balloon"
        style="top:36px;left:110px;"
        src="@/assets/images/main/oneday/left_balloon1.png"
      />
      <img
        class="balloon"
        style="top:222px;left:104px;"
        src="@/assets/images/main/oneday/left_balloon2.png"
      />
      <img
        class="balloon"
        style="top:386px;left:50px;"
        src="@/assets/images/main/oneday/left_balloon3.png"
      />
      <img
        class="balloon"
        style="top:516px;left:116px;"
        src="@/assets/images/main/oneday/left_balloon4.png"
      />
      <img
        class="balloon"
        style="top:130px;left:1106px;"
        src="@/assets/images/main/oneday/right_balloon1.png"
      />
      <img
        class="balloon"
        style="top:336px;left:1106px;"
        src="@/assets/images/main/oneday/right_balloon2.png"
      />
      <img
        class="balloon"
        style="top:474px;left:1166px;"
        src="@/assets/images/main/oneday/right_balloon3.png"
      />
      <img class="pollen" src="@/assets/images/main/oneday/pollen.png" />
      <img class="stamp" src="@/assets/images/main/oneday/stamp.png" />
      <img class="medal" src="@/assets/images/main/oneday/medal.png" />
      <div class="certificateBg" />
      <span class="userName">{{ this.userName }}</span>
      <span class="date">{{ this.today }}</span>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import '@/assets/css/swiper.css'

import { mapState, mapActions } from 'vuex'

import timerCheck from '@/components/timer'

import onedayComponent from '@/components/main/onedayComponent'
import cardComponent from '@/components/main/cardComponent'
import puzzleComponent from '@/components/main/puzzleComponent'
import parentComponent from '@/components/main/parentComponent'

import cardPopupComponent from '@/components/main/card/popupComponent'
import alertComponent from '@/components/main/popup/alertComponent'
import profileComponent from '@/components/main/popup/profileComponent'
import gsap from 'gsap/all'
import config from '@/activity/gameUtil/config'

export default {
  components: {
    timerCheck,
    swiper,
    swiperSlide,
    onedayComponent,
    cardComponent,
    puzzleComponent,
    parentComponent,
    alertComponent,
    cardPopupComponent,
    profileComponent
  },
  data() {
    return {
      swiperOption: {
        initialSlide: 0,
        sensitive: 100
      },
      userName: '',
      userFace: '',
      dayOfStudy: 0,
      swiperIndex: 0,
      profilePopup: false,
      parentPopup: false,
      randomKey: 0,
      today: '',
      keyword: [
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
      ],
      startX: 0,
      certificatePopup: false
    }
  },
  computed: {
    ...mapState({
      playTime: (state) => state.timer.timer,
      cardPopup: (state) => state.cardView.popup.visible,
      alertPopup: (state) => state.popup.alert.visible
    })
  },
  async created() {
    const year = new Date().getFullYear()
    let month = new Date().getMonth() + 1
    if (month.length == 1) {
      month = `0${new Date().getMonth() + 1}`
    }
    let date = new Date().getDate()
    if (date.length == 1) {
      date = `0${new Date().getDate()}`
    }

    const token = localStorage.getItem('token')

    const time = await this.$axios.get(`${config.restAPI}/learning/hangul`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })

    let completedDate = `${year}년 ${month}월 ${date}일`

    if (time.data.result.completedDate)
      completedDate = time.data.result.completedDate

    this.today = completedDate

    await this.getUserInfo()
  },
  mounted() {
    this.callback()

    if (this.$route.params.puzzle === 'true') {
      this.$refs.swiperMain.swiper.slideTo(2, 0)
    }
  },
  methods: {
    ...mapActions('timer', ['timeSave']),
    ...mapActions('parentPage', ['userinfoUpdate']),
    async timeUpdate(t) {
      try {
        await this.$axios.post('/learning/child/time/remained', {
          remainedTime: t
        })
      } catch (error) {
        // console.error(error)
      }
    },
    async getUserInfo() {
      try {
        const { data } = await this.$axios.get('/learning/hangul/user')
        if (data.result.playStgupTime === 0) {
          this.$router.push({
            name: `opening`
          })
          return false
        }
        this.userinfoUpdate(data)
        this.userName = data.result.name
        this.userFace = data.result.profile
        this.dayOfStudy = data.result.dayOfStudy
        this.randomKey = Math.floor(Math.random() * data.result.lastPuzzleIndex)

        if (this.$route.params.timeUpdate) {
          this.timeSave(data.result.playStgupTime)
          this.timeUpdate(data.result.playStgupTime)
          return false
        }
        if (data.result.playPosbTime <= 0) {
          this.timeSave(data.result.playStgupTime)
        } else {
          this.timeSave(data.result.playPosbTime)
        }
        // this.timeSave(200)
      } catch (error) {
        // console.error(error)
      }
    },
    // 기능
    async next(v) {
      await this.playclickSnd()
      this.$refs.swiperMain.swiper.allowSlideNext = true
      this.$refs.swiperMain.swiper.allowSlidePrev = true
      this.$refs.swiperMain.swiper.slideTo(v)
      this.swiperIndex = v
      // // console.log('activeIndex', this.$refs.swiperMain.swiper.activeIndex)
    },
    startEvent() {
      this.startX = window.event.clientX
      this.$refs.swiperMain.swiper.allowClick = true
      this.$refs.swiperMain.swiper.allowTouchMove = true
    },
    moveEvent() {
      const gap = Math.abs(window.event.clientX - this.startX)
      if (gap < 200) {
        this.$refs.swiperMain.swiper.allowSlideNext = false
        this.$refs.swiperMain.swiper.allowSlidePrev = false
      } else {
        this.$refs.swiperMain.swiper.allowSlideNext = true
        this.$refs.swiperMain.swiper.allowSlidePrev = true
      }
    },
    endEvent() {
      this.$refs.swiperMain.swiper.allowSlideNext = true
      this.$refs.swiperMain.swiper.allowSlidePrev = true
    },
    certificatePop(flag) {
      this.certificatePopup = flag
    },
    parentClose() {
      this.parentPopup = false
    },
    parentStart() {
      this.parentPopup = true
    },
    profileClose() {
      this.profilePopup = false
    },
    profileStart() {
      this.profilePopup = true
    },
    callback() {
      this.swiperIndex = this.$refs.swiperMain.swiper.activeIndex

      if (this.swiperIndex === 0) {
        this.$refs.wrapMain.style.backgroundColor = '#7fd9f8'
      } else if (this.swiperIndex === 1) {
        this.$refs.wrapMain.style.backgroundColor = '#d5c8ff'
      } else if (this.swiperIndex === 2) {
        this.$refs.wrapMain.style.backgroundColor = '#ffe76d'
      }
    },
    playclickSnd() {
      return new Promise((resolve) => {
        if (window['clickSnd']) {
          window['clickSnd'].stop()
          window['clickSnd'].play()
          gsap.delayedCall(window['clickSnd'].duration, () => {
            resolve()
          })
        } else {
          resolve()
        }
      })
    },

    reload() {
      this.$router.replace('/hangul')
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-main {
  .header-menu {
    position: relative;
    width: 100%;
    height: 130px;
    padding: 12px 0 12px 180px;
    background: url('~@/assets/images/header/bg.png') no-repeat 0 0;
    background-size: 100% auto;
    z-index: 2;
    .logo {
      position: absolute;
      top: 18px;
      left: 54px;
      width: 70px;
      z-index: 1;
    }
    .info {
      overflow: hidden;
      width: 600px;
      li {
        position: relative;
        display: table;
        float: left;
        height: 64px;
        & + li {
          margin-left: 24px;
        }
        & > * {
          display: table-cell;
          vertical-align: middle;
        }
        &.name {
          padding: 0 50px 0 90px;
          border: 2px solid #c7ecff;
          border-radius: 32px;
          cursor: pointer;
          img,
          .face-default {
            position: absolute;
            top: 3px;
            left: 4px;
            width: 54px;
            border-radius: 100%;
          }
          .face-default {
            display: block;
            height: 54px;
            background: #e6e6e6 url('~@/assets/images/common/ico_baby.svg')
              no-repeat center center;
            background-size: 40px auto;
          }
        }
        &.char {
          .img {
            width: 64px;
            // background: url('~@/assets/images/header/char/01.svg') no-repeat center center;
            background: url('~@/assets/images/main/puzzle/puzzle_main_clear.svg')
              no-repeat 0 0;
            background-size: 340px auto;
            &.img0 {
              background-position: 0 0;
            }
            &.img1 {
              background-position: -68px 0;
            }
            &.img2 {
              background-position: -68px * 2 0;
            }
            &.img3 {
              background-position: -68px * 3 0;
            }
            &.img4 {
              background-position: -68px * 4 0;
            }
            &.img5 {
              background-position: 0 -68px;
            }
            &.img6 {
              background-position: -68px -68px;
            }
            &.img7 {
              background-position: -68px * 2 -68px;
            }
            &.img8 {
              background-position: -68px * 3 -68px;
            }
            &.img9 {
              background-position: -68px * 4 -68px;
            }
            &.img10 {
              background-position: 0 -68px * 2;
            }
            &.img11 {
              background-position: -68px -68px * 2;
            }
            &.img12 {
              background-position: -68px * 2 -68px * 2;
            }
            &.img13 {
              background-position: -68px * 3 -68px * 2;
            }
            &.img14 {
              background-position: -68px * 4 -68px * 2;
            }
          }
          .chat {
            width: 159px;
            padding-left: 10px;
            background: url('~@/assets/images/header/bg_speech.svg') no-repeat
              right center;
            text-align: center;
          }
        }
      }
    }
    .menu {
      position: absolute;
      top: 0;
      right: 29px;
      width: 436px;
      z-index: 1;
      li {
        position: relative;
        float: left;
        width: 94px;
        height: 116px;
        padding-top: 1px;
        border-radius: 0 0 52px 52px;
        font-size: 16px;
        font-weight: 200;
        text-align: center;
        color: $color9;
        cursor: pointer;
        transition: all 0.3s ease 0s;
        -webkit-transition: all 0.3s ease 0s;
        & + li {
          margin-left: 20px;
        }
        & > * {
          position: absolute;
          display: block;
          text-align: center;
        }
        &.active {
          @include boxShadow(6px, 0.6);
        }
        .name {
          top: 10px;
          left: 0;
          width: 100%;
        }
        .ico {
          top: 37px;
          left: 15px;
          width: 64px;
          height: 64px;
        }
        &.oneday {
          .ico {
            background: url('~@/assets/images/header/ico_oneday_off.svg')
              no-repeat center 1px;
          }
          &.active {
            background: #00b5f2;
            color: $colorF;
            .ico {
              background: url('~@/assets/images/header/ico_oneday_on.svg')
                no-repeat center center;
            }
          }
        }
        &.card {
          .ico {
            background: url('~@/assets/images/header/ico_card_off.svg')
              no-repeat center 1px;
          }
          &.active {
            background: #9a73ff;
            color: $colorF;
            .ico {
              background: url('~@/assets/images/header/ico_card_on.svg')
                no-repeat center center;
            }
          }
        }
        &.mypet {
          .ico {
            background: url('~@/assets/images/header/ico_puzzle_off.svg')
              no-repeat center 1px;
          }
          &.active {
            background: #ffb612;
            color: $colorF;
            .ico {
              background: url('~@/assets/images/header/ico_puzzle_on.svg')
                no-repeat center center;
            }
          }
        }
        &.parent {
          .ico {
            background: url('~@/assets/images/header/ico_parent_off.svg')
              no-repeat center 1px;
          }
          &.active {
            background: #c7ecff;
            color: #50acdb;
            .ico {
              background: url('~@/assets/images/header/ico_parent_on.svg')
                no-repeat center center;
            }
          }
        }
      }
    }
  }
  .swiper-wrap {
    .main-swiper {
      margin-top: -42px;
    }
  }
  .certificate {
    position: fixed;
    top: -10px;
    left: 0;
    width: 100%;
    height: calc(100% + 20px);
    background: rgba(0, 0, 0, 0.6);
    z-index: 100;
    > img {
      position: absolute;
    }
    > button {
      position: absolute;
      top: 40px;
      right: 40px;
      width: 70px;
      height: 70px;
      background: url('~@/assets/images/main/oneday/close_btn.png') no-repeat;
      z-index: 80;
    }
    .pollen,
    .certificateBg {
      position: absolute;
      transform: scale(0);
      transform-origin: center center;
    }
    .pollen {
      top: 34px;
      left: 47px;
      animation: pollenMotion forwards 0.5s;
    }
    .certificateBg {
      top: 50px;
      left: 116px;
      width: 1050px;
      height: 620px;
      background: url('~@/assets/images/main/oneday/certificate.png') no-repeat;
      animation: pollenMotion forwards 1s 1s;
    }
    .balloon {
      margin-top: 800px;
      z-index: 90;
      opacity: 0;
      animation: balloonMotion forwards 1s;
    }
    .stamp {
      top: 336px;
      left: 204px;
      animation: balloonMotion forwards 0.5s 3s;
    }
    .medal {
      top: 514px;
      left: 766px;
      animation: balloonMotion forwards 0.5s 4s;
    }
    .stamp,
    .medal {
      position: absolute;
      transform: scale(2);
      transform-origin: center center;
      z-index: 99;
      opacity: 0;
    }
  }
  .userName,
  .date {
    overflow: hidden;
    display: block;
    position: absolute;
    width: 0;
    z-index: 100;
    white-space: nowrap;
    text-align: center;
  }
  .userName {
    top: 250px;
    left: 450px;
    height: 70px;
    font-family: 'TmoneyRoundWind';
    font-size: 50px;
    font-weight: 800;
    animation: userName forwards 1s 2s;
  }
  .date {
    top: 550px;
    left: 450px;
    height: 40px;
    font-family: 'NotoSansCJKkr';
    font-size: 26px;
    font-weight: normal;
    animation: userName forwards 1s 3s;
  }
  @keyframes userName {
    100% {
      width: 380px;
    }
  }
  @keyframes pollenMotion {
    100% {
      transform: scale(1);
    }
  }
  @keyframes balloonMotion {
    100% {
      margin-top: 0;
      opacity: 1;
      transform: scale(1);
    }
  }
}
</style>
