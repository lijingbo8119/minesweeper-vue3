<template>
  <number-display :number="count"></number-display>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import NumberDisplay from "@/components/NumberDisplay.vue";

export default defineComponent({
  name: "BombsCount",
  components: {NumberDisplay},
  computed: {
    thisAny() {
      return this as any;
    },
    count(): number {
      return this.thisAny.$store.state.bombsCount - this.thisAny.$store.state.markedCount;
    },
  },
})
</script>

<style scoped>

</style>