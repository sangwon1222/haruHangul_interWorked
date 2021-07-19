<template>
  <div class="puzzle-wrap">
    <ol class="puzzle-list">
      <li v-for="(p, index) in puzzleList" :key="index">
        <div class="rev-button" @click.self="reversal" />
        <!-- start -->
        <div
          v-if="
            (!p.completed && p.usable && p.matchedPieces.length === 0) ||
              (p.day == 0 && !p.usable)
          "
          class="puzzle start"
        >
          <p class="txt">{{ mission[index].text }}</p>
          <div class="thume" :class="`thume${index}`" />
          <router-link
            :to="{ name: 'activity', params: { name: 'puzzle', info: p } }"
            >{{ mission[index].chapter }} 시작하기
          </router-link>
        </div>
        <!-- play -->
        <div v-else-if="!p.completed && p.usable && p.matchedPieces.length > 0">
          <div class="puzzle play">
            <div class="thume" :class="`thume${index}`" />
            <div class="support" />
            <router-link
              :to="{ name: 'activity', params: { name: 'puzzle', info: p } }"
              >{{ mission[index].chapter }} 진행중
            </router-link>
          </div>
          <div class="puzzle back">
            <p>{{ mission[index].text }}</p>
          </div>
        </div>
        <!-- clear -->
        <div v-else-if="p.completed && p.usable">
          <div class="puzzle clear">
            <div class="thume" :class="`thume${index}`" />
            <div class="support" />
            <router-link
              :to="{ name: 'activity', params: { name: 'puzzle', info: p } }"
              >{{ mission[index].chapter }} 완료
            </router-link>
          </div>
          <div class="puzzle back">
            <p>{{ mission[index].clear }}</p>
          </div>
        </div>
        <!-- lock -->
        <div
          v-else-if="!p.completed && !p.usable && p.day !== 0"
          class="puzzle lock"
        >
          <!-- && p.day !== 0 // 1일차는 무조건 풀어줘야 해서 추가 했음 수정자:이상원-->
          <p class="txt">{{ mission[index].text }}</p>
          <div class="thume" :class="`thume${index}`" />
          <div class="chapter">{{ mission[index].chapter }}</div>
        </div>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mission: [
        {
          chapter: '하루한글',
          text: `하루 한글을 시작해볼까?`,
          clear: '반가워! 우리 함께 한글 공부를 하자.'
        },
        {
          chapter: '1차시',
          text: '1차시를 완료해보자.',
          clear: '첫번째 차시를 완료했어! 훌륭해'
        },
        {
          chapter: '10차시',
          text: '10차시까지 끝내자구!',
          clear: '10차시를 끝냈어. 대단한걸?'
        },
        {
          chapter: '17차시',
          text: '자음 학습을 시작해봐.',
          clear: 'ㄱㄴㄷㄹ 자음 속으로 출발!'
        },
        {
          chapter: '24차시',
          text: '24차시를 완료해보자.',
          clear: '자음 속으로 빠져든다~'
        },
        {
          chapter: '30차시',
          text: '자음 학습을 꾸준히 해줘.',
          clear: '자음 배우기 영차영차!'
        },
        {
          chapter: '37차시',
          text: '자음 학습이 얼마 안남았어',
          clear: '자음 배우기 으쌰으쌰!'
        },
        {
          chapter: '43차시',
          text: '자음 학습을 끝내볼까?',
          clear: '짜잔! 자음을 완성했어!'
        },
        {
          chapter: '50차시',
          text: '50차시까지 앞으로!',
          clear: '으앗! 벌써 반이나 학습했어!'
        },
        {
          chapter: '60차시',
          text: '모음, 자음 모두 완성!',
          clear: '짝짝짝! 모음, 자음 모두 완성!'
        },
        {
          chapter: '70차시',
          text: '기본 받침을 모두 끝내봐.',
          clear: '하루 한글 기본 받침까지 완성했어!'
        },
        {
          chapter: '77차시',
          text: '복잡한 받침을 꾸준히 해줘.',
          clear: '받침 속으로 빠져든다~'
        },
        {
          chapter: '83차시',
          text: '복잡한 받침까지 완성해봐!',
          clear: '이제 복잡한 받침도 문제 없다구!'
        },
        {
          chapter: '90차시',
          text: '겹받침을 꾸준히 해줘.',
          clear: '마지막 겹받침이야. 기를 모아라!'
        },
        {
          chapter: '100차시',
          text: '한글 완성!',
          clear: '하루 한글 완성! 최고야!'
        }
      ],
      puzzleList: []
    }
  },
  async created() {
    await this.getList()
  },
  methods: {
    async getList() {
      try {
        const { data } = await this.$axios.get('/learning/hangul/puzzles')
        this.puzzleList = data.result
        // console.log('this.puzzleList', this.puzzleList)
      } catch (error) {
        // console.error(error)
      }
    },
    reversal(e) {
      e.target.nextSibling.childNodes.forEach(function(item) {
        item.classList.toggle('reversal')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.puzzle-wrap {
  overflow-x: hidden;
  overflow-y: auto;
  height: 632px;
  padding-top: 42px;

  &::-webkit-scrollbar {
    display: none;
  }
  .puzzle-list {
    overflow: hidden;
    padding-top: 40px;
    li {
      position: relative;
      float: left;
      width: 386px;
      height: 434px;
      margin: 2px 0 58px 30px;
      // transform-style: preserve-3d;
      transform-style: initial;
      transition: 1s;
      & > .rev-button {
        position: absolute;
        width: 100%;
        height: 340px;
        z-index: 1;
      }
      .puzzle {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 20px;
        background: $colorF;
        font-size: 30px;
        text-align: center;
        font-family: 'tmoney-bold';
        backface-visibility: hidden;
        transition: all 0.5s ease 0s;
        -webkit-transition: all 0.5s ease 0s;
        &.reversal {
          transform: rotateY(180deg);
        }
        &::before {
          content: '';
          display: block;
          position: absolute;
          top: -40px;
          left: 153px;
          width: 80px;
          height: 96px;
          background: no-repeat center 0;
          z-index: 1;
        }
        & > * {
          position: absolute;
        }
        .txt {
          top: 56px;
          left: 0;
          width: 100%;
          text-align: center;
          color: $color6;
        }
        .thume {
          top: 120px;
          left: 96px;
          width: 200px;
          height: 200px;
          background-image: url('~@/assets/images/main/puzzle/puzzle_main_start.svg');
          background-repeat: no-repeat;
          background-position: 0 0;
          &.thume1 {
            background-position: -220px 0;
          }
          &.thume2 {
            background-position: -440px 0;
          }
          &.thume3 {
            background-position: -660px 0;
          }
          &.thume4 {
            background-position: -880px 0;
          }
          &.thume5 {
            background-position: 0 -220px;
          }
          &.thume6 {
            background-position: -220px -220px;
          }
          &.thume7 {
            background-position: -440px -220px;
          }
          &.thume8 {
            background-position: -660px -220px;
          }
          &.thume9 {
            background-position: -880px -220px;
          }
          &.thume10 {
            background-position: 0 -440px;
          }
          &.thume11 {
            background-position: -220px -440px;
          }
          &.thume12 {
            background-position: -440px -440px;
          }
          &.thume13 {
            background-position: -660px -440px;
          }
          &.thume14 {
            background-position: -880px -440px;
          }
        }
        a {
          bottom: 20px;
          left: 40px;
          width: 306px;
          height: 70px;
          background: #00aaed;
          border-radius: 16px;
          font-family: 'tmoney-bold';
          font-size: 30px;
          line-height: 70px;
          color: $colorF;
          z-index: 10;
          a {
            display: block;
            width: 100%;
            height: 100%;
            line-height: 70px;
          }
        }
        &.start {
          border: 3px solid #bbb;
          &::before {
            background-image: url('~@/assets/images/main/puzzle/ico_puzzle_lock.svg');
          }
        }
        &.back {
          display: table;
          height: 100%;
          transition: all 0.5s ease 0s;
          -webkit-transition: all 0.5s ease 0s;
          transform: rotateY(180deg);
          &.reversal {
            transform: rotateY(0deg);
          }
          p {
            position: unset;
            display: table-cell;
            width: 100%;
            height: 100%;
            padding: 0 44px;
            font-size: 36px;
            line-height: 52px;
            vertical-align: middle;
          }
        }
        &.play {
          $color: #34cc67;
          border: 3px solid $color;
          &::before {
            background-image: url('~@/assets/images/main/puzzle/ico_puzzle_play.svg');
          }
          a {
            background: $color;
          }
          & + .back {
            background: url('~@/assets/images/main/puzzle/bg_puzzle_play.svg')
              no-repeat 0 0;
            background-size: 100%;
            color: #01c944;
            &::before {
              height: 46px;
              background-image: url('~@/assets/images/main/puzzle/back_puzzle_play.svg');
              background-size: 100% auto;
            }
          }
          .thume {
            top: 58px;
            background-image: url('~@/assets/images/main/puzzle/puzzle_main_play.svg');
          }
          .support {
            bottom: 110px;
            width: 100%;
            height: 90px;
            background: url('~@/assets/images/main/puzzle/bg_light.svg')
              no-repeat center 0;
          }
        }
        &.clear {
          $color: #ff8000;
          border: 3px solid #ff8000;
          &::before {
            background-image: url('~@/assets/images/main/puzzle/ico_puzzle_clear.svg');
            background-size: 100%;
          }
          a {
            background: $color;
          }
          & + .back {
            background: url('~@/assets/images/main/puzzle/bg_puzzle_clear.svg')
              no-repeat 0 0;
            background-size: 100%;
            color: #50acdb;
            &::before {
              height: 46px;
              background-image: url('~@/assets/images/main/puzzle/back_puzzle_clear.svg');
              background-size: 100% auto;
            }
            p {
              &::before {
                content: '';
                display: block;
                width: 100%;
                height: 135px;
                background: url('~@/assets/images/main/puzzle/ico_stamp_clear.svg')
                  no-repeat center top;
                margin-bottom: 26px;
              }
            }
          }
          .thume {
            top: 58px;
            background-image: url('~@/assets/images/main/puzzle/puzzle_main_clear.svg');
          }
          .support {
            bottom: 110px;
            width: 100%;
            height: 90px;
            background: url('~@/assets/images/main/puzzle/bg_light.svg')
              no-repeat center 0;
          }
        }
        &.lock {
          $color: #bbb;
          border: 3px solid $color;
          &::before {
            background-image: url('~@/assets/images/main/puzzle/ico_puzzle_lock.svg');
          }
          .chapter {
            bottom: -2px;
            left: -1px;
            width: 384px;
            height: 72px;
            background: $color;
            border-radius: 0 0 17px 17px;
            font-size: 30px;
            line-height: 70px;
            color: $colorF;
          }
        }
      }
    }
  }
}
</style>
