<template>
    <section >
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form :inline="true" :model="filters" size="mini">
                <el-form-item >
                    <el-date-picker
                            v-model="filters.today"
                            align="right"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>

                <el-form-item >
                    <el-input v-model="filters.paypassid" :clearable="true" placeholder="上游ID"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="RequestQuery" :loading="listLoading">查询</el-button>
                </el-form-item>
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
            <el-table-column prop="id" label="上游ID" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="name" label="上游名称" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="amount" label="流水" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="rate" label="成功率" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="order_success_count" label="成功订单" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="order_count" label="订单数" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="today" label="日期" width="150" sortable align="center">
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
    import { pass_count  } from '~/api/request/request';
    import { dateformart } from '~/api/utils'
    export default {
        data() {
            return {
                filters: {
                    paypassid:'',
                    today:''
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
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

                if(this.filters.today){
                    this.filters.today=dateformart(this.filters.today)
                }

                pass_count({
                    params : {
                        page:this.page,
                        page_size: this.pagesize,
                        paypassid: this.filters.paypassid,
                        today : this.filters.today
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
