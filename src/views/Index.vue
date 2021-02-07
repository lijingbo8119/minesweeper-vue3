<template>
  请使用鼠标左右键游玩。<br>
  几行<input type="number" v-model="rowsLength"><br>
  几列<input type="number" v-model="colsLength"><br>
  几个雷<input type="number" v-model="bombsCount"><br>
  <button @click="run">开始</button><br>

  <div v-for="(row, index) in matrix" :key="index" class="row" oncontextmenu="self.event.returnValue=false">
    <template v-for="(sq, i) in row" :key="i">
      <square-container :square="sq" :matrix="matrix"></square-container>
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import SquareContainer from "@/components/SquareContainer.vue";
import {INIT_MATRIX} from "@/store/action-types";
import {Square} from "@/model/square";

export default defineComponent({
  name: 'Index',
  components: {SquareContainer},
  data() {
    return {
      rowsLength: 9,
      colsLength: 9,
      bombsCount: 9,
    };
  },
  computed: {
    thisAny() {
      return this as any;
    },
    matrix(): Array<Array<Square>> {
      return this.thisAny.$store.state.matrix;
    },
  },
  methods: {
    initMatrix({rowsLength, colsLength, bombsCount}: { rowsLength: number; colsLength: number; bombsCount: number }) {
      this.thisAny.$store.dispatch(INIT_MATRIX, {rowsLength, colsLength, bombsCount})
    },
    run() {
      this.initMatrix({rowsLength: this.rowsLength, colsLength: this.colsLength, bombsCount: this.bombsCount})
    }
  },
  mounted() {
    this.run()
  }
});
</script>

<style scoped>
.row {
  height: 32px;
}
</style>