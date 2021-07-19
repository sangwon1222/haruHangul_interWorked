<template>
  <div v-if="learningData" class="wrap-study">
    <timerCheck />
    <h3>학습 기록<span>누적된 활동 데이터입니다.</span></h3>
    <ul>
      <li>
        <span class="tit">접한 낱자</span
        ><span class="num">{{ learningData.phonemeCount }}</span
        ><span class="txt">개</span>
      </li>
      <li>
        <span class="tit">접한 낱말</span
        ><span class="num">{{ learningData.wordCount }}</span
        ><span class="txt">개</span>
      </li>
    </ul>
    <p class="txt-balloon">
      자녀가 한글에 얼마나 많이 노출되었을까요?<br />
      같은 글자를 여러 번 반복해도 좋아요. <br />
      벌써 이만큼이나 많은 한글을 만났답니다.
    </p>
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
      learningData: (state) => state.parentPage.report.learning
    })
  }
}
</script>

<style lang="scss" scoped>
.wrap-study {
  position: relative;
  height: 100%;
  background: url('~@/assets/images/main/parent/img_study_balloon.svg')
    no-repeat right 256px;
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
    top: 276px;
    right: 16px;
    font-size: 18px;
    font-weight: 400;
    text-align: center;
    line-height: 34px;
    color: $color6;
  }
}
</style>
