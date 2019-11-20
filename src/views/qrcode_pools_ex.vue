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
                   @search-change="searchChange"
                   v-model="obj" >
        </avue-crud>
    </section>
</template>


<script>

    import { get_ok_qrcode,del_qrcode,upd_qrcode ,open_qrcode, upd_status_qrcode} from '~/api/request/request'

    import { imgjoin } from '~/api/utils'

    export default {
        data() {
            return {
                fileList: [],
                data : [],
                obj:{},
                loading:false,
                cellEdit: false,
                filter: {
                    name:'',
                    status:''
                },
                page: {
                    // pageSizes: [10,20,30],
                    pageSize: 10,
                    currentPage:1,
                    total : 0
                },
                option:{
                    page:false,
                    align:'center',
                    showSummary:true,
                    sumColumnList: [
                        {
                            name: 'today_confirm_tot',
                            type: 'sum'
                        },
                        {
                            name: 'confirm_tot',
                            type: 'sum'
                        },
                        {
                            name: 'all_tot',
                            type: 'sum'
                        },
                        {
                            name: 'today_all_tot',
                            type: 'sum'
                        }
                    ],
                    menuWidth: 300,
                    menuAlign:'center',
                    menu:false,
                    border:true,
                    addBtn:false,
                    cellBtn:false,
                    editBtn: false,
                    maxHeight:350,
                    height:350,
                    delBtn : false,
                    searchMenuSpan:6,
                    size:"mini",
                    column:[
                        {
                            label:'微信昵称',
                            prop:'name',
                            search:true,
                            cell: true,
                            minWidth:200,
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
                            minWidth:100,
                            search:true,
                            filters:[{ text: '启用', value: '启用' }, { text: '禁用', value: '禁用' }],
                            filterMethod:function(value, row, column) {
                                return row.statusname === value;
                            },
                            type:'select',
                            // searchMmultiple:true,
                            dicData:[
                                {
                                    label:'启用',
                                    value:'0'
                                },{
                                    label:'禁用',
                                    value:'3'
                                }
                            ]
                        },
                        {
                            label:'创建时间',
                            prop:'createtime',
                            minWidth:150,
                        },
                        {
                            label:'(正常)当天流水',
                            prop:'today_confirm_tot',
                            minWidth:110,
                        },
                        {
                            label:'(正常)总流水',
                            prop:'confirm_tot',
                            minWidth:110,
                        },
                        {
                            label:'(所有)当天流水',
                            prop:'today_all_tot',
                            minWidth:110,
                        },
                        {
                            label:'(所有)总流水',
                            prop:'all_tot',
                            minWidth:110,
                        },
                    ]
                }
            };
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
                // console.log( file.type )
                const isJPG = file.type.split('/')[0] === 'image';
                const isLt2M = file.size / 1024  < 120;

                if (!isJPG) {
                    this.$message.error('必须是图片格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 120KB!');
                }
                return isJPG && isLt2M;
            },
            onLoad(page) {
                // console.log(page)
                this.page.currentPage = page.currentPage
                this.page.pageSize = page.pageSize
                this.QueryQrcode()
            },
            searchChange(params){
                this.filter.name = params.name
                this.filter.status = params.statusname
                this.QueryQrcode()
            },
            refreshChange(){
                this.QueryQrcode()
            },
            rowCell(row, index) {
                this.$refs.crud.rowCell(row, index)
            },
            rowStatus(row,index){
                this.$confirm('确认启用吗？', '提示', {}).then(() => {
                    upd_status_qrcode({
                        data : {"id":row.id,"status":"0"},
                        callback : () => {
                            this.QueryQrcode()
                            this.$message.success("启用成功!")
                        },
                    })
                })
            },
            rowStatus1(row,index){
                this.$confirm('确认禁用吗？', '提示', {}).then(() => {
                    upd_status_qrcode({
                        data : {"id":row.id,"status":"3"},
                        callback : () => {
                            this.QueryQrcode()
                            this.$message.success("禁用成功!")
                        },
                    })
                })
            },
            rowDel(row,index){
                this.$confirm('确认删除吗？', '提示', {}).then(() => {
                    upd_status_qrcode({
                        data : {"id":row.id,"status":"4"},
                        callback : () => {
                            this.QueryQrcode()
                            this.$message.success("删除成功!")
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
                get_ok_qrcode({
                    "params":{
                        "status" : this.filter.status,
                        "page" : this.page.currentPage,
                        "page_size" : this.page.pageSize,
                        "name" : this.filter.name,
                        "userid" : this.$route.query.id
                    },
                    "callback": (res)=>{
                        this.data=[]
                        res.data.data.forEach(item => {
                            this.data.push({
                                path : imgjoin(item.path ),
                                name : item.name,
                                id : item.id,
                                statusname : item.statusname,
                                createtime : item.createtime,
                                confirm_tot : item.confirm_tot,
                                today_confirm_tot : item.today_confirm_tot,
                                all_tot : item.all_tot,
                                today_all_tot: item.today_all_tot
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
            // console.log(this.$route.query.id)
        }
    }
</script>

<style scoped="scoped" lang="scss">
</style>