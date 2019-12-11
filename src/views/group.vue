<template>
    <basic-container>
        <avue-crud :data="data" :option="option" v-model="obj"
                   :page="page"
                   @size-change="sizeChange"
                   @current-change="currentChange"
                   @search-change="searchChange"
                   @refresh-change="refresh"
                   :table-loading="loading">


            <template slot="menuLeft">
                <el-button type="primary" size="small" @click="cflag=true">创建群组</el-button>
            </template>
        </avue-crud>

        <el-dialog  title="创建群组" :visible.sync="cflag" :close-on-click-modal="false" width="60%">
            <basic-container v-if="cflag">
                <el-form :inline="true" size="mini">
                    <el-form-item >
                        <el-select v-model="uid" filterable placeholder="请选择">
                            <el-option
                                    v-for="item in sendlist"
                                    :key="item.id"
                                    :label="item.username"
                                    :value="item.uid">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-form :inline="true" size="mini">
                    <el-form-item >
                        <el-button  @click="createGroup" type="primary">创建</el-button>
                    </el-form-item>
                </el-form>
            </basic-container>
        </el-dialog>
    </basic-container>
</template>

<script>

    import { getWeiboUser,addGroup,getGroup } from '~/api/request/request';

    export default {
        data() {
            return {
                data:[],
                obj:{},
                cflag:false,
                page: {
                    //pageSizes: [10, 20, 30, 40],默认
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                loading:false,
                uid:"",
                sendlist:[]
            };
        },
        computed: {
            option(){
                return {
                    title:'群管理',
                    columnBtn:true,
                    page:true,
                    align:'center',
                    menuType:'menu',
                    editBtn:false,
                    viewBtn:false,
                    addBtn:false,
                    size:"mini",
                    column:[
                        {
                            label:'ID',
                            prop:'id',
                            width:120,
                            display:false
                        },
                        {
                            label:'群组ID',
                            prop:'group_id',
                            width:180
                        },
                        {
                            label:'群名称',
                            prop:'name',
                            width:180
                        },
                        {
                            label:'群组长ID',
                            prop:'uid',
                            width:180
                        },
                        {
                            label:'群成员数量',
                            prop:'count',
                            width:180
                        },
                        {
                            label:'创建时间',
                            prop:'createtime_format',
                            display:false,
                            width:150
                        }
                    ]
                }
            }
        },
        methods: {
            sendlistQuery(){
                this.loading = true
                getWeiboUser({
                    params : {
                        type: '0',
                        status : '0',
                        session_status:'0'
                    },
                    callback : (res) => {
                        this.sendlist = res.data.data
                        console.log(this.sendlist)
                        this.loading = false
                    },
                    errorcallback : () => {
                        this.loading = false
                    }
                })
            },
            createGroup(){
                this.$confirm('确定创建群组吗？', '提示', {}).then(() => {
                    addGroup({
                        data :{uid:this.uid},
                        callback : () => {
                            this.$message.success("添加成功!")
                        }
                    })
                })
            },
            queryData(){
                this.loading = true
                getGroup({
                    params : {
                        page : this.page.currentPage,
                        page_size : this.page.pageSize,
                    },
                    callback : (res) => {
                        this.data = res.data.data
                        this.page.total = Number(res.headers.total)
                        this.loading = false
                    },
                    errorcallback : () => {
                        this.loading = false
                    }
                })
            },
            refresh(){
                this.queryData()
            },
            sizeChange(val) {
                this.page.currentPage = 1
                this.page.pageSize = val
                this.queryData()
            },
            currentChange(val) {
                this.page.currentPage = val
                this.queryData()
            },
            searchChange(){
                this.queryData()
            }
        },
        mounted(){
            this.queryData()
            this.sendlistQuery()
        }
    }
</script>