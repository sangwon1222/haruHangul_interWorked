<template>
  <div class="alert-popup">
    <button class="btn-close" @click="alertPopupClose()" />
    <div class="popup-cell">
      <div class="popup-wrap">
        <h2><img src="~@/assets/images/common/txt_hangul.svg" /></h2>
        <p v-if="alertState === 'step'">
          이전 진도를 마친 뒤<br />
          활동 가능합니다.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: {
    state: {
      type: Object,
      default: null
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      alertState: (state) => state.popup.alert.state
    })
  },
  methods: {
    ...mapActions('popup', ['alertPopupClose'])
  }
}
</script>

<style lang="scss" scoped>
.alert-popup {
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
  .popup-cell {
    overflow: hidden;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    .popup-wrap {
      overflow: hidden;
      width: 740px;
      height: 406px;
      background-color: #d8f2ff;
      margin: 0 auto;
      padding: 0 40px;
      border-radius: 30px;
      h2 {
        margin-top: 40px;
        img {
          width: 202px;
        }
      }
      p {
        width: 100%;
        height: 234px;
        margin-top: 34.5px;
        padding-top: 50px;
        background: $colorF;
        font-family: $mainFont;
        font-size: 36px;
        font-weight: 400;
        line-height: 58px;
        color: $color3;
      }
    }
  }
}
</style>
