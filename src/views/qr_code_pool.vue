<template>
    <section class="main">
        <el-form ref="FormObj" :model="request_data" label-width="100px">
            <el-form-item label="二维码类型" :rules="{ required: true, message: '请选择二维码类型!', trigger: 'blur' }" placeholder="请选择二维码类型">
                <el-select v-model="request_data.qrtype" placeholder="请选择二维码类型">
                    <el-option v-for="item in FormObj2" :label="item.value" :value="item.name" :key="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="码商" :rules="{ required: true, message: '请选择码商!', trigger: 'blur' }" placeholder="请选择码商">
                <el-select v-model="request_data.userid" placeholder="请选择码商">
                    <el-option v-for="item in FormObj" :label="item.name" :value="item.userid" :key="item.userid"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="店员助手" v-show="isFlag" :rules="{ required: true, message: '请选择店员助手!', trigger: 'blur' }" placeholder="请选择店员助手">
                <el-select v-model="request_data.wechathelper_id" placeholder="请选择店员助手">
                    <el-option v-for="item in FormObj1" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="上传二维码">
                <el-upload
                        class="upload-demo"
                        drag
                        :data="this.request_data"
                        action="/upload"
                        accept="image/*"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess"
                        :before-upload="handlerUpload"
                        :on-progress="handlerProress"
                        :show-file-list="false"
                        :file-list="fileList"
                        multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过120kb</div>
                </el-upload>
            </el-form-item>
        </el-form>


        <avue-crud style="margin-left:100px;"
                   :option="option"
                   ref="crud"
                   :page="page"
                   @on-load="onLoad"
                   :table-loading="loading"
                   @refresh-change="refreshChange"
                   :data="data"
                   @row-update="rowUpdate"
                   @search-change="searchChange"
                   v-model="obj" >
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
                <el-button
                        type="primary"
                        size="mini"
                        @click="rowOpen(scope.row)"
                >启用</el-button>
            </template>
        </avue-crud>
    </section>
</template>


<script>

    import { get_qrcode,del_qrcode,upd_qrcode ,open_qrcode ,agent_query,wechathelper_query , get_qrtype,paytype_get} from '~/api/request/request'

    import { imgjoin } from '~/api/utils'

    export default {
        data() {
            return {
                FormObj:[],
                FormObj1:[],
                FormObj2:[],
                paytypes:[],
                isFlag:false,
                fileList: [],
                data : [],
                obj:{},
                loading:false,
                cellEdit: false,
                filter: {
                  name:''
                },
                request_data:{
                    qrtype:''
                },
                page: {
                    // pageSizes: [2],
                    pageSize: 10,
                    currentPage:1,
                    total : 0
                },
                option:{
                    page:false,
                    align:'center',
                    menuAlign:'center',
                    border:true,
                    addBtn:false,
                    cellBtn:false,
                    maxHeight:300,
                    height:300,
                    editBtn: false,
                    delBtn : false,
                    searchMenuSpan:6,
                    size:"mini",
                    column:[
                        {
                            label:'微信昵称',
                            prop:'name',
                            search:true,
                            cell: true,
                            minWidth:150,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入微信昵称',
                                    trigger: 'blur'
                                }
                            ]
                        },
                        // {
                        //     label:'二维码',
                        //     prop:'path',
                        //     type:'upload',
                        //     // imgType:'card',
                        //     listType:'picture-img',
                        //     cell: false
                        // },
                        {
                            label:'状态',
                            prop:'statusname',
                        },
                        {
                            label:'创建时间',
                            prop:'createtime',
                            minWidth:150,
                        },
                    ]
                },
                optionForm:{
                    labelWidth:300,
                    size:"mini",
                    submitText: '选择码商',
                    menuPostion : 'left',
                    emptyBtn:false,
                    submitBtn:false,
                    column: [
                        {
                            label: "银行卡信息",
                            prop: "userid",
                            span:12,
                            row:true,
                            type: 'text',
                            parent:false,
                            placeholder:"请选择码商信息",
                            rules: [{
                                required: true,
                                message: "请选择码商信息"
                            }],
                            click: this.user_handler,
                        },
                    ]
                }
            };
        },
        watch: {
            request_data: {
                handler(newName, oldName) {
                    if(newName.qrtype === 'QR001'){
                        this.isFlag=true
                    }else{
                        this.isFlag=false
                    }
                },
                deep: true,
                immediate: true
            }
        },
        methods: {
            handleRemove(file, fileList) {
            },
            handlePreview(file) {
            },
            handleSuccess( response, file, fileList ){
                if ( response.rescode !== '10000' ){
                    this.$message.error(response.msg)
                } else {
                    this.QueryQrcode()
                    this.$message.success("上传成功!")
                }
            },
            handlerProress(event, file, fileList){
            },
            handlerUpload(file) {
                const isJPG = file.type.split('/')[0] === 'image';
                const isLt2M = file.size / 1024  < 500;

                if (!isJPG) {
                    this.$message.error('必须是图片格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 120KB!');
                }
                return isJPG && isLt2M;
            },
            onLoad(page) {
                this.page.currentPage = page.currentPage
                this.QueryQrcode()
            },
            searchChange(params){
                this.filter.name = params.name
                this.QueryQrcode()
            },
            refreshChange(){
                this.QueryQrcode()
            },
            rowCell(row, index) {
                this.$refs.crud.rowCell(row, index)
            },
            rowDel(row,index){
                this.$confirm('确认删除吗？', '提示', {}).then(() => {
                    del_qrcode({
                        data : {"id":row.id},
                        callback : () => {
                            this.QueryQrcode()
                            this.$message.success("删除成功!")
                        },
                    })
                })
            },
            rowOpen(row,index){
                this.$confirm('确认启用吗？', '提示', {}).then(() => {
                    open_qrcode({
                        data : {"id":row.id},
                        callback : () => {
                            this.QueryQrcode()
                            this.$message.success("启用成功!")
                        },
                    })
                })
            },
            rowUpdate(form, index, done) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    upd_qrcode({
                        data : {"id":form.id,"name":form.name},
                        callback : () => {
                            this.QueryQrcode()
                            this.$message.success("修改成功!")
                            done()
                        },
                    })
                })
            },
            QueryQrcode(){
                this.loading=true
                get_qrcode({
                    "params":{
                        "status" : "1",
                        "page" : this.page.currentPage,
                        "page_size" : this.page.pageSize,
                        "name" : this.filter.name,
                    },
                    "callback": (res)=>{
                        this.data=[]
                        res.data.data.forEach(item => {
                            this.data.push({
                                path : imgjoin(item.path ),
                                name : item.name,
                                id : item.id,
                                statusname : item.statusname,
                                createtime : item.createtime
                            })
                        })
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
            // this.QueryQrcode()
            // paytype_get({
            //     "callback": (res)=>{
            //         this.paytypes=res.data.data
            //     }
            // })
            get_qrtype({
                "params":{
                    "status" : "0",
                    "page" : 1,
                    "page_size" : 99999999,
                    "type" : "3"
                },
                "callback": (res)=>{
                    this.FormObj2=res.data.data
                }
            })
            agent_query({
                "params":{
                    "status" : "0",
                    "page" : 1,
                    "page_size" : 99999999,
                    "type" : "3"
                },
                "callback": (res)=>{
                    this.FormObj=res.data.data
                }
            })
            wechathelper_query({
                "params":{
                    "page" : 1,
                    "page_size" : 99999999
                },
                "callback": (res)=>{
                    this.FormObj1=res.data.data
                }
            })
        }
    }
</script>

<style scoped="scoped" lang="scss">
</style>