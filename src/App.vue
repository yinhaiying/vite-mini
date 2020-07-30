 

<template>
  <div>
    <h2>{{count}} * 2 = {{double}}</h2>
    <button @click="add">add</button>
  </div>
</template>

<script>
import { ref, computed } from "vue";
export default {
  name: "App",
  setup() {
    const count = ref(1);
    function add() {
      count.value++;
    }
    const double = computed(() => {
      count.value * 2;
    });
    return {
      count,
      double,
      add,
    };
  },
};
</script>

<style>
</style> 