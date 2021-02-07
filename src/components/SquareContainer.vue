<template>
  <div
      class="square"
      @mousedown.prevent="mousedown"
      @mouseup="mouseup"
      @mouseleave="mouseleave"
  >
    <img :src="imgSrc" style="width: 32px; height: 32px;">
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {
  SQUARE_MOUSE_DOWN_LEFT,
  SQUARE_MOUSE_DOWN_RIGHT,
  SQUARE_MOUSE_LEAVE,
  SQUARE_MOUSE_UP_LEFT,
  SQUARE_MOUSE_UP_RIGHT,
} from "@/store/action-types";
import {Coordinate} from "@/model/interface";
import {Square, SquareStatus} from "@/model/square";

export default defineComponent({
  name: 'Square',
  props: {
    square: {
      type: Object,
    },
    matrix: {
      type: Array,
    },
  },
  emits: ['updateStatus'],
  data() {
    return {}
  },
  computed: {
    thisAny() {
      return this as any;
    },
    coordinate(): Coordinate {
      return (this.square as Square).getCoordinate()
    },
    activeSquareCoordinate(): Coordinate {
      return this.thisAny.$store.state.activeSquareCoordinate
    },
    failed(): boolean {
      return this.thisAny.$store.state.failed
    },
    imgSrc() {
      const square = this.square as Square;
      if (square.getStatus() === SquareStatus.opened) {
        const bombCount = square.getAroundBombsCount(this.matrix as Array<Array<Square>>);
        return require(`@/assets/image/${bombCount}.gif`);
      }
      if (square.getStatus() === SquareStatus.exploded) {
        return require(`@/assets/image/mine2.gif`);
      }
      if (square.getStatus() === SquareStatus.markedBomb) {
        return require(`@/assets/image/flag.gif`);
      }
      return require(`@/assets/image/blank.gif`);
    }
  },
  methods: {
    mousedown(e: MouseEvent) {
      if (this.failed) {
        return;
      }

      switch (e.button) {
        case 0:
          this.thisAny.$store.dispatch(SQUARE_MOUSE_DOWN_LEFT, {coordinate: this.coordinate})
          break;
        case 2:
          this.thisAny.$store.dispatch(SQUARE_MOUSE_DOWN_RIGHT, {coordinate: this.coordinate})
          break;
      }
    },
    mouseup(e: MouseEvent) {
      if (this.failed) {
        return;
      }

      switch (e.button) {
        case 0:
          this.thisAny.$store.dispatch(SQUARE_MOUSE_UP_LEFT, {coordinate: this.coordinate})
          break;
        case 2:
          this.thisAny.$store.dispatch(SQUARE_MOUSE_UP_RIGHT, {coordinate: this.coordinate})
          break;
      }
    },
    mouseleave() {
      this.thisAny.$store.dispatch(SQUARE_MOUSE_LEAVE, {coordinate: this.coordinate})
    }
  }
});
</script>

<style scoped>
.square {
  display: inline-block;
  width: 32px;
  height: 32px;
}
</style>
