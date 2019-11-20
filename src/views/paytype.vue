<template>
    <section >

        <el-col :span="24" class="toolbar">
            <el-button type="primary" icon="el-icon-plus" @click="addFlag = true" size="mini">添加</el-button>
        </el-col>

        <el-table
                :data="vlist"
                height="500"
                highlight-current-row
                v-loading="listLoading"
                style="width: 100%;"
                border
                :fit="true"
                size="mini">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="40">
            </el-table-column>
            <el-table-column prop="paytypeid" label="ID" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="typename" label="类型名称" width="110" sortable align="center">
            </el-table-column>

            <el-table-column label="操作"  width="110" align="center" >
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="updHandler(scope.row)"></el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="delHandler(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>

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

        <el-dialog title="添加" :visible.sync="addFlag" :close-on-click-modal="false">
            <el-form :model="addForm" status-icon label-width="100px" :rules="addFormRules" ref="addForm" label-position='left' size="mini">
                <el-form-item label="名称" prop="name">
                    <el-input
                            v-model="addForm.name"
                            placeholder="请输入名称">
                    </el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="addForm.type" placeholder="请选择类型">
                        <el-option label="支付宝" value="0"></el-option>
                        <el-option label="微信" value="1"></el-option>
                        <el-option label="银联" value="2"></el-option>
                        <el-option label="聚合" value="3"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFlag = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑" :visible.sync="updFlag" :close-on-click-modal="false">
            <el-form :model="updForm" status-icon label-width="100px" :rules="addFormRules" ref="updForm" label-position='left' size="mini">
                <el-form-item label="名称" prop="name">
                    <el-input
                            v-model="updForm.name"
                            placeholder="请输入名称">
                    </el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="updForm.type" placeholder="请选择类型">
                        <el-option label="支付宝" value="0"></el-option>
                        <el-option label="微信" value="1"></el-option>
                        <el-option label="银联" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="updFlag = false">取消</el-button>
                <el-button type="primary" @click.native="updSubmit" :loading="updLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import { paytype_add,paytype_upd,paytype_del,paytype_query  } from '~/api/request/request';
    export default {
        data() {
            return {
                vlist:[],
                listLoading: false,
                total:0,
                page:1,
                pagesize:10,
                addFlag:false,
                addForm:{
                },
                addFormRules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择类型', trigger: 'blur' }
                    ]
                },
                addLoading:false,
                updFlag:false,
                updForm:{},
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
                            paytype_add({
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
            updSubmit() {
                this.$refs.updForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.updLoading = true;
                            paytype_upd({
                                data :this.updForm,
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
                    paytype_del({
                        data : { paytypeid : row.paytypeid },
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
                paytype_query({
                    params : {
                        page:this.page,
                        page_size: this.pagesize
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
