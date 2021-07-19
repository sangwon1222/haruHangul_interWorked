<template>
  <div class="wrap-component" :class="$route.name">
    <div v-if="state.active === 'disable'" class="mask" />
    <div class="wrap-basic" :class="state.active">
      <div class="tit">
        <span class="day">{{ state.info.day }}일차</span>
        <span class="han">{{ state.info.letter }}</span>
      </div>
      <ul class="contents">
        <router-link
          :to="{
            name: 'activity',
            params: { name: 'nodak', cd: state.info.day }
          }"
        >
          <li>
            노닥 한글
            <!-- <span>노닥 한글</span> -->
          </li>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    state: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
$bg: url('~@/assets/images/main/oneday/ico_sprite.svg');

.wrap-component {
  position: relative;
  .mask {
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
      position: relative;
      padding-left: 72px;
      background-repeat: no-repeat;
      background-position: 9px center;
      li {
        position: relative;
        display: block;
        width: 840px;
        height: 110px;
        border-radius: 20px;
        font-size: 30px;
        line-height: 110px;
        text-align: center;
        cursor: pointer;
        & > a {
          position: absolute;
          top: 0;
          line-height: 110px;
          width: 100%;
          height: 100%;
        }
        &::before {
          position: absolute;
          top: -24px;
          left: 395px;
          content: '';
          display: block;
          width: 50px;
          height: 50px;
          background-image: url('~@/assets/images/common/ico_play.svg');
          background-repeat: no-repeat;
          background-position: 14px center;
          background-size: 26px 24px;
          border-radius: 100%;
        }
        a {
          position: relative;
          padding-left: 49px;
          &::before {
            position: absolute;
            top: 0;
            left: 0;
            content: '';
            display: inline-block;
            width: 40px;
            height: 40px;
            background-image: $bg;
            background-repeat: no-repeat;
          }
        }
      }
    }
  }
}
@mixin stepColor($defualt, $active) {
  .tit {
    border: 3px solid $defualt;
    .day {
      background: $defualt;
    }
    .han {
      color: $defualt;
    }
  }
  .contents {
    color: $defualt;
    li {
      border: 3px solid $defualt;
      &::before {
        background-color: $defualt;
      }
    }
  }
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
      color: $color3;
      li {
        &::before {
          background-color: $active;
        }
        position: relative;
        background: $colorF url('~@/assets/images/main/oneday/img_talk.png')
          no-repeat 44px 1px;
        border: 3px solid $active;
        a {
          &::before {
            background-position-x: 0;
          }
        }
      }
    }
  }
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
      color: $colorB;
      li {
        border: 3px solid $colorB;
        &::before {
          background-color: $colorB;
          background-image: url('~@/assets/images/common/ico_lock.svg');
          background-size: 26px 30px;
          background-position: center 9px;
        }
        a {
          &::before {
            background-position-x: -60px;
          }
        }
      }
    }
  }
}
.onedayStep01 {
  @include stepColor($step01Color, $step01ColorActive);
  .contents {
    background-image: url('~@/assets/images/main/oneday/ico_dot01_defualt.svg');
    li {
      a {
        &::before {
          background-position-x: -120px;
        }
      }
    }
  }
}
.onedayStep02 {
  @include stepColor($step02Color, $step02ColorActive);
  .contents {
    background-image: url('~@/assets/images/main/oneday/ico_dot02_defualt.svg');
    li {
      a {
        &::before {
          background-position-x: -240px;
        }
      }
    }
  }
}
.onedayStep03 {
  @include stepColor($step03Color, $step03ColorActive);
  .contents {
    background-image: url('~@/assets/images/main/oneday/ico_dot03_defualt.svg');
    li {
      a {
        &::before {
          background-position-x: -300px;
        }
      }
    }
  }
}
.onedayStep04 {
  @include stepColor($step04Color, $step04ColorActive);
  .contents {
    background-image: url('~@/assets/images/main/oneday/ico_dot04_defualt.svg');
    li {
      a {
        &::before {
          background-position-x: -180px;
        }
      }
    }
  }
}
.onedayStep05 {
  @include stepColor($step05Color, $step05ColorActive);
  .contents {
    background-image: url('~@/assets/images/main/oneday/ico_dot05_defualt.svg');
    li {
      a {
        &::before {
          background-position-x: -360px;
        }
      }
    }
  }
}
.onedayStep06 {
  @include stepColor($step06Color, $step06ColorActive);
  .contents {
    background-image: url('~@/assets/images/main/oneday/ico_dot06_defualt.svg');
    li {
      a {
        &::before {
          background-position-x: -420px;
        }
      }
    }
  }
}
</style>
