<template>
    <section class="main">
        <avue-crud style="margin-left:100px;"
                   :option="option"
                   ref="crud"
                   :page="page"
                   @on-load="onLoad"
                   :table-loading="loading"
                   @refresh-change="refreshChange"
                   :data="data"
                   @row-update="rowUpdate"
                   @row-save="rowSave"
                   @search-change="searchChange"
                   v-model="obj" >
            <template slot-scope="scope" slot="menu">
                <el-button v-if="PayObj.PayLodingButton===false" type="primary" size="mini" icon="el-icon-s-finance" circle @click="clickPayHandler(scope.row)"></el-button>
                <el-button v-else type="primary" size="mini" icon="el-icon-loading" circle @click="clickPayHandler(scope.row)"></el-button>
                <el-button
                        type="primary"
                        size="mini"
                        @click="rowCell(scope.row,scope.index)"
                >{{scope.row.$cellEdit?'保存':'修改'}}</el-button>
<!--                <el-button-->
<!--                        type="primary"-->
<!--                        size="mini"-->
<!--                        @click="LinkQrcode(scope.row)"-->
<!--                >二维码</el-button>-->
                <el-button
                        type="danger"
                        size="mini"
                        @click="rowDel(scope.row)"
                >删除</el-button>
            </template>
        </avue-crud>


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

    import { user_add,user_upd,user_del,get_help,paypasslinktype_add,paypasslinktype_query,paytype_query } from '~/api/request/request'

    export default {
        data() {
            return {
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
                PayPassObj : {},
                fileList: [],
                data : [],
                obj:{},
                loading:false,
                cellEdit: false,
                filter: {
                    name:'',
                    loginname:'',
                    userid:""
                },
                page: {
                    // pageSizes: [10,20,30],
                    pageSize: 10,
                    currentPage:1,
                    total : 0
                },
                option:{
                    page:false,
                    title:'码商维护',
                    align:'center',
                    menuWidth: 300,
                    menuAlign:'center',
                    border:true,
                    cellBtn:false,
                    editBtn: false,
                    maxHeight:300,
                    height:300,
                    delBtn : false,
                    searchMenuSpan:6,
                    showSummary:true,
                    sumColumnList: [
                        {
                            name: 'up_bal',
                            type: 'sum'
                        },
                        {
                            name: 'bal1',
                            type: 'sum'
                        },
                        {
                            name: 'bal',
                            type: 'sum'
                        },
                    ],
                    size:"mini",
                    column:[
                        {
                            label:'码商ID',
                            prop:'userid',
                            minWidth:150,
                            addVisdiplay:false,
                            search:true,
                        },
                        {
                            label:'名称',
                            prop:'name',
                            minWidth:150,
                            cell: true,
                            search:true,
                        },
                        {
                            label:'登录名',
                            prop:'loginname',
                            minWidth:150,
                            search:true,
                            cell: true,
                        },
                        // {
                        //     label:'码商余额',
                        //     prop:'up_bal',
                        //     minWidth:110,
                        //     addVisdiplay:false,
                        // },
                        // {
                        //     label:'可提现余额',
                        //     prop:'bal1',
                        //     minWidth:110,
                        //     addVisdiplay:false,
                        // },
                        // {
                        //     label:'利润',
                        //     prop:'bal',
                        //     minWidth:110,
                        //     addVisdiplay:false,
                        // },
                        {
                            label:'创建时间',
                            prop:'createtime',
                            minWidth:150,
                            display:false,
                        },
                    ]
                }
            };
        },
        methods: {
            handleCheckAllChange(val) {
                this.Pays.pays = val ? this.PayObj.cityOptions : [];
                this.PayObj.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.PayObj.checkAll = checkedCount === this.PayObj.cities.length;
                this.PayObj.isIndeterminate = checkedCount > 0 && checkedCount < this.PayObj.cities.length;
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
                        type : "2",
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
                                        type : '2',
                                        rate : this.PayObj.rates[listno]
                                    })
                                }
                            })
                            if (this.PayObj.addlist.insert.length===0){
                                this.$set(this.PayObj.addlist.delete,'id',this.PayPassObj.userid)
                                this.$set(this.PayObj.addlist.delete,'type','2')
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
                                    this.QueryQrcode()
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

            LinkQrcode(row){
              this.$router.push({path: '/qrcode_pools?id='+row.userid})
            },
            rowSave(row, done, loading){
                this.$confirm('确认提交吗？', '提示', {}).then(() => {

                    user_add({
                        data : {
                            name:row.name,
                            loginname: row.loginname,
                            rolecode : '4001'
                        },
                        callback : () => {
                            this.QueryQrcode()
                            this.$message.success("新增成功!")
                            done()
                        }
                    })
                })
            },
            rowUpdate(row, index, done) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    user_upd({
                        data : {
                            userid : row.userid,
                            name : row.name,
                            loginname : row.loginname
                        },
                        callback : () => {
                            this.QueryQrcode()
                            this.$message.success("修改成功!")
                            done()
                        },
                    })
                })
            },
            rowDel(row,index){
                this.$confirm('确认删除吗？', '提示', {}).then(() => {
                    user_del({
                        data : {"userid":row.userid},
                        callback : () => {
                            this.QueryQrcode()
                            this.$message.success("删除成功!")
                        },
                    })
                })
            },
            onLoad(page) {
                this.page.currentPage = page.currentPage
                this.page.pageSize = page.pageSize
                this.QueryQrcode()
            },
            searchChange(params){
                this.filter.name = params.name
                this.filter.loginname = params.loginname
                this.filter.userid = params.userid
                this.QueryQrcode()
            },
            refreshChange(){
                this.QueryQrcode()
            },
            rowCell(row, index) {
                this.$refs.crud.rowCell(row, index)
            },
            QueryQrcode(){
                this.loading=true
                get_help({
                    "params":{
                        "status" : "0",
                        "page" : this.page.currentPage,
                        "page_size" : this.page.pageSize,
                        "type" : "3",
                        "name" : this.filter.name,
                        "loginname" : this.filter.loginname,
                        "userid":this.filter.userid

                    },
                    "callback": (res)=>{
                        this.data=res.data.data

                        this.page.total = Number(res.headers.total)
                        this.loading=false
                    },
                    errorcallback : () => {
                        this.loading=false
                    }
                })
            }
        },
        mounted() {
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

<style scoped="scoped" lang="scss">
</style>