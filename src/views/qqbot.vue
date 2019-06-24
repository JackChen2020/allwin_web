<template>
    <el-row>

        <el-form-item label="QQ号" :rules="{ required: true, message: '请选择QQ号!', trigger: 'blur' }" placeholder="请选择QQ号">
            <el-select v-model="qqacc" placeholder="请选择QQ号">
                <el-option v-for="item in qqaccs" :label="item" :value="item" :key="item"></el-option>
            </el-select>
        </el-form-item>

        <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 10}"
                placeholder="请输入内容"
                v-model="msg">
        </el-input>
        <el-button style="margin-top:20px;" type="primary" @click="send">发送消息</el-button>
    </el-row>
</template>

<script>
    import {qqbot_send_msg,get_qq_accs } from '~/api/request/request';
    export default {
        data() {
            return {
                msg:"",
                qqacc:"",
                qqaccs:""
            }
        },
        methods : {
            send(){
                this.$confirm('确定群发吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    qqbot_send_msg({
                        "data":{
                            "msg" : this.msg,
                            "qqacc" : this.qqacc
                        },
                        callback : (res)=>{
                            this.$message({
                                message : "群发成功!",
                                type: "sueecss"
                            })
                        }
                    })
                }).catch(() => {
                })

            }
        },
        mounted() {
            get_qq_accs({
                callback: (res)=>{
                    this.qqaccs = res.data.data
                }
            })
        }
    }
</script>

<style scoped>

</style>