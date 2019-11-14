<template>
    <basic-container>
        <avue-crud :data="data" :option="option" v-model="obj" @date-change="dateChange"
                   :page="page"
                   @row-update="rowUpdate"
                   @row-del="rowDel"
                   @row-save="rowSave"
                   @search-change="searchChange"
                   @size-change="sizeChange"
                   @current-change="currentChange"
                   @refresh-change="refresh">
        </avue-crud>
    </basic-container>
</template>

<script>

    import { addWhiteList,updWhiteList,delWhiteList,getWhiteList } from "@/api/request/request";

    export default {
        data() {
            return {
                page: {
                    //pageSizes: [10, 20, 30, 40],默认
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                obj:{},
                data: [],
                filter_params:{},
                rolecode:"1001",
            }
        },
        computed: {
            option(){
                return {
                    title:'白名单管理',
                    menuType:'menu',
                    page:true,
                    align:'center',
                    dateBtn:false,
                    dateDefault:false,
                    menuAlign:'center',
                    indexLabel:'序号',
                    index:true,
                    border:true,
                    expandFixed:false,
                    searchShow:false,
                    size:"mini",
                    column:[
                        {
                            label:'白名单ID',
                            prop:'id',
                            width:120,
                            editDisplay:false,
                            addDisplay:false,
                            addDisabled:true,
                            display:false
                        },
                        {
                            label:'用户ID',
                            prop:'userid',
                            width:180,
                            search:true,
                            editDisplay:false
                        },
                        {
                            label:'代付白名单',
                            prop:'dfobj',
                            width:200
                        },
                        {
                            label:'客户端登录白名单',
                            prop:'webobj',
                            width:200
                        },
                        {
                            label:'申请订单白名单',
                            prop:'orderobj',
                            width:200
                        },
                    ]
                }
            }
        },
        methods: {
            dateChange(date){

                console.log(date)
                this.filter_params.date = date
                this.queryData()
            },
            queryData(){
                getWhiteList({
                    params: {
                        page : this.page.currentPage,
                        page_size : this.page.pageSize,
                        userid : this.filter_params.userid
                    },
                    callback : (res) => {
                        this.data = res.data.data
                        this.page.total = Number(res.headers.total)
                    },
                })
            },
            rowSave(form,done,loading){
                console.log("rowSave")
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    loading();
                    var data={}
                    console.log(form)
                    this.$set(data,'userid',form['userid'])

                    if (form.dfobj.length>0){
                        this.$set(data,'dfobj',form.dfobj)
                    }

                    if (form.webobj.length>0){
                        this.$set(data,'webobj',form.webobj)
                    }

                    if (form.orderobj.length >0){
                        this.$set(data,'orderobj',form.orderobj)
                    }

                    console.log(data)

                    addWhiteList({
                        data:data,
                        callback : (res)=>{
                            done();
                            this.queryData()
                            this.$message.success("添加成功!")
                        }
                    })
                })

            },
            rowUpdate(form,index,done,loading){
                console.log("rowUpdate")
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    loading();
                    var data={}
                    console.log(form)
                    this.$set(data,'userid',form['userid'])
                    if (form.dfobj.length>0){
                        this.$set(data,'dfobj',form.dfobj)
                    }

                    if (form.webobj.length>0){
                        this.$set(data,'webobj',form.webobj)
                    }

                    if (form.orderobj.length >0){
                        this.$set(data,'orderobj',form.orderobj)
                    }

                    updWhiteList({
                        data:data,
                        callback : (res)=>{
                            done();
                            this.queryData()
                            this.$message.success("修改成功!")
                        }
                    })
                })
            },
            rowDel(form){
                console.log("rowDel")
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    var data={}
                    this.$set(data,'userid',form['userid'])

                    delWhiteList({
                        data:data,
                        callback : (res)=>{
                            this.queryData()
                            this.$message.success("删除成功!")
                        }
                    })
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
            searchChange(params){
                this.filter_params.userid = params.userid
                this.queryData()
            }
        },
        created() {
            this.queryData()
        }
    }
</script>