<template>
    <avue-form ref="form" v-model="obj"
               :option="option" @reset-change="emptytChange" @submit="submit"
                    :loading="loading">
    </avue-form>
</template>

<script>

    import { get_bankinfo,user_upd } from '~/api/request/request'

    export default {
        data() {
            return {
                obj:{},
                obj1:{},
                sizeValue:'mini',
                loading:true
            }
        },
        computed: {
            option(){
                return{
                    size:this.sizeValue,
                    submitText: '提交',
                    menuPostion : 'left',
                    column: [
                        {
                            label: "银行名称",
                            prop: "bank_name",
                            tip: '请输入银行名称',
                            span:18,
                            rules: [{
                                required: true,
                                message: "请输入银行名称",
                                trigger: "blur"
                            }],
                            row:true
                        },
                        {
                            label: "支行",
                            prop: "open_bank",
                            tip: '请输入支行信息',
                            span:18,
                            row:true,
                            rules: [{
                                required: true,
                                message: "请输入支行信息",
                                trigger: "blur"
                            }],
                        },
                        {
                            label: "开户人",
                            prop: "open_name",
                            tip: '请输入开户人',
                            span:8,
                            rules: [{
                                required: true,
                                message: "请输入开户人",
                                trigger: "blur"
                            }],
                        },

                        {
                            label: "银行卡号",
                            prop: "bank_card_number",
                            tip: '请输入银行卡号',
                            span:10,
                            rules: [{
                                required: true,
                                message: "请输入银行卡号",
                                trigger: "blur"
                            }],
                        }],
                }
            }
        },
        mounted(){
            get_bankinfo({
                "callback" : (res) => {
                    this.obj1 = res.data.data
                    this.obj = res.data.data
                }
            })
        },
        methods:{
            emptytChange(){
                // this.$message.success('清空方法回调');
            },
            submit () {
                // this.$message.success('当前数据'+JSON.stringify(this.obj));

                this.$confirm('确认提交该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$set(this.obj,'userid',this.obj1.userid)
                    user_upd({
                        data : this.obj,
                        callback : () => {
                            this.$message.success("成功!")
                        },
                        errorcallback : () => {
                        }
                    })
                }).catch(() => {
                })
            },
            queryHandler(){
                get_bankinfo({
                    "callback" : (res) => {
                        this.obj = res.data.data
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
