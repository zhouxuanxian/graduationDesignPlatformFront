<template>
  <div>
    <div style="maring:30rpx">
      <button @click="request">Http请求示例</button>
    </div>
    <div style="text-align:center;margin:30rpx">
    <a href="/pages/counter/main" class="counter">去往Vuex示例页面(a标签)</a>
    </div>
    <button @click="gotoVuex" class="counter">去往Vuex示例页面</button>
        <p>
            本框架引用了MPVue+Vuex+FlyIO+Mpvue-router-patch
        </p>
        <p>
            实现了网络请求的拦截配置，Vuex全局状态管理，缓存的实时同步，<br>可以按照Vue-Router的方式进行页面跳转
        </p>
  </div>
  
</template>

<script>
export default {
    data() {
        return {
        };
    },

    components: {},

    methods: {
        request() {
            this.$router.push("/pages/test/main");
        },
        gotoVuex() {
            this.$router.push({ path: "/pages/counter/main" });
        }
    },

    created() {
    }
};
</script>

<style scoped>
</style>
