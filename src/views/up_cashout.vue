<template>
    <div>
        <avue-form ref="form" v-model="obj"
                   :option="option">
            <template slot="menuForm">
                <el-button v-if="subloding===false" type="primary" @click="submit">提现申请</el-button>
                <el-button v-else type="primary" icon="el-icon-loading">提现申请</el-button>
            </template>
        </avue-form>

        <el-dialog title="银行卡设置" :visible.sync="isFlag"  >
            <avue-crud ref="crud" :data="data" :option="option0" @row-click="handleCurrentRowChange"
                       :page="page"
                       @size-change="sizeChange"
                       @current-change="currentChange"
                       @row-save="rowSave"
                       @row-update="rowUpdate"
                       @row-del="rowDel"
                       @refresh-change="refresh"></avue-crud>
        </el-dialog>
    </div>
</template>



<script>

    import { get_help,cashout,bankinfo_query,bankinfo_upd,bankinfo_del,bankinfo_add,up_cashout } from '~/api/request/request'
    import { timestampToTime } from '~/api/utils'

    export default {
        data() {
            return {
                obj:{userid:''},
                obj1:{},
                subloding:false,
                data:[],
                lastuserid:0,
                isFlag:false,
                dicData:[],
                bankinfo:{},
                userids :[],
                page: {
                    //pageSizes: [10, 20, 30, 40],默认
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
            }
        },
        watch: {
            obj: {
                handler(newName, oldName) {
                    if(newName.userid !== this.lastuserid && newName.userid >0){
                        this.userids.forEach(item => {
                            if(newName.userid === item.userid){
                                newName.confirm_bal = (item.up_bal - item.bal - item.cashout_bal).toFixed(2)
                                newName.cashout_bal = item.cashout_bal
                            }
                        })
                    }
                    this.lastuserid = newName.userid
                },
                deep: true
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
                            label: "码商",
                            prop: "userid",
                            dicData: this.dicData,
                            type:'select',
                            span:10,
                            placeholder:"请选择码商信息",
                            rules: [{
                                required: true,
                                message: "请选择码商信息"
                            }],
                            row:true,
                        },
                        {
                            label: "可提余额",
                            prop: "confirm_bal",
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
                                    } else if (value > this.obj.confirm_bal) {
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
            this.QueryData()
        },
        methods:{
            QueryData(){
                get_help({
                    "params":{
                        "status" : "0",
                        "page" : 1,
                        "page_size" : 999999,
                        "type" : "3"
                    },
                    "callback": (res)=>{
                        this.userids=res.data.data
                        this.userids.forEach(item =>{
                            this.dicData.push({
                                label:item.name,
                                value: item.userid
                            })
                        })
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
                            up_cashout({
                                data : {
                                    bank : this.bankinfo,
                                    userid : this.obj.userid,
                                    pay_passwd : this.$md5(this.obj.pay_passwd),
                                    amount : this.obj.amount
                                },
                                callback : (res) => {
                                    this.$set(this.obj,"pay_passwd","")
                                    this.$set(this.obj,"bankinfo","")
                                    this.$set(this.obj,"amount",0.0)
                                    this.obj.confirm_bal = (res.data.data.up_bal - res.data.data.bal - res.data.data.cashout_bal).toFixed(2)
                                    this.obj.cashout_bal = res.data.data.cashout_bal.toFixed(2)
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
                bankinfo_query({
                    params : {
                        page : this.page.currentPage,
                        page_size : this.page.pageSize
                    },
                    callback : (res)=> {
                        this.data = res.data.data
                        this.page.total = Number(res.headers.total)

                    }
                })

            },
            rowSave(form,done,loading){

                loading();
                bankinfo_add({
                    data : form,
                    callback : ()=>{
                        done();
                        this.bankQuery()
                        this.$message.success("新增成功!")
                    },
                    errorcallback : ()=>{
                        done();
                    }
                })
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

<style>
</style>
