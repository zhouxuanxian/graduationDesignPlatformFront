<template>
  <div>
    <ul class="container log-list">
      <li v-for="(log, index) in logs" :key="index" class="log-item">
        <span>{{index+1}}: {{log}}</span>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
    components: {},

    data() {
        return {
            logs: []
        };
    },

    created() {
        let logs;
        logs = this.$storage.getItem("logs");
        Object.keys(logs).forEach(ele => {
            this.logs.push(logs[ele]);
        });
    }
};
</script>

<style scope>
.log-list {
    display: flex;
    flex-direction: column;
    padding: 40rpx;
}

.log-item {
    margin: 10rpx;
}
</style>
