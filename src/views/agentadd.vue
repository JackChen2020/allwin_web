<template>
    <section >

        <el-col :span="24" class="toolbar">
            <el-button type="primary" icon="el-icon-plus" @click="addFlag = true" size="mini">添加</el-button>
        </el-col>

        <el-dialog title="添加" style="width:1000px;margin-left:200px" :visible.sync="addFlag" :close-on-click-modal="false">
            <el-form :model="addForm"  status-icon label-width="100px" :rules="addFormRules" ref="addForm" label-position='left' size="mini">
                <el-form-item label="代理人名称" prop="name">
                    <el-input
                            v-model="addForm.name"
                            placeholder="请输入代理人名称">
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
                            placeholder="请输入联系方式">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="addFlag = false">取消</el-button>
                <el-button size="mini" type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <el-table
                :data="vlist"
                height="500"
                highlight-current-row
                v-loading="listLoading"
                style="width: 100%;"
                :border="true"
                :fit="true"
                size="mini">
            <el-table-column type="index" width="40">
            </el-table-column>
            <el-table-column prop="userid" label="代理人ID" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="name" label="代理人名称" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="loginname" label="登录账号" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="concat" label="联系人" width="100" sortable align="center">
            </el-table-column>
            <el-table-column prop="contype" label="联系方式" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="createtime" label="注册时间" width="140" sortable align="center">
            </el-table-column>
            <el-table-column label="操作"  width="110" align="center">
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
    </section>
</template>

<script>
    import { user_del,agent_query,user_add,user_verify } from '~/api/request/request';
    export default {
        data() {
            return {
                vlist:[],
                listLoading: false,
                total:0,
                page:1,
                roles:[],
                addFlag:false,
                addForm:{
                },
                addFormRules: {
                    name: [
                        { required: true, message: '请输入代理人名称', trigger: 'blur' }
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
                },
                addLoading:false
            }
        },
        methods:{
            mg_add () {
                this.addFlag = true;
            },
            addSubmit() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            this.$set(this.addForm,'rolecode',"3001")
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
                agent_query({
                    params : {
                        page:this.page,
                        status : "1",
                        type: "2"
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
        }
    }
</script>

<style scoped>

</style>
