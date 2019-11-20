<template>
    <section >
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" size="mini">
                <el-form-item >
                    <el-input v-model="filters.ordercode" :clearable="true" placeholder="订单号"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input v-model="filters.no" :clearable="true" placeholder="流水号"></el-input>
                </el-form-item>
            </el-form>
            <el-form :inline="true" :model="filters" size="mini">
                <el-form-item >
                    <el-select v-model="filters.status" :clearable="true" placeholder="支付状态">
                        <el-option label="支付成功" value="0"></el-option>
                        <el-option label="等待支付" value="1"></el-option>
                        <el-option label="订单过期" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item >
                    <el-select v-model="filters.down_status" :clearable="true" placeholder="商户订单支付状态">
                        <el-option label="支付成功" value="0"></el-option>
                        <el-option label="等待支付" value="1"></el-option>
                        <el-option label="回调失败" value="2"></el-option>
                        <el-option label="订单过期" value="3"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-form :inline="true" :model="filters" size="mini">
                <el-form-item >
                    <el-date-picker
                            v-model="filters.querytime"
                            type="daterange"
                            align="right"
                            placeholder="选择订单日期"
                            range-separator="至"
                            start-placeholder="订单开始日期"
                            end-placeholder="订单结束日期"
                            unlink-panels
                            :picker-options="pickerOptions2">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="RequestQuery" :loading="listLoading">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-button @click="exportExcel" style="margin-top: 2px;" size="medium" type="success">导出</el-button>
        </el-col>


        <el-table
                id="rebateSetTable"
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
            <el-table-column prop="ordercode" label="订单ID" width="90" sortable align="center">
            </el-table-column>
            <el-table-column prop="no" label="流水号" width="200" sortable align="center">
            </el-table-column>
            <el-table-column prop="status_name" label="支付状态" width="100" sortable align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status=== '0'" style="color: #95e61a">{{scope.row.status_name}}</span>
                    <span v-else-if="scope.row.status=== '1'" style="color: #abd5f9">{{scope.row.status_name}}</span>
                    <span v-else style="color: #e62b32">{{scope.row.status_name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="down_status_name" label="商户订单支付状态" width="150" sortable align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.down_status=== '0'" style="color: #95e61a">{{scope.row.down_status_name}}</span>
                    <span v-else-if="scope.row.down_status=== '1'" style="color: #abd5f9">{{scope.row.down_status_name}}</span>
                    <span v-else style="color: #e62b32">{{scope.row.down_status_name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="createtime" label="订单时间" width="150" sortable align="center">
            </el-table-column>
            <el-table-column prop="amount" label="订单金额" width="100" sortable align="center">
            </el-table-column>
            <el-table-column prop="confirm_amount" label="收款金额" width="100" sortable align="center">
            </el-table-column>
            <el-table-column prop="tech_cost" label="总技术费" width="100" sortable align="center">
            </el-table-column>
            <el-table-column prop="paytypename" label="支付方式" width="110" sortable align="center">
            </el-table-column>

            <el-table-column  label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button v-show="scope.row.down_status==='2'" type="primary" size="mini" icon="el-icon-edit" circle @click="callbackBusi(scope.row)">补发通知</el-button>
                </template>
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

        <el-dialog title="添加" :visible.sync="addFlag" :close-on-click-modal="false">
            <el-form :model="addForm" status-icon label-width="100px" :rules="addFormRules" ref="addForm" label-position='left' size="mini">
                <el-form-item label="名称" prop="name">
                    <el-input
                            v-model="addForm.name"
                            placeholder="请输入名称">
                    </el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="addForm.type" placeholder="请选择类型">
                        <el-option label="支付宝" value="0"></el-option>
                        <el-option label="微信" value="1"></el-option>
                        <el-option label="银联" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFlag = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑" :visible.sync="updFlag" :close-on-click-modal="false">
            <el-form :model="updForm" status-icon label-width="100px" :rules="addFormRules" ref="updForm" label-position='left' size="mini">
                <el-form-item label="名称" prop="name">
                    <el-input
                            v-model="updForm.name"
                            placeholder="请输入名称">
                    </el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="updForm.type" placeholder="请选择类型">
                        <el-option label="支付宝" value="0"></el-option>
                        <el-option label="微信" value="1"></el-option>
                        <el-option label="银联" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="updFlag = false">取消</el-button>
                <el-button type="primary" @click.native="updSubmit" :loading="updLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import { paytype_add,paytype_upd,paytype_del,order_query,order_status_upd,callback_business  } from '~/api/request/request';
    import { dateformart , Decrypt , Encrypt} from '~/api/utils'
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'

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
                    down_status:''
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
            callbackBusi(row){
                this.$confirm('确认补发通知吗？', '提示', {}).then(() => {
                    callback_business({
                        data :{
                            "ordercode" : row.ordercode
                        },
                        callback : () => {
                            this.RequestQuery()
                            this.$message({message : "补发通知成功!"})
                        }
                    })
                })
            },
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
            exportExcel () {
                /* generate workbook object from table */
                var xlsxParam = { raw: true }
                let wb = XLSX.utils.table_to_book(document.querySelector('#rebateSetTable'),xlsxParam);
                /* get binary string as output */
                // wb.Sheets.forEach( item => {
                //     con
                // })
                // console.log(wb.Sheets)

                let dic = wb.Sheets.Sheet1
                for (var key in dic){
                    var item = dic[key];

                    if(item.v == '补发通知' || key == 'A1'){
                        delete dic[key]
                    }

                    // if(item.v){
                    //     item.v = item.v.toString()
                    // }
                }
                let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
                try {
                    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' } ), '订单信息.xlsx');
                } catch (e)
                {
                    if (typeof console !== 'undefined')
                        console.log(e, wbout)
                }
                return wbout
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

                let startdate=""
                let enddate=""
                if(this.filters.querytime && this.filters.querytime[0] && this.filters.querytime[1]){
                    startdate=dateformart(this.filters.querytime[0])+' 00:00:01'
                    enddate=dateformart(this.filters.querytime[1])+' 23:59:59'
                }

                order_query({
                    params : {
                        page:this.page,
                        page_size: this.pagesize,
                        ordercode : this.filters.ordercode,
                        startdate : startdate ,
                        enddate : enddate,
                        status : this.filters.status,
                        no : this.filters.no,
                        down_status : this.filters.down_status
                    },
                    callback : (res) => {
                        this.vlist = res.data.data.data
                        this.today_amount = res.data.data.today_amount
                        this.tot_amount = res.data.data.tot_amount
                        this.today_order_tot_count = res.data.data.today_order_tot_count
                        this.today_order_ok_count = res.data.data.today_order_ok_count
                        this.tot_order_tot_count = res.data.data.tot_order_tot_count
                        this.tot_order_ok_count = res.data.data.tot_order_ok_count
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
