<template>
    <el-row>
        <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 10}"
                placeholder="请输入内容"
                v-model="msg">
        </el-input>
        <el-button type="primary" @click="send">发送消息</el-button>
    </el-row>
</template>

<script>
    import {qqbot_send_msg } from '~/api/request/request';
    export default {
        data() {
            return {
                msg:""
            }
        },
        methods : {
            send(){
                this.$confirm('确定群发吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    qqbot_send_msg({
                        "data":{
                            "msg" : this.msg
                        },
                        callback : (res)=>{
                            if(res.data.data.length>0){
                                this.$message({
                                    message : res.data.data
                                })
                            }else{
                                this.$message({
                                    message : "群发成功!",
                                    type: "sueecss"
                                })
                            }
                        }
                    })
                }).catch(() => {
                })

            }
        }
    }
</script>

<style scoped>

</style>