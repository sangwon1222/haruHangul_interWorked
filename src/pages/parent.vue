<template>
  <div class="wrap-parent">
    <div class="parent-lnb">
      <h2>활동 리포트</h2>
      <ul ref="lnbMenu">
        <li><router-link to="/hangul/parent/play">활동 기록</router-link></li>
        <li><router-link to="/hangul/parent/study">학습 기록</router-link></li>
        <li>
          <router-link to="/hangul/parent/section">영역별 성취</router-link>
        </li>
        <li><router-link to="/hangul/parent/setting">설정</router-link></li>
        <li><router-link to="/hangul/parent/exit">종료</router-link></li>
      </ul>
    </div>
    <router-link
      to="/hangul"
      class="btn-home"
      :class="{ exit: this.$route.name === 'parentExit' }"
    />
    <div ref="pageView" class="page">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      playData: (state) => state.parentPage.report.play
    })
  },
  async created() {
    if (!this.playData) {
      await this.getPlayResult()
    }
  },
  mounted() {
    this.lnbSelect()
  },
  updated() {
    this.lnbSelect()
  },
  methods: {
    ...mapActions('parentPage', ['reportUpdate']),
    async getPlayResult() {
      try {
        const { data } = await this.$axios.get('/learning/hangul/report')
        this.reportUpdate(data.result)
        console.log(data)
      } catch (error) {
        // console.log(error)
      }
    },
    lnbSelect() {
      this.$refs.lnbMenu.removeAttribute('class')
      this.$refs.pageView.classList.remove('exit')
      const name = this.$route.name
      switch (name) {
        case 'parentPlay':
          this.$refs.lnbMenu.classList.add('play')
          break
        case 'parentSection':
          this.$refs.lnbMenu.classList.add('section')
          break
        case 'parentStudy':
          this.$refs.lnbMenu.classList.add('study')
          break
        case 'parentSetting':
          this.$refs.lnbMenu.classList.add('setting')
          break
        case 'parentExit':
          this.$refs.pageView.classList.add('exit')
          this.$refs.lnbMenu.classList.add('exit')
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-parent {
  position: relative;
  height: 100%;
  & > * {
    height: 100%;
  }
  .parent-lnb {
    position: absolute;
    width: 190px;
    background: #50acdb url('~@/assets/images/main/parent/ico_report.svg')
      no-repeat center 40px;
    border-radius: 0 20px 20px 0;
    h2 {
      margin-top: 86px;
      font-size: 30px;
      font-weight: 700;
      text-align: center;
      color: $colorF;
    }
    ul {
      position: relative;
      overflow: hidden;
      height: 100%;
      padding-top: 79px;
      background: url('~@/assets/images/main/parent/bg_select.svg') no-repeat;
      li {
        float: right;
        width: 150px;
        height: 80px;
        font-weight: 500;
        a {
          position: relative;
          display: block;
          padding: 25px 0 25px 23px;
          border-radius: 40px 0 0 40px;
          font-size: 24px;
          color: $colorF;
          &.router-link-active {
            color: #50acdb;
          }
        }
        &:nth-child(-n + 3) {
          //
        }
        &:nth-child(4) {
          margin-top: 82px;
          a {
            padding-left: 56px;
            background: url('~@/assets/images/main/parent/ico_setting_off.svg')
              no-repeat 10px center;
            background-size: 40px;
          }
        }
        &:nth-child(5) {
          a {
            padding-left: 56px;
            background: url('~@/assets/images/main/parent/ico_power_off.svg')
              no-repeat 10px center;
            background-size: 40px;
          }
        }
      }
      &.play {
        background-position: 40px 50px;
      }
      &.study {
        background-position: 40px 131px;
      }
      &.section {
        background-position: 40px 211px;
      }
      &.setting {
        background-position: 40px 372px;
        li:nth-child(4) {
          a {
            background-image: url('~@/assets/images/main/parent/ico_setting_on.svg');
          }
        }
      }
      &.exit {
        background: url('~@/assets/images/main/parent/bg_exit_select.svg')
          no-repeat 40px 452px;
        li:nth-child(5) {
          a {
            background-image: url('~@/assets/images/main/parent/ico_power_on.svg');
          }
        }
      }
    }
  }
  .btn-home {
    position: fixed;
    top: 40px;
    right: 30px;
    width: 64px;
    height: 64px;
    background: #c7ecff url('~@/assets/images/main/parent/btn_home.svg')
      no-repeat center center;
    border-radius: 100%;
    z-index: 1000;
    &.exit {
      background-color: $colorF;
    }
  }
  .page {
    padding: 66px 70px 0 240px;
    background: $colorF;
    &.exit {
      background-color: #d8f2ff;
    }
  }
}
</style>
