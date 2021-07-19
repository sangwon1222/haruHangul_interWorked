<template>
  <div class="wrap-step01">
    <timerCheck />
    <div class="page-header">
      <!-- <router-link
        :to="{ name: 'main' }"
        class="btn-back"
      /> -->
      <div class="btn-back" @click="goMainPage" />
      <h2>
        <span class="tit">{{ stepName }}</span>
      </h2>
    </div>
    <ul class="day-list">
      <li v-for="(f, index) in curriculum" :key="index">
        <!-- 종합(깨단한글)일 경우 === 마지막 -->
        <div v-if="index >= curriculum.length - 1" @click="playclickSnd">
          <div v-if="f.day < dayOfStudy">
            <totalComponent
              :state="{ active: 'defualt', info: f, day: dayOfStudy }"
            />
          </div>
          <div v-else-if="f.day === dayOfStudy">
            <totalComponent
              :state="{ active: 'active', info: f, day: dayOfStudy }"
            />
          </div>
          <div v-else-if="f.day > dayOfStudy">
            <totalComponent
              :state="{ active: 'disable', info: f, day: dayOfStudy }"
            />
          </div>
        </div>
        <!-- 종합(깨단한글) 아닐 경우 -->
        <div v-else>
          <!-- 기본일 경우 -->
          <div v-if="f.curriculum.length >= 5" @click="playclickSnd">
            <div v-if="f.day < dayOfStudy">
              <basicComponent
                :state="{
                  active: 'defualt',
                  info: f,
                  day: dayOfStudy
                }"
              />
            </div>
            <div v-else-if="f.day === dayOfStudy">
              <basicComponent
                :state="{
                  active: 'active',
                  info: f,
                  day: dayOfStudy
                }"
              />
            </div>
            <div v-else-if="f.day > dayOfStudy">
              <basicComponent
                :state="{
                  active: 'disable',
                  info: f,
                  day: dayOfStudy
                }"
              />
            </div>
          </div>
          <!-- 기본 아닐 경우( = 리뷰, 노닥한글) -->
          <div v-else @click="playclickSnd">
            <div v-if="f.day < dayOfStudy">
              <reviewComponent
                :state="{ active: 'defualt', info: f, day: dayOfStudy }"
              />
            </div>
            <div v-else-if="f.day === dayOfStudy">
              <reviewComponent
                :state="{ active: 'active', info: f, day: dayOfStudy }"
              />
            </div>
            <div v-else-if="f.day > dayOfStudy">
              <reviewComponent
                :state="{ active: 'disable', info: f, day: dayOfStudy }"
              />
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import basicComponent from '@/components/main/oneday/basicComponent'
import reviewComponent from '@/components/main/oneday/reviewComponent'
import totalComponent from '@/components/main/oneday/totalComponent'
import timerCheck from '@/components/timer'
import config from '@/activity/gameUtil/config'
import gsap from 'gsap/all'
export default {
  components: {
    basicComponent,
    reviewComponent,
    timerCheck,
    totalComponent
  },
  data() {
    return {
      stepName: '',
      dayOfStudy: 0,
      curriculum: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const { data } = await this.$axios.get(
          '/learning/hangul/contents/step01'
        )
        // this.stepName = data.result.name
        this.stepName = '기본 모음'
        this.dayOfStudy = data.result.dayOfStudy
        this.curriculum = data.result.curriculum
      } catch (error) {
        // console.error(error)
      }
    },
    async goMainPage() {
      await this.playclickSnd()
      this.$router.replace('/hangul')
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
    }
  }
}
</script>

<style lang="scss" scoped>
$backgroundColor: #fff0ce;
$h2Color: #ffb612;

.wrap-step01 {
  position: relative;
  min-height: 100%;
  width: 100%;
  background: $backgroundColor;
  font-family: 'tmoney-bold';

  .page-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 90px;
    z-index: 1000;
    .btn-back {
      position: absolute;
      top: 13px;
      left: 30px;
      width: 64px;
      height: 64px;
      background: #c7ecff url('~@/assets/images/common/ico_back.svg') no-repeat
        center center;
      border-radius: 100%;
      cursor: pointer;
      z-index: 1001;
    }
    h2 {
      @include boxShadow(10px, 0.4);
      position: absolute;
      background: $colorF;
      width: 100%;
      line-height: 90px;
      text-align: center;
      color: $h2Color;
      .tit {
        position: relative;
        padding-left: 56px;
        &::before {
          position: absolute;
          content: '';
          display: inline-block;
          top: 4px;
          left: 0;
          width: 40px;
          height: 46px;
          background: url('~@/assets/images/main/oneday/menu_sprite.svg')
            no-repeat 0 0;
          background-size: 250px;
        }
      }
    }
  }
  .day-list {
    overflow-y: auto;
    height: 720px;
    padding: 122px 13px 40px 30px;

    &::-webkit-scrollbar {
      display: none;
    }
    li + li {
      margin-top: 30px;
    }
  }
}
</style>
