<template>
  <div class="wrap-exit">
    <timerCheck />
    <h3 />
    <p class="txt">하루 한글을 종료하시겠습니까?</p>
    <div class="btn-wrap">
      <button class="yes" @click="hanEnd()">네</button>
      <button class="no" @click="reload">아니오</button>
    </div>
  </div>
</template>

<script>
import timerCheck from '@/components/timer'
export default {
  components: {
    timerCheck
  },
  methods: {
    hanEnd() {
      this.$router.push('/')
      location.reload()
    },
    reload() {
      this.$router.push('/hangul')
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-exit {
  overflow: hidden;
  height: 100%;
  background: url('~@/assets/images/main/parent/ico_exit_goblin.svg') no-repeat
    center 364px;
  h3 {
    width: 230px;
    height: 55px;
    background: url('~@/assets/images/main/parent/txt_exit_logo.svg') no-repeat
      0 0;
    margin: 68px auto 0;
  }
  .txt {
    margin-top: 62px;
    font-size: 30px;
    font-weight: 500;
    text-align: center;
    color: $color3;
  }
  .btn-wrap {
    margin-top: 26px;
    text-align: center;
    button {
      display: inline-block;
      width: 200px;
      height: 70px;
      margin: 0 15px;
      border-radius: 38px;
      font-family: 'tmoney-bold';
      font-size: 30px;
      color: $colorF;
      &.yes {
        background: $color9;
      }
      &.no {
        background: #ff4747;
      }
    }
  }
}
</style>
