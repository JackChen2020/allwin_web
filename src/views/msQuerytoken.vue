
<template>
    <div>
        <el-row :span="24">
            <el-col :md="7"
                    :xs="24"
                    :sm="24">
                <basic-container>
                    <div class="info">
                        <el-link @click="HandlerPass" class="img-border1" type="success"  target="_blank">Token: {{g_token}}</el-link>
                    </div>
                </basic-container>
            </el-col>
        </el-row>

        <el-dialog title="支付密码校验" :visible.sync="isFlag" >
            <avue-form ref="form" v-model="obj" @submit="submit"
                       :option="option">
            </avue-form>
        </el-dialog>
    </div>



</template>

<script>
    import { mapState } from 'vuex'
    import { check_paypasswd } from '~/api/request/request'
    import { imgjoin } from '~/api/utils'

    export default {

        data() {
            return {
                g_token : "",
                cflag : false,
                isFlag: false,
                obj:{},
                obj1:{},
                javasdk_url:''
            }
        },
        computed: {
            ...mapState(['user']),
            option() {
                return {
                    labelWidth:280,
                    size:"mini",
                    submitText: '提交',
                    menuPostion : 'left',
                    emptyBtn:false,
                    submitBtn:true,
                    column: [
                        {
                            label: "支付密码",
                            prop: "pay_passwd",
                            span:20,
                            type:"password",
                            row:true,
                            rules: [{
                                required: true,
                                message: "请输入支付密码"
                            }],
                        },
                    ]
                }
            }
        },
        methods:{
            HandlerPass () {
                if(!this.cflag){
                    this.cflag = true
                    this.isFlag = true
                }
            },
            submit () {
                this.$refs.form.validate(vaild=> {
                    if (vaild) {
                        this.$confirm('确认提交吗?', '提示', {
                            type: 'warning'
                        }).then(() => {
                            this.$set(this.obj1,"pay_passwd",this.$md5(this.obj.pay_passwd))
                            check_paypasswd({
                                data : this.obj1,
                                callback : (res) => {
                                    this.g_token = this.user.google_token
                                    this.$message.success("成功!")
                                    this.isFlag = false
                                },
                                errorcallback : () => {
                                    this.isFlag = false
                                    this.cflag = false
                                }
                            })
                        }).catch(() => {
                            this.cflag = false
                        })
                    }
                })
            },
        },
        mounted() {
            let token = this.user.google_token
            this.g_token = token.substr(0,3) + "********" + token.substr(11);
            this.javasdk_url = imgjoin("/nginx_upload/sdk/java/allwin-api-client-1.0.zip")
        }
    }

</script>

<style scoped="scoped" lang="scss">
    .info {
        padding: 12px 0;
        text-align: center;

        .img-border {
            height: 30px;
            position: relative;
            vertical-align: middle;
            display: inline-block;
        }

        .img-border1 {
            height: 30px;
            position: relative;
            vertical-align: middle;
            display: inline-block;
        }
    }
</style>