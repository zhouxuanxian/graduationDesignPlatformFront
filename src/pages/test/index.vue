<template>
    <div style="padding:10rpx 10rpx">
        <button type="primary" style="margin:10rpx" @click="get">Get 请求示例</button>
        <button type="primary" style="margin:10rpx" @click="post">Post 请求示例</button>
        <button type="primary" style="margin:10rpx" @click="request">Request 请求示例(适用RESTful)</button>
        <button type="primary" style="margin:10rpx" @click="all">多请求并发示例</button>
        <button type="primary" style="margin:10rpx" @click="url">发送URLSearchParams示例</button>
        <button type="primary" style="margin:10rpx" @click="form">发送FormData示例</button>
        <button type="primary" style="margin:10rpx" @click="buffer">请求二进制数据示例</button>
    </div>
</template>
<script>
export default {
    data() {
        return {};
    },
    methods: {
        get() {
            this.$fly
                .get("/get", {
                    //这里存放请求参数
                    id: 133
                })
                .then(function(response) {
                    console.log(response);
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        post() {
            this.$fly
                .post("/post", {
                    //这里存放请求参数
                    id: 321
                })
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        request() {
            this.$fly
                .request(
                    "/request",
                    {
                        //这里存放请求参数
                        id: 123
                    },
                    {
                        // 使用request时必须在此指定请求方法
                        method: "post",
                        headers: {}, //http请求头，
                        baseURL: "", //请求基地址
                        timeout: 0, //超时时间，为0时则无超时限制
                        //是否自动将Content-Type为“application/json”的响应数据转化为JSON对象，默认为true
                        parseJson: true,
                        params: {}, //默认公共的url get参数
                        withCredentials: false //跨域时是否发送cookie
                    }
                )
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        fun1() {
            return this.$fly.get("/func1");
        },
        fun2() {
            return this.$$fly.get("/func2");
        },
        all() {
            this.$fly
                .all([this.fun1(), this.fun2()])
                .then(response => {
                    //所有请求都完成才会回调
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        url() {
            const params = new URLSearchParams();
            params.append("a", 1);
            this.$fly.post("", params).then(d => {
                console.log("request result:", d);
            });
        },
        form() {
            var formData = new FormData();
            var log = console.log;
            formData.append("username", "Chris");
            this.$fly
                .post("../package.json", formData)
                .then(log)
                .catch(log);
        },
        buffer() {
            //在浏览器中时 responseType 值可为 "arraybuffer" 或"blob"之一。在node下只需设为 "stream"即可
            this.$fly
                .get("/Fly/v.png", null, {
                    responseType: "arraybuffer"
                })
                .then(d => {
                    //d.data 为ArrayBuffer实例
                });
        }
    }
};
</script>
<style>
</style>

