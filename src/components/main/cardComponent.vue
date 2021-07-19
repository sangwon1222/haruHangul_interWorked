<template>
  <div class="card-wrap">
    <ul class="tab-list">
      <li
        :class="{ active: tab === 'consonant', new: hasNew[0] }"
        @click="getList('consonant')"
      >
        자음
      </li>
      <li
        :class="{ active: tab === 'vowel', new: hasNew[1] }"
        @click="getList('vowel')"
      >
        모음
      </li>
      <li
        :class="{ active: tab === 'finalconsonant', new: hasNew[2] }"
        @click="getList('finalconsonant')"
      >
        받침
      </li>
    </ul>
    <ol class="word-list">
      <li v-for="(c, index) in cardList" :key="index">
        <wordComponent :info="c" :num="{ index }" />
      </li>
    </ol>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import wordComponent from '@/components/main/card/wordComponent'

export default {
  components: { wordComponent },
  data() {
    return {
      tab: '',
      hasNew: [],
      cardList: [],
      cardView: []
    }
  },
  async created() {
    await this.createList()
    await this.getList('consonant')
  },
  methods: {
    ...mapActions('cardView', ['viewListUpdate']),
    async createList() {
      const list = ['consonant', 'vowel', 'finalconsonant']
      this.hasNew = []
      for (const label of list) {
        const { data } = await this.$axios.get(
          `/learning/hangul/cards/${label}`
        )
        this.hasNew.push(data.result.hasNew)
      }
    },
    async getList(type) {
      this.tab = type
      try {
        const { data } = await this.$axios.get(
          `/learning/hangul/cards/${this.tab}`
        )
        this.cardList = data.result.letters
        //
        // this.hasNew = data.result.hasNew
        //

        this.cardView = []
        for (const c of this.cardList) {
          if (c.cards.length === 1) {
            c.cards[0].letter = c.letter
            this.cardView.push(c.cards[0])
          } else if (c.cards.length === 2) {
            c.cards[0].letter = c.letter
            c.cards[1].letter = c.letter
            this.cardView.push(c.cards[0], c.cards[1])
          }
        }
        this.viewListUpdate(this.cardView)
      } catch (error) {
        // console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card-wrap {
  overflow-y: auto;
  height: 632px;
  padding: 42px 4px 22px 22px;
  font-family: 'tmoney-bold';

  &::-webkit-scrollbar {
    display: none;
  }
  .tab-list {
    margin-bottom: 12px;
    text-align: center;
    li {
      display: inline-block;
      width: 230px;
      height: 70px;
      background-color: $colorF;
      border-radius: 34px;
      font-size: 36px;
      line-height: 70px;
      color: $color9;
      cursor: pointer;
      & + li {
        margin-left: 20px;
      }
      &.new {
        position: relative;
        &::after {
          position: absolute;
          content: '';
          display: block;
          width: 1.5rem;
          height: 1.5rem;
          top: -4px;
          right: -12px;
          background: url('~@/assets/images/main/card/ico_new.svg') no-repeat
            center center;
        }
      }
      &.active {
        position: relative;
        &::before {
          position: absolute;
          content: '';
          display: block;
          width: 81px;
          height: 44px;
          top: -39px;
          left: 78px;
          background: url('~@/assets/images/common/ico_active_char.svg')
            no-repeat center center;
        }

        background: #9a73ff;
        color: $colorF;
      }
    }
  }
  .word-list {
    overflow: hidden;
    li {
      position: relative;
      float: left;
    }
  }
}
</style>
