<template>
    <basic-container>
        <avue-crud :data="data"
                   :option="option"
                   v-model="obj"
                   :page="page"
                   @size-change="sizeChange"
                   @current-change="currentChange"
                   :table-loading="loading"
                   @refresh-change="refreshChange"
                   @search-change="searchChange"
                   @search-reset="searchReset"
                   @selection-change="selectionChange"
        >
            <template slot="search">
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" :model="filters" size="mini">
                        <el-form-item >
                            <el-input v-model="filters.ordercode" :clearable="true" placeholder="订单号"></el-input>
                        </el-form-item>
                        <el-form-item >
                            <el-input v-model="filters.no" :clearable="true" placeholder="流水号"></el-input>
                        </el-form-item>
                        <el-form-item >
                            <el-input v-model="filters.userid" :clearable="true" placeholder="商户ID"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-form :inline="true"  :model="filters" size="mini">
                        <el-form-item >
                            <el-select v-model="filters.status" :clearable="true" placeholder="支付状态">
                                <el-option label="支付成功" value="0"></el-option>
                                <el-option label="等待支付" value="1"></el-option>
                                <el-option label="订单过期" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item >
                            <el-select v-model="filters.down_status" :clearable="true" placeholder="商户订单支付状态">
                                <el-option label="支付成功" value="0"></el-option>
                                <el-option label="等待支付" value="1"></el-option>
                                <el-option label="回调失败" value="2"></el-option>
                                <el-option label="订单过期" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item >
                            <el-input v-model="filters.passid" :clearable="true" placeholder="支付渠道"></el-input>
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
            <template slot="status_name" slot-scope="scope" >
                <span v-if="scope.row.status=== '0'" style="color: #95e61a">{{scope.row.status_name}}</span>
                <span v-else-if="scope.row.status=== '1'" style="color: #abd5f9">{{scope.row.status_name}}</span>
                <span v-else style="color: #e62b32">{{scope.row.status_name}}</span>
            </template>

            <template slot="down_status_name" slot-scope="scope" >
                <span v-if="scope.row.down_status=== '0'" style="color: #95e61a">{{scope.row.down_status_name}}</span>
                <span v-else-if="scope.row.down_status=== '1'" style="color: #abd5f9">{{scope.row.down_status_name}}</span>
                <span v-else style="color: #e62b32">{{scope.row.down_status_name}}</span>
            </template>


            <template slot="menuLeft">
                <el-button type="primary" icon="el-icon-edit" circle @click="clickUpdOrderStatus" size="mini" ></el-button>
                <el-button type="primary" icon="el-icon-phone-outline" circle @click="clickUpdOrderDown" size="mini" ></el-button>
            </template>

            <template slot-scope="scope" slot="menu">
                <el-button  v-if="scope.row.isstop==='1'" type="primary" icon="el-icon-edit" circle size="mini" @click="stopHandler(scope.row)">冻结</el-button>
                <el-button  v-else type="danger" icon="el-icon-edit" circle size="mini" @click="stopCanleHandler(scope.row)">解冻</el-button>
            </template>

        </avue-crud>
    </basic-container>

</template>

<script>
    import {order_query,order_status_upd,callback_business_ex,stop_handler,stop_canle_handler } from '~/api/request/request';
    import { dateformart } from '~/api/utils'
    export default {
        data() {
            return {
                filters: {
                    querytime:'',
                    ordercode:'',
                    status:'',
                    no:'',
                    userid:'',
                    name:'',
                    down_status:'',
                    passid:''
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
                selectData:[],
                loading:true,
                page: {
                    //pageSizes: [10, 20, 30, 40],默认
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                obj:{},
                data: [],
                option:{
                    stripe:true,
                    align:'center',
                    menuAlign:'center',
                    menuWidth:100,
                    size:'mini',
                    title:'订单列表',
                    menu:true,
                    border:true,
                    addBtn:false,
                    // excelBtn:true,
                    editBtn:false,
                    delBtn:false,
                    searchSize:'mini',
                    selection:true,
                    searchShow:false,
                    column:[
                        {
                            label:'商户ID',
                            prop:'userid',
                            width:60
                        },
                        {
                            label:'订单ID',
                            prop:'ordercode',
                            width:100
                        },
                        {
                            label:'流水号',
                            prop:'no',
                            width:220,
                        },
                        {
                            label:'订单时间',
                            prop:'createtime',
                            width:150
                        },
                        {
                            label:'订单金额',
                            prop:'amount',
                            width:80
                        },
                        {
                            label:'支付状态',
                            prop:'status_name',
                            width:100,
                            slot:true,
                        },
                        {
                            label:'商户订单状态',
                            prop:'down_status_name',
                            width:100,
                            slot:true,
                        },
                        {
                            label:'是否冻结',
                            prop:'isstop_name',
                            width:100
                        },
                        {
                            label:'支付渠道',
                            prop:'paypassname',
                            width:200
                        },
                        {
                            label:'支付方式',
                            prop:'paytypename',
                            width:130
                        },
                        {
                            label:'总技术费',
                            prop:'tech_cost',
                            width:80
                        },
                        {
                            label:'收入',
                            prop:'myfee',
                            width:80
                        },
                        {
                            label:'码商费用',
                            prop:'codefee',
                            width:100
                        },
                    ]
                }
            }
        },
        methods : {
            sizeChange(val) {
                this.page.currentPage = 1
                this.page.pageSize = val
                this.RequestQuery()
            },
            currentChange(val) {
                this.page.currentPage = val
                this.RequestQuery()
            },
            refreshChange(){
                this.RequestQuery()
            },
            searchChange(){
              this.RequestQuery()
            },
            searchReset(){
              this.filters={}
            },
            selectionChange(list){
                this.selectData = list
            },
            clickUpdOrderStatus(){
                if(this.selectData.length==0){
                    this.$message.error('请勾选订单!')
                }
                else{
                    let orders = []
                    this.selectData.forEach(item => {
                        if(item.status === '1' || item.status === '3'){
                            orders.push(item.ordercode)
                        }
                    })
                    order_status_upd({
                        data : {"orders" : orders},
                        callback : (res) => {
                            this.$message.success("手工上分成功!")
                            this.RequestQuery()
                        }
                    })
                }
            },
            clickUpdOrderDown(){
                if(this.selectData.length==0){
                    this.$message.error('请勾选订单!')
                }
                else{
                    let orders = []
                    this.selectData.forEach(item => {
                        orders.push(item.ordercode)
                    })
                    callback_business_ex({
                        data : {"orders" : orders},
                        callback : (res) => {
                            if(res.data.data.error){
                                this.$message.warning(res.data.data.error)
                            }else{
                                this.$message.success("通知成功!")
                            }
                            this.RequestQuery()
                        }
                    })
                }
            },
            stopHandler(row){
                this.$confirm('确认冻结此笔订单号吗？', '提示', {}).then(() => {
                    stop_handler({
                        data :{
                            "ordercode" : row.ordercode
                        },
                        callback : () => {
                            this.RequestQuery()
                            this.$message({message : "冻结成功!"})
                        }
                    })
                })
            },
            stopCanleHandler(row){
                this.$confirm('确认解冻此笔订单号吗？', '提示', {}).then(() => {
                    stop_canle_handler({
                        data :{
                            "ordercode" : row.ordercode
                        },
                        callback : () => {
                            this.RequestQuery()
                            this.$message({message : "解冻成功!"})
                        }
                    })
                })
            },
            RequestQuery(){
                this.loading=true
                let startdate=""
                let enddate=""
                if(this.filters.querytime && this.filters.querytime[0] && this.filters.querytime[1]){
                    startdate=dateformart(this.filters.querytime[0])+' 00:00:01'
                    enddate=dateformart(this.filters.querytime[1])+' 23:59:59'
                }

                order_query({
                    params : {
                        page:this.page.currentPage,
                        page_size: this.page.pageSize,
                        ordercode : this.filters.ordercode,
                        startdate : startdate ,
                        enddate : enddate,
                        status : this.filters.status,
                        no : this.filters.no,
                        userid: this.filters.userid,
                        down_status: this.filters.down_status,
                        passid: this.filters.passid
                    },
                    callback : (res) => {
                        this.data = res.data.data.data
                        this.page.total = Number(res.headers.total)
                        this.loading=false
                    }
                })
            }
        },
        created() {
            this.RequestQuery()
        },
    }
</script>

<style>

</style>