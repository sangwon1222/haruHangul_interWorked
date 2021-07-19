<template>
  <div class="card">
    <button
      class="play-sound"
      :class="{ playing: playing }"
      @click="soundPlay()"
    />
    <audio
      ref="audio"
      :src="
        `https://contents.arambookclub.com/contents/hangul/res/card_snd/${info.sound}`
      "
    >
      <source type="audio/mpeg" />
    </audio>
    <div class="thume">
      <img
        :class="{ blind: !imgView }"
        :src="
          `https://contents.arambookclub.com/contents/hangul/res/card_img/${info.image}`
        "
      />
    </div>
    <p class="word" :class="{ blind: !txtView }">{{ info.word }}</p>
    <button
      class="btn-view img"
      :class="{ blind: !imgView }"
      @click="viewChange('img')"
    />
    <button
      class="btn-view txt"
      :class="{ blind: !txtView }"
      @click="viewChange('txt')"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: {
    info: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      playing: false
    }
  },
  computed: {
    ...mapState({
      imgView: (state) => state.cardView.imgView,
      txtView: (state) => state.cardView.txtView
    })
  },
  methods: {
    callback() {
      //
    },
    soundPlay() {
      this.$refs.audio.play()
      this.playing = true
      setTimeout(() => {
        this.playing = false
      }, this.$refs.audio.duration * 1000)
    },
    ...mapActions('cardView', ['viewChange'])
  }
}
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  width: 900px;
  height: 500px;
  margin: 0 auto;
  background: #ece6ff;
  border: 10px solid $colorF;
  border-radius: 40px;
  line-height: 480px;
  audio {
    display: none;
  }
  .play-sound {
    position: absolute;
    top: -58px;
    left: 400px;
    width: 100px;
    height: 100px;
    background: url('~@/assets/images/main/card/btn_sound.png');
    &.playing {
      background: url('~@/assets/images/main/card/btn_sound_dow.png');
    }
  }
  .btn-view {
    position: absolute;
    width: 70px;
    height: 70px;
    background: transparent url('~@/assets/images/main/card/ico_visible.svg')
      no-repeat 0 0;
    z-index: 1;
    &.blind {
      background-image: url('~@/assets/images/main/card/ico_hidden.svg');
    }
    &.img {
      bottom: 14px;
      left: 254px;
    }
    &.txt {
      bottom: 14px;
      right: 14px;
    }
  }
}
.thume {
  position: absolute;
  top: 14px;
  left: 14px;
  width: 330px;
  height: 452px;
  background: $colorF;
  border: 3px solid #c2acff;
  border-radius: 20px;
  text-align: center;
  line-height: 452px;
  img {
    width: 100%;
  }
}
.word {
  padding-left: 330px;
  font-size: 150px;
  text-align: center;
}
.thume img,
.word {
  opacity: 1;
  transition: all 0.5s ease 0s;
  -webkit-transition: all 0.5s ease 0s;
  &.blind {
    opacity: 0;
  }
}
</style>
