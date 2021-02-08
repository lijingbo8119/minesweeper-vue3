<template>
  <div style="width: 100%; margin: 20px 0 0 0; text-align: center;">
    <div style="width: 188px; display: inline-block;">
      <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid" style="text-align: center;">
        <label><input class="uk-radio" type="radio" name="level" :value="1" v-model="level" checked> 初级</label>
        <label><input class="uk-radio" type="radio" name="level" :value="2" v-model="level"> 中级</label>
        <label><input class="uk-radio" type="radio" name="level" :value="3" v-model="level"> 高级</label>
        <template v-if="false">
          <label><input class="uk-radio" type="radio" name="level" :value="4" v-model="level"> 自定</label>
        </template>
      </div>
      <a class="uk-button uk-button-primary uk-button-small" @click="run" v-show="false">Go</a>

      <template v-if="level===4">
        <div class="uk-margin">
          <input class="uk-input uk-form-small" type="number" placeholder="几行" min="9" max="30" v-model="rowsLength">
        </div>
        <div class="uk-margin">
          <input class="uk-input uk-form-small" type="number" placeholder="几列" min="9" max="30" v-model="colsLength">
        </div>
        <div class="uk-margin">
          <input class="uk-input uk-form-small" type="number" placeholder="几个雷" min="1" v-model="bombsCount">
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: "Setting",
  emits: ['setParam', 'run'],
  data() {
    return {
      level: 1,
      rowsLength: 9,
      colsLength: 9,
      bombsCount: 10,
    };
  },
  methods: {
    run() {
      this.$emit('setParam', {rowsLength: this.rowsLength, colsLength: this.colsLength, bombsCount: this.bombsCount})
      this.$emit('run')
    }
  },
  watch: {
    level(val) {
      switch (val) {
        case 1:
          this.rowsLength = 9;
          this.colsLength = 9;
          this.bombsCount = 10;
          break;
        case 2:
          this.rowsLength = 16;
          this.colsLength = 16;
          this.bombsCount = 40;
          break;
        case 3:
          this.rowsLength = 16;
          this.colsLength = 30;
          this.bombsCount = 99;
          break;
      }
      this.run()
    }
  }
})
</script>

<style scoped>

</style>