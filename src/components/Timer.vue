<template>
    <number-display :number="duration"></number-display>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import NumberDisplay from "@/components/NumberDisplay.vue";

export default defineComponent({
  name: "Timer",
  components: {NumberDisplay},
  computed: {
    thisAny() {
      return this as any;
    },
    duration(): number {
      return this.thisAny.$store.state.duration;
    },
  },
})
</script>

<style scoped>

</style>