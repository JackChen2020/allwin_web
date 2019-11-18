<template>
    <basic-container>

        <avue-form ref="form" v-model="obj"
                   :option="option">
            <template slot="menuForm">
                <el-button v-if="subloding===false" type="primary" @click="submit">充值</el-button>
                <el-button v-else type="primary" icon="el-icon-loading">充值</el-button>
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


        <!--        <el-dialog title="验证谷歌验证码" :visible.sync="googleFlag"  >-->
        <!--            <avue-form ref="form" v-model="obj10"-->
        <!--                       :option="option1">-->
        <!--            </avue-form>-->
        <!--        </el-dialog>-->
    </basic-container>
</template>



<script>

    import { get_bal,cashout,bankinfo_query,bankinfo_upd,bankinfo_del,bankinfo_add,check_google_token,neichong } from '~/api/request/request'
    import { timestampToTime } from '~/api/utils'

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
                            label: "充值金额",
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
                                   } else {
                                       callback();
                                   }
                               },
                           }],
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
                    console.log(this.obj)
                }
            })
        },
        methods:{
            submit () {
                this.$refs.form.validate(vaild=> {
                    if (vaild) {
                        this.$confirm('确认充值吗?', '提示', {
                            type: 'warning'
                        }).then(() => {
                            this.subloding = true
                            neichong({
                                data : {
                                    bank : this.bankinfo,
                                    amount : this.obj.amount
                                },
                                callback : (res) => {
                                    this.obj.amount =0.0
                                    window.open(res.data.data.url, '_blank');
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

<style >
    .avue-form__menu{
        width:500px;
    }
</style>

