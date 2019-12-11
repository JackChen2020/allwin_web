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
                   @selection-change="selectionChange"
                   @refresh-change="refresh"
                   :table-loading="loading">
            <template slot="search">
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" :model="filters" size="mini">
                        <el-form-item >
                            <el-input v-model="filters.username" :clearable="true" placeholder="账号"></el-input>
                        </el-form-item>
                        <el-form-item >
                            <el-select v-model="filters.status" :clearable="true" placeholder="是否开启">
                                <el-option label="是" value="0"></el-option>
                                <el-option label="否" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <el-form :inline="true" :model="filters" size="mini">
                        <el-form-item >
                            <el-input v-model="filters.uid" :clearable="true" placeholder="微博ID"></el-input>
                        </el-form-item>
                        <el-form-item >
                            <el-select v-model="filters.session_status" :clearable="true" placeholder="会话状态">
                                <el-option label="存活" value="0"></el-option>
                                <el-option label="失效" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <el-form :inline="true"  :model="filters" size="mini">
                        <el-form-item>
                            <el-date-picker
                                    style="height:27px;line-height: 27px;"
                                    v-model="filters.querytime"
                                    type="daterange"
                                    align="right"
                                    placeholder="选择订单日期"
                                    range-separator="至"
                                    start-placeholder="订单开始日期"
                                    end-placeholder="订单结束日期"
                                    unlink-panels
                                    :clearable="true"
                                    :picker-options="pickerOptions2">
                            </el-date-picker>
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

            <template slot="menuLeft">
                <el-button type="primary" size="mini" @click="slodding=true;login()" :loading="slodding">登录</el-button>
            </template>


            <template slot-scope="scope" slot="menuBtn">
                <!--                <el-dropdown-item @click.native="getSession(scope.row)">获取Session</el-dropdown-item>-->
                <el-dropdown-item v-if="scope.row.type==='0'" @click.native="vercodeFlag=true;sssid=scope.row.id;vercode='';sendAuthCode=true;">登录(手机验证码)</el-dropdown-item>
<!--                <el-dropdown-item v-if="scope.row.type==='0'" @click.native="InitDataForWeb(scope.row)">初始化数据</el-dropdown-item>-->
            </template>

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

        <el-dialog  title="登录" :visible.sync="pcloginFlag" :close-on-click-modal="false" width="40%">

            <div  v-for="(item,index) in login_params" :key="index">
                <div v-if="item.code==='10002'">
                    <basic-container>
                        <h4 style="color: green">{{item.username}}：{{item.msg}}</h4>
                        <div style="display: flex;align-items:center">
                            <div style="width:100px;">验证码:</div>
                            <el-input size="mini" clearable v-model="item.vercode"></el-input>
                            <img style="margin-left:5px;width:100px;border:1px solid #C0C0C0" :src="item.url">
                        </div>
                    </basic-container>
                </div>
                <div v-if="item.code==='10001'">
                    <basic-container>
                        <h4 style="color: red">{{item.username}}：{{item.msg}}</h4>
                    </basic-container>
                </div>
            </div>
            <el-button type="primary" @click="bloadding=true;logins(login_params)" :loading="bloadding">登录</el-button>
        </el-dialog>

    </basic-container>
</template>

<script>

    import { addWeiboUser,getWeiboUser,updWeiboUser,delWeiboUser, loginForPc, getPayPassLinkData,updPayPassLinkData,initOtherDataForWeibo,delPayPassLinkData,getSessionSSS,getVerCodeForWeibo,vercodeLoginForWeibo } from '~/api/request/request';
    import { dateformart } from '~/api/utils'

    export default {
        data() {
            return {
                sendAuthCode:true,
                auth_time: 0, /*倒计时 计数器*/
                vercodeFlag:false,
                vercode:"",
                bloadding:false,
                selectdata:[],
                slodding:false,
                pcloginFlag:false,
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
                login_params:[]
            };
        },
        computed: {
            option(){
                return {
                    title:'发送红包账号管理',
                    menuType:'menu',
                    page:true,
                    align:'center',
                    // dateBtn:true,
                    dateDefault:false,
                    menuAlign:'center',
                    indexLabel:'序号',
                    index:true,
                    border:true,
                    selection:true,
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
                            label:'微博ID',
                            prop:'uid',
                            width:180,
                            display:false,
                        },
                        {
                            label:'账号',
                            prop:'username',
                            width:180
                        },
                        {
                            label:'密码',
                            prop:'password',
                        },
                        {
                            label:'是否开启',
                            prop:'status_format',
                            formslot:true,
                        },
                        {
                            label:'会话状态',
                            prop:'session_status_format',
                            // formslot:true,
                            display:false,
                        },
                        {
                            label:'登录时间',
                            prop:'logintime_format',
                            display:false,
                            width:150
                        },
                        {
                            label:'创建时间',
                            prop:'createtime_format',
                            display:false,
                            width:150
                        },
                        {
                            label:'会话',
                            prop:'session',
                            addDisplay:false,
                            width:4000,
                        },
                    ]
                }
            }
        },
        methods: {
            selectionChange(list){
                this.selectdata = list
                console.log(this.selectdata)
            },
            logins(datas){
                console.log(datas)
                loginForPc({
                    data:{datas:datas},
                    callback:res=>{
                        console.log(res)
                        if(res.data.data.length===0){
                            this.$message.success("登录成功!")

                            this.bloadding=false
                            this.pcloginFlag=false
                        }else{
                            this.bloadding=false
                            this.pcloginFlag=false
                            this.pcloginFlag=true
                            this.login_params = res.data.data
                        }
                    }
                })
            },
            login(){
                if(this.selectdata.length===0){
                    this.$message.warning("请勾选数据!")
                }else{
                    var datas=[]
                    this.selectdata.forEach(item=>{
                        datas.push({
                            username:item.username
                        })
                    })
                    this.$confirm('确定登录这些勾选的账号吗？', '提示', {}).then(() => {

                        loginForPc({
                            data:{datas:datas},
                            callback:res=>{
                                if(res.data.data.length===0){
                                    this.$message.success("登录成功!")
                                    this.slodding=false
                                }else{
                                    this.slodding=false
                                    this.login_params = res.data.data
                                    this.pcloginFlag=true
                                }
                            }
                        })
                    })
                }
            },
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
                getWeiboUser({
                    params : {
                        page : this.page.currentPage,
                        page_size : this.page.pageSize,
                        userid : this.filters.userid,
                        username : this.filters.username,
                        type: '0',
                        status : this.filters.status,
                        startdate : startdate ,
                        enddate : enddate,
                        uid:this.filters.uid,
                        session_status:this.filters.session_status
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
                    this.$set(data,'type','0')
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