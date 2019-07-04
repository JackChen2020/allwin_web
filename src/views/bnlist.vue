<template>
    <div>
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
            <template  slot="search">
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form  :model="filters" size="mini">
                        <el-form-item >
                            <el-input v-model="filters.userid" :clearable="true" placeholder="商户ID"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </template>
            <template slot="agent" slot-scope="scope" >
                <u v-if="scope.row.agentsname.length!==0" style="color: #e62b32" @click="QueryAgent(scope.row)">{{scope.row.agentsname}}</u>
                <u v-else style="color: #e62b32"  @click="QueryAgent(scope.row)">暂未设置代理,点击可设置!</u>
            </template>
            <template slot="passtyperate" slot-scope="scope" >
                <u v-if="scope.row.paypasstypenames.length!==0" style="color: #e62b32"  @click="clickPayHandler(scope.row)">{{scope.row.paypasstypenames}}</u>
                <u v-else style="color: #e62b32"  @click="clickPayHandler(scope.row)">暂未设置费率,请点击设置!</u>
            </template>
            <template slot-scope="scope" slot="menu">
                <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="updHandler(scope.row)"></el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="delHandler(scope.row)"></el-button>
            </template>
            <template slot="menuRight">
                <el-button type="primary" icon="el-icon-edit" circle @click="clickPayHandler2" size="mini" ></el-button>
            </template>

        </avue-crud>

        <el-dialog title="费率" :visible.sync="PayObj.showFlag" :close-on-click-modal="false">
            <el-form :model="PayObj" status-icon  label-width="150px"  ref="PayObj" label-position='left' size="mini">
                <el-checkbox :indeterminate="PayObj.isIndeterminate" v-model="PayObj.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="Pays.pays" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="(city,index) in PayObj.cities" :label="city" :key="index">{{city}}</el-checkbox>
                </el-checkbox-group>
                <div style="margin: 20px"></div>
                <el-form-item v-for="(item,index) in Pays.pays"
                              :label="item +'费率'" :key="index"
                              :prop="'rates[' + index + ']'"
                              :rules="PayObj.Rules">
                    <el-input v-model="PayObj.rates[index]" placeholder="请输入费率"></el-input>
                    <el-autocomplete
                            :fetch-suggestions="querySearch1"
                            prefix-icon="el-icon-search"
                            v-model="PayObj.passids[index]"
                            placeholder="请输入支付渠道ID">
                    </el-autocomplete>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="PayObj.showFlag = false">取消</el-button>
                <el-button type="primary" @click.native="PaySubmit" :loading="PayObj.loading" v-show="AgentObj.PayShowFlag">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="批量切换费率" :visible.sync="PayObj.showFlag1" :close-on-click-modal="false">
            <el-form :model="PayObj" status-icon  label-width="150px"  ref="PayObj" label-position='left' size="mini">
                <el-checkbox :indeterminate="PayObj.isIndeterminate" v-model="PayObj.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="Pays.pays" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="(city,index) in PayObj.cities" :label="city" :key="index">{{city}}</el-checkbox>
                </el-checkbox-group>
                <div style="margin: 20px"></div>
                <el-form-item v-for="(item,index) in Pays.pays"
                              :label="item +'渠道'" :key="index"
                              :prop="'rates[' + index + ']'">
                    <el-autocomplete
                            :fetch-suggestions="querySearch1"
                            prefix-icon="el-icon-search"
                            v-model="PayObj.passids[index]"
                            placeholder="请输入支付渠道ID">
                    </el-autocomplete>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="PayObj.showFlag1 = false">取消</el-button>
                <el-button type="primary" @click.native="PaySubmit1" :loading="PayObj.loading" v-show="AgentObj.PayShowFlag">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="查看代理" :visible.sync="AgentObj.showFlag" :close-on-click-modal="false">
            <el-col :span="24" class="toolbar">
                <el-button type="primary" icon="el-icon-edit" @click="AgentObj.updFlag = true" size="mini">编辑</el-button>
            </el-col>

            <el-table
                    :data="AgentObj.list"
                    height="300"
                    highlight-current-row
                    style="width: 100%;"
                    border
                    v-loading="AgentObj.loading"
                    :fit="true"
                    size="mini">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" width="40">
                </el-table-column>
                <el-table-column prop="userid" label="代理ID" width="110" sortable align="center">
                </el-table-column>
                <el-table-column prop="name_to" label="代理名称" width="110" sortable align="center">
                </el-table-column>
                <el-table-column prop="level" label="代理级别" width="100" sortable align="center">
                </el-table-column>
                <el-table-column label="操作"  width="140" align="center" >
                    <template slot-scope="scope">
                        <el-button v-if="PayObj.PayLodingButton===false" type="primary" size="mini" icon="el-icon-s-finance" circle @click="clickPayHandler1(scope.row)"></el-button>
                        <el-button v-else type="primary" size="mini" icon="el-icon-loading" circle @click="clickPayHandler1(scope.row)"></el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="delAgentHandler(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="编辑代理" :visible.sync="AgentObj.updFlag" :close-on-click-modal="false">
            <el-form :model="updobj" status-icon label-width="100px" ref="updobj" label-position='left' size="mini">
                <el-form-item
                        v-for="(agent, index) in updobj.agents"
                        :label="index+1 + '级' + '代理人'"
                        :key="agent.key"
                        :prop="'agents[' + index + '].value'"
                        :rules="AgentObj.Rules"
                >
                    <el-autocomplete  class="inline-input"
                                      :fetch-suggestions="querySearch"
                                      prefix-icon="el-icon-search"
                                      placeholder="请输入代理人ID或名字"
                                      v-model="agent.value"></el-autocomplete>
                    <el-button type="danger" size="mini" icon="el-icon-delete" circle @click.prevent="removeAgent(agent)"></el-button>
                </el-form-item>
                <el-button style="margin-bottom:10px" type="primary" size="mini" icon="el-icon-plus" circle @click="addAgent">新增代理人</el-button>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="AgentObj.updFlag = false">取消</el-button>
                <el-button type="primary" @click.native="AgentModiHandler" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑" :visible.sync="addFlag" :close-on-click-modal="false">
            <el-form :model="addForm" status-icon label-width="100px" :rules="addFormRules" ref="addForm" label-position='left' size="mini">
                <el-form-item label="商户名称" prop="name">
                    <el-input
                            v-model="addForm.name"
                            placeholder="请输入商户名称">
                    </el-input>
                </el-form-item>
                <el-form-item label="登录账号" prop="loginname">
                    <el-input
                            v-model="addForm.loginname"
                            placeholder="请输入登录账号">
                    </el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="concat">
                    <el-input
                            v-model="addForm.concat"
                            placeholder="请输入联系人">
                    </el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="contype">
                    <el-input
                            v-model="addForm.contype"
                            placeholder="例如:QQ:10101100">
                    </el-input>
                </el-form-item>
                <!--                <el-form-item label="支付渠道" prop="paypassid">-->
                <!--                    <el-autocomplete-->
                <!--                            :fetch-suggestions="querySearch1"-->
                <!--                            prefix-icon="el-icon-search"-->
                <!--                            v-model="addForm.paypassid"-->
                <!--                            placeholder="请输入支付渠道ID">-->
                <!--                    </el-autocomplete>-->
                <!--                </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFlag = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import {business_query,agent_modi,agent_delete,agent_query1,user_del,user_upd,paypasslinktype_query,paytype_query,paypass_query1,paypasslinktype_add,upd_paypass_batch   } from '~/api/request/request';
    import { dateformart } from '~/api/utils'
    export default {
        data() {
            return {
                filters: {
                    userid:''
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
                addFlag:false,
                addForm:{
                    agents: [],
                    passwd: "",
                    confirm_passwd: "",
                    passwd_value: ""
                },
                addForm1:{},
                addFormRules: {
                    name: [
                        { required: true, message: '请输入商户名称', trigger: 'blur' }
                    ],
                    loginname: [
                        { required: true, message: '请输入登录账号', trigger: 'blur' }
                    ],
                    concat: [
                        { required: true, message: '请输入联系人', trigger: 'blur' }
                    ],
                    contype: [
                        { required: true, message: '请输入联系方式', trigger: 'blur' }
                    ],
                    paypassid : [
                        {
                            validator : (rule, value, callback) => {
                                if (value.length > 0 && this.paypass1.indexOf(value) === -1) {
                                    callback(new Error('输入的支付渠道不存在!'));
                                } else {
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ]
                },
                restaurants:[],
                restaurants1:[],
                //代理结构
                addLoading:false,
                AgentObj:{
                    list : [],
                    loading : false ,
                    showFlag: false,
                    PayShowFlag:true,
                    updFlag :false,
                    Rules: [
                        {   required: true, message: '请输代理人', trigger: 'blur' },
                        {
                            validator : (rule, value, callback) => {
                                if (value.length > 0 && this.restaurants1.indexOf(value) === -1) {
                                    callback(new Error('输入的代理人不存在!'));
                                } else {
                                    callback();
                                }
                            }}
                    ],
                    userid : 0,
                },
                updobj:{agents:[]},

                // 费率处理结构
                paypass:[],
                paypass1:[],
                PayObj : {
                    addlist : {insert:[]} ,
                    loading : false ,
                    showFlag: false,
                    showFlag1: false,
                    cityOptions : [] ,
                    checkAll: false,
                    checkedCities: [],
                    cities: [],
                    isIndeterminate: true,
                    Rules:[
                        {   required: true, message: '请输入费率,例如:0.003', trigger: 'blur' },
                        {
                            validator: (rule, value, callback) => {
                                var reg = /^-?\d{1,5}(?:\.\d{1,4})?$/
                                if (reg.test(value)) {
                                    callback()
                                } else {
                                    callback(new Error('请输入正确的金额'))
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    PayLodingButton:false,
                    rates:[],
                    passids:[]
                },
                Pays : {pays:[]},
                PayTypeObj : [],
                PayTypeObjs : [],
                PayPassObj : {},

                obj:{},
                data: [],
                option:{
                    stripe:true,
                    align:'center',
                    menuAlign:'center',
                    size:'mini',
                    menu:true,
                    menuWidth:100,
                    cellBtn:false,
                    delBtn:false,
                    editBtn:false,
                    border:true,
                    addBtn:false,
                    searchSize:'mini',
                    searchShow:false,
                    selection:true,
                    showSummary:true,
                    sumColumnList:[
                        {
                            name: 'bal',
                            type: 'sum'
                        },
                        {
                            name: 'bal1',
                            type: 'sum'
                        },
                        {
                            name: 'today_amount',
                            type: 'sum'
                        },
                        {
                            name: 'up_bal',
                            type: 'sum'
                        },
                    ],
                    column:[
                        {
                            label:'商户ID',
                            prop:'userid',
                            width:60
                        },
                        {
                            label:'商户名称',
                            prop:'name',
                            width:200
                        },
                        {
                            label:'登录账号',
                            prop:'loginname',
                            width:200
                        },
                        {
                            label:'渠道支付方式费率',
                            prop:'passtyperate',
                            width:500,
                            solt:true,
                        },
                        {
                            label:'商户余额',
                            prop:'bal',
                            width:120
                        },
                        {
                            label:'可提现余额',
                            prop:'bal1',
                            width:120
                        },
                        {
                            label:'当天流水',
                            prop:'today_amount',
                            width:120
                        },
                        {
                            label:'总流水',
                            prop:'up_bal',
                            width:140
                        },

                        {
                            label:'代理',
                            prop:'agent',
                            width:130,
                            solt:true,
                        },
                        {
                            label:'注册时间',
                            prop:'createtime',
                            width:150
                        },
                        {
                            label:'联系人',
                            prop:'concat',
                            width:200
                        },
                        {
                            label:'联系方式',
                            prop:'contype',
                            width:200
                        },
                    ]
                }
            }
        },
        methods : {
            selectionChange(list){
                this.selectData = list
            },
            querySearch1(queryString, cb) {
                var restaurants = this.paypass;
                var results = queryString ? restaurants.filter(this.createFilter1(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter1(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
                };
            },
            handleCheckAllChange(val) {
                this.Pays.pays = val ? this.PayObj.cityOptions : [];
                this.PayObj.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.PayObj.checkAll = checkedCount === this.PayObj.cities.length;
                this.PayObj.isIndeterminate = checkedCount > 0 && checkedCount < this.PayObj.cities.length;
            },
            PaySubmit(){
                this.$refs.PayObj.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.PayObj.loading= true;
                            this.PayPassObj.types.forEach((item,index) => {
                                let listno = this.Pays.pays.indexOf(item.typename + item.name)
                                if (listno !==-1){
                                    this.PayObj.addlist.insert.push({
                                        to_id : this.PayPassObj.userid,
                                        paytypeid : item.paytypeid,
                                        type : '1',
                                        rate : this.PayObj.rates[listno],
                                        passid : this.PayObj.passids[listno].split('(')[0],
                                    })
                                }
                            })
                            if (this.PayObj.addlist.insert.length===0){
                                this.$set(this.PayObj.addlist.delete,'id',this.PayPassObj.userid)
                                this.$set(this.PayObj.addlist.delete,'type','1')
                            }
                            paypasslinktype_add({
                                data :this.PayObj.addlist,
                                callback : () => {
                                    this.$refs['PayObj'].resetFields();
                                    this.PayObj.showFlag = false;
                                    this.PayObj.loading= false;
                                    this.$message({
                                        message : "编辑成功!"
                                    })
                                    this.RequestQuery()
                                },
                                errorcallback : () => {
                                    this.PayObj.showFlag = false;
                                    this.PayObj.loading= false;
                                }
                            })
                        })
                    }
                })
            },
            PaySubmit1(){
                this.$refs.PayObj.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.PayObj.loading= true;

                            let paypass=[]
                            this.PayPassObj.types.forEach((item,index) => {
                                let listno = this.Pays.pays.indexOf(item.typename + item.name)
                                if (listno !==-1) {
                                    paypass.push({
                                        passid : this.PayObj.passids[listno].split('(')[0],
                                        paytypeid : item.paytypeid
                                    })
                                }
                            })
                            let userids=[]
                            this.selectData.forEach(item =>{
                                userids.push(item.userid)
                            })
                            upd_paypass_batch({
                                data :{userids:userids,paypass:paypass},
                                callback : (res) => {
                                    this.$refs['PayObj'].resetFields();
                                    this.PayObj.showFlag = false;
                                    this.PayObj.loading= false;
                                    if(res.data.data.error_list.length>0){
                                        this.$message({
                                            message : res.data.data.error_list
                                        })
                                    }else{
                                        this.$message({
                                            message : "渠道切换成功!"
                                        })
                                    }
                                    this.RequestQuery()
                                },
                                errorcallback : () => {
                                    this.PayObj.showFlag = false;
                                    this.PayObj.loading= false;
                                }
                            })
                        })
                    }
                })
            },
            clickPayHandler2(row){
                if(this.selectData.length==0){
                    this.$message.error('请勾选订单!')
                }else{
                    this.PayObj.showFlag1 = true
                    this.PayPassObj = Object.assign({}, row);
                    this.$set(this.PayPassObj,'types',this.PayTypeObj)
                    this.PayObj.isIndeterminate=true
                    this.PayObj.checkAll=false
                    this.Pays.pays=[]
                    this.PayObj.rates=[]
                    this.PayObj.passids=[]
                }
            },
            clickPayHandler(row){
                this.PayObj.PayLodingButton=true
                this.PayPassObj = Object.assign({}, row);
                this.$set(this.PayPassObj,'types',this.PayTypeObj)

                this.PayObj.isIndeterminate=true
                this.PayObj.checkAll=false
                this.Pays.pays=[]
                this.PayObj.rates=[]
                this.PayObj.passids=[]
                this.$set(this.PayObj.addlist,'delete',{})
                this.$set(this.PayObj.addlist,'insert',[])

                paypasslinktype_query({
                    params : {
                        page:1,
                        page_size: 9999999,
                        type : "1",
                        id : this.PayPassObj.userid
                    },
                    callback : (res) => {

                        res.data.data.forEach((item,index) => {
                            this.Pays.pays.push(
                                item.typename + item.name
                            )
                            this.PayObj.rates.push(
                                item.rate
                            )
                            this.paypass1.forEach(item1 => {
                                if (item1.split('(')[0] === item.passid.toString()){
                                    this.PayObj.passids.push(
                                        item1
                                    )
                                }
                            })
                        })

                        this.PayObj.PayLodingButton=false
                        this.PayObj.showFlag=true
                    }
                })
            },
            clickPayHandler1(row){
                this.clickPayHandler(row)
                this.AgentObj.PayShowFlag=false
            },
            addSubmit() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;

                            this.$set(this.addForm1,'userid',this.addForm.userid)
                            this.$set(this.addForm1,'name',this.addForm.name)
                            this.$set(this.addForm1,'concat',this.addForm.concat)
                            this.$set(this.addForm1,'contype',this.addForm.contype)
                            this.$set(this.addForm1,'loginname',this.addForm.loginname)

                            user_upd({
                                data :this.addForm1,
                                callback : () => {
                                    this.addLoading = false;
                                    this.$refs['addForm'].resetFields();
                                    this.addFlag= false;
                                    this.$message({
                                        message : "编辑成功!"
                                    })
                                    this.RequestQuery()
                                },
                                errorcallback : () => {
                                    this.addLoading = false;
                                    this.addFlag = false;
                                }
                            })
                        })
                    }
                })
            },
            updHandler(row){
                this.addForm = Object.assign({}, row);
                this.addFlag = true
            },
            delHandler(row){
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    user_del({
                        data : { userid : row.userid },
                        callback : () => {
                            this.RequestQuery()
                        },
                        errorcallback : () => {
                            this.listLoading = false;
                        }
                    })
                }).catch(() => {
                })
            },
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
            SearchAgentQuery(){
                agent_query1({
                    params : {
                        status : "0",
                        type: "2"
                    },
                    callback : (res) => {
                        this.restaurants = res.data.data
                        this.restaurants.forEach(item => {
                            this.restaurants1.push(item.value)
                        })
                    }
                })
            },
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
                };
            },
            AgentQueryTmp(userid){
                this.AgentObj.loading =true
                this.updobj={agents:[]}
                business_query({
                    params : {
                        status : "0",
                        type: "1",
                        userid : this.AgentObj.userid,
                    },
                    callback : (res) => {
                        console.log(res)
                        if(res.data.data && res.data.data.length>0){
                            this.AgentObj.list = res.data.data[0].agents
                            this.AgentObj.list.forEach((item,index) => {
                                let userid = this.AgentObj.list[index].userid_to
                                this.$set(this.AgentObj.list[index],'userid_to', this.AgentObj.list[index].userid)
                                this.$set(this.AgentObj.list[index],'userid', userid)

                                this.updobj.agents.push({
                                    value: this.AgentObj.list[index].userid+'('+this.AgentObj.list[index].name_to+')',
                                    key: this.AgentObj.list[index].id
                                })


                                this.AgentObj.userid  = this.AgentObj.list[index].userid_to
                            })
                        }else{
                            this.AgentObj.list = []
                        }


                        this.AgentObj.loading =false
                        this.RequestQuery()

                    },
                    errorcallback : () => {
                        this.AgentObj.loading =false
                    }
                })
            },
            addAgent(){
                this.updobj.agents.push({
                    value: '',
                    key: Date.now()
                })
            },
            AgentModiHandler(){
                this.$refs.updobj.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            this.$set(this.updobj,'userid',this.AgentObj.userid)
                            agent_modi({
                                data :this.updobj,
                                callback : () => {
                                    this.addLoading = false;
                                    this.$refs['updobj'].resetFields();
                                    this.AgentObj.updFlag = false;
                                    this.$message({
                                        message : "编辑成功!"
                                    })
                                    this.AgentQueryTmp(this.AgentObj.userid)
                                },
                                errorcallback : () => {
                                    this.addLoading = false;
                                    this.AgentObj.updFlag = false;
                                }
                            })
                        })
                    }
                })
            },
            delAgentHandler(row){
                this.$confirm('确认删除吗？', '提示', {}).then(() => {
                    this.AgentObj.loading =true
                    agent_delete({
                        data: {id: row.id},
                        callback: () => {
                            this.AgentQueryTmp(row.userid_to)

                        },
                        errorcallback: () => {

                        }
                    })
                })
            },
            QueryAgent(row){
                this.AgentObj.showFlag=true
                this.AgentObj.userid=row.userid
                this.AgentQueryTmp(row.userid)
            },
            RequestQuery(){
                this.loading=true
                let startdate=""
                let enddate=""
                if(this.filters.querytime && this.filters.querytime[0] && this.filters.querytime[1]){
                    startdate=dateformart(this.filters.querytime[0])+' 00:00:01'
                    enddate=dateformart(this.filters.querytime[1])+' 23:59:59'
                }

                business_query({
                    params : {
                        page:this.page.currentPage,
                        page_size: this.page.pageSize,
                        userid: this.filters.userid,
                        status : '0'
                    },
                    callback : (res) => {
                        this.data = res.data.data
                        this.page.total = Number(res.headers.total)
                        this.loading=false
                        this.data.forEach(item =>{
                            let agentsname=""
                            item.agents.forEach(item1 => {
                                agentsname =  agentsname + '(' + item1.name_to + ')'
                            })
                            this.$set(item,'agentsname',agentsname)


                            let paypasstypenames = ""
                            item.paytypes.forEach(item2 =>{
                                paypasstypenames = paypasstypenames+ '(' + item2.paypassname+','+ item2.typename + item2.name + ',' + (item2.rate * 100.0).toFixed(2) + '%'  + ')'
                            })
                            this.$set(item,"paypasstypenames",paypasstypenames)
                        })
                    }
                })
            }
        },
        created() {
            this.RequestQuery()
            this.SearchAgentQuery()
            paytype_query({
                params : {
                    page:1,
                    page_size: 9999999
                },
                callback : (res) => {
                    this.PayTypeObj = res.data.data

                    this.PayTypeObj.forEach(item => {
                        this.PayObj.cityOptions.push(
                            item.typename + item.name
                        )
                    })
                    this.PayObj.cities = this.PayObj.cityOptions
                }
            })
            paypass_query1({
                params : {
                    page:1,
                    page_size : 9999999,
                },
                callback : (res) => {
                    res.data.data.forEach(item => {
                        this.paypass.push({
                            name : item.name ,
                            value : item.paypassid+'('+item.name+')'
                        })
                        this.paypass1.push( item.paypassid+'('+item.name+')' )
                    })
                }
            })
        },
    }
</script>

<style scoped>

</style>