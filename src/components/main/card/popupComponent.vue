<template>
  <div class="card-popup">
    <button class="btn-close" @click="popupClose()" />
    <div class="swiper-button swiper-button-next" />
    <div class="swiper-button swiper-button-prev" />
    <div class="swiper-wrap">
      <swiper
        ref="swiperCard"
        class="swiper"
        :options="swiperOption"
        @slideChangeTransitionStart="callback"
        @slideChangeTransitionEnd="callback"
      >
        <swiper-slide v-for="(c, index) in cardViewList" :key="index">
          <!-- swiper 컴포넌트 안에서 렌더링 변경시 렌더링 이슈가 있어서 컴포넌트로 빼야했음 -->
          <viewComponent :info="c" />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import viewComponent from '@/components/main/card/viewComponent'
export default {
  components: {
    swiper,
    swiperSlide,
    viewComponent
  },
  props: {
    state: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      swiperOption: {
        // spaceBetween: 100,
        speed: 600,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        initialSlide: 0
      }
    }
  },
  computed: {
    ...mapState({
      swiperLetter: (state) => state.cardView.popup.letter,
      cardViewList: (state) => state.cardView.viewList
    })
  },
  mounted() {
    const swiperIndex = this.cardViewList.findIndex(
      (c) => c.letter === this.swiperLetter
    )
    this.$refs.swiperCard.swiper.slideTo(swiperIndex, 0)
  },
  methods: {
    callback() {
      //
    },
    ...mapActions('cardView', ['popupClose'])
  }
}
</script>

<style lang="scss" scoped>
.card-popup {
  position: absolute;
  top: -0.4%;
  left: -0.4%;
  // top: 0;
  // left: 0;
  display: table;
  width: 100.8%;
  height: 100.8%;
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
  .swiper-button {
    position: fixed;
    /* top: 340px; */
    top: 350px;
    width: 100px;
    height: 100px;
    background: $colorF url('~@/assets/images/main/card/btn_arw.svg') no-repeat
      42px center;
    border-radius: 100%;
    &.swiper-button-next {
      right: 29px;
      left: unset;
      transform: rotate(360deg);
    }
    &.swiper-button-prev {
      left: 30px;
      transform: rotate(180deg);
    }
  }
  .swiper-wrap {
    overflow: hidden;
    display: table-cell;
    vertical-align: middle;
    padding-top: 20px;
    .swiper-container {
      overflow: unset;
    }
  }
}
</style>
