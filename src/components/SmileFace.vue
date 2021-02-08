<template>
  <img
      :src="imgSrc"
      draggable="false"
      style="width: 32px; height: 32px;"
      @mousedown="mousedown"
      @mouseup="mouseup"
      @mouseleave="mouseleave"
  >
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: "SmileFace",
  emits: ['run'],
  computed: {
    thisAny() {
      return this as any;
    },
    failed(): boolean {
      return this.thisAny.$store.state.failed
    },
    succeed(): boolean {
      return this.thisAny.$store.state.succeed
    },
    imgSrc() {
      if (this.clicked) {
        return require(`@/assets/image/face1.gif`);
      }
      if (this.failed) {
        return require(`@/assets/image/face3.gif`);
      }
      if (this.succeed) {
        return require(`@/assets/image/face4.gif`);
      }
      return require(`@/assets/image/face0.gif`);
    },
  },
  data() {
    return {
      clicked: false,
    }
  },
  methods: {
    mousedown() {
      this.clicked = true;
    },
    mouseup() {
      if (!this.clicked) {
        return;
      }
      this.$emit('run');
      this.clicked = false;
    },
    mouseleave() {
      this.clicked = false;
    }
  }
})
</script>

<style scoped>

</style>