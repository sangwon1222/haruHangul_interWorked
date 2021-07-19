<template>
  <div class="wrap-section">
    <timerCheck />
    <h3>영역별 성취</h3>
    <ul class="section-list">
      <li class="listen">
        <div
          class="face"
          :class="{
            face05: listenIndex >= 9,
            face04: listenIndex >= 8 && listenIndex < 9,
            face03: listenIndex >= 7 && listenIndex < 8,
            face02: listenIndex >= 6 && listenIndex < 7,
            face01: listenIndex >= 5 && listenIndex < 6,
            face00: listenIndex < 5
          }"
        />
        <div class="result">
          <span class="tit">성취율</span>
          <ol class="stat-late">
            <li
              v-for="(num, index) in 10"
              :key="index"
              :class="{ active: listenIndex > index }"
            />
          </ol>
        </div>
        <div class="result">
          <span class="tit">한마디</span>
          <p v-if="listen.length" class="ment">
            {{ listen[0].evaluation }}
          </p>
          <p v-else class="ment">
            {{ noPlayText }}
          </p>
        </div>
      </li>
      <li class="read">
        <div
          class="face"
          :class="{
            face05: readIndex >= 9,
            face04: readIndex >= 8 && readIndex < 9,
            face03: readIndex >= 7 && readIndex < 8,
            face02: readIndex >= 6 && readIndex < 7,
            face01: readIndex >= 5 && readIndex < 6,
            face00: readIndex < 5
          }"
        />
        <div class="result">
          <span class="tit">성취율</span>
          <ol class="stat-late">
            <li
              v-for="(num, index) in 10"
              :key="index"
              :class="{ active: readIndex > index }"
            />
          </ol>
        </div>
        <div class="result">
          <span class="tit">한마디</span>
          <p v-if="read.length" class="ment">{{ read[0].evaluation }}</p>
          <p v-else class="ment">
            {{ noPlayText }}
          </p>
        </div>
      </li>
      <li class="write">
        <div
          class="face"
          :class="{
            face05: writeIndex >= 9,
            face04: writeIndex >= 8 && writeIndex < 9,
            face03: writeIndex >= 7 && writeIndex < 8,
            face02: writeIndex >= 6 && writeIndex < 7,
            face01: writeIndex >= 5 && writeIndex < 6,
            face00: writeIndex < 5
          }"
        />
        <div class="result">
          <span class="tit">성취율</span>
          <ol class="stat-late">
            <li
              v-for="(num, index) in 10"
              :key="index"
              :class="{ active: writeIndex > index }"
            />
          </ol>
        </div>
        <div class="result">
          <span class="tit">한마디</span>
          <p v-if="write.length" class="ment">{{ write[0].evaluation }}</p>
          <p v-else class="ment">
            {{ noPlayText }}
          </p>
        </div>
      </li>
    </ul>
    <p class="txt-balloon">
      자녀의 영역별 성취를 한눈에 볼 수<br />
      있어요. 성취율이 조금 낮더라도<br />
      걱정 마세요. 꾸준히 최선을 다하는<br />
      모습만으로 충분히 훌륭해요!
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
  data() {
    return {
      noPlayText: '아직 활동 결과가 없어요. 다양한 활동을 해주세요.'
    }
  },
  computed: {
    ...mapState({
      listen: (state) => state.parentPage.listen,
      read: (state) => state.parentPage.read,
      write: (state) => state.parentPage.write,
      listenIndex: (state) => state.parentPage.listenIndex,
      readIndex: (state) => state.parentPage.readIndex,
      writeIndex: (state) => state.parentPage.writeIndex
    })
  }
}
</script>

<style lang="scss" scoped>
.wrap-section {
  position: relative;
  height: 100%;
  background: url('~@/assets/images/main/parent/img_section_balloon.svg')
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
  .section-list {
    margin-top: 40px;
    & > li {
      position: relative;
      width: 590px;
      height: 140px;
      padding: 24px 16px 16px 155px;
      background: #edf7fc;
      border-radius: 20px;
      &::after {
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        display: block;
        width: 33px;
        height: 83px;
        z-index: 1;
      }
      & + li {
        margin-top: 30px;
      }
      &.listen {
        &::after {
          background: url('~@/assets/images/main/parent/ico_tit_listen.svg')
            no-repeat 0 0;
        }
      }
      &.read {
        &::after {
          background: url('~@/assets/images/main/parent/ico_tit_read.svg')
            no-repeat 0 0;
        }
      }
      &.write {
        &::after {
          background: url('~@/assets/images/main/parent/ico_tit_write.svg')
            no-repeat 0 0;
        }
      }
      .face {
        position: absolute;
        top: 17px;
        left: 53px;
        width: 80px;
        height: 80px;
        &::before {
          display: block;
          padding-top: 86px;
          font-size: 16px;
          text-align: center;
          color: $color6;
        }
        &.face05 {
          background: url('~@/assets/images/main/parent/ico_face05.svg')
            no-repeat 0 0;
          &::before {
            content: '최고예요!';
          }
        }
        &.face04 {
          background: url('~@/assets/images/main/parent/ico_face04.svg')
            no-repeat 0 0;
          &::before {
            content: '훌륭해요!';
          }
        }
        &.face03 {
          background: url('~@/assets/images/main/parent/ico_face03.svg')
            no-repeat 0 0;
          &::before {
            content: '멋져요!';
          }
        }
        &.face02 {
          background: url('~@/assets/images/main/parent/ico_face02.svg')
            no-repeat 0 0;
          &::before {
            content: '잘했어요!';
          }
        }
        &.face01 {
          background: url('~@/assets/images/main/parent/ico_face01.svg')
            no-repeat 0 0;
          &::before {
            content: '좋아요!';
          }
        }
        &.face00 {
          background: url('~@/assets/images/main/parent/ico_face00.svg')
            no-repeat 0 0;
          &::before {
            content: '';
          }
        }
      }
      .result {
        display: table;
        & > * {
          display: table-cell;
          vertical-align: top;
        }
        & + .result {
          margin-top: 11px;
        }
        .tit {
          width: 79px;
          // padding-right: 18px;
          font-size: 22px;
          color: $color3;
        }
        .ment {
          padding-top: 2px;
          font-size: 18px;
          font-weight: 400;
          line-height: 24px;
          color: $color6;
        }
        ol {
          overflow: hidden;
          li {
            float: left;
            width: 34px;
            height: 30px;
            background: url('~@/assets/images/main/parent/ico_star_off.svg')
              no-repeat 0 0;
            &.active {
              background-image: url('~@/assets/images/main/parent/ico_star_on.svg');
            }
          }
        }
      }
    }
  }
  .txt-balloon {
    position: absolute;
    top: 276px;
    right: 17px;
    font-size: 18px;
    font-weight: 400;
    text-align: center;
    line-height: 34px;
    color: $color6;
  }
}
</style>
