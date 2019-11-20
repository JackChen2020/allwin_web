<template>
    <div>

        <el-select v-model="qqacc"  clearable  placeholder="请选择QQ号">
            <el-option v-for="item in qqaccs" :label="item" :value="item" :key="item"></el-option>
        </el-select>

        <avue-crud ref="crud" :data="data" :option="option"
                   :page="page"
                   @size-change="sizeChange"
                   @current-change="currentChange"
                   @selection-change="selectionChange"
                   @row-update="rowUpdate"
                   @search-change="searchChange"
                   @refresh-change="refresh">
            <template slot-scope="scope" slot="menu">
                <el-button
                        type="primary"
                        size="mini"
                        @click="rowCell(scope.row,scope.index)"
                >{{scope.row.$cellEdit?'保存':'修改'}}</el-button>
                <el-button
                        type="danger"
                        size="mini"
                        @click="rowDel(scope.row)"
                >删除</el-button>
            </template>
        </avue-crud>

        <el-input
                style="margin-top:30px;"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 10}"
                placeholder="请输入内容"
                v-model="msg">
        </el-input>
        <el-button style="margin-top:20px;" type="primary" @click="send">发送消息</el-button>

    </div>
</template>

<script>
    import {qqbot_send_msg,get_qq_accs,get_qq_list,upd_qq,del_qq } from '~/api/request/request';
    export default {
        data() {
            return {
                filter:{
                    name:""
                },
                msg:"",
                qqacc:"",
                qqaccs:"",
                data:[],
                selectdata:[],
                page: {
                    //pageSizes: [10, 20, 30, 40],默认
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                isFlag:false,
                option:{
                    selection: true,
                    page:false,
                    align:'center',
                    menuAlign:'center',
                    editBtn: false,
                    delBtn : false,
                    addBtn:false,
                    cellBtn:false,
                    size:"mini",
                    column:[
                        {
                            label:'群名称',
                            prop:'name',
                            cell: true,
                            search:true,
                            formslot:true
                        },
                        {
                            label:'群类型',
                            prop:'message_type',
                            formslot:true
                        },
                        {
                            label:'群ID',
                            prop:'id',
                            formslot:true
                        },
                    ]
                },
            }
        },
        watch: {
            qqacc(val) {
                this.qq_list_Get()
            }
        },
        methods : {
            rowDel(row,index){
                this.$confirm('确认删除吗？', '提示', {}).then(() => {
                    del_qq({
                        data : {
                            self_id : this.qqacc,
                            "id":row.id
                        },
                        callback : () => {
                            this.qq_list_Get()
                            this.$message.success("删除成功!")
                        },
                    })
                })
            },
            rowCell(row, index) {
                this.$refs.crud.rowCell(row, index)
            },
            selectionChange(list){
                this.selectdata = list
            },
            searchChange(params){
                this.filter.name = params.name
                this.qq_list_Get()
            },
            send(){

                if(!this.selectdata || this.selectdata.length==0){
                    this.$message({
                        message : "请勾选需要发送群号!",
                        type: "error"
                    })
                    return
                }

                if(this.msg && this.msg.length>0){
                    this.$confirm('确定群发吗?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        qqbot_send_msg({
                            "data":{
                                "msg" : this.msg,
                                "data" : this.selectdata,
                                self_id : this.qqacc,
                            },
                            callback : (res)=>{
                                this.$message({
                                    message : "群发成功!",
                                    type: "sueecss"
                                })
                            }
                        })
                    }).catch(() => {
                    })
                }else{
                    this.$message({
                        message : "发送内容不能为空!",
                        type: "error"
                    })
                }
            },
            qq_list_Get(){
                if(this.qqacc && this.qqacc.length>0){
                    get_qq_list({
                        params:{
                            self_id : this.qqacc,
                            page : this.page.currentPage,
                            name: this.filter.name,
                            page_size : this.page.pageSize
                        },
                        callback : (res) =>{
                            this.data = res.data.data
                            this.page.total = Number(res.headers.total)
                            this.isFlag = true
                        }
                    })
                }else{
                    this.data=[]
                }

            },
            rowUpdate(form,index,done,loading){
                upd_qq({
                    data: {
                        data : form,
                        self_id: this.qqacc
                    },
                    callback : (res)=>{
                        this.qq_list_Get()
                        done();
                    }
                })
            },
            sizeChange(val) {
                this.page.currentPage = 1
                this.page.pageSize = val
                this.qq_list_Get()
            },
            currentChange(val) {
                this.page.currentPage = val
                this.qq_list_Get()
            },
            refresh(){
                this.qq_list_Get()
            }
        },
        mounted() {
            get_qq_accs({
                callback: (res)=>{
                    this.qqaccs = res.data.data
                }
            })
        }
    }
</script>

<style scoped>

</style>