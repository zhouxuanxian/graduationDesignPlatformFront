<template>
  <div class="counter-warp">
      <p>可在控制台查看本地存储，体现实时缓存</p>
    <p>Vuex counter：{{ count }}</p>
    <p>
      <button @click="increment">+</button>
      <button @click="decrement">-</button>
    </p>
  </div>
</template>

<script>
// Use Vuex
import store from "@/store/index";

export default {
    computed: {
        count() {
            return store.state.count;
        }
    },
    methods: {
        increment() {
            store.commit("increment");
        },
        decrement() {
            store.commit("decrement");
        }
    }
};
</script>

<style scope>
</style>
