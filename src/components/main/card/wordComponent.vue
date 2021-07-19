<template>
  <div>
    <div v-if="info.cards.length <= 0" class="mask" />
    <div
      class="card"
      :class="{ active: info.cards.length > 0 }"
      @click="popupOpen(info.letter)"
    >
      <span class="word">{{ info.letter }}</span>
      <ul class="popup-list">
        <li
          v-for="(c, index) in info.cntOfCards"
          :key="index"
          :class="{ open: info.cards.length >= index + 1 }"
        >
          {{ index }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    info: {
      type: Object,
      default: null
    },
    num: {
      type: Object,
      default: null
    }
  },
  // mounted() {
  //   console.log(this.info)
  //   console.log(this.num)
  // },
  methods: {
    ...mapActions('cardView', ['popupOpen'])
  }
}
</script>

<style lang="scss" scoped>
$tab02Color: #c2acff;

.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 1;
}
.card {
  position: relative;
  width: 190px;
  height: 144px;
  margin: 8px;
  background: #f1f1f1;
  border: 3px solid $colorB;
  border-radius: 20px;
  font-size: 84px;
  text-align: center;
  color: $colorB;
  cursor: pointer;
  & > * {
    position: absolute;
  }
  .word {
    display: block;
    top: 13px;
    width: 100%;
    text-align: center;
  }
  .popup-list {
    right: 7px;
    bottom: 7px;
    font-size: 0;
    & > li {
      display: inline-block;
      width: 17px;
      height: 14px;
      background: #cfcfcf;
      border-radius: 4px;
      & + li {
        margin-left: 4px;
      }
    }
  }
  &.active {
    background: $colorF;
    border: 3px solid $tab02Color;
    color: $color3;
    .popup-list {
      & > li {
        &.open {
          background: $tab02Color;
        }
      }
    }
  }
}
.disable {
  background: #f1f1f1;
  border: 3px solid $colorB;
  color: $colorB;
  cursor: default;
  .popup-list {
    display: none;
  }
}
</style>
