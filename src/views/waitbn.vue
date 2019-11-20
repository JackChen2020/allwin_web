<template>
    <section >

        <el-col :span="24" class="toolbar">
            <el-button type="primary" icon="el-icon-plus" @click="addFlag = true" size="mini">添加</el-button>

            <el-button type="primary" icon="el-icon-check" @click="batchConfirm" size="mini">一键审核</el-button>
        </el-col>

        <el-table
                :data="vlist"
                height="500"
                highlight-current-row
                v-loading="listLoading"
                @selection-change="handleSelectionChange"
                style="width: 100%;"
                border
                :fit="true"
                size="mini">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="40">
            </el-table-column>
            <el-table-column prop="userid" label="商户ID" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="name" label="商户名称" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="loginname" label="登录账号" width="100" sortable align="center">
            </el-table-column>
            <el-table-column prop="createtime" label="注册时间" width="150" sortable align="center">
            </el-table-column>
            <el-table-column prop="concat" label="联系人" width="100" sortable align="center">
            </el-table-column>
            <el-table-column prop="contype" label="联系方式" width="100" sortable align="center">
            </el-table-column>
            <el-table-column label="代理" width="90" align="center" >
                <template slot-scope="scope">
                    <el-button size="mini" icon="el-icon-search" circle @click="QueryAgent(scope.row)"></el-button>
                </template>
            </el-table-column>

            <el-table-column label="操作"  width="110" align="center" >
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-check" circle @click="updHandler(scope.row)"></el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="delHandler(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-col :span="24" class="toolbar">
            <el-pagination
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                    :page-size="20"
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
                :fit="true"
                size="mini">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="40">
            </el-table-column>
            <el-table-column prop="userid_to" label="代理ID" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="name_to" label="代理名称" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="level" label="代理级别" width="100" sortable align="center">
            </el-table-column>
        </el-table>
        </el-dialog>


        <el-dialog title="添加" :visible.sync="addFlag" :close-on-click-modal="false">
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
                <el-form-item
                        v-for="(agent, index) in addForm.agents"
                        :label="index+1 + '级' + '代理人'"
                        :key="agent.key"
                        :prop="'agents[' + index + '].value'"
                        :rules="Rules"
                >
                    <el-autocomplete  class="inline-input"
                                      @select="handleSelect"
                                      :fetch-suggestions="querySearch"
                                      prefix-icon="el-icon-search"
                                      placeholder="请输入代理人ID或名字"
                                      v-model="agent.value"></el-autocomplete>
                    <el-button type="danger" size="mini" icon="el-icon-delete" circle @click.prevent="removeAgent(agent)"></el-button>
                </el-form-item>
                <el-button style="margin-bottom:10px" type="primary" size="mini" icon="el-icon-plus" circle @click="addAgent">新增代理人</el-button>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFlag = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import { user_del,agent_query,user_add,user_verify,agent_query1,business_query  } from '~/api/request/request';
    export default {
        data() {
            return {
                vlist:[],
                listLoading: false,
                total:0,
                page:1,
                roles:[],
                addFlag:false,
                selectData:[],
                addForm:{
                    agents: []
                    // passwd: "",
                    // confirm_passwd: "",
                    // passwd_value: ""
                },
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
                addFormRules: {
                    name: [
                        { required: true, message: '请输入商户名称', trigger: 'blur' }
                    ],
                    loginname: [
                        { required: true, message: '请输入登录账号', trigger: 'blur' }
                    ],
                    // passwd_value: [
                    //     { required: true, message: '请输入密码', trigger: 'blur' },
                    //     {
                    //         validator : (rule, value, callback) =>{
                    //             if (value === '') {
                    //                 callback(new Error('请输入密码'));
                    //             } else {
                    //                 if (this.addForm.confirm_passwd !== '') {
                    //                     this.$refs.addForm.validateField('confirm_passwd');
                    //                 }
                    //                 callback();
                    //             }
                    //         },
                    //         trigger: 'blur'
                    //     }
                    // ],
                    // confirm_passwd: [
                    //     { required: true, message: '请输入确认密码', trigger: 'blur' },
                    //     {
                    //         validator : (rule, value, callback) => {
                    //             if (value === '') {
                    //                 callback(new Error('请再次输入密码'));
                    //             } else if (value !== this.addForm.passwd_value) {
                    //                 callback(new Error('两次输入密码不一致!'));
                    //             } else {
                    //                 callback();
                    //             }
                    //         },
                    //         trigger: 'blur'
                    //     }
                    // ],
                    concat: [
                        { required: true, message: '请输入联系人', trigger: 'blur' }
                    ],
                    contype: [
                        { required: true, message: '请输入联系方式', trigger: 'blur' }
                    ],
                    alipay: [
                        {  message: '请选择支付宝通道', trigger: 'blur' }
                    ],
                    wechat: [
                        {  message: '请选择微信通道', trigger: 'blur' }
                    ],
                    ebank: [
                        {  message: '请选择网银通道', trigger: 'blur' }
                    ],
                },
                addLoading:false,
                restaurants:[],
                restaurants1:[],
                //代理结构
                AgentObj:{
                    list : [],
                    loading : false ,
                    showFlag: false
                }
            }
        },
        methods:{
            handleSelectionChange(val){
                val.forEach(item => {
                    this.selectData.push(item.userid)
                })
            },
            batchConfirm(){
                this.$confirm('确认审核通过该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    user_verify({
                        data : { userid : this.selectData },
                        callback : () => {
                            this.$message({
                                message : "审核成功!"
                            })
                            this.RequestQuery()
                        },
                        errorcallback : () => {
                            this.listLoading = false;
                        }
                    })
                }).catch(() => {
                })
            },
            QueryAgent(row){
                this.AgentObj.showFlag=true
                this.AgentObj.list = Object.assign({}, row).agents

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
                var index = this.addForm.agents.indexOf(item)
                if (index !== -1) {
                    this.addForm.agents.splice(index, 1)
                }
            },
            addAgent(){
                    this.addForm.agents.push({
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
                            this.$set(this.addForm,'rolecode',"2001")
                            this.$set(this.addForm,"status","1")
                            user_add({
                                data :this.addForm,
                                callback : () => {
                                    this.addLoading = false;
                                    this.$refs['addForm'].resetFields();
                                    this.addFlag= false;
                                    this.$message({
                                        message : "添加成功!"
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
                this.$confirm('确认审核通过该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    user_verify({
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
            handleCurrentChange(val) {
                this.page = val;
                this.RequestQuery()
            },
            RequestQuery(){
                this.listLoading=true
                business_query({
                    params : {
                        page:this.page,
                        status : "1",
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
        }
    }
</script>

<style scoped>

</style>
