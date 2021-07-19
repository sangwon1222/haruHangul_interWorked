<template>
  <div class="profile-popup">
    <button class="btn-close" @click="popupClose()" />
    <div class="popup-cell">
      <div class="popup-wrap">
        <h2>프로필</h2>
        <div class="info">
          <ul>
            <li><span class="tit">이름</span>{{ name }}</li>
            <li><span class="tit">하루 한글</span>{{ dayOfStudy }}일차</li>
          </ul>
          <div v-if="face !== ''" class="thume">
            <img src="" alt="" />
          </div>
          <div v-else class="thume default" />
        </div>
        <div class="timer">
          <span class="time" v-if="!this.isLimitToPlay"
            >{{ clock }}:{{ minute }}:{{ second }}</span
          >
          <span class="time" v-if="this.isLimitToPlay"> 무제한 </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: {
    name: {
      type: String,
      default: '하루한글'
    },
    face: {
      type: String,
      default: null
    },
    dayOfStudy: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      clock: '00',
      minute: '00',
      second: '00',
      playPsTime: 0
    }
  },
  computed: {
    ...mapState({
      saveTime: (state) => state.timer.saveTime,
      isLimitToPlay: (state) => state.parentPage.userInfo.isLimitToPlay
    })
  },
  watch: {
    saveTime() {
      this.timeStart()
    }
  },
  async created() {
    this.timeStart()
  },
  methods: {
    popupClose() {
      this.$emit('popupClose')
    },
    ...mapActions('timer', ['timeSave']),
    timeStart() {
      clearInterval(this.setTime)
      if (this.isLimitToPlay == true) {
        return
      }
      if (this.saveTime == 'limit') {
        this.second = '00'
        this.minute = '00'
        this.clock = '00'
        return
      }
      this.playPsTime = this.saveTime
      // console.log('가져온 시간', this.playPsTime)

      this.second = `${this.playPsTime % 60}`
      if (this.second.length == 1) {
        this.second = `0${this.second}`
      }

      this.minute = `${Math.floor(this.playPsTime / 60)}`
      if (this.minute.length == 3) {
        this.minute = this.minute % 60
        this.minute = `${this.minute}`
      }
      if (this.minute.length == 1) {
        this.minute = `0${this.minute}`
      }

      const m = Math.floor(this.playPsTime / 60)
      if (m > 60) {
        this.clock = `${Math.floor(m / 60)}`
      } else {
        this.clock = '00'
      }
      if (this.clock.length == 1) {
        this.clock = `0${Math.floor(m / 60)}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-popup {
  position: absolute;
  top: -0.1%;
  left: -0.1%;
  // top: 0;
  // left: 0;
  display: table;
  width: 100.2%;
  height: 100.2%;
  // width: 1280px;
  // height: 720px;
  background: rgba(0, 0, 0, 0.8);
  font-family: 'tmoney-bold';
  z-index: 100;
  .btn-close {
    position: fixed;
    top: 40px;
    right: 40px;
    width: 68px;
    height: 68px;
    background: url('~@/assets/images/main/card/btn_close.png');
    z-index: 101;
  }
  .popup-cell {
    overflow: hidden;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    .popup-wrap {
      overflow: hidden;
      width: 758px;
      height: 568px;
      background: url('~@/assets/images/common/bg_profile.svg');
      margin: 0 auto;
      padding: 0 40px;
      border-radius: 30px;
      h2 {
        margin: 46px 20px 0 0;
        text-align: right;
        color: #00b4f2;
      }
      .info,
      .timer {
        background: $colorF;
        border-radius: 24px;
      }
      .info {
        overflow: hidden;
        padding: 25px 30px;
        margin: 30px 0;
        font-size: 32px;
        text-align: left;
        color: $color3;
        ul {
          float: left;
          margin: 11px 0;
          li {
            & + li {
              margin-top: 21px;
            }
            .tit {
              display: inline-block;
              width: 163px;
              font-family: 'tmoney-regular';
              color: $color9;
            }
          }
        }
        .thume {
          float: right;
          width: 190px;
          height: 190px;
          border-radius: 18px;
          &.default {
            background: #e6e6e6 url('~@/assets/images/common/ico_baby.svg')
              no-repeat center center;
          }
        }
      }
      .timer {
        overflow: hidden;
        height: 120px;
        padding: 0 30px;
        .tit {
          float: left;
          font-family: 'tmoney-regular';
          font-size: 32px;
          line-height: 120px;
          color: $color9;
        }
        .time {
          float: right;
          padding-left: 66px;
          background: url('~@/assets/images/common/ico_clock.svg') no-repeat
            left center;
          font-size: 50px;
          line-height: 120px;
          color: #ff4747;
        }
      }
    }
  }
}
</style>
