<template>
    <basic-container>
        <avue-crud :data="data" :option="option" v-model="obj"
                   :page="page"
                   @size-change="sizeChange"
                   @current-change="currentChange"
                   @search-change="searchChange"
                   @refresh-change="refresh"
                   :table-loading="loading">
            <template slot="search">
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" :model="filters" size="mini">
                        <el-form-item >
                            <el-input v-model="filters.uid" :clearable="true" placeholder="组长ID"></el-input>
                        </el-form-item>
                        <el-form-item >
                            <el-input v-model="filters.groupid" :clearable="true" placeholder="群ID"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-form :inline="true" :model="filters" size="mini">
                        <el-form-item >
                            <el-input v-model="filters.setid" :clearable="true" placeholder="红包ID"></el-input>
                        </el-form-item>
                        <el-form-item >
                            <el-select v-model="filters.status" :clearable="true" placeholder="状态">
                                <el-option label="已抢完" value="0"></el-option>
                                <el-option label="正在抢" value="1"></el-option>
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

    </basic-container>
</template>

<script>

    import { getSendList } from '~/api/request/request';
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
                    title:'红包明细',
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
                    addBtn:false,
                    menu:false,
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
                            label:'任务ID',
                            prop:'taskid',
                            width:180
                        },
                        {
                            label:'组长微博ID',
                            prop:'uid',
                            width:180,
                            display:false,
                        },
                        {
                            label:'群组ID',
                            prop:'groupid',
                            width:180
                        },
                        {
                            label:'红包ID',
                            prop:'setid',
                            width:180
                        },
                        {
                            label:'状态',
                            prop:'status_format',
                            width:100,
                            formslot:true,
                        },
                        {
                            label:'已抢数量',
                            prop:'getcount',
                            width:100
                        },
                        {
                            label:'发红包数量',
                            prop:'sendcount',
                            width:100
                        },
                        {
                            label:'红包金额',
                            prop:'amount',
                            width:100
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
            queryData(){
                this.loading = true
                let startdate=""
                let enddate=""
                if(this.filters.querytime && this.filters.querytime[0] && this.filters.querytime[1]){
                    startdate=dateformart(this.filters.querytime[0])+' 00:00:01'
                    enddate=dateformart(this.filters.querytime[1])+' 23:59:59'
                }
                getSendList({
                    params : {
                        page : this.page.currentPage,
                        page_size : this.page.pageSize,
                        userid : this.filters.userid,
                        uid : this.filters.uid,
                        groupid : this.filters.groupid,
                        startdate : startdate ,
                        enddate : enddate,
                        setid:this.filters.setid,
                        status:this.filters.status
                    },
                    callback : (res) => {
                        this.data = res.data.data
                        console.log(this.data)
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
        }
    }
</script>