<template>
    <basic-container>
        <avue-crud :data="data" :option="option" v-model="obj"
                   :page="page"
                   @row-update="rowUpdate"
                   @row-del="rowDel"
                   @row-save="rowSave"
                   @size-change="sizeChange"
                   @current-change="currentChange"
                   @search-change="searchChange"
                   @refresh-change="refresh"
                   :table-loading="loading">
            <template slot="search">
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" :model="filters" size="mini">
                        <el-form-item >
                            <el-input v-model="filters.group_id" :clearable="true" placeholder="群组ID"></el-input>
                        </el-form-item>
                        <el-form-item >
                            <el-input v-model="filters.name" :clearable="true" placeholder="群组名称"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-form :inline="true" :model="filters" size="mini">
                        <el-form-item >
                            <el-input v-model="filters.uid" :clearable="true" placeholder="群组长ID"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </template>
            <template slot-scope="scope" slot="status_formatForm">
                <el-select v-model="scope.row.status" placeholder="是否开启">
                    <el-option label="是" value="0"></el-option>
                    <el-option label="否" value="1"></el-option>
                </el-select>
            </template>

            <template slot-scope="scope" slot="type_formatForm">
                <el-select v-model="scope.row.type" placeholder="类型">
                    <el-option label="发红包" value="0"></el-option>
                    <el-option label="抢红包" value="1"></el-option>
                </el-select>
            </template>


            <!--            <template slot-scope="scope" slot="menuBtn">-->
            <!--                &lt;!&ndash;                <el-dropdown-item @click.native="getSession(scope.row)">获取Session</el-dropdown-item>&ndash;&gt;-->
            <!--                <el-dropdown-item v-if="scope.row.type==='0'" @click.native="vercodeFlag=true;sssid=scope.row.id;vercode='';sendAuthCode=true;">登录(手机验证码)</el-dropdown-item>-->
            <!--                &lt;!&ndash;                <el-dropdown-item v-if="scope.row.type==='0'" @click.native="InitDataForWeb(scope.row)">初始化数据</el-dropdown-item>&ndash;&gt;-->
            <!--            </template>-->

        </avue-crud>

        <el-dialog  title="手机验证码登录" :visible.sync="vercodeFlag" :close-on-click-modal="false" width="60%">
            <basic-container v-if="vercodeFlag">
                <el-form :inline="true" size="mini">
                    <el-form-item >
                        <el-input v-model="vercode" :clearable="true" placeholder="手机验证码"></el-input>

                    </el-form-item>
                    <el-form-item>
                        <el-button v-show="sendAuthCode" @click="getAuthCode" type="primary">获取验证码</el-button>
                        <span v-show="!sendAuthCode" class="auth_text"> <span class="auth_text_blue">{{auth_time}} </span> 秒之后重新发送验证码(一天不能超过5次)</span>
                    </el-form-item>

                </el-form>
                <el-form :inline="true" size="mini">
                    <el-form-item >
                        <el-button  @click="vercodeLogin" type="primary">登录</el-button>
                    </el-form-item>
                </el-form>
            </basic-container>

        </el-dialog>

    </basic-container>
</template>

<script>

    import { getGroupMember,addWeiboUser,getWeiboUser,updWeiboUser,delWeiboUser,  getPayPassLinkData,updPayPassLinkData,initOtherDataForWeibo,delPayPassLinkData,getSessionSSS,getVerCodeForWeibo,vercodeLoginForWeibo } from '~/api/request/request';
    import { dateformart } from '~/api/utils'

    export default {
        data() {
            return {
                sendAuthCode:true,
                auth_time: 0, /*倒计时 计数器*/
                vercodeFlag:false,
                vercode:"",
                FormCopy:false,
                objForm:{},
                sssid:0,
                proSet:false,
                page: {
                    //pageSizes: [10, 20, 30, 40],默认
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
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
                obj:{},
                data: [],
                filters:{},
                loading:false,
            };
        },
        computed: {
            option(){
                return {
                    title:'群成员管理',
                    editBtn:false,
                    addBtn:false,
                    menuType:'menu',
                    page:true,
                    align:'center',
                    // dateBtn:true,
                    dateDefault:false,
                    menuAlign:'center',
                    indexLabel:'序号',
                    index:true,
                    border:true,
                    expandFixed:false,
                    searchShow:false,
                    viewBtn:false,
                    menuWidth:150,
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
                            width:180,
                            display:false,
                        },
                        {
                            label:'群名称',
                            prop:'name',
                            width:180
                        },
                        {
                            label:'群组长ID',
                            prop:'uid',
                        },
                        {
                            label:'群成员ID',
                            prop:'son_uid',
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
            getAuthCode:function () {
                this.$confirm('确认发送验证码？', '提示', {}).then(() => {
                    getVerCodeForWeibo({
                        data :{id:this.sssid},
                        callback : () => {
                            this.$message.success("发送成功!")
                            this.sendAuthCode = false;
                            this.auth_time = 60;
                            var auth_timetimer =  setInterval(()=>{
                                this.auth_time--;
                                if(this.auth_time<=0){
                                    this.sendAuthCode = true;
                                    clearInterval(auth_timetimer);
                                }
                            }, 1000);
                        }
                    })
                })
            },
            vercodeLogin(){
                this.$confirm('确认登录吗？', '提示', {}).then(() => {
                    vercodeLoginForWeibo({
                        data :{id:this.sssid,vercode:this.vercode},
                        callback : () => {
                            this.$message.success("登录成功!")
                            this.vercodeFlag = false
                            this.queryData()
                        }
                    })
                })
            },
            InitDataForWeb(row){
                this.$confirm('确认初始化数据吗？', '提示', {}).then(() => {
                    this.loading = true
                    initOtherDataForWeibo({
                        data :{id:row.id},
                        callback : () => {
                            this.$message.success("初始化成功!")
                            this.queryData()
                            this.loading = false
                        },
                        errorcallback : () => {
                            this.loading = false
                        }
                    })
                })
            },

            // dateChange(date){
            //     this.filter_params.date = date
            //     this.queryData()
            // },
            queryData(){
                this.loading = true
                let startdate=""
                let enddate=""
                if(this.filters.querytime && this.filters.querytime[0] && this.filters.querytime[1]){
                    startdate=dateformart(this.filters.querytime[0])+' 00:00:01'
                    enddate=dateformart(this.filters.querytime[1])+' 23:59:59'
                }
                getGroupMember({
                    params : {
                        page : this.page.currentPage,
                        page_size : this.page.pageSize,
                        group_id : this.filters.group_id,
                        name : this.filters.name,
                        uid: this.filters.uid
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
            rowSave(form,done,loading){
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    loading();
                    var data={}
                    this.$set(data,'username',form['username'])
                    this.$set(data,'password',form.password)
                    this.$set(data,'type','1')
                    this.$set(data,'status',form.status)
                    addWeiboUser({
                        data :data,
                        callback : () => {
                            this.$message.success("添加成功!")
                            done()
                            this.queryData()
                        },
                        errorcallback : () => {
                            done()
                        }
                    })
                })
            },
            getSession(row){
                console.log(row)
                this.$confirm('确认获取Session吗？', '提示', {}).then(() => {
                    var data={}
                    this.$set(data,'id',row.id)
                    getSessionSSS({
                        data :data,
                        callback : () => {
                            this.$message.success("获取成功!")
                            this.queryData()
                        },
                        errorcallback : () => {
                        }
                    })
                })
            },
            rowUpdate(form,index,done,loading){
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    loading();
                    var data={}
                    console.log(form)
                    this.$set(data,'id',form['id'])
                    this.$set(data,'password',form['password'])
                    this.$set(data,'status',form.status)
                    this.$set(data,'session',form.session)
                    updWeiboUser({
                        data :data,
                        callback : () => {
                            this.$message.success("修改成功!")
                            done()
                            this.queryData()
                        },
                        errorcallback : () => {
                            done()
                        }
                    })
                })
            },
            rowDel(form){
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    var data={}
                    this.$set(data,'id',form['id'])
                    delWeiboUser({
                        data :data,
                        callback : () => {
                            this.$message.success("删除成功!")
                            this.queryData()
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
            searchChange(){
                this.queryData()
            }
        },
        mounted(){
            this.queryData()
        }
    }
</script>