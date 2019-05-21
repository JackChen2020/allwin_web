<template>
    <avue-form ref="form" v-model="obj"
               :option="option">
        <template slot="menuForm">
            <el-button v-if="subloding===false" type="primary" @click="submit">提交修改</el-button>
            <el-button v-else type="primary" icon="el-icon-loading">提交修改</el-button>
        </template>
    </avue-form>
</template>

<script>

    import { upd_passwd } from '~/api/request/request'

    export default {
        data() {
            return {
                obj:{},
                subloding:false
            }
        },
        computed: {
            option(){
                return{
                    labelWidth:120,
                    size:"mini",
                    menuPostion : 'left',
                    emptyBtn:false,
                    submitBtn:false,
                    column: [
                        {
                            label: "旧密码",
                            prop: "oldpasswd",
                            span: 8,
                            type: "password",
                            precision: 2,
                            row: true,
                            rules: [{
                                validator: (rule, value, callback) => {
                                    if (value <= 0) {
                                        callback(new Error('密码不能为空'));
                                    } else {
                                        callback();
                                    }
                                }
                            }],
                        },
                        {
                            label: "密码",
                            prop: "passwd",
                            span: 8,
                            type: "password",
                            precision: 2,
                            row: true,
                            rules: [{
                                validator: (rule, value, callback) => {
                                    if (value <= 6) {
                                        callback(new Error('密码长度必须大于等于6'));
                                    } else {
                                        callback();
                                    }
                                }
                            }],
                        }
                        ]
                }
            }
        },
        mounted(){
        },
        methods:{
            submit () {
                this.$refs.form.validate(vaild=> {
                    if (vaild) {
                        this.$confirm('确认修改吗?', '提示', {
                            type: 'warning'
                        }).then(() => {
                            this.subloding = true
                            upd_passwd({
                                data : {
                                    "passwd" : this.$md5(this.obj.passwd),
                                    "oldpasswd" : this.$md5(this.obj.oldpasswd)
                                },
                                callback : (res) => {
                                    this.$message.success("成功!")
                                    this.subloding = false
                                },
                                errorcallback : () => {
                                    this.subloding = false
                                }
                            })
                        }).catch(() => {
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
