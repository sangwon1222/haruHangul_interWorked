<template>
  <div class="wrap-component" :class="$route.name">
    <div v-if="state.active === 'disable'" class="section-mask" />
    <div class="wrap-basic" :class="state.active">
      <div class="tit">
        <span class="day">{{ state.info.day }}일차</span>
        <span class="han">{{ state.info.letter }}</span>
      </div>
      <ul class="contents">
        <li
          :class="{
            complete:
              state.info.curriculum[0].active &&
              state.info.curriculum[0].completed,
            play:
              state.info.curriculum[0].active &&
              !state.info.curriculum[0].completed,
            noPlay:
              !state.info.curriculum[0].active &&
              !state.info.curriculum[0].completed
          }"
        >
          <div v-if="!state.info.curriculum[0].active" class="mask" />
          <router-link
            :to="{
              name: 'activity',
              params: { name: 'today', cd: state.info.day }
            }"
          >
            오늘 한글
          </router-link>
        </li>
        <li
          :class="{
            complete:
              state.info.curriculum[1].active &&
              state.info.curriculum[1].completed,
            play:
              state.info.curriculum[1].active &&
              !state.info.curriculum[1].completed,
            noPlay:
              !state.info.curriculum[1].active &&
              !state.info.curriculum[1].completed
          }"
        >
          <div v-if="!state.info.curriculum[1].active" class="mask" />
          <router-link
            :to="{
              name: 'activity',
              params: { name: 'rhythm', cd: state.info.day }
            }"
          >
            리듬 한글
          </router-link>
        </li>
        <li
          :class="{
            complete:
              state.info.curriculum[2].active &&
              state.info.curriculum[2].completed,
            play:
              state.info.curriculum[2].active &&
              !state.info.curriculum[2].completed,
            noPlay:
              !state.info.curriculum[2].active &&
              !state.info.curriculum[2].completed
          }"
        >
          <div v-if="!state.info.curriculum[2].active" class="mask" />
          <router-link
            :to="{
              name: 'activity',
              params: { name: 'paint', cd: state.info.day }
            }"
          >
            색칠 한글
          </router-link>
        </li>
        <li
          :class="{
            complete:
              state.info.curriculum[3].active &&
              state.info.curriculum[3].completed,
            play:
              state.info.curriculum[3].active &&
              !state.info.curriculum[3].completed,
            noPlay:
              !state.info.curriculum[3].active &&
              !state.info.curriculum[3].completed
          }"
        >
          <div v-if="!state.info.curriculum[3].active" class="mask" />
          <router-link
            :to="{
              name: 'activity',
              params: { name: 'partner', cd: state.info.day }
            }"
          >
            짝꿍 한글
          </router-link>
        </li>
        <li
          :class="{
            complete:
              state.info.curriculum[4].active &&
              state.info.curriculum[4].completed,
            play:
              state.info.curriculum[4].active &&
              !state.info.curriculum[4].completed,
            noPlay:
              !state.info.curriculum[4].active &&
              !state.info.curriculum[4].completed
          }"
        >
          <div v-if="!state.info.curriculum[4].active" class="mask" />
          <router-link
            :to="{
              name: 'activity',
              params: { name: 'myHangul', cd: state.info.day }
            }"
          >
            나의 한글
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    // // console.log(this.state.day)
  },
  props: {
    state: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-component {
  position: relative;
  .section-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    z-index: 1;
  }
  .wrap-basic {
    overflow: hidden;
    padding-top: 37px;
    .tit {
      float: left;
      position: relative;
      width: 308px;
      height: 110px;
      background: $colorF;
      border-radius: 0 20px 20px 20px;
      text-align: center;
      line-height: 100px;
      .day {
        position: absolute;
        top: -37px;
        left: -3px;
        width: 100px;
        height: 37px;
        border-radius: 17px 17px 0 0;
        font-family: $mainFont;
        line-height: 34px;
        letter-spacing: 1px;
        font-size: 20px;
        color: $colorF;
      }
      .han {
        font-size: 70px;
      }
    }
    .contents {
      float: left;
      padding-left: 72px;
      background-repeat: no-repeat;
      background-position: 9px center;
      li {
        position: relative;
        float: left;
        width: 160px;
        height: 110px;
        border: 3px solid $colorB;
        border-radius: 20px;
        padding-top: 37px;
        font-size: 30px;
        text-align: center;
        color: $colorB;
        cursor: pointer;
        .mask {
          position: absolute;
          top: -24px;
          left: -8px;
          width: 111%;
          height: 130%;
          background: transparent;
          z-index: 1;
          cursor: default;
        }
        a {
          display: block;
          position: absolute;
          top: 0;
          line-height: 110px;
          width: 100%;
          height: 100%;
        }
        & + li {
          margin-left: 10px;
        }
        &::before {
          position: absolute;
          top: -24px;
          left: 50px;
          content: '';
          display: block;
          width: 50px;
          height: 50px;
          background: $colorB url('~@/assets/images/common/ico_lock.svg')
            no-repeat center 9px;
          background-size: 26px 30px;
          border-radius: 100%;
        }
      }
    }
  }
}
@mixin stepColor($defualt, $active) {
  // 진행중
  .active {
    .tit {
      border: 3px solid $active;
      &::before {
        position: absolute;
        content: '';
        display: block;
        width: 81px;
        height: 44px;
        top: -44px;
        right: 17px;
        background: url('~@/assets/images/common/ico_active_char.svg') no-repeat
          center center;
      }
      .day {
        background: $active;
      }
      .han {
        color: $color3;
      }
    }
    .contents {
      background-image: url('~@/assets/images/main/oneday/ico_dot_disable.svg');
      li {
        &::before {
          background: $defualt url('~@/assets/images/common/ico_play.svg')
            no-repeat 14px center;
          background-size: 26px 24px;
        }
        &.complete {
          border: 3px solid $defualt;
          color: $defualt;
        }
        &.play {
          border: 3px solid $active;
          background-color: $colorF;
          color: $color3;
          &::before {
            background-color: $active;
          }
        }
        &.noPlay {
          background-color: $colorF;
          &::before {
            background: $colorB url('~@/assets/images/common/ico_lock.svg')
              no-repeat center 9px;
            background-size: 26px 30px;
          }
        }
      }
    }
  }
  // 지남
  .defualt {
    .tit {
      border: 3px solid $defualt;
      // main\oneday/ico_char.svg
      .day {
        background: $defualt;
      }
      .han {
        color: $defualt;
      }
    }
    .contents {
      li {
        border: 3px solid $defualt;
        color: $defualt;
        &::before {
          background: $defualt url('~@/assets/images/common/ico_play.svg')
            no-repeat 14px center;
          background-size: 26px 24px;
        }
      }
    }
  }
  // 안함
  .disable {
    .tit {
      background: transparent;
      border: 3px solid $colorB;
      .day {
        background: $colorB;
      }
      .han {
        color: $colorB;
      }
    }
    .contents {
      background-image: url('~@/assets/images/main/oneday/ico_dot_disable.svg');
      li {
        border: 3px solid $colorB;
        color: $colorB;
        &::before {
          background-color: $colorB;
        }
      }
    }
  }
}
.onedayStep01 {
  @include stepColor($step01Color, $step01ColorActive);
  .contents {
    background-image: url('~@/assets/images/main/oneday/ico_dot01_defualt.svg');
  }
}
.onedayStep02 {
  @include stepColor($step02Color, $step02ColorActive);
  .contents {
    background-image: url('~@/assets/images/main/oneday/ico_dot02_defualt.svg');
  }
}
.onedayStep03 {
  @include stepColor($step03Color, $step03ColorActive);
  .contents {
    background-image: url('~@/assets/images/main/oneday/ico_dot03_defualt.svg');
  }
}
.onedayStep04 {
  @include stepColor($step04Color, $step04ColorActive);
  .contents {
    background-image: url('~@/assets/images/main/oneday/ico_dot04_defualt.svg');
  }
}
.onedayStep05 {
  @include stepColor($step05Color, $step05ColorActive);
  .contents {
    background-image: url('~@/assets/images/main/oneday/ico_dot05_defualt.svg');
  }
}
.onedayStep06 {
  @include stepColor($step06Color, $step06ColorActive);
  .contents {
    background-image: url('~@/assets/images/main/oneday/ico_dot06_defualt.svg');
  }
}
</style>
