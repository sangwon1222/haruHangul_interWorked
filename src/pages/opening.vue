<template>
  <div class="wrap-opening" :class="{ step5: swiperIndex === 4 }">
    <button v-if="swiperIndex !== 4" class="btn-next" @click="nextSlide">
      넘어가기
    </button>
    <swiper
      ref="swiperOpening"
      class="swiper"
      :options="swiperOption"
      @slideChangeTransitionStart="callback"
      @slideChangeTransitionEnd="callback"
    >
      <swiper-slide class="step01">
        <dl>
          <dt class="tit">
            하루에 한 글자씩
            <h2><img src="@/assets/images/common/txt_hangul.svg" /></h2>
          </dt>
          <dd class="txt">
            하루에 한 자씩 꾸준히 활동하면 어느새 한글이 술술~<br />
            ㅏ, ㅑ, ㅓ, ㅕ 모음부터 받침 있는 글자까지 체계적으로 배워나가요!
          </dd>
        </dl>
      </swiper-slide>
      <swiper-slide class="step02">
        <dl>
          <dt class="tit">
            하루 하루 진도를 체크하는
            <h2>한글 카드</h2>
          </dt>
          <dd class="txt">
            하루 한글 진도를 한글 카드로 볼 수 있어요.<br />
            배운 음소 및 낱말을 카드로 보며 부모님과 함께 한글 퀴즈 놀이도 해
            보아요.
          </dd>
        </dl>
      </swiper-slide>
      <swiper-slide class="step03">
        <dl>
          <dt class="tit">
            재미있는 맞춰보는
            <h2>그림 퍼즐</h2>
          </dt>
          <dd class="txt">
            하루 한글을 하다 보면 그림 퍼즐을 얻을 수 있어요.<br />
            하루와 바루의 여러 모습을 퍼즐로 맞춰 보아요.
          </dd>
        </dl>
      </swiper-slide>
      <swiper-slide class="step04"
        ><dl>
          <dt class="tit">
            아이의 활동을 한눈에 보는
            <h2>활동 리포트</h2>
          </dt>
          <dd class="txt">
            내 아이가 얼마나 많은 한글을 접했는지 영역별 활동은 잘 하고 있는지
            등<br />여러 내용을 리포트로 확인 할 수 있어요!
          </dd>
        </dl>
      </swiper-slide>
      <swiper-slide class="step05">
        <h2 style="margin-top: 70px;">사용 시간 설정</h2>
        <div
          class="time-box"
          @pointerdown="offSwiper"
          @pointerup="onSwiper"
          @pointerleave="onSwiper"
        >
          <!-- <div v-if="!noLimit" class="txt"> -->
          <div v-if="!limitPlay" class="txt">
            <i class="ico" />
            <span class="num">{{ time }}</span>
            <span class="min">분</span>
          </div>
          <!-- <div v-if="!noLimit" class="slider"> -->
          <div v-if="!limitPlay" class="slider">
            <button ref="silderBar" class="bar" />
            <div ref="silderFill" class="fill" />
            <input
              ref="slider"
              v-model="time"
              type="range"
              value="0"
              min="0"
              max="150"
            />
          </div>
          <!-- <div v-if="!noLimit" class="txt-limit"> -->
          <div v-if="!limitPlay" class="txt-limit">
            <p class="min">5분</p>
            <p class="max">150분</p>
          </div>
          <!-- <div v-if="noLimit" class="no-limit"> -->
          <div v-if="limitPlay" class="no-limit">
            <i class="ico" /><span>무제한</span>
          </div>
          <div class="limit-check">
            <input id="limitCheck" v-model="limitPlay" type="checkbox" />
            <label for="limitCheck">제한 없음</label>
          </div>
        </div>
        <ul class="notice">
          <li>오래 사용하지 않도록 자녀와 사용 시간을 약속해 주세요.</li>
          <li>시간이 다 되면 활동을 할 수 없습니다.</li>
          <li>사용 시간은 부모님 메뉴에서 수정 가능합니다.</li>
        </ul>
        <button class="btn-start" @click="hangulStart">
          시작
        </button>
        <ol class="pagination">
          <li v-for="(num, index) in 5" :key="index" />
        </ol>
      </swiper-slide>
      <!-- <div class="swiper-pagination" /> -->
    </swiper>
    <ol class="pagination">
      <li
        v-for="(num, index) in 5"
        :key="index"
        :class="{ active: swiperIndex === index }"
      />
    </ol>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import '@/assets/css/swiper.css'

export default {
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      per: 59 / 15,
      time: 5,
      limitPlay: false,
      swiperIndex: 0,
      swiperOption: {
        initialSlide: 0
      }
    }
  },
  created() {
    //
  },
  watch: {
    limitPlay() {
      this.time = 5
    },
    time() {
      this.time = this.time - (this.time % 5)

      if (this.time == 0) {
        this.time = 5
      }

      this.$refs.silderBar.setAttribute(
        'style',
        `left:${this.per * this.time}px`
      )
      this.$refs.silderFill.setAttribute(
        'style',
        `width:${this.per * this.time}px`
      )
    }
  },
  methods: {
    callback() {
      this.swiperIndex = this.$refs.swiperOpening.swiper.snapIndex
    },
    nextSlide() {
      if (window['clickSnd']) {
        window['clickSnd'].stop()
        window['clickSnd'].play()
      }
      this.$refs.swiperOpening.swiper.slideTo(this.swiperIndex + 1, 300)
    },
    offSwiper() {
      this.$refs.swiperOpening.swiper.allowClick = false
      this.$refs.swiperOpening.swiper.allowTouchMove = false
    },
    onSwiper() {
      this.$refs.swiperOpening.swiper.allowClick = true
      this.$refs.swiperOpening.swiper.allowTouchMove = true
    },
    async hangulStart() {
      if (window['clickSnd']) {
        window['clickSnd'].stop()
        window['clickSnd'].play()
      }

      if (this.limitPlay == true) {
        this.time = 5
      }
      if (this.time % 5 == 0) {
        try {
          await this.$axios.put('/learning/child/settings/time', {
            isNonLimitToPlay: this.limitPlay,
            playPosbTime: this.time * 60
          })
        } catch (error) {
          alert('학습시간은 5분 미만으로 설정할 수 없습니다.')
        }
      }
      this.$router.push({
        name: `main`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-opening {
  width: 100%;
  height: 100%;
  background: url('~@/assets/images/opening/bg_opening.svg') no-repeat 0 0;
  background-size: 100% auto;
  text-align: center;
  &.step4 {
    background: #a8eaff;
  }
  .btn-next {
    position: fixed;
    bottom: 40px;
    right: 30px;
    width: 230px;
    height: 80px;
    background: #34cc67;
    border-radius: 40px;
    font-family: 'tmoney-bold';
    font-size: 36px;
    line-height: 80px;
    color: $colorF;
    z-index: 2;
  }
  .swiper-container {
    height: 100%;
    .swiper-wrapper {
      .swiper-slide:not(:last-child) {
        font-size: 36px;
        line-height: 54px;
        .tit {
          margin-top: 100px;
          font-family: 'tmoney-bold';
        }
      }
      .step01 {
        h2 {
          margin-top: 19px;
        }
        .txt {
          margin-top: 66px;
        }
      }
      .step02 {
        .tit {
          height: 140px;
          h2 {
            margin-top: 20px;
            font-size: 74px;
            line-height: 68px;
            color: #9a73ff;
          }
        }
        .txt {
          margin-top: 72px;
        }
      }
      .step03 {
        .tit {
          height: 140px;
          h2 {
            margin-top: 20px;
            font-size: 74px;
            line-height: 68px;
            color: #fba000;
          }
        }
        .txt {
          margin-top: 72px;
        }
      }
      .step04 {
        .tit {
          height: 140px;
          h2 {
            margin-top: 20px;
            font-size: 74px;
            line-height: 68px;
            color: #00aaed;
          }
        }
        .txt {
          margin-top: 72px;
        }
      }
      .step05 {
        position: relative;
        width: 100%;
        height: 100%;
        background: url('~@/assets/images/opening/bg_timer.svg') no-repeat 0 0;
        text-align: center;
        & > *:not(.pagination) {
          width: 920px;
          margin: 0 auto;
        }
        h2 {
          font-family: 'tmoney-bold';
          font-size: 56px;
          color: #3d4459;
        }
        .ico {
          display: inline-block;
          width: 63px;
          height: 50px;
          background: url('~@/assets/images/opening/ico_timer.svg') no-repeat 0
            center;
        }
        .time-box {
          overflow: hidden;
          height: 300px;
          margin-top: 56px;
          .txt {
            display: table;
            width: 293px;
            margin: 42px auto 30px;
            & > * {
              display: table-cell;
              vertical-align: middle;
            }
            .num {
              display: block;
              width: 180px;
              height: 70px;
              border: 1px solid #50acdb;
              border-radius: 35px;
              background: $colorF;
              font-family: 'tmoney-bold';
              font-size: 60px;
              line-height: 67px;
              color: #ff4747;
            }
            .min {
              padding-left: 15px;
              font-size: 36px;
            }
          }
          .slider {
            position: relative;
            width: 590px;
            height: 40px;
            margin: 25px auto 0;
            &::before {
              position: absolute;
              top: 14px;
              left: 0;
              content: '';
              display: block;
              width: 100%;
              height: 10px;
              background: #cfcfcf;
              border-radius: 50px;
              z-index: 1;
            }
            & > * {
              position: absolute;
            }
            .fill {
              top: 14px;
              left: 0;
              width: 0;
              height: 10px;
              background: #00aaed;
              border-radius: 50px;
              z-index: 2;
            }
            .bar {
              @include boxShadow(4px, 1);
              top: -1px;
              left: 0;
              width: 40px;
              height: 40px;
              margin-left: -20px;
              border-radius: 100%;
              background: #00aaed;
              transition: none;
              -webkit-transition: none;
              z-index: 3;
            }
            input[type='range'] {
              -webkit-appearance: none;
              height: 25px;
              top: 5px;
              left: 0;
              width: 590px;
              cursor: pointer;
              opacity: 0;
              z-index: 4;
              &::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 25px;
                height: 25px;
                background: #4caf50;
                cursor: pointer;
              }
              &::-moz-range-thumb {
                width: 25px;
                height: 25px;
                background: #4caf50;
                cursor: pointer;
              }
            }
          }
          .txt-limit {
            overflow: hidden;
            width: 590px;
            margin: 11px auto 0;
            font-size: 30px;
            font-weight: 500;
            color: $color3;
            .min {
              float: left;
            }
            .max {
              float: right;
            }
          }
          .no-limit {
            display: table;
            margin: 90px auto 65px;
            font-family: 'tmoney-bold';
            font-size: 60px;
            text-align: center;
            color: #ff4747;
            & > * {
              display: table-cell;
              vertical-align: middle;
            }
          }
          .limit-check {
            clear: both;
            font-size: 26px;
            font-weight: 500;
            color: $color3;
            input {
              overflow: hidden;
              position: relative;
              width: 40px;
              height: 40px;
              margin: -3px 16px 0 0;
              &:checked:before {
                content: '✔';
                display: block;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 60px;
                height: 60px;
                background-color: #00aaed !important;
                font-size: 34px;
                text-align: center;
                line-height: 60px;
                color: #fff;
              }
            }
          }
        }
        .notice {
          margin-top: 26px;
          font-size: 24px;
          text-align: left;
          line-height: 32px;
          color: #316b88;
          li {
            padding-left: 38px;
            background: url('~@/assets/images/opening/ico_exclam.svg') no-repeat
              left center;
          }
        }
        .btn-start {
          position: absolute;
          bottom: 40px;
          right: 30px;
          width: 230px;
          height: 80px;
          background: #ff4747;
          border-radius: 40px;
          font-family: 'tmoney-bold';
          font-size: 36px;
          color: $colorF;
          z-index: 2;
        }
        .pagination {
          li {
            background: #6bd2f8;
            &:last-child {
              background: $colorF;
            }
          }
        }
      }
    }
  }
  .pagination {
    position: absolute;
    left: 0;
    bottom: 40px;
    width: 100%;
    text-align: center;
    li {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: #7ed622;
      border-radius: 100%;
      &.active {
        background: $colorF;
      }
      & + li {
        margin-left: 60px;
      }
    }
  }
}
</style>
