<template>
    <div>
        <avue-form ref="form" v-model="obj"
                   :option="option">
            <template slot="menuForm">
                <el-button v-if="subloding===false" type="primary" @click="submit">提交</el-button>
                <el-button v-else type="primary" icon="el-icon-loading">提交</el-button>
            </template>
        </avue-form>
    </div>
</template>submit



<script>

    import { correct } from '~/api/request/request'

    export default {
        data() {
            return {
                obj:{},
                obj1:{},
                obj10:{},
                subloding:false,
                data:[],
                isFlag:false,
                bankinfo:{},
                page: {
                    //pageSizes: [10, 20, 30, 40],默认
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
            }
        },
        computed: {
            option(){
                return{
                    labelWidth:300,
                    size:"mini",
                    submitText: '提现申请',
                    menuPostion : 'left',
                    emptyBtn:false,
                    submitBtn:false,
                    column: [
                        {
                            label: "冲正金额",
                            prop: "amount",
                            span: 12,
                            type: "number",
                            precision: 2,
                            row: true
                        },
                        {
                            label: "商户ID",
                            prop: "userid",
                            span: 12,
                            type: "text",
                            row: true
                        },
                        {
                            label: "备注",
                            prop: "memo1",
                            span: 12,
                            type: "text",
                            row: true
                        }

                    ]
                }
            },
            option0(){
                return {
                    highlightCurrentRow:true,
                    border:true,
                    align:'center',
                    menuAlign:'center',
                    page:true,
                    overHidden:true,
                    size:'mini',
                    column:[
                        {
                            label:'银行名称',
                            prop:'bank_name'
                        }, {
                            label:'开户人',
                            prop:'open_name'
                        }, {
                            label:'支行',
                            prop:'open_bank'
                        }, {
                            label:'银行卡号',
                            prop:'bank_card_number'
                        }
                    ]
                }
            }
        },
        mounted(){
            get_bal({
                "callback" : (res) => {
                    this.obj = res.data.data
                }
            })
        },
        methods:{
            submit () {
                this.$refs.form.validate(vaild=> {
                    if (vaild) {
                        this.$confirm('确认提交吗?', '提示', {
                            type: 'warning'
                        }).then(() => {
                            this.subloding = true
                            correct({
                                data : {
                                    amount : this.obj.amount,
                                    userid : this.obj.userid,
                                    memo1 : this.obj.memo1
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

<style>
</style>
