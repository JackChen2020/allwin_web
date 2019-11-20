<template>
    <section class="main">
        <avue-crud style="margin-left:100px;"
                   :option="option"
                   ref="crud"
                   :page="page"
                   @on-load="onLoad"
                   :table-loading="loading"
                   @refresh-change="refreshChange"
                   :data="data"
                   @row-update="rowUpdate"
                   @row-save="rowSave"
                   @search-change="searchChange"
                   v-model="obj" >
            <template slot-scope="scope" slot="menu">
                <el-button
                        type="primary"
                        size="mini"
                        @click="rowCell(scope.row,scope.index)"
                >{{scope.row.$cellEdit?'保存':'修改'}}</el-button>
                <el-button
                        type="primary"
                        size="mini"
                        @click="Login(scope.row)"
                >登录</el-button>
                <el-button
                        type="primary"
                        size="mini"
                        @click="LinkQrcode(scope.row)"
                >二维码</el-button>
                <el-button
                        type="warning"
                        size="mini"
                        @click="LoginOut(scope.row)"
                >退出</el-button>
                <el-button
                        type="danger"
                        size="mini"
                        @click="rowDel(scope.row)"
                >删除</el-button>
            </template>
        </avue-crud>


        <el-dialog title="登录" :visible.sync="loginFlag" :close-on-click-modal="false">
            <el-link class="img-border" type="success" :href="loginUrl" target="_blank">点击链接扫码登录</el-link>
        </el-dialog>
    </section>
</template>


<script>

    import { wechathelper_query,wechathelper_del,wechathelper_upd,wechathelper_add,wechathelper_login,wechathelper_stop } from '~/api/request/request'
    import { imgjoin,sleep } from '~/api/utils'

    export default {
        data() {
            return {
                data : [],
                obj:{'url':[]},
                loginFlag:false,
                loginUrl:'',
                isFlag:false,
                url:'',
                loading:false,
                cellEdit: false,
                filter: {
                    name:'',
                },
                page: {
                    // pageSizes: [10,20,30],
                    pageSize: 10,
                    currentPage:1,
                    total : 0
                },
                option:{
                    page:false,
                    title:'店员助手维护',
                    align:'center',
                    menuWidth: 400,
                    menuAlign:'center',
                    border:true,
                    cellBtn:false,
                    editBtn: false,
                    maxHeight:300,
                    height:300,
                    delBtn : false,
                    searchMenuSpan:6,
                    size:"mini",
                    column:[
                        {
                            label:'名称',
                            prop:'name',
                            minWidth:150,
                            cell: true,
                            search:true,
                        },
                        {
                            label:'状态',
                            prop:'status_name',
                            minWidth:120,
                            addVisdiplay:false,
                        },
                        // {
                        //     label:'登录二维码',
                        //     minWidth:120,
                        //     prop:'url',
                        //     type:'upload',
                        //     dataType:'array',
                        //     listType:'picture-card',
                        //     lazy:true,
                        //     span:24,
                        //     imgFullscreen:true,
                        //     addVisdiplay:false,
                        //     // imgHeight:400,
                        //     // imgWidth:100,
                        //     imgType:'card'
                        // },
                        {
                            label:'类型',
                            prop:'type',
                            minWidth:150,
                            search:true,
                            dicData: [{
                                "label":"微信扫码",
                                "value" : "QR001"
                            },{
                                "label":"付临门聚合",
                                "value" : "QR005"
                            },
                            ],
                            type:'select',
                        },
                        {
                            label:'创建时间',
                            prop:'createtime',
                            minWidth:150,
                            addVisdiplay:false,
                        },
                    ]
                }
            };
        },
        methods: {
            rowSave(row, done, loading){
                this.$confirm('确认提交吗？', '提示', {}).then(() => {

                    wechathelper_add({
                        data : {
                            name:row.name,
                            type:row.type
                        },
                        callback : () => {
                            this.QueryQrcode()
                            this.$message.success("新增成功!")
                            done()
                        }
                    })
                })
            },
            rowUpdate(row, index, done) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    wechathelper_upd({
                        data : {
                            id : row.id,
                            name : row.name
                        },
                        callback : () => {
                            this.QueryQrcode()
                            this.$message.success("修改成功!")
                            done()
                        },
                    })
                })
            },
            rowDel(row,index){
                this.$confirm('确认删除吗？', '提示', {}).then(() => {
                    wechathelper_del({
                        data : {"id":row.id},
                        callback : () => {
                            this.QueryQrcode()
                            this.$message.success("删除成功!")
                        },
                    })
                })
            },
            LinkQrcode(row){
                this.$router.push({path: '/qrcode_pools?wechathelper_id='+row.id})
            },
            waite1(res1,row){
                wechathelper_query({
                    "params":{
                        "page" : this.page.currentPage,
                        "page_size" : this.page.pageSize,
                        "name" : this.filter.name
                    },
                    "callback": (res)=>{
                        this.data=res.data.data

                        this.data.forEach(item => {
                            if (item.id === row.id){
                                if(item.login === "1"){
                                    this.loginUrl = imgjoin(res1.data.data.path)
                                    this.loginFlag = true
                                }
                            }
                        })

                        this.page.total = Number(res.headers.total)
                        this.loading=false
                    },
                    errorcallback : () => {
                        this.loading=false
                    }
                })
            },
            Login(row,index){
                this.$confirm('确认登录吗？', '提示', {}).then(() => {
                    this.$message.success("正在登录,请稍等6秒!")
                    this.loading=true
                    wechathelper_login({
                        data : {"id":row.id},
                        callback : (res) => {
                            sleep(6000)
                            this.waite1(res,row)
                        },
                    })
                })
            },
            LoginOut(row,index){
                this.$confirm('确认退出此店员助手网页微信吗？', '提示', {}).then(() => {
                    wechathelper_stop({
                        data : {"id":row.id},
                        callback : (res) => {
                            this.QueryQrcode()
                            this.$message.success("退出成功!")
                        },
                    })
                })
            },
            onLoad(page) {
                this.page.currentPage = page.currentPage
                this.page.pageSize = page.pageSize
                this.QueryQrcode()
            },
            searchChange(params){
                this.filter.name = params.name
                this.filter.loginname = params.loginname
                this.QueryQrcode()
            },
            refreshChange(){
                this.QueryQrcode()
            },
            rowCell(row, index) {
                this.$refs.crud.rowCell(row, index)
            },
            QueryQrcode(){
                this.loading=true
                wechathelper_query({
                    "params":{
                        "page" : this.page.currentPage,
                        "page_size" : this.page.pageSize,
                        "name" : this.filter.name
                    },
                    "callback": (res)=>{
                        this.data=res.data.data
                        // this.data.forEach( item =>{
                        //     if(item.qrcode.length > 0 ){
                        //         item.url = [imgjoin(item.qrcode)]
                        //     } else {
                        //         item.url = []
                        //     }
                        // })

                        this.page.total = Number(res.headers.total)
                        this.loading=false
                    },
                    errorcallback : () => {
                        this.loading=false
                    }
                })
            }
        },
        mounted() {
        }
    }
</script>

<style scoped="scoped" lang="scss">
    .info {
        padding: 12px 0;
        text-align: center;

        .img-border {
            height: 30px;
            position: relative;
            vertical-align: middle;
            display: inline-block;
        }

        .img-border1 {
            height: 30px;
            position: relative;
            vertical-align: middle;
            display: inline-block;
        }
    }
</style>