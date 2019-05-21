<template>
    <section >

        <el-table
                :data="vlist"
                highlight-current-row
                v-loading="listLoading"
                style="width: 100%;"
                :border=true
                :fit=true
                size="mini"
                height="500">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="userid" label="用户ID" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="100" sortable align="center">
            </el-table-column>
            <el-table-column prop="loginname" label="登录名" width="100" sortable align="center">
            </el-table-column>
            <el-table-column prop="rolename" label="用户类型" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="createtime" label="登录时间" width="190" sortable align="center">
            </el-table-column>
            <el-table-column prop="ip" label="IP地址" width="90" sortable align="center">
            </el-table-column>
            <el-table-column prop="chrom" label="登录设备" width="190" sortable align="center">
            </el-table-column>
            <el-table-column prop="windows" label="登录系统" width="190" sortable align="center">
            </el-table-column>
        </el-table>

        <el-col :span="24" class="toolbar">
            <el-pagination
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                    :page-size="20"
                    :total="total"
                    :pager-count="5"
                    style="float:right;">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>
import { request_loginquery } from '../api/request/request';
export default {
    data() {
        return {
            vlist:[],
            listLoading: false,
            total:0,
            page:1
        }
    },
    methods:{
        handleCurrentChange(val) {
            this.page = val;
            this.RequestLoginquery()
        },
        RequestLoginquery(){
            this.listLoading=true
            request_loginquery({
                params : {
                    page:this.page
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
        this.RequestLoginquery()
    }
}
</script>

<style scoped>

</style>
