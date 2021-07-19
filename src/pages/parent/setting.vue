<template>
  <div class="wrap-setting">
    <timerCheck />
    <h3>설정</h3>
    <p class="txt-balloon">
      약속한 사용 시간을 설정해요.<br />
      “제한 없음”은 시간 설정을 하지 않아요.<br />
      시간이 다 되면 진행 중인 활동이 끝난 뒤<br />
      시간 완료 안내를 합니다.
    </p>
    <div class="timer">
      <h4>시간 설정</h4>
      <!-- <button class="btn-question active">?</button> -->
      <div v-if="!limitPlay" class="txt-time">
        <i class="ico" style="float: left;" />
        <span class="num" :class="{ disable: limitPlay }">{{ time }}</span
        >분
      </div>
      <div v-if="!limitPlay" class="slider">
        <button ref="silderBar" class="bar" :class="{ disable: limitPlay }" />
        <div ref="silderFill" class="fill" :class="{ disable: limitPlay }" />
        <input
          ref="slider"
          v-model="time"
          type="range"
          value="0"
          min="0"
          max="150"
        />
      </div>
      <div class="txt-limit">
        <p v-if="!limitPlay" class="min">5분</p>
        <p v-if="!limitPlay" class="max">150분</p>
        <div class="no-linit-text" v-if="limitPlay">
          <i class="ico" /><span>무제한</span>
        </div>
        <div class="no-limit">
          <input
            id="limitCheck"
            v-model="limitPlay"
            type="checkbox"
            @click="limitToggle()"
          />
          <label for="limitCheck"> 제한 없음 </label>
        </div>
        <p class="txt-apply">시간 변경 시 메인으로 이동합니다.</p>
        <button class="btn-apply" @click="timeUpdate()">적용하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import timerCheck from '@/components/timer'
export default {
  components: {
    timerCheck
  },
  data() {
    return {
      per: 59 / 15,
      time: 0,
      limitPlay: false
    }
  },
  computed: {
    ...mapState({
      isLimitToPlay: (state) => state.parentPage.userInfo.isLimitToPlay,
      playStgupTime: (state) => state.parentPage.userInfo.playStgupTime,
      playPosbTime: (state) => state.parentPage.userInfo.playPosbTime
    })
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
  mounted() {
    const rest = this.playStgupTime % 5
    if (rest == 0) {
      this.time = Number.parseInt(this.playStgupTime / 60)
    } else {
      this.time = Number.parseInt((this.playStgupTime - rest) / 60)
    }
    this.limitPlay = this.isLimitToPlay
  },
  async beforeDestroy() {
    // console.error(this.limitPlay)
  },
  methods: {
    ...mapActions('popup', ['alertPopupOpen']),
    async limitToggle() {
      this.limitPlay = !this.limitPlay
    },
    async timeUpdate() {
      if (this.time % 5 == 0) {
        try {
          await this.$axios.put('/learning/child/settings/time', {
            isNonLimitToPlay: this.limitPlay,
            playPosbTime: this.time * 60
          })
          // console.error(this.limitPlay)
          this.$router.push({
            name: `main`,
            params: {
              timeUpdate: true
            }
          })
        } catch (error) {
          // console.error(error)
          alert('학습시간은 5분 미만으로 설정할 수 없습니다.')
          // this.alertPopupOpen('time')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$disableColor: #a7a7a7;
.wrap-setting {
  position: relative;
  height: 100%;
  background: url('~@/assets/images/main/parent/img_setting_balloon.svg')
    no-repeat right 216px;
  font-weight: 500;
  h3 {
    background: url('~@/assets/images/main/parent/ico_tit_setting.svg')
      no-repeat 0 5px;
    background-size: 28px;
    padding-left: 34px;
    font-weight: 500;
    vertical-align: bottom;
    color: $color3;
    span {
      display: inline-block;
      padding-left: 8px;
      font-size: 18px;
      font-weight: 400;
      color: $color9;
    }
  }
  .txt-balloon {
    position: absolute;
    top: 235px;
    right: 15px;
    font-size: 18px;
    font-weight: 400;
    text-align: center;
    line-height: 34px;
    color: $color6;
  }
}
.timer {
  position: relative;
  width: 590px;
  margin-top: 25px;
  text-align: center;
  h4 {
    width: 124px;
    height: 46px;
    background: #9a73ff;
    border-radius: 0 20px 20px 22px;
    font-weight: 400;
    text-align: center;
    line-height: 42px;
    color: $colorF;
  }
  .btn-question {
    position: absolute;
    width: 42px;
    height: 42px;
    top: 2px;
    left: 136px;
    background: $colorB;
    border-radius: 100%;
    font-family: 'tmoney-bold';
    font-size: 26px;
    color: $colorF;
    &.active {
      background: #50acdb;
    }
  }
  .txt-time {
    position: absolute;
    top: 8px;
    right: 0;
    font-size: 28px;
    font-weight: 500;
    color: $color3;
    line-height: 54px;
    .num {
      float: left;
      /* display: inline-block; */
      margin-top: 4px;
      width: 110px;
      height: 50px;
      border: 1px solid #50acdb;
      border-radius: 25px;
      margin-right: 8px;
      font-family: 'tmoney-bold';
      font-size: 30px;
      text-align: center;
      line-height: 46px;
      color: #ff4747;
      &.disable {
        color: $disableColor;
      }
    }
  }
  .slider {
    position: relative;
    width: 590px;
    height: 40px;
    margin-top: 25px;
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
      background: #9a73ff;
      border-radius: 50px;
      z-index: 2;
      &.disable {
        background: $disableColor;
      }
    }
    .bar {
      @include boxShadow(4px, 1);
      top: -1px;
      left: 0;
      width: 40px;
      height: 40px;
      margin-left: -20px;
      border-radius: 100%;
      background: #9a73ff;
      transition: none;
      -webkit-transition: none;
      z-index: 3;
      &.disable {
        background: $disableColor;
      }
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
    font-size: 24px;
    color: $color6;
    .min {
      float: left;
    }
    .max {
      float: right;
    }
    .no-linit-text {
      display: table;
      margin: 26px auto;
      font-family: 'tmoney-bold';
      font-size: 36px;
      text-align: center;
      color: #ff4747;

      & > * {
        display: table-cell;
        vertical-align: middle;
      }
    }
    .no-limit {
      clear: both;
      padding-top: 26px;
      font-size: 20px;
      text-align: left;
      color: $color3;
      /* input {
        width: 40px;
        height: 40px;
        border: 1px solid $color9;
        margin-right: 10px;
      } */
      input {
        overflow: hidden;
        position: relative;
        width: 40px;
        height: 40px;
        margin: 0 10px 0 0;
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

    .btn-apply {
      width: 230px;
      height: 70px;
      background: #ff4747;
      border-radius: 35px;
      margin: 0 auto;
      font-family: 'tmoney-bold';
      font-size: 36px;
      color: $colorF;
    }
    .txt-apply {
      width: 360px;
      padding-top: 50px;
      margin: 40px auto 30px;
      background: url('~@/assets/images/main/parent/btn_warning.svg') no-repeat
        center top;
      margin: 42px center 30px;
      font-family: 'tmoney-regular';
      font-size: 22px;
      text-align: center;
      color: $color6;
    }
  }

  .ico {
    display: inline-block;
    width: 63px;
    height: 50px;
    background: url('~@/assets/images/opening/ico_timer.svg') no-repeat 0 center;
  }
}
</style>
