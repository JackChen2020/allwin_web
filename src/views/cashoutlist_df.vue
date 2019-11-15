<template>
    <section >

        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" size="mini">
                <el-form-item >
                    <el-input v-model="filters.ordercode" :clearable="true" placeholder="订单号"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input v-model="filters.no" :clearable="true" placeholder="商户订单号"></el-input>
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
                @selection-change="handleSelectionChange"
                style="width: 100%;"
                border
                :fit="true"
                size="mini">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="40">
            </el-table-column>

            <el-table-column prop="ordercode" label="订单ID" width="160" sortable align="center">
            </el-table-column>
            <el-table-column prop="downordercode" label="商户订单ID" width="140" sortable align="center">
            </el-table-column>
            <el-table-column prop="amount" label="申请金额" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="bank_name" label="开户银行" width="100" sortable align="center">
            </el-table-column>
            <el-table-column prop="open_name" label="开户人" width="150" sortable align="center">
            </el-table-column>
            <el-table-column prop="open_bank" label="支行" width="100" sortable align="center">
            </el-table-column>
            <el-table-column prop="bank_card_number" label="银行卡号" width="130" sortable align="center">
            </el-table-column>
            <el-table-column prop="createtime" label="申请时间" width="150" sortable align="center">
            </el-table-column>
            <el-table-column prop="textstatus" label="状态" width="100" sortable align="center">
            </el-table-column>

            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button type="primary"  circle size="mini" @click="QueryOrderHandler(scope.row)">查询状态</el-button>
                    <!--                    <el-button type="primary" icon="el-icon-edit" circle @click="CashoutConfirm(scope.row)" size="mini" :loading="ButtonLoading"></el-button>-->
                    <!--                    <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="CashoutCancel(scope.row)" :loading="ButtonLoading1"></el-button>-->
                </template>
            </el-table-column>

        </el-table>

        <!--分页-->
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

    import { cashoutlist_df_query,daifuOrderQuery } from '~/api/request/request'
    import { dateformart } from '~/api/utils'
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'


    export default {

        data() {
            return {
                vlist:[],
                listLoading: false,
                ButtonLoading: false,
                ButtonLoading1 : false,
                total:0,
                page:1,
                pagesize:10,
                roles:[],
                addFlag:false,
                selectData:[],
                selectData1:[],
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
                filters: {
                    querytime:'',
                    ordercode:'',
                    status:'',
                    no:'',
                    userid:'',
                    name:'',
                    down_status:'',
                    passid:''
                },
            }
        },
        methods:{
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

                    console.log(key,item)
                    if(item.v == '补发通知' || key == 'A1'){
                        delete dic[key]
                    }

                    // if(item.v){
                    //     item.v = item.v.toString()
                    // }
                }
                let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
                try {
                    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' } ), '代付订单明细.xlsx');
                } catch (e)
                {
                    if (typeof console !== 'undefined')
                        console.log(e, wbout)
                }
                return wbout
            },
            QueryOrderHandler(row){
                // console.log(row.ordercode[0])
                daifuOrderQuery({
                    data:{
                        id:row.id,
                        dfordercode:row.ordercode[0],
                        paypassid : row.paypassid
                    },
                    callback : (res)=>{
                        this.RequestQuery()
                    }
                })
            },
            handleSelectionChange(val){
                this.selectData = val
                console.log(this.selectData)
            },
            // CashoutConfirm(row){
            //     this.$confirm('确认通过提现申请吗？', '提示', {}).then(() => {
            //         this.ButtonLoading = true;
            //         cashout_confirm({
            //             data : {"userid": row.userid,"id":row.id},
            //             callback : () => {
            //                 this.ButtonLoading = false;
            //                 this.$message.success('提现通过处理成功!')
            //                 this.RequestQuery()
            //             },
            //             errorcallback : () => {
            //                 this.ButtonLoading = false;
            //             }
            //         })
            //     })
            // },
            // CashoutCancel(row){
            //     console.log("row:",row)
            //     this.$confirm('确认拒绝提现申请吗？', '提示', {}).then(() => {
            //         this.ButtonLoading1 = true;
            //         cashout_cancel({
            //             data : {"userid": row.userid,"id":row.id},
            //             callback : () => {
            //                 this.ButtonLoading1 = false;
            //                 this.$message.success('提现拒绝处理成功!')
            //                 this.RequestQuery()
            //             },
            //             errorcallback : () => {
            //                 this.ButtonLoading1 = false;
            //             }
            //         })
            //     })
            // },
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

                cashoutlist_df_query({
                    params : {
                        page:this.page,
                        page_size:this.pagesize,
                        startdate : startdate ,
                        enddate : enddate,
                        no : this.filters.no,
                        ordercode : this.filters.ordercode
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

<style scoped>

</style>
