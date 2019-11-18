<template>
    <div>

        <basic-container >
            <avue-form ref="form" v-model="obj"
                       :option="option">
                <template slot="menuForm">
                    <el-button v-if="subloding===false" type="primary" @click="submit">提现申请</el-button>
                    <el-button v-else type="primary" icon="el-icon-loading">提现申请</el-button>
                </template>
            </avue-form>
            <el-dialog title="银行卡设置" :visible.sync="isFlag" >
                <avue-crud ref="crud" :data="data" :option="option0" @row-click="handleCurrentRowChange"
                           :page="page"
                           @size-change="sizeChange"
                           @current-change="currentChange"
                           @row-save="rowSave"
                           @row-update="rowUpdate"
                           @row-del="rowDel"
                           @refresh-change="refresh"></avue-crud>
            </el-dialog>
        </basic-container>

        <el-dialog title="消息" width="50%" :visible.sync="noticeFlag" :close-on-click-modal="false">
            <el-tabs v-model="activeName">
                <el-tab-pane label="代付订单消息" name="first"></el-tab-pane>
                <el-tab-pane label="消息(2)" name="second"></el-tab-pane>
            </el-tabs>
            <avue-notice :data="noticeData"  :option="noticeOption" @page-change="pageChange"></avue-notice>
        </el-dialog>
    </div>

</template>



<script>

    let list = [{
        ordercode: 'DF0112312301023123123',
        createtime: '05-08 15:08',
        df_status_format: '支付成功',
        df_status: 1
    }, {
        ordercode: 'DF0112312301023113223',
        createtime: '05-08 15:08',
        df_status_format: '支付失败',
        df_status: 2
    }, {
        ordercode: 'DF0112312301023113023',
        createtime: '05-08 15:08',
        df_status_format: '支付中',
        df_status: 0
    }]

    import { get_bal,cashout,bankinfo_query,cashout_daifusb,bankinfo_upd,bankinfo_del,bankinfo_add,check_google_token,cashoutlist_df_query } from '~/api/request/request'
    import { timestampToTime } from '~/api/utils'

    export default {
        data() {
            return {
                noticeFlag:false,
                noticeData:list,
                activeName:'first',
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
                noticeOption: {
                    props: {
                        title: 'ordercode',
                        subtitle: 'createtime',
                        tag: 'df_status_format',
                        status: 'df_status'
                    },
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
                            label: "余额",
                            prop: "bal",
                            span:12,
                            readonly:true,
                            row:true,
                        },
                        {
                            label: "已提现待审核金额",
                            prop: "cashout_bal",
                            span:12,
                            readonly:true,
                            row:true,
                        },
                        {
                            label: "提现手续费",
                            prop: "fee_rule",
                            span:12,
                            readonly:true,
                            row:true,
                        },
                        {
                            label: "提现",
                            prop: "amount",
                            span: 12,
                            type: "number",
                            precision: 2,
                            row: true,
                            rules: [{
                                required: true,
                                validator: (rule, value, callback) => {
                                    if (value <= 0) {
                                        callback(new Error('提现金额必须大于0'));
                                    } else if (value > this.obj.bal - this.obj.cashout_bal - this.obj.fee_rule) {
                                        callback(new Error('提现金额不能大于可提余额!'));
                                    } else {
                                        callback();
                                    }
                                },
                            }],
                        },
                        {
                            label: "银行卡信息",
                            prop: "bankinfo",
                            span:12,
                            row:true,
                            type: 'text',
                            parent:false,
                            placeholder:"请选择银行信息",
                            rules: [{
                                required: true,
                                message: "请选择银行信息"
                            }],
                            click: this.bankinfo_handler,
                        },
                        {
                            label: "支付密码",
                            prop: "pay_passwd",
                            span:12,
                            type:"password",
                            rules: [{
                                required: true,
                                message: "请输入支付密码"
                            }],
                            row:true,
                        },
                        {
                            label: "备注",
                            prop: "memo",
                            span:12,
                            row:true,
                        },
                        {
                            label: "谷歌验证码",
                            prop: "vercode",
                            span:12,
                            type:"text",
                            rules: [{
                                required: true,
                                message: "请输入谷歌验证码"
                            }],
                            row:true,
                        },
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
            this.getBal1()
        },
        methods:{
            pageChange(page, done) {
                setTimeout(() => {
                    this.$message.success('页码' + page)
                    this.noticeData = this.noticeData.concat(list);
                    done();
                }, 1000)

            },
            getBal1(){
                get_bal({
                    "callback" : (res) => {
                        this.obj = res.data.data
                        console.log(this.obj)
                    }
                })
            },
            submit () {
                this.$refs.form.validate(vaild=> {
                    if (vaild) {
                        this.$confirm('确认提现吗?', '提示', {
                            type: 'warning'
                        }).then(() => {
                            this.subloding = true
                            cashout_daifusb({
                                data : {
                                    vercode : this.obj.vercode,
                                    bank : this.bankinfo,
                                    pay_passwd : this.$md5(this.obj.pay_passwd),
                                    amount : this.obj.amount,
                                    memo : this.obj.memo
                                },
                                callback : (res) => {
                                    this.$set(this.obj,"amount",0.0)
                                    this.$set(this.obj,"memo","")
                                    this.$set(this.obj,"bankinfo","")
                                    this.$set(this.obj,"pay_passwd","")
                                    this.$set(this.obj,"vercode","")
                                    this.getBal1()
                                    this.$message.success("成功,请在下方的提现列表查看是否到账!")
                                    this.subloding = false
                                    // this.noticeFlag = true
                                },
                                errorcallback : () => {
                                    this.subloding = false
                                }
                            })
                        }).catch(() => {
                        })
                    }
                })
            },
            bankinfo_handler () {
                this.isFlag = true
                this.bankQuery()
            },
            handleCurrentRowChange (row, event, column) {
                this.$set(this.obj,'bankinfo', row.open_name + ' ' + row.bank_name + ' ' + row.bank_card_number )
                this.bankinfo = row
                this.isFlag = false
            },
            bankQuery(){
                // bankinfo_query({
                //     params : {
                //         page : this.page.currentPage,
                //         page_size : this.page.pageSize
                //     },
                //     callback : (res)=> {
                //         this.data = res.data.data
                //         this.page.total = Number(res.headers.total)
                //
                //     }
                // })

            },
            GoogleCheck(callback){
                check_google_token({
                    data : {
                        "vercode":this.obj10.vercode
                    },
                    callback : callback
                })
            },
            rowSave(form,done,loading){
                loading();
                this.data.push(form)
                done();
                // bankinfo_add({
                //     data : form,
                //     callback : ()=>{
                //         done();
                //         this.bankQuery()
                //         this.$message.success("新增成功!")
                //     },
                //     errorcallback : ()=>{
                //         done();
                //     }
                // })
            },
            refresh(val){
                this.bankQuery()
            },
            rowDel(form,index){
                bankinfo_del({
                    data : {"id":form.id},
                    callback : ()=>{
                        this.bankQuery()
                        this.$message.success("删除成功!")
                    },
                    errorcallback : ()=>{
                    }
                })
            },
            rowUpdate(form,index,done,loading){
                loading();
                bankinfo_upd({
                    data : form,
                    callback : ()=>{
                        done();
                        this.bankQuery()
                        this.$message.success("编辑成功!")
                    },
                    errorcallback : ()=>{
                        done();
                    }
                })
            },
            sizeChange(val) {
                this.page.currentPage = 1
                this.page.pageSize = val
                this.bankQuery()
            },
            currentChange(val) {
                this.page.currentPage = val
                this.bankQuery()
            }
        }
    }
</script>

<style >
    .avue-form__menu{
        width:500px;
    }
</style>

