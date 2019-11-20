<template>
    <section >

        <el-table
                :data="vlist"
                height="500"
                highlight-current-row
                v-loading="listLoading"
                style="width: 100%;"
                :border="true"
                :summary-method="getSummaries"
                show-summary
                :fit="true"
                size="mini">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="userid" label="代理人ID" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="name" label="代理人名称" width="200" sortable align="center">
            </el-table-column>
            <el-table-column prop="loginname" label="登录账号" width="200" sortable align="center">
            </el-table-column>
            <el-table-column prop="bal" label="商户余额" width="100" sortable align="center">
            </el-table-column>
            <el-table-column prop="bal1" label="可提现余额" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="concat" label="联系人" width="100" sortable align="center">
            </el-table-column>
            <el-table-column prop="contype" label="联系方式" width="120" sortable align="center">
            </el-table-column>
            <el-table-column prop="createtime" label="注册时间" width="140" sortable align="center">
            </el-table-column>
            <el-table-column label="操作"  width="140" align="center">
                <template slot-scope="scope">
                    <el-button v-if="PayObj.PayLodingButton===false" type="primary" size="mini" icon="el-icon-s-finance" circle @click="clickPayHandler(scope.row)"></el-button>
                    <el-button v-else type="primary" size="mini" icon="el-icon-loading" circle @click="clickPayHandler(scope.row)"></el-button>
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


        <el-dialog title="编辑" :visible.sync="updFlag" :close-on-click-modal="false">
            <el-form :model="updForm" label-width="100px" :rules="updFormRules" ref="updForm" label-position='left'>
                <el-form-item label="代理人名称" prop="name">
                    <el-input v-model="updForm.name"></el-input>
                </el-form-item>
                <el-form-item label="登录名" prop="loginname">
                    <el-input v-model="updForm.loginname"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="concat">
                    <el-input v-model="updForm.concat"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="contype">
                    <el-input v-model="updForm.contype"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="updFlag = false">取消</el-button>
                <el-button type="primary" @click.native="updSubmit" :loading="updLoading">提交</el-button>
            </div>
        </el-dialog>


        <el-dialog title="费率" :visible.sync="PayObj.showFlag" :close-on-click-modal="false">
            <el-form :model="PayObj" status-icon  label-width="130px"  ref="PayObj" label-position='left' size="mini">
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
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="PayObj.showFlag = false">取消</el-button>
                <el-button type="primary" @click.native="PaySubmit" :loading="PayObj.loading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import { user_del,agent_query,user_upd,user_verify,
        paytype_query,paypasslinktype_add,paypasslinktype_query,
        paypass_query,paypass_add,paypass_upd  } from '~/api/request/request';
    export default {
        data() {

            var rate_valid = (rule, value, callback) => {
                var reg = /^-?\d{1,5}(?:\.\d{1,6})?$/
                if (reg.test(value)) {
                    callback()
                } else {
                    callback(new Error('请输入正确的金额!'))
                }
            };
            return {
                vlist:[],
                listLoading: false,
                total:0,
                page:1,
                pagesize:10,
                roles:[],
                updFlag:false,
                updForm:{},
                updFormRules: {
                    name: [
                        { required: true, message: '请输入管理员名称', trigger: 'blur' }
                    ],
                    loginname: [
                        { required: true, message: '请输入登录名', trigger: 'blur' }
                    ],
                    concat: [
                        { required: true, message: '请输入联系人', trigger: 'blur' }
                    ],
                    contype: [
                        { required: true, message: '请输入联系方式', trigger: 'blur' }
                    ],
                    alipay_rate: [
                        {  required: true, message: '请输入支付宝费率,例如:0.13', trigger: 'blur' },
                        { validator: rate_valid , trigger: 'blur'}
                    ],
                    wechat_rate: [
                        {  required: true, message: '请输入微信费率,例如:0.13', trigger: 'blur' },
                        { validator: rate_valid , trigger: 'blur'}
                    ],
                    ebank_rate: [
                        {  required: true, message: '请输入网银费率,例如:0.13', trigger: 'blur' },
                        { validator: rate_valid , trigger: 'blur'}
                    ],
                },
                updLoading:false,




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
                    rates:[]
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
                    if (index === 4 || index ===5){
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
                            sums[index] += ' 元';
                        } else {
                            sums[index] = 'N/A';
                        }
                    }

                });

                return sums;
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
                                        rate : this.PayObj.rates[listno]
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
                        })

                        this.PayObj.PayLodingButton=false
                        this.PayObj.showFlag=true
                    }
                })
            },
            updSubmit() {
                this.$refs.updForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.updLoading = true;
                            delete this.updForm.createtime
                            user_upd({
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
                agent_query({
                    params : {
                        page:this.page,
                        status : "0",
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
        }
    }
</script>

<style scoped>

</style>
