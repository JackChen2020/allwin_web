<template>
    <section >
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

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

                <el-form :inline="true" :model="filters" size="mini">
                    <el-form-item >
                        <el-input v-model="filters.userid" :clearable="true" placeholder="商户ID"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="RequestQuery" :loading="listLoading">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-form>
        </el-col>


        <el-table
                :data="vlist"
                height="400"
                highlight-current-row
                v-loading="listLoading"
                style="width: 100%;"
                border
                :fit="true"
                size="mini">
            <el-table-column type="index" width="40">
            </el-table-column>
            <el-table-column prop="userid" label="商户ID" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="today" label="日期" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="today_amount" label="流水" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="today_rate" label="成功率" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="tot_order_count" label="订单数" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="today_success_order_count" label="成功订单数" width="150" sortable align="center">
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
    import { finance_order_count  } from '~/api/request/request';
    import { dateformart } from '~/api/utils'
    export default {
        data() {
            return {
                filters: {
                    querytime:'',
                    userid:''
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
                pagesize:10
            }
        },
        methods:{
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

                finance_order_count({
                    params : {
                        page:this.page,
                        page_size: this.pagesize,
                        startdate : startdate ,
                        enddate : enddate,
                        userid: this.filters.userid
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
</style>
