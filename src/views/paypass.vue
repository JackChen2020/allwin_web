<template>
    <section >

        <el-col :span="24" class="toolbar">
            <el-button type="primary" icon="el-icon-plus" @click="InsertObj.showFlag = true" size="mini">添加</el-button>
        </el-col>

        <el-table
                :data="ListTableObj.list"
                highlight-current-row
                v-loading="ListTableObj.loading"
                style="width: 100%;"
                :border="true"
                :fit="true"
                height="500"
                size="mini">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="40">
            </el-table-column>
            <el-table-column prop="paypassid" label="支付渠道ID" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="name" label="渠道名称" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="paycode" label="渠道编号" width="100" sortable align="center">
            </el-table-column>
            <el-table-column prop="passcode" label="渠道商户号" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="isdayfu_name" label="是否API代付" width="110" sortable align="center">
            </el-table-column>
            <el-table-column prop="status_name" label="使用状态" width="110" sortable align="center">
            </el-table-column>
            <el-table-column label="操作" width="140" align="center">
                <template slot-scope="scope">
                    <el-button v-if="PayObj.PayLodingButton===false" type="primary" size="mini" icon="el-icon-s-finance" circle @click="clickPayHandler(scope.row)"></el-button>
                    <el-button v-else type="primary" size="mini" icon="el-icon-loading" circle @click="clickPayHandler(scope.row)"></el-button>
                    <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="updHandler(scope.row)"></el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="delHandler(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination
                    background
                    layout="sizes,prev, pager, next"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 30, 50, 100,200,500,1000,2000,5000]"
                    :page-size="ListTableObj.pagesize"
                    :total="ListTableObj.total"
                    :pager-count="5"
                    style="float:right;">
            </el-pagination>
        </el-col>

        <el-dialog title="添加" :visible.sync="InsertObj.showFlag" :close-on-click-modal="false">
            <el-form :model="insertobject" label-width="100px" :rules="InsertObj.Rules" ref="insertobject" label-position='left' size="mini">
                <el-form-item label="渠道名称" prop="name">
                    <el-input
                            v-model="insertobject.name"
                            placeholder="请输入渠道名称"
                            auto-complete="off">
                    </el-input>
                </el-form-item>
                <el-form-item label="渠道商户号" prop="passcode">
                    <el-input
                            v-model="insertobject.passcode"
                            placeholder="请输入渠道商户号"
                            auto-complete="off">
                    </el-input>
                </el-form-item>
                <el-form-item label="渠道编号" prop="paycode">
                    <el-input
                            v-model="insertobject.paycode"
                            placeholder="请输入渠道编号"
                            auto-complete="off">
                    </el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="concat">
                    <el-input
                            v-model="insertobject.concat"
                            placeholder="请输入联系人"
                            auto-complete="off">
                    </el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="contype">
                    <el-input
                            v-model="insertobject.contype"
                            placeholder="例如:QQ:10101100"
                            auto-complete="off">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="InsertObj.showFlag = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="InsertObj.loading">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改" :visible.sync="ModiObj.showFlag" :close-on-click-modal="false">
            <el-form :model="modiobject" label-width="100px" :rules="ModiObj.Rules" ref="modiobject" label-position='left' size="mini">
                <el-form-item label="是否开启" prop="status">
                    <el-radio-group v-model="modiobject.status">
                        <el-radio class="radio" label="0">开启</el-radio>
                        <el-radio class="radio" label="1">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="渠道名称" prop="name">
                    <el-input
                            v-model="modiobject.name"
                            placeholder="请输入渠道名称"
                            auto-complete="off">
                    </el-input>
                </el-form-item>
                <el-form-item label="渠道商户号" prop="passcode">
                    <el-input
                            v-model="modiobject.passcode"
                            placeholder="请输入渠道商户号"
                            auto-complete="off">
                    </el-input>
                </el-form-item>
                <el-form-item label="渠道编号" prop="paycode">
                    <el-input
                            v-model="modiobject.paycode"
                            placeholder="请输入渠道编号"
                            auto-complete="off">
                    </el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="concat">
                    <el-input
                            v-model="modiobject.concat"
                            placeholder="请输入联系人"
                            auto-complete="off">
                    </el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="contype">
                    <el-input
                            v-model="modiobject.contype"
                            placeholder="例如:QQ:10101100"
                            auto-complete="off">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="ModiObj.showFlag = false">取消</el-button>
                <el-button type="primary" @click.native="updSubmit" :loading="ModiObj.loading">提交</el-button>
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
    import { paytype_query,paypasslinktype_add,paypasslinktype_query,
        paypass_query,paypass_add,paypass_upd  } from '~/api/request/request';
    export default {
        data() {
            return {

                //列表明细结构
                ListTableObj : {
                    list : [] ,
                    loading : false,
                    total:0,
                    page:1,
                    pagesize:10,
                },

                InsertObj: {
                    showFlag:false,
                    loading:false,
                    Rules: {
                        name: [
                            { required: true, message: '请输入渠道名称', trigger: 'blur' }
                        ],
                        passcode: [
                            { required: true, message: '请输入渠道商户号', trigger: 'blur' }
                        ],
                        paycode: [
                            { required: true, message: '请输入渠道编号', trigger: 'blur' }
                        ],
                        concat: [
                            { required: true, message: '请输入联系人', trigger: 'blur' }
                        ],
                        contype: [
                            { required: true, message: '请输入联系方式', trigger: 'blur' }
                        ],
                    }
                },
                insertobject: {},

                ModiObj: {
                    showFlag:false,
                    loading:false,
                    Rules: {
                        name: [
                            { required: true, message: '请输入渠道名称', trigger: 'blur' }
                        ],
                        passcode: [
                            { required: true, message: '请输入渠道商户号', trigger: 'blur' }
                        ],
                        paycode: [
                            { required: true, message: '请输入渠道编号', trigger: 'blur' }
                        ],
                        concat: [
                            { required: true, message: '请输入联系人', trigger: 'blur' }
                        ],
                        contype: [
                            { required: true, message: '请输入联系方式', trigger: 'blur' }
                        ],
                    }
                },
                modiobject: {},

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

            };
        },
        methods: {
            handleSizeChange(val) {
                this.ListTableObj.pagesize = val;
                this.RequestQuery()
            },
            handleCurrentChange(val) {
                this.ListTableObj.page = val;
                this.RequestQuery()
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
                                        to_id : this.PayPassObj.paypassid,
                                        paytypeid : item.paytypeid,
                                        type : '0',
                                        rate : this.PayObj.rates[listno]
                                    })
                                }
                            })
                            if (this.PayObj.addlist.insert.length===0){
                                this.$set(this.PayObj.addlist.delete,'id',this.PayPassObj.paypassid)
                                this.$set(this.PayObj.addlist.delete,'type','0')
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
                        type : "0",
                        id : this.PayPassObj.paypassid
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
            addSubmit() {
                this.$refs.insertobject.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.InsertObj.loading = true;
                            paypass_add({
                                data :this.insertobject,
                                callback : () => {
                                    this.InsertObj.loading = false;
                                    this.$refs['insertobject'].resetFields();
                                    this.InsertObj.showFlag= false;
                                    this.$message({
                                        message : "添加成功!"
                                    })
                                    this.RequestQuery()
                                },
                                errorcallback : () => {
                                    this.InsertObj.loading = false;
                                    this.InsertObj.showFlag= false;
                                }
                            })
                        })
                    }
                })
            },
            updSubmit() {
                this.$refs.modiobject.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.ModiObj.loading = true;
                            paypass_upd({
                                data :this.modiobject,
                                callback : () => {
                                    this.ModiObj.loading = false;
                                    this.$refs['modiobject'].resetFields();
                                    this.ModiObj.showFlag= false;
                                    this.$message({
                                        message : "编辑成功!"
                                    })
                                    this.RequestQuery()
                                },
                                errorcallback : () => {
                                    this.ModiObj.loading = false;
                                    this.ModiObj.showFlag= false;
                                }
                            })
                        })
                    }
                })
            },
            updHandler(row){
                this.modiobject = Object.assign({}, row);
                this.ModiObj.showFlag = true
            },
            RequestQuery(){
                this.ListTableObj.loading=true
                paypass_query({
                    params : {
                        page:this.ListTableObj.page
                    },
                    callback : (res) => {
                        this.ListTableObj.list = res.data.data
                        this.ListTableObj.total = Number(res.headers.total)
                        this.ListTableObj.loading=false
                    },
                    errorcallback : () => {
                        this.ListTableObj.loading=false
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
    };
</script>
