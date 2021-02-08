<template>
 <div style="display: inline-block">
   <template v-for="(num, i) in numbersArr" :key="i">
     <img :src="getImgSrc(num)" alt="">
   </template>
 </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: "NumberDisplay",
  props: {
    number: {
      required: true,
      type: Number,
      validator: function (value: number) {
        return value < 1000
      }
    }
  },
  computed: {
    numbersArr(): Array<number> {
      const negative = this.number < 0;
      const num = negative ? -this.number : this.number;
      let res: Array<number>;
      if (num < 10) {
        res = [0, 0, num];
      } else if (num < 100) {
        const arr = String(num).split('')
        res = [0, parseInt(arr[0]), parseInt(arr[1])];
      } else {
        const arr = String(num).split('')
        res = [parseInt(arr[0]), parseInt(arr[1]), parseInt(arr[2])];
      }
      if (negative) {
        if (res[0] === 0) {
          res[0] = 10;
        } else {
          res.unshift(10);
        }
      }
      return res;
    }
  },
  methods: {
    getImgSrc(num: number) {
      return require(`@/assets/image/d${num}.gif`);
    }
  },
})
</script>

<style scoped>

</style>