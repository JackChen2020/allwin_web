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
                            <el-input v-model="filters.userid" :clearable="true" placeholder="码商ID"></el-input>
                        </el-form-item>
                        <el-form-item >
                            <el-input v-model="filters.username" :clearable="true" placeholder="码账号"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-form :inline="true"  :model="filters" size="mini">
                        <el-form-item >
                            <el-select v-model="filters.type" :clearable="true" placeholder="类型">
                                <el-option label="发红包" value="0"></el-option>
                                <el-option label="抢红包" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item >
                            <el-select v-model="filters.status" :clearable="true" placeholder="是否开启">
                                <el-option label="是" value="0"></el-option>
                                <el-option label="否" value="1"></el-option>
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


            <template slot-scope="scope" slot="menuBtn">
<!--                <el-dropdown-item @click.native="getSession(scope.row)">获取Session</el-dropdown-item>-->
                <el-dropdown-item v-if="scope.row.type==='0'" @click.native="vercodeFlag=true;sssid=scope.row.id;vercode='';sendAuthCode=true;">登录(手机验证码)</el-dropdown-item>
                <el-dropdown-item v-if="scope.row.type==='0'" @click.native="InitDataForWeb(scope.row)">初始化数据</el-dropdown-item>
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

    </basic-container>
</template>

<script>

    import { getPayPassLinkData,updPayPassLinkData,initOtherDataForWeibo,addPayPassLinkData,delPayPassLinkData,getSessionSSS,getVerCodeForWeibo,vercodeLoginForWeibo } from '~/api/request/request';
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
                    title:'码设置',
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
                            label:'码ID',
                            prop:'id',
                            width:120,
                            display:false
                        },
                        {
                            label:'码商ID',
                            prop:'userid',
                            width:120,
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
                            label:'类型',
                            prop:'type_format',
                            formslot:true
                        },
                        {
                            label:'是否开启',
                            prop:'status_format',
                            formslot:true
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
            },
            optionForm() {
                return {
                    size: "mini",
                    submitText: '完成',
                    labelWidth: 200,
                    card: true,
                    group: [
                        {
                            icon: 'el-icon-info',
                            label: '基础数据',
                            prop: 'request',
                            column: [
                                {
                                    label: "码商ID",
                                    prop: "userid",
                                    span: 10,
                                    row:true,
                                },
                                {
                                    label: "账号",
                                    prop: "username",
                                    span: 10,
                                },
                                {
                                    label: "密码",
                                    prop: "password",
                                    span: 10,
                                },
                                {
                                    label: "是否开启",
                                    prop: "status",
                                    type: "select",
                                    dicData: [
                                        {
                                            label: "是",
                                            value: "0",
                                        },
                                        {
                                            label: "否",
                                            value: "1",
                                        }
                                    ],
                                    span: 10,
                                },
                                {
                                    label: "类型",
                                    prop: "type",
                                    type: "select",
                                    dicData: [
                                        {
                                            label: "发红包",
                                            value: "0",
                                        },
                                        {
                                            label: "抢红包",
                                            value: "1",
                                        }
                                    ],
                                    span: 10,
                                },
                            ],
                        },
                        {
                            icon: 'el-icon-info',
                            label: '会话数据',
                            prop: 'request',
                            column: [
                                {
                                    label: "会话",
                                    prop: "session",
                                    span: 10,
                                    row:2
                                },
                            ],
                        },
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
                getPayPassLinkData({
                    params : {
                        page : this.page.currentPage,
                        page_size : this.page.pageSize,
                        userid : this.filters.userid,
                        username : this.filters.username,
                        type: this.filters.type,
                        status : this.filters.status,
                        startdate : startdate ,
                        enddate : enddate,
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
                    this.$set(data,'userid',form.userid)
                    this.$set(data,'type',form.type)
                    this.$set(data,'status',form.status)
                    addPayPassLinkData({
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
                    this.$set(data,'type',form.type)
                    this.$set(data,'status',form.status)
                    this.$set(data,'session',form.session)
                    updPayPassLinkData({
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
                    delPayPassLinkData({
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