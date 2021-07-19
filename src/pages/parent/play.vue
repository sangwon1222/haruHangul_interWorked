<template>
  <div v-if="playData" class="wrap-play">
    <timerCheck />
    <h3>활동 기록<span>누적된 활동 데이터입니다.</span></h3>
    <ul>
      <li>
        <span class="tit">활동 시간</span
        ><span class="num">{{ playData.time }}</span
        ><span class="txt">분</span>
      </li>
      <li>
        <span class="tit">평균 활동 시간</span
        ><span class="num">{{ playData.averageTime }}</span
        ><span class="txt">분</span>
      </li>
      <li>
        <span class="tit">활동 횟수(출석)</span
        ><span class="num">{{ playData.attendance }}</span
        ><span class="txt">회</span>
      </li>
      <li>
        <span class="tit">자녀 진도</span
        ><span class="num">{{ playData.studyDays }}</span
        ><span class="txt">일차</span>
      </li>
    </ul>
    <p class="txt-balloon">
      자녀의 활동 기록을 볼 수 있어요.<br />
      활동 시간, 출석 횟수, 그리고 현재 진도까지.<br />
      자녀에게 잘하고 있다는 격려의 말 한마디<br />
      어떨까요?
    </p>
    <ol>
      <li :class="{ active: playData.contentStep >= 1 }">기본 모음</li>
      <li :class="{ active: playData.contentStep >= 2 }">기본 자음</li>
      <li :class="{ active: playData.contentStep >= 3 }">기본 받침</li>
      <li :class="{ active: playData.contentStep >= 4 }">복잡한 모음</li>
      <li :class="{ active: playData.contentStep >= 5 }">복잡한 받침</li>
      <li :class="{ active: playData.contentStep >= 6 }">겹받침</li>
    </ol>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import timerCheck from '@/components/timer'
export default {
  components: {
    timerCheck
  },
  computed: {
    ...mapState({
      playData: (state) => state.parentPage.report.play
    })
  },
  mounted() {
    // console.log(this.playData)
  }
}
</script>

<style lang="scss" scoped>
.wrap-play {
  position: relative;
  height: 100%;
  background: url('~@/assets/images/main/parent/img_play_balloon.svg') no-repeat
    right 216px;
  font-weight: 500;
  h3 {
    background: url('~@/assets/images/main/parent/ico_tit_check.svg') no-repeat
      0 5px;
    background-size: 28px;
    padding-left: 40px;
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
  ul {
    width: 540px;
    margin-top: 40px;
    li {
      position: relative;
      display: table;
      width: 100%;
      height: 66px;
      padding-left: 30px;
      background: #edf7fc;
      border-radius: 20px;
      font-size: 28px;
      & + li {
        margin-top: 16px;
      }
      &:nth-child(even) {
        background: #dceef8;
      }
      & > * {
        display: table-cell;
        vertical-align: middle;
      }
      .tit {
        width: 436px;
      }
      .num {
        position: absolute;
        top: 8px;
        left: 346px;
        width: 110px;
        height: 50px;
        background: $colorF;
        border: 2px solid #95cce9;
        border-radius: 25px;
        font-family: 'tmoney-bold';
        text-align: center;
        line-height: 48px;
        color: #ff4747;
      }
    }
  }
  .txt-balloon {
    position: absolute;
    top: 235px;
    right: 16px;
    font-size: 18px;
    font-weight: 400;
    text-align: center;
    line-height: 34px;
    color: $color6;
  }
  ol {
    overflow: hidden;
    position: absolute;
    bottom: 90px;
    li {
      float: left;
      width: 169px;
      height: 97px;
      background: transparent
        url('~@/assets/images/main/parent/ico_step_off.svg') no-repeat 0 bottom;
      margin-left: -9px;
      padding-top: 45px;
      font-size: 24px;
      text-align: center;
      color: $colorF;
      &.active {
        background-image: url('~@/assets/images/main/parent/ico_step_on.svg');
      }
      &:first-child {
        margin-left: 0;
        background-image: url('~@/assets/images/main/parent/ico_step01_off.svg');
        &.active {
          background-image: url('~@/assets/images/main/parent/ico_step01_on.svg');
        }
      }
    }
  }
}
</style>
