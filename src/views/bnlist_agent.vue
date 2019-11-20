<template>
    <section >

        <!--        <el-col :span="24" class="toolbar">-->
        <!--            <el-button type="primary" icon="el-icon-check" @click="clickUpdpassHandler" size="mini">切换支付渠道</el-button>-->
        <!--        </el-col>-->

        <el-table
                :data="vlist"
                height="500"
                highlight-current-row
                v-loading="listLoading"
                @selection-change="handleSelectionChange"
                style="width: 100%;"
                border
                :summary-method="getSummaries"
                show-summary
                :fit="true"
                size="mini">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="userid" label="商户ID" width="90" sortable align="center">
            </el-table-column>
            <el-table-column prop="name" label="商户名称" width="200" sortable align="center">
            </el-table-column>
            <el-table-column prop="loginname" label="登录账号" width="200" sortable align="center">
            </el-table-column>
            <el-table-column prop="today_amount" label="当天流水" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="up_bal" label="总流水" width="120" sortable align="center">
            </el-table-column>
<!--            <el-table-column label="代理" width="90" align="center" >-->
<!--                <template slot-scope="scope">-->
<!--                    <el-button size="mini" icon="el-icon-search" circle @click="QueryAgent(scope.row)"></el-button>-->
<!--                </template>-->
<!--            </el-table-column>-->
            <el-table-column label="商户费率" width="90" align="center" >
                <template slot-scope="scope">
                    <el-button size="mini" icon="el-icon-search" circle @click="clickPayHandler(scope.row)"></el-button>
                </template>
            </el-table-column>
            <el-table-column label="我的费率" width="90" align="center" >
                <template slot-scope="scope">
                    <el-button size="mini" icon="el-icon-search" circle @click="clickPayHandler1(scope.row)"></el-button>
                </template>
            </el-table-column>
            <el-table-column prop="createtime" label="注册时间" width="150" sortable align="center">
            </el-table-column>
            <el-table-column prop="concat" label="联系人" width="100" sortable align="center">
            </el-table-column>
            <el-table-column prop="contype" label="联系方式" width="100" sortable align="center">
            </el-table-column>

        </el-table>


        <el-dialog title="我的费率" :visible.sync="PayObj1.showFlag" :close-on-click-modal="false">
            <el-form :model="PayObj1" status-icon  label-width="150px"  ref="PayObj1" label-position='left' size="mini">
<!--                <el-checkbox :indeterminate="PayObj1.isIndeterminate" v-model="PayObj1.checkAll" @change="handleCheckAllChange">全选</el-checkbox>-->
<!--                <div style="margin: 15px 0;"></div>-->
<!--                <el-checkbox-group v-model="Pays.pays" @change="handleCheckedCitiesChange">-->
<!--                    <el-checkbox v-for="(city,index) in PayObj1.cities" :label="city" :key="index">{{city}}</el-checkbox>-->
<!--                </el-checkbox-group>-->
                <div style="margin: 20px"></div>
                <el-form-item v-for="(item,index) in Pays.pays"
                              :label="item +'费率'" :key="index"
                              :prop="'rates[' + index + ']'"
                              :rules="PayObj1.Rules">
                    <el-input v-model="PayObj1.rates[index]" placeholder="请输入费率"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="PayObj1.showFlag = false">取消</el-button>
                <el-button type="primary" @click.native="PaySubmit2" :loading="PayObj1.loading" v-show="AgentObj.PayShowFlag">提交</el-button>
            </div>
        </el-dialog>

        <!--        &lt;!&ndash;渠道切换&ndash;&gt;-->
        <!--        <el-dialog title="渠道切换" :visible.sync="UpdPassObj.flag" :close-on-click-modal="false">-->
        <!--            <el-form :model="upassobj" status-icon label-width="100px" ref="upassobj"  label-position='left' size="mini">-->
        <!--                <el-form-item label="支付渠道" prop="paypassid" :rules="UpdPassFormRule">-->
        <!--                    <el-autocomplete-->
        <!--                            :fetch-suggestions="querySearch1"-->
        <!--                            prefix-icon="el-icon-search"-->
        <!--                            v-model="upassobj.paypassid"-->
        <!--                            placeholder="请输入支付渠道ID">-->
        <!--                    </el-autocomplete>-->
        <!--                </el-form-item>-->
        <!--            </el-form>-->
        <!--            <div slot="footer" class="dialog-footer">-->
        <!--                <el-button @click.native="UpdPassObj.flag = false">取消</el-button>-->
        <!--                <el-button type="primary" @click.native="UpdPassHandler" :loading="addLoading">提交</el-button>-->
        <!--            </div>-->
        <!--        </el-dialog>-->

        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination
                    background
                    layout="sizes,prev, pager, next"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 30, 50, 100,200,500,1000,2000,5000]"
                    :page-size="pagesize"
                    :total="total"
                    :pager-count="5"
                    style="float:right;">
            </el-pagination>
        </el-col>

        <el-dialog title="查看代理" :visible.sync="AgentObj.showFlag" :close-on-click-modal="false">

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
            </el-table>
        </el-dialog>

        <el-dialog title="费率" :visible.sync="PayObj.showFlag" :close-on-click-modal="false">
            <el-form :model="PayObj" status-icon  label-width="150px"  ref="PayObj" label-position='left' size="mini">
                <el-form-item v-for="(item,index) in Pays.pays"
                              :label="item +'费率'" :key="index"
                              :prop="'rates[' + index + ']'"
                              :rules="PayObj.Rules">
                    <el-input v-model="PayObj.rates[index]" placeholder="请输入费率"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="PayObj.showFlag = false">取消</el-button>
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
    </section>
</template>

<script>
    import { user_del,agent_query,user_add,user_verify,agent_query1,business_query,
        user_upd,paytype_query,paypasslinktype_add,paypasslinktype_query,agent_delete,agent_modi,paypass_query1 ,
        user_updpass} from '~/api/request/request';
    export default {
        data() {
            return {
                obj:{},
                //一键更改渠道结构
                UpdPassObj:{
                    flag:false
                },
                upassobj:{},
                UpdPassFormRule:[
                    {
                        required: true,
                        validator : (rule, value, callback) => {
                            if ( this.paypass1.indexOf(value) === -1) {
                                callback(new Error('输入的支付渠道不存在!'));
                            } else {
                                callback();
                            }
                        }
                    }
                ],


                paypass:[],
                paypass1:[],
                vlist:[],
                listLoading: false,
                total:0,
                page:1,
                pagesize:10,
                roles:[],
                addFlag:false,
                selectData:[],
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
                addLoading:false,
                restaurants:[],
                restaurants1:[],
                //代理结构
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
                PayObj : {
                    addlist : {insert:[]} ,
                    loading : false ,
                    showFlag: false,
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
                PayObj1 : {
                    addlist : {insert:[]} ,
                    loading : false ,
                    showFlag: false,
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
                PayPassObj : {}
            }
        },
        methods:{
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0 ) {
                        sums[index] = '总价';
                        return;
                    }
                    if (index === 4 || index ===5 ){
                        const values = data.map(item => Number(item[column.property]));
                        if (!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return prev + curr;
                                } else {
                                    return prev;
                                }
                            }, 0);
                            sums[index] = sums[index].toFixed(2)
                            sums[index] += ' 元'
                        } else {
                            sums[index] = 'N/A';
                        }
                    }

                });

                return sums;
            },
            clickUpdpassHandler(){
                if(this.selectData.length==0){
                    this.$message.error('请勾选商户数据!')
                }else{
                    this.UpdPassObj.flag=true
                }
            },
            UpdPassHandler(){
                this.$refs.upassobj.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let insert_data={pass:[]}
                            this.selectData.forEach(item => {
                                insert_data.pass.push({
                                    userid : item.userid,
                                    paypassid : this.upassobj.paypassid.split('(')[0]
                                })
                            })
                            user_updpass({
                                data :insert_data,
                                callback : () => {
                                    this.addLoading = false;
                                    this.$refs['upassobj'].resetFields();
                                    this.UpdPassObj.flag = false;
                                    this.$message.success("切换成功!")
                                    this.RequestQuery()
                                },
                                errorcallback : () => {
                                    this.addLoading = false;
                                    this.UpdPassObj.flag = false;
                                }
                            })
                        })
                    }
                })
            },
            handleSelectionChange(val){
                this.selectData = val
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

                        // console.log(res)
                        // console.log(this.paypass1)
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
            clickPayHandlerAgent(row){
                this.PayObj1.PayLodingButton=true
                this.PayPassObj = Object.assign({}, row);
                this.$set(this.PayPassObj,'types',this.PayTypeObj)

                this.PayObj1.isIndeterminate=true
                this.PayObj1.checkAll=false
                this.Pays.pays=[]
                this.PayObj1.rates=[]
                this.PayObj1.passids=[]
                this.$set(this.PayObj1.addlist,'delete',{})
                this.$set(this.PayObj1.addlist,'insert',[])

                let user = JSON.parse(localStorage.user)

                paypasslinktype_query({
                    params : {
                        page:1,
                        page_size: 9999999,
                        type : "1",
                        id : user.userid,
                        userid : this.obj.userid,
                        isAgent : 1
                    },
                    callback : (res) => {

                        res.data.data.forEach((item,index) => {
                            this.Pays.pays.push(
                                item.typename + item.name
                            )
                            this.PayObj1.rates.push(
                                item.rate
                            )
                            this.paypass1.forEach(item1 => {
                                if (item1.split('(')[0] === item.passid.toString()){
                                    this.PayObj1.passids.push(
                                        item1
                                    )
                                }
                            })
                        })

                        this.PayObj1.PayLodingButton=false
                        this.PayObj1.showFlag=true
                    }
                })
            },
            clickPayHandler1(row){
                this.obj = row
                this.clickPayHandlerAgent(row)
                this.AgentObj.PayShowFlag=false
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

                        this.AgentObj.loading =false

                    },
                    errorcallback : () => {
                        this.AgentObj.loading =false
                    }
                })
            },
            QueryAgent(row){
                this.AgentObj.showFlag=true
                this.AgentObj.userid=row.userid
                this.AgentQueryTmp(row.userid)
            },
            handleSelect(item) {
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
            removeAgent(item){
                var index = this.updobj.agents.indexOf(item)
                if (index !== -1) {
                    this.updobj.agents.splice(index, 1)
                }
            },
            addAgent(){
                this.updobj.agents.push({
                    value: '',
                    key: Date.now()
                })
            },
            mg_add () {
                this.addFlag = true;
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
                            if(this.addForm.paypassid.length>0){
                                this.$set(this.addForm1,'paypassid',this.addForm.paypassid.split('(')[0])
                            }else{
                                this.$set(this.addForm1,'paypassid','0')
                            }

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
                this.paypass1.forEach(item => {
                    if (item.split('(')[0] === this.addForm.paypassid.toString()){
                        this.$set(this.addForm,"paypassid",item)
                    }
                })
                if(this.addForm.paypassid===0){
                    this.$set(this.addForm,"paypassid","")
                }
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
            handlerEdit(row){
            },
            handleSizeChange(val) {
                this.pagesize = val;
                this.RequestQuery()
            },
            handleCurrentChange(val) {
                this.page = val;
                this.RequestQuery()
            },
            RequestQuery(){
                this.listLoading=true
                business_query({
                    params : {
                        page:this.page,
                        page_size:this.pagesize,
                        status : "0",
                        type: "1"
                    },
                    callback : (res) => {
                        this.vlist = res.data.data
                        this.total = Number(res.headers.total)
                        this.listLoading=false
                    },
                    errorcallback : () => {
                        this.listLoading=false
                    }
                })
            }
        },
        mounted(){
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
                        this.PayObj1.cityOptions.push(
                            item.typename + item.name
                        )
                    })
                    this.PayObj.cities = this.PayObj.cityOptions
                    this.PayObj1.cities = this.PayObj.cityOptions
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
        }
    }
</script>

<style scoped>

</style>
