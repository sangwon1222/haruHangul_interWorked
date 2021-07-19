<template>
  <div v-if="playPsTime === 'limit'" class="play-end-popup">
    <!-- <button class="btn-close" @click="alertPopupClose()" /> -->
    <div class="popup-cell">
      <div class="popup-wrap">
        <div v-if="agree" ref="startTest" class="start-test">
          <h2>부모님</h2>
          <div class="calc">
            <div class="question">{{ random01 }} X {{ random02 }}</div>
            <div class="result">
              {{ result01 }}
              {{ result02 }}
            </div>
          </div>
          <ul class="number">
            <li
              v-for="(num, index) in 9"
              :key="index"
              @click="resultAdd(index + 1)"
            >
              {{ num }}
            </li>
            <li class="btn-zero" @click="resultAdd(0)">0</li>
            <li class="btn-del" @click="resultDel()">X</li>
          </ul>
        </div>
        <div v-else class="notice">
          <p class="txt-end">
            활동 시간이 모두 끝났어요.<br />
            오늘은 이만 활동을 마무리하고<br />
            우리 내일 다시 만나요.<br />
            안녕!
          </p>
          <ul>
            <li><button @click="hanEnd()">종료 하기</button></li>
            <li><button @click="agree = true">계속 하기</button></li>
          </ul>
          <p class="txt-agree">(계속 하기는 부모님 동의가 필요합니다.)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/activity/gameUtil/config'
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      playPsTime: 0,
      agree: false,
      random01: Math.floor(Math.random() * 6 + 4),
      random02: Math.floor(Math.random() * 6 + 4),
      result01: '',
      result02: '',
      setTime: {},
      saveTime: 0
    }
  },
  computed: {
    ...mapState({
      // saveTime: (state) => state.timer.saveTime,
      isLimitToPlay: (state) => state.parentPage.userInfo.isLimitToPlay
    })
  },
  watch: {
    saveTime() {
      this.timeStart()
    }
  },
  async created() {
    const token = localStorage.getItem('token')

    const user = await this.$axios.get(
      `${config.restAPI}/learning/hangul/user`,
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    )
    this.saveTime = user.data.result.playPosbTime
    await this.timeStart()
  },
  beforeDestroy() {
    clearInterval(this.setTime)
  },
  methods: {
    ...mapActions('timer', ['timeSave']),
    async timeReset() {
      try {
        const { data } = await this.$axios.post('/learning/parents/reset/time')
        // const { data } = await this.$axios.put(
        //   '/learning/child/settings/time',
        //   { isNonLimitToPlay: false, playPosbTime: 300 }
        // )
      } catch (error) {
        // console.error(error)
      }
    },
    async timeUpdate() {
      try {
        await this.$axios.post('/learning/child/time/remained', {
          remainedTime: this.playPsTime
        })
        // console.log('data', this.playPsTime)
      } catch (error) {
        // console.error(error)
      }
    },
    timeStart() {
      clearInterval(this.setTime)

      this.playPsTime = this.saveTime

      if (this.playPsTime > 0) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _this = this
        this.setTime = setInterval(function() {
          _this.timeout()
        }, 1000)
      } else {
        // console.log('이용시간 부족')
        // console.log('playPsTime', this.playPsTime)
        this.playPsTime = 'limit'
      }
    },
    timeout() {
      if (this.isLimitToPlay == true) {
        return
      }
      if (this.playPsTime > 0) {
        this.playPsTime -= 1

        if (Number.isInteger(this.playPsTime / 10)) {
          this.timeUpdate()
        }

        if (this.playPsTime <= 0) {
          // console.log('클리어 인터벌')
          clearInterval(this.setTime)
          this.playPsTime = 'limit'
          this.timeSave('limit')
          if (this.$route.name !== 'main') {
            this.$router.push({
              name: `main`
            })
          }
        } else {
          this.timeSave(this.playPsTime)
        }
      }
      // // console.log('this.playPsTime', this.playPsTime)
    },
    async resultAdd(num) {
      if (this.result01 === '') {
        this.$refs.startTest.classList.remove('error')
        this.result01 = num
      } else {
        this.result02 = num
        const result = ('' + this.result01 + this.result02) * 1

        if (result === this.random01 * this.random02) {
          // console.log('정답')
          await this.timeSave('reset')
          await this.timeReset()
          location.reload()
        } else {
          // console.log('오답')
          this.result01 = this.result02 = ''
          this.$refs.startTest.classList.add('error')
        }
      }
    },
    hanEnd() {
      this.$router.push('/')
      location.reload()
    },
    resultDel() {
      if (this.result02 !== '') {
        this.result02 = ''
      } else {
        this.result01 = ''
      }
    }
    // timesave() {
    //   this.timeSave(this.playPsTime)
    // }
  }
}
</script>
<style lang="scss" scoped>
.play-end-popup {
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
      .notice {
        width: 918px;
        height: 518px;
        background: url('~@/assets/images/common/bg_play_end.svg') no-repeat 0 0;
        padding: 50px 60px;
        margin: 0 auto;
        border-radius: 30px;
        .txt-end {
          font-size: 36px;
          line-height: 54px;
          text-align: left;
          color: $color3;
        }
        .txt-agree {
          margin-top: 17px;
          font-family: $mainFont;
          font-size: 24px;
          text-align: left;
          color: $color6;
        }
        ul {
          margin-top: 58px;
          text-align: left;
          li {
            display: inline-block;
            background-color: #ff4747;
            border-radius: 35px;
            & + li {
              margin-left: 30px;
              background-color: $color9;
            }
            button {
              width: 230px;
              height: 70px;
              font-family: 'tmoney-bold';
              font-size: 36px;
              color: $colorF;
            }
          }
        }
      }
      .start-test {
        position: fixed;
        top: 166px;
        left: 298px;
        width: 684px;
        height: 450px;
        background: $colorF;
        border-radius: 20px;
        font-family: 'BPreplay-bold';
        z-index: 1;
        h2 {
          position: absolute;
          top: -52px;
          left: 155px;
          width: 377px;
          height: 86px;
          padding-top: 5px;
          background: url('~@/assets/images/main/parent/ico_ribbon.svg')
            no-repeat 0 0;
          font-size: 34px;
          text-align: center;
          color: $colorF;
          z-index: 2;
        }
        .calc {
          float: left;
          width: 294px;
          height: 100%;
          background-color: #c7ecff;
          border-radius: 20px 0 0 20px;
          .question {
            margin-top: 160px;
            font-size: 48px;
            text-align: center;
          }
          input {
            margin-top: 25px;
            text-align: center;
          }
          .result {
            width: 218px;
            height: 78px;
            margin: 25px auto 0;
            border: 4px solid #97daff;
            border-radius: 40px;
            background: $colorF;
            font-size: 47px;
            text-align: center;
            line-height: 70px;
            letter-spacing: -6px;
            color: #ff4747;
          }
        }
        .number {
          overflow: hidden;
          padding: 50px 25px 33px;
          margin-left: 294px;
          li {
            float: left;
            width: 99px;
            height: 78px;
            margin: 7px;
            border: 2px solid #e5e5e5;
            border-radius: 10px;
            font-family: 'BPreplay-bold';
            font-size: 41px;
            text-align: center;
            line-height: 76px;
            color: #626e74;
            cursor: pointer;
            &.btn-zero {
              width: 212px;
            }
            &.btn-del {
              background: url('~@/assets/images/main/parent/bg_reset.svg')
                no-repeat center center;
              padding-left: 10px;
              font-size: 17px;
              line-height: 76px;
            }
          }
        }
        &.error {
          animation-name: shake;
          animation-duration: 0.1s;
          animation-duration: leaner;
          animation-iteration-count: 4;

          @keyframes shake {
            0% {
              left: 298px;
            }
            25% {
              left: 293px;
            }
            50% {
              left: 298px;
            }
            75% {
              left: 303px;
            }
            100% {
              left: 298px;
            }
          }
        }
      }
    }
  }
}
</style>
