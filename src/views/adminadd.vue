<template>
    <section >

        <el-col :span="24" class="toolbar">
            <el-button type="primary" icon="el-icon-plus" @click="addFlag = true" size="mini">添加</el-button>
        </el-col>

        <el-dialog title="添加" :visible.sync="addFlag" :close-on-click-modal="false" >
            <el-form :model="addForm" label-width="150px" :rules="addFormRules" ref="addForm" label-position='left' size="mini">
                <el-form-item label="管理员名称" prop="name">
                    <el-input
                            v-model="addForm.name"
                            auto-complete="off">
                    </el-input>
                </el-form-item>
                <el-form-item label="登录名" prop="loginname">
                    <el-input
                            v-model="addForm.loginname"
                            auto-complete="off">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFlag = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改" :visible.sync="updFlag" :close-on-click-modal="false">
            <el-form :model="updForm" label-width="150px" :rules="updFormRules" ref="updForm" label-position='left' size="mini">
                <el-form-item label="管理员名称" prop="name">
                    <el-input
                            v-model="updForm.name"
                            auto-complete="off">
                    </el-input>
                </el-form-item>
                <el-form-item label="登录名" prop="loginname">
                    <el-input
                            v-model="updForm.loginname"
                            auto-complete="off">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="updFlag = false">取消</el-button>
                <el-button type="primary" @click.native="updSubmit" :loading="updLoading">提交</el-button>
            </div>
        </el-dialog>

        <el-table
                :data="vlist"
                highlight-current-row
                v-loading="listLoading"
                style="width: 100%;"
                :border="true"
                :fit="true"
                size="mini"
                height="500">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="40">
            </el-table-column>
            <el-table-column prop="userid" label="管理员ID" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="loginname" label="登录账号" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="100" sortable align="center">
            </el-table-column>
            <el-table-column prop="rolename" label="类型" width="100" sortable align="center">
            </el-table-column>
            <el-table-column prop="logintime" label="最后登录时间" width="170" sortable align="center">
            </el-table-column>
            <el-table-column prop="logincount" label="登录次数" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="ip" label="最后登录IP" width="170" sortable align="center">
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle @click="updHandler(scope.row)" size="mini"></el-button>
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
    import { manageadd_del,manageadd_query,getroletype,manageadd_add,manageadd_upd } from '~/api/request/request';
    export default {
        data() {
            return {
                vlist:[],
                listLoading: false,
                total:0,
                page:1,
                roles:[],
                addFlag:false,
                addForm:{},
                addForm1:{},
                addFormRules: {
                    name: [
                        { required: true, message: '请输入管理员名称', trigger: 'blur' }
                    ],
                    loginname: [
                        { required: true, message: '请输入登录名', trigger: 'blur' }
                    ]
                },
                addLoading:false,
                updFlag:false,
                updForm:{},
                updForm1:{},
                updFormRules: {
                    name: [
                        { required: true, message: '请输入管理员名称', trigger: 'blur' }
                    ],
                    loginname: [
                        { required: true, message: '请输入登录名', trigger: 'blur' }
                    ]
                },
                updLoading:false
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
                            this.$set(this.addForm1,'name',this.addForm.name)
                            this.$set(this.addForm1,'loginname',this.addForm.loginname)
                            this.$set(this.addForm1,'rolecode',"1001")
                            manageadd_add({
                                data :this.addForm1,
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
            updSubmit() {
                this.$refs.updForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.updLoading = true;
                            this.$set(this.updForm1,'name',this.updForm.name)
                            this.$set(this.updForm1,'loginname',this.updForm.loginname)
                            this.$set(this.updForm1,'rolecode',"1001")
                            this.$set(this.updForm1,'userid',this.updForm.userid)
                            manageadd_upd({
                                data :this.updForm1,
                                callback : () => {
                                    this.updLoading = false;
                                    this.$refs['updForm'].resetFields();
                                    this.updFlag= false;
                                    this.$message({
                                        message : "编辑成功!"
                                    })
                                    this.RequestQuery()
                                },
                                errorcallback : () => {
                                    this.updLoading = false;
                                    this.updFlag = false;
                                }
                            })
                        })
                    }
                })
            },
            updHandler(row){
                this.updForm = Object.assign({}, row);
                this.updFlag = true
            },
            delHandler(row){
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    manageadd_del({
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
                manageadd_query({
                    params : {
                        page:this.page
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
            },
            RequestRoleGet(){
                getroletype({
                    callback : (res) => {
                        this.roles = res.data.data
                    }
                })
            }
        },
        mounted(){
            this.RequestQuery()
            // this.RequestRoleGet()
            this.$set(this.addForm,'rolecode','1001')
        }
    }
</script>

<style scoped>

</style>
