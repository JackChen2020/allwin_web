<template>
    <section >

        <!--<el-col :span="24" class="toolbar">-->
        <!--<el-button type="primary" icon="el-icon-check" @click="CashoutConfirm" size="mini" :loading="ButtonLoading">提现申请通过</el-button>-->
        <!--<el-button type="danger" icon="el-icon-delete" @click="CashoutCancel" size="mini" :loading="ButtonLoading1">提现申请拒绝</el-button>-->
        <!--</el-col>-->

        <el-table
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
            <el-table-column prop="name" label="支付方式" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="rate" label="费率(%)" width="100" sortable align="center">
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

    import { rate_query  } from '~/api/request/request'

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
                selectData1:[]
            }
        },
        methods:{
            handleSelectionChange(val){
                this.selectData = val
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
                rate_query({
                    params : {
                        page:this.page,
                        page_size:this.pagesize
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
