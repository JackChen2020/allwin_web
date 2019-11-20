<template>
    <basic-container >

        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" size="mini">
                <el-form-item >
                    <el-input v-model="filters.ordercode" :clearable="true" placeholder="订单号"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input v-model="filters.no" :clearable="true" placeholder="商户订单号"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-select v-model="filters.df_status" :clearable="true" placeholder="支付状态">
                        <el-option label="支付成功" value="1"></el-option>
                        <el-option label="支付中" value="0"></el-option>
                        <el-option label="支付失败" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-form :inline="true" :model="filters" size="mini">

                <el-form-item >
                    <el-input v-model="filters.bank_name" :clearable="true" placeholder="银行名称"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input v-model="filters.open_name" :clearable="true" placeholder="开户人"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input v-model="filters.bank_card_number" :clearable="true" placeholder="银行卡号"></el-input>
                </el-form-item>


            </el-form>

            <el-form :inline="true" :model="filters" size="mini">
                <el-form-item >
                    <el-input v-model="filters.amount" :clearable="true" placeholder="金额"></el-input>
                </el-form-item>

                <el-form-item >
                    <el-input v-model="filters.memo" :clearable="true" placeholder="备注"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-select v-model="filters.sort" :clearable="true" placeholder="排序">
                        <el-option label="按时间倒序" value="0"></el-option>
                        <el-option label="按时间正序" value="1"></el-option>
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
                :summary-method="getSummaries"
                show-summary
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

            <el-table-column prop="ordercode" label="订单ID" width="220" sortable align="center">
            </el-table-column>
            <el-table-column prop="downordercode" label="商户订单ID" width="140" sortable align="center">
            </el-table-column>
            <el-table-column prop="amount" label="申请金额" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="bank_name" label="开户银行" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="open_name" label="开户人" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="open_bank" label="支行" width="100" sortable align="center">
            </el-table-column>
            <el-table-column prop="bank_card_number" label="银行卡号" width="130" sortable align="center">
            </el-table-column>
            <el-table-column prop="createtime" label="申请时间" width="150" sortable align="center">
            </el-table-column>
            <el-table-column prop="memo" label="备注" width="150" sortable align="center">
            </el-table-column>
            <el-table-column prop="df_status_format" label="支付状态" width="100" sortable align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.df_status=== '1'" style="color: #95e61a">{{scope.row.df_status_format}}</span>
                    <span v-else-if="scope.row.df_status=== '0'" style="color: #abd5f9">{{scope.row.df_status_format}}</span>
                    <span v-else style="color: #e62b32">{{scope.row.df_status_format}}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button type="primary"  circle size="mini" @click="QueryOrderHandler(scope.row)">查询状态</el-button>
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

    </basic-container>
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
                    passid:'',
                    df_status:"",
                    memo:"",
                    bank_card_number:"",
                    bank_name:"",
                    open_name:"",
                    amount:"",
                    sort:""
                },
            }
        },
        methods:{
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    if (index !== 4) {
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] += ' 元';
                    } else {
                        sums[index] = 'N/A';
                    }
                });

                return sums;
            },
            exportExcel (sort) {

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

                    if(item.v == '操作' || key == 'A1' || item.v == '查询状态'){
                        delete dic[key]
                    }
                }
                console.log(dic)
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
                        row.df_status_format = res.data.data
                        this.$message(res.data.data)
                    }
                })
            },
            handleSelectionChange(val){
                this.selectData = val
                console.log(this.selectData)
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

                cashoutlist_df_query({
                    params : {
                        page:this.page,
                        page_size:this.pagesize,
                        startdate : startdate ,
                        enddate : enddate,
                        no : this.filters.no,
                        ordercode : this.filters.ordercode,
                        df_status : this.filters.df_status,
                        memo:this.filters.memo,
                        sort:this.filters.sort,
                        bank_card_number:this.filters.bank_card_number,
                        bank_name:this.filters.bank_name,
                        open_name:this.filters.open_name,
                        amount:this.filters.amount,
                    },
                    callback : (res) => {
                        this.vlist = res.data.data
                        this.total = Number(res.headers.total)
                        this.listLoading=false
                        console.log(this.vlist)
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
