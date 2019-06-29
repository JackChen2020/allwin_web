<template>
    <section >

        <el-form :inline="true" :model="filters" size="mini">
            <el-form-item >
                <el-input v-model="filters.userid" :clearable="true" placeholder="商户ID"></el-input>
            </el-form-item>
            <el-form-item >
                <el-input v-model="filters.memo" :clearable="true" placeholder="摘要"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="RequestQuery" :loading="listLoading">查询</el-button>
            </el-form-item>
        </el-form>

        <el-table
                :data="vlist"
                height="500"
                highlight-current-row
                v-loading="listLoading"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                border
                :fit="true"
                size="mini">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="40">
            </el-table-column>
            <el-table-column prop="userid" label="商户ID" width="100" sortable align="center">
            </el-table-column>
            <el-table-column prop="createtime" label="操作时间" width="150" sortable align="center">
            </el-table-column>
            <el-table-column prop="memo" label="摘要" width="90" sortable align="center">
            </el-table-column>
            <el-table-column prop="bal" label="交易前余额" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="amount" label="交易金额" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="confirm_bal" label="交易后余额" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="ordercode" label="订单号" width="100" sortable align="center">
            </el-table-column>
        </el-table>

        <el-col :span="24" class="toolbar">
            <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 30, 50, 100,200,500,1000,2000,5000]"
                    :page-size="pagesize"
                    :total="total"
                    :pager-count="5"
                    style="float:right;">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>
    import { paytype_add,paytype_upd,paytype_del,order_query,order_status_upd,ballist_query  } from '~/api/request/request';
    import { dateformart , Decrypt , Encrypt} from '~/api/utils'
    export default {
        data() {
            return {
                today_amount : 0.0,
                tot_amount : 0.0,
                today_order_tot_count : 0 ,
                today_order_ok_count : 0 ,
                tot_order_tot_count : 0 ,
                tot_order_ok_count : 0,
                filters: {
                    querytime:'',
                    ordercode:'',
                    status:'',
                    no:'',
                    userid:'',
                    memo:''
                },
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                vlist:[],
                listLoading: false,
                total:0,
                page:1,
                pagesize:10,
                addFlag:false,
                addForm:{
                },
                addFormRules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择类型', trigger: 'blur' }
                    ]
                },
                addLoading:false,
                updFlag:false,
                updForm:{},
                updLoading:false,
                selectData:[]
            }
        },
        methods:{
            handleSelectionChange(val){
                this.selectData = val
            },
            clickUpdOrderStatus(){
                if(this.selectData.length==0){
                    this.$message.error('请勾选订单!')
                }else{
                    this.addLoading = true;
                    let orders = []
                    this.selectData.forEach(item => {
                        if(item.status === '1'){
                            orders.push(item.ordercode)
                        }
                    })
                    order_status_upd({
                        data : {"orders" : orders},
                        callback : (res) => {
                            this.addLoading = false;
                            this.$message.success("手工上分成功!")
                            this.RequestQuery()
                        },
                        errorcallback : () => {
                            this.addLoading = false;
                        }
                    })
                }
            },
            addSubmit() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            paytype_add({
                                data :this.addForm,
                                callback : () => {
                                    this.addLoading = false;
                                    this.$refs['addForm'].resetFields();
                                    this.addFlag= false;
                                    this.$message({
                                        message : "添加成功!"
                                    })
                                    this.RequestQuery()
                                },
                                errorcallback : () => {
                                    this.addLoading = false;
                                    this.addFlag = false;
                                }
                            })
                        })
                    }
                })
            },
            updSubmit() {
                this.$refs.updForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.updLoading = true;
                            paytype_upd({
                                data :this.updForm,
                                callback : () => {
                                    this.updLoading = false;
                                    this.$refs['updForm'].resetFields();
                                    this.updFlag= false;
                                    this.$message({
                                        message : "编辑成功!"
                                    })
                                    this.RequestQuery()
                                },
                                errorcallback : () => {
                                    this.updLoading = false;
                                    this.updFlag = false;
                                }
                            })
                        })
                    }
                })
            },
            tableRowClassName({row, rowIndex}) {
                if (row.status === "0") {
                    return 'success-row';
                } else if (row.status === "1") {
                    return 'warning-row';
                }
                return '';
            },
            updHandler(row){
                this.updForm = Object.assign({}, row);
                this.updFlag = true
            },
            delHandler(row){
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    paytype_del({
                        data : { paytypeid : row.paytypeid },
                        callback : () => {
                            this.RequestQuery()
                        },
                        errorcallback : () => {
                            this.listLoading = false;
                        }
                    })
                }).catch(() => {
                })
            },
            handlerEdit(row){
            },
            handleSizeChange(val) {
                this.pagesize = val;
                this.RequestQuery()
            },
            handleCurrentChange(val) {
                this.page = val;
                this.RequestQuery()
            },
            RequestQuery(){
                this.listLoading=true

                ballist_query({
                    params : {
                        page:this.page,
                        page_size: this.pagesize,
                        userid : this.filters.userid,
                        memo : this.filters.memo
                    },
                    callback : (res) => {
                        this.vlist = res.data.data
                        this.total = Number(res.headers.total)
                        this.listLoading=false
                    },
                    errorcallback : () => {
                        this.listLoading=false
                    }
                })
            }
        },
        mounted(){
            this.RequestQuery()
        }
    }
</script>

<style>
    .el-table .warning-row {
        background: #5261fd;
    }

    .el-table .success-row {
        background: #f92489;
    }
</style>
