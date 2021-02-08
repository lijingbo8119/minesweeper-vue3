<template>

  <setting @setParam="setParam" @run="run"></setting>

  <div class="row" oncontextmenu="self.event.returnValue=false" style="margin-bottom: 10px">
    <bombs-count style="margin-right: 80px"></bombs-count>
    <smile-face @run="run"></smile-face>
    <timer style="margin-left: 80px"></timer>
  </div>

  <div v-for="(row, index) in matrix" :key="index" class="row" oncontextmenu="self.event.returnValue=false">
    <template v-for="(sq, i) in row" :key="i">
      <square-container :square="sq" :matrix="matrix"></square-container>
    </template>
  </div>

</template>

<script lang="ts">
import {defineComponent} from 'vue';
import SmileFace from "@/components/SmileFace.vue";
import BombsCount from "@/components/BombsCount.vue";
import Timer from "@/components/Timer.vue";
import Setting from "@/components/Setting.vue";
import SquareContainer from "@/components/SquareContainer.vue";
import {INIT_MATRIX} from "@/store/action-types";
import {Square} from "@/model/square";

export default defineComponent({
  name: 'Index',
  components: {SmileFace, SquareContainer, BombsCount, Timer, Setting},
  data() {
    return {
      rowsLength: 9,
      colsLength: 9,
      bombsCount: 10,
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
    setParam({rowsLength, colsLength, bombsCount}: { rowsLength: number; colsLength: number; bombsCount: number }) {
      this.rowsLength = rowsLength;
      this.colsLength = colsLength;
      this.bombsCount = bombsCount;
    },
    initMatrix({rowsLength, colsLength, bombsCount}: { rowsLength: number; colsLength: number; bombsCount: number }) {
      this.thisAny.$store.dispatch(INIT_MATRIX, {rowsLength, colsLength, bombsCount})
    },
    run() {
      this.initMatrix({rowsLength: this.rowsLength, colsLength: this.colsLength, bombsCount: this.bombsCount})
    },
  },
  mounted() {
    this.run()
  }
});
</script>

<style scoped>
.row {
  height: 32px;
  text-align: center;
}
</style>