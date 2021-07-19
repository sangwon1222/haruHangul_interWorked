<template>
  <div>
    <div class="parent-popup">
      <button class="btn-close" @click="popupClose()" />
      <div ref="startTest" class="start-test">
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      random01: Math.floor(Math.random() * 6 + 4),
      random02: Math.floor(Math.random() * 6 + 4),
      result01: '',
      result02: ''
    }
  },
  methods: {
    resultAdd(num) {
      if (this.result01 === '') {
        this.$refs.startTest.classList.remove('error')
        this.result01 = num
      } else {
        this.result02 = num
        const result = ('' + this.result01 + this.result02) * 1

        if (result === this.random01 * this.random02) {
          // console.log('정답')
          this.$router.push({
            name: `parentPlay`
          })
        } else {
          // console.log('오답')
          this.result01 = this.result02 = ''
          this.$refs.startTest.classList.add('error')
        }
      }
    },
    resultDel() {
      if (this.result02 !== '') {
        this.result02 = ''
      } else {
        this.result01 = ''
      }
    },
    popupClose() {
      this.$emit('popupClose')
    }
  }
}
</script>

<style lang="scss" scoped>
.parent-popup {
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
      background: url('~@/assets/images/main/parent/ico_ribbon.svg') no-repeat 0
        0;
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
          background: url('~@/assets/images/main/parent/bg_reset.svg') no-repeat
            center center;
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
</style>
