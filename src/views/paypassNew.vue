<template>
    <basic-container>
        <avue-crud :data="data" :option="option" v-model="obj" @date-change="dateChange"
                   :page="page"
                   @row-update="rowUpdate"
                   @row-del="rowDel"
                   @row-save="rowSave"
                   @search-change="searchChange"
                   @size-change="sizeChange"
                   @current-change="currentChange"
                   @refresh-change="refresh"
                   :table-loading="loading">

            <template slot-scope="scope" slot="status_formatForm">
                <el-select v-model="scope.row.status" placeholder="是否开启">
                    <el-option label="是" value="0"></el-option>
                    <el-option label="否" value="1"></el-option>
                </el-select>
            </template>

            <template slot-scope="scope" slot="isdayfu_formatForm">
                <el-select v-model="scope.row.isdayfu" placeholder="请选择是否代付">
                    <el-option label="是" value="0"></el-option>
                    <el-option label="否" value="1"></el-option>
                </el-select>
            </template>

            <template slot-scope="scope" slot="custom_formatForm">
                <el-select v-model="scope.row.custom" placeholder="请选择开发模式">
                    <el-option label="自定义" value="0"></el-option>
                    <el-option label="规则" value="1"></el-option>
                </el-select>
            </template>

<!--            <template slot-scope="scope" slot="menu">-->
<!--                <el-button size="mini" @click.native="RateSeting(scope.row)">费率</el-button>-->
<!--            </template>-->

            <template slot-scope="scope" slot="menuBtn">
                <el-dropdown-item @click.native="clickPayHandler(scope.row)">费率设置</el-dropdown-item>
                <el-dropdown-item @click.native="clickProSetHandler(scope.row)">开发设置</el-dropdown-item>
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

        <el-dialog title="开发设置" width="80%" :visible.sync="proSet" :close-on-click-modal="false">
            <basic-container>
                <el-button type="primary" v-show="!FormCopy" @click="FormCopy=objForm">复制</el-button>
                <el-button type="primary" v-show="FormCopy" @click="objForm=FormCopy;FormCopy=false">粘贴</el-button>
            </basic-container>
            <basic-container>
                <avue-form ref="form" v-if="proSet" v-model="objForm" :option="optionForm" @submit="proSetSubmit">
                </avue-form>
            </basic-container>
        </el-dialog>

    </basic-container>
</template>

<script>

    import { paytype_query,paypasslinktype_add,paypasslinktype_query,
        paypass_query,paypass_add,paypass_upd,paypass_del,paypassRulesAdd,paypassRulesGet  } from '~/api/request/request';
    import { Loading } from 'element-ui';

    export default {
        data() {
            return {
                FormCopy:false,
                objForm:{},
                proSet:false,
                page: {
                    //pageSizes: [10, 20, 30, 40],默认
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                obj:{},
                data: [],
                filter_params:{},
                loading:false,

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
        computed: {
            option(){
                return {
                    title:'支付渠道管理',
                    menuType:'menu',
                    page:true,
                    align:'center',
                    // dateBtn:true,
                    dateDefault:false,
                    menuAlign:'center',
                    indexLabel:'序号',
                    index:true,
                    border:true,
                    expandFixed:false,
                    searchShow:false,
                    viewBtn:false,
                    menuWidth:150,
                    size:"mini",
                    column:[
                        {
                            label:'支付渠道ID',
                            prop:'paypassid',
                            width:120,
                            search:true,
                            display:false
                        },
                        {
                            label:'渠道名称',
                            prop:'name',
                            width:180
                        },
                        {
                            label:'联系人',
                            prop:'concat',
                        },
                        {
                            label:'联系方式',
                            prop:'contype',
                        },
                        {
                            label:'回调IP',
                            prop:'callback_ip',
                        },
                        {
                            label:'是否开启',
                            prop:'status_format',
                            addDisplay:false,
                            formslot:true
                        },
                        {
                            label:'是否代付',
                            prop:'isdayfu_format',
                            addDisplay:false,
                            formslot:true
                        },
                        {
                            label:'开发模式',
                            prop:'custom_format',
                            addDisplay:false,
                            formslot:true
                        },
                        {
                            label:'创建时间',
                            prop:'createtime_format',
                            display:false,
                        },
                    ]
                }
            },
            optionForm(){
                return{
                    size:"mini",
                    submitText: '完成',
                    labelWidth:200,
                    card:true,
                    group:[
                        {
                            icon:'el-icon-info',
                            label: '基础数据',
                            prop: 'request',
                            column: [
                                {
                                    label: "网关地址",
                                    prop: "request_url",
                                    span:10,
                                    rules: [{
                                        required: true,
                                        message: "请输入网关地址",
                                        trigger: "blur"
                                    }],
                                },
                                {
                                    label: "请求的方法",
                                    prop: "request_method",
                                    type: "select",
                                    dicData: [
                                        {
                                            label:"POST",
                                            value:"POST",
                                        },
                                        {
                                            label:"GET",
                                            value:"GET",
                                        }
                                    ],
                                    valueDefault:"POST",
                                    span:10,
                                    rules: [{
                                        required: true,
                                        message: "请选择请求的方法",
                                        trigger: "blur"
                                    }],
                                },
                                {
                                    label: "请求数据类型",
                                    prop: "request_type",
                                    type: "select",
                                    valueDefault:"body",
                                    dicData: [
                                        {
                                            label:"Json",
                                            value:"json",
                                        },
                                        {
                                            label:"表单",
                                            value:"body",
                                        },
                                        {
                                            label:"Params",
                                            value:"params",
                                        }
                                    ],
                                    span:10,
                                    row:true,
                                    rules: [{
                                        required: true,
                                        message: "请选择请求的方法",
                                        trigger: "blur"
                                    }],
                                },
                                {
                                    label: "是否签名",
                                    prop: "request_sign",
                                    type: "select",
                                    valueDefault:true,
                                    dicData: [
                                        {
                                            label:"是",
                                            value:true,
                                        },
                                        {
                                            label:"否",
                                            value:false,
                                        }
                                    ],
                                    span:10,
                                    rules: [{
                                        required: true,
                                        message: "请选择是否签名",
                                        trigger: "blur"
                                    }],
                                },
                                {
                                    label: "是否加密",
                                    prop: "request_password",
                                    type: "select",
                                    valueDefault:false,
                                    dicData: [
                                        {
                                            label:"是",
                                            value:true,
                                        },
                                        {
                                            label:"否",
                                            value:false,
                                        }
                                    ],
                                    span:10,
                                    rules: [{
                                        required: true,
                                        message: "请选择是否加密",
                                        trigger: "blur"
                                    }],
                                },

                            ],
                        },
                        {
                            icon:'el-icon-info',
                            label: '返回数据处理',
                            prop: 'request',
                            column: [
                                {
                                    label: "返回数据类型",
                                    prop: "return_type",
                                    type: "select",
                                    valueDefault:"html",
                                    dicData: [
                                        {
                                            label:"Json",
                                            value:"json",
                                        },
                                        {
                                            label:"Html",
                                            value:"html",
                                        }
                                    ],
                                    span:10,
                                    rules: [{
                                        required: true,
                                        message: "请选择请求的方法",
                                        trigger: "blur"
                                    }],
                                },
                                {
                                    label: "Code关键字",
                                    prop: "return_codeKey",
                                    span:10
                                },
                                {
                                    label: "Code成功值",
                                    prop: "return_ok",
                                    span:10
                                },
                                {
                                    label: "Msg关键字",
                                    prop: "return_msgKey",
                                    span:10
                                },
                                {
                                    label: "链接关键字",
                                    prop: "return_url",
                                    span:10
                                },
                            ],
                        },
                        {
                            icon:'el-icon-info',
                            label: '回调数据处理',
                            prop: 'request',
                            column: [
                                {
                                    label: "订单号关键字",
                                    prop: "callback_key",
                                    span:10,
                                    rules: [{
                                        required: true,
                                        message: "请输入订单号关键字",
                                        trigger: "blur"
                                    }],
                                },
                                {
                                    label: "Code关键字",
                                    prop: "callback_codeKey",
                                    span:10,
                                    rules: [{
                                        required: true,
                                        message: "请输入Code关键字",
                                        trigger: "blur"
                                    }],
                                },
                                {
                                    label: "Code成功值",
                                    prop: "callback_ok",
                                    span:10,
                                    rules: [{
                                        required: true,
                                        message: "请输入Code成功值",
                                        trigger: "blur"
                                    }],
                                },
                                {
                                    label: "返回值",
                                    prop: "callback_rvalue",
                                    span:10,
                                    rules: [{
                                        required: true,
                                        message: "请输入返回值",
                                        trigger: "blur"
                                    }],
                                }
                            ],
                        },
                        {
                            icon:'el-icon-info',
                            label: '数据MAP',
                            prop: 'requestData',
                            column: [
                                {
                                    label: '数据MAP',
                                    prop: 'requestData',
                                    type: 'dynamic',
                                    span:30,
                                    children: {
                                        align: 'center',
                                        headerAlign: 'center',
                                        column: [
                                            {
                                                width: 150,
                                                label: '关键字',
                                                prop: "key",
                                            },
                                            {
                                                width: 150,
                                                label: '数据类型',
                                                prop: "dataType",
                                                type: 'select',
                                                dicData: [
                                                    {
                                                        label: '金额',
                                                        value: "amount"
                                                    },
                                                    {
                                                        label: '日期',
                                                        value: "date"
                                                    },
                                                    {
                                                        label: '字符串',
                                                        value: "string"
                                                    },
                                                    {
                                                        label: '整型',
                                                        value: "int"
                                                    },
                                                ]
                                            },
                                            {
                                                width: 150,
                                                label: '值来源',
                                                prop: "type",
                                                type: 'select',
                                                dicData: [
                                                    {
                                                        label: '数据池',
                                                        value: "appoint"
                                                    },
                                                    {
                                                        label: '自定义值',
                                                        value: "custom"
                                                    }
                                                ]
                                            },
                                            {
                                                width: 200,
                                                label: '值',
                                                prop: "value",
                                            },
                                            {
                                                width: 200,
                                                label: '日期格式化',
                                                prop: "format",
                                            },
                                            {
                                                width: 150,
                                                label: '金额单位',
                                                prop: "unit",
                                                type: 'select',
                                                dicData: [
                                                    {
                                                        label: '元',
                                                        value: "Y"
                                                    },
                                                    {
                                                        label: '分',
                                                        value: "F"
                                                    }
                                                ]
                                            },
                                            {
                                                width: 150,
                                                label: '金额小数位',
                                                prop: "point",
                                                type: "number"
                                            },
                                            {
                                                width: 150,
                                                label: '是否为请求数据',
                                                prop: "requestOk",
                                                type: 'select',
                                                dicData: [
                                                    {
                                                        label: '是',
                                                        value: true
                                                    },
                                                    {
                                                        label: '否',
                                                        value: false
                                                    }
                                                ]
                                            },
                                            {
                                                width: 150,
                                                label: '是否加入签名',
                                                prop: "sign",
                                                type: 'select',
                                                dicData: [
                                                    {
                                                        label: '是',
                                                        value: true
                                                    },
                                                    {
                                                        label: '否',
                                                        value: false
                                                    }
                                                ]
                                            },
                                            {
                                                width: 150,
                                                label: '是否加入加密',
                                                prop: "password",
                                                type: 'select',
                                                dicData: [
                                                    {
                                                        label: '是',
                                                        value: true
                                                    },
                                                    {
                                                        label: '否',
                                                        value: false
                                                    }
                                                ]
                                            },
                                        ]
                                    },
                                },

                            ]
                        },
                        {
                            icon:'el-icon-info',
                            label: '签名方式',
                            prop: 'sign',
                            column: [
                                {
                                    label: "签名关键字",
                                    prop: "sign_signKey",
                                    span:10,
                                    rules: [{
                                        required: true,
                                        message: "请输入加密关键字",
                                        trigger: "blur"
                                    }],
                                },
                                {
                                    label: "签名方式",
                                    prop: "sign_signType",
                                    type: "select",
                                    dicData: [
                                        {
                                            label:"MD5",
                                            value:"md5",
                                        },
                                        {
                                            label:"SHA256",
                                            value:"sha256",
                                        },
                                        {
                                            label:"RSA-ECB-PKCS1Padding",
                                            value:"rsa_ecb_pkcs1padding",
                                        }
                                    ],
                                    span:10,
                                    rules: [{
                                        required: true,
                                        message: "请选择签名方式",
                                        trigger: "blur"
                                    }],
                                },
                                {
                                    label: "签名数据编码",
                                    prop: "sign_signEncode",
                                    type: "select",
                                    dicData: [
                                        {
                                            label:"UTF-8",
                                            value:"UTF-8",
                                        }
                                    ],
                                    span:10,
                                    rules: [{
                                        required: true,
                                        message: "请选择签名数据编码",
                                        trigger: "blur"
                                    }],
                                },
                                {
                                    label: "签名关键字处理方法",
                                    prop: "sign_signDataType",
                                    type: "select",
                                    dicData: [
                                        {
                                            label:"按照关键字ascii码排序(去除空值)(key-value形式)",
                                            value:"key-ascii-sort",
                                        },
                                        {
                                            label:"按照指定关键字排序",
                                            value:"key-appoint",
                                        }
                                    ],
                                    span:10,
                                    rules: [{
                                        required: true,
                                        message: "请选择签名关键字处理方法",
                                        trigger: "blur"
                                    }],
                                },
                                {
                                    label: "是否大写",
                                    prop: "sign_dataType",
                                    type: "select",
                                    dicData: [
                                        {
                                            label:"是",
                                            value:"upper",
                                        },
                                        {
                                            label:"否",
                                            value:"no",
                                        }
                                    ],
                                    span:20,
                                    row:true,
                                    rules: [{
                                        required: true,
                                        message: "请选择是否大写",
                                        trigger: "blur"
                                    }],
                                },
                                {
                                    label: "指定关键字的值",
                                    prop: "sign_signValue",
                                    span:20,
                                    row:true,
                                },
                                {
                                    label: "指定关键字的值前缀拼接",
                                    prop: "sign_signBefore",
                                    span:20,
                                    row:true,
                                },
                                {
                                    label: "指定关键字的值后缀拼接",
                                    prop: "sign_signAppend",
                                    span:20,
                                    row:true,
                                },
                                {
                                    label: "平台公钥",
                                    prop: "sign_Gpass",
                                    span:20,
                                    row:true,
                                },
                                {
                                    label: "商户私钥",
                                    prop: "sign_Spass",
                                    span:20,
                                    row:true,
                                },
                            ],
                        },
                        {
                            icon:'el-icon-info',
                            label: '加密方式',
                            prop: 'password',
                            column: [
                                {
                                    label: "加密关键字",
                                    prop: "password_signKey",
                                    span:10
                                },
                                {
                                    label: "加密方式",
                                    prop: "password_signType",
                                    type: "select",
                                    valueDefault:"aesPass",
                                    dicData: [
                                        {
                                            label:"AES",
                                            value:"aesPass",
                                        }
                                    ],
                                    span:10,
                                    rules: [{
                                        required: true,
                                        message: "请选择加密方式",
                                        trigger: "blur"
                                    }],
                                },
                                {
                                    label: "加密模式",
                                    prop: "password_signEncode",
                                    type: "select",
                                    valueDefault:"CBC",
                                    dicData: [
                                        {
                                            label:"CBC",
                                            value:"CBC",
                                        },
                                        {
                                            label:"ECB",
                                            value:"ECB",
                                        },
                                        {
                                            label:"CTR",
                                            value:"CTR",
                                        }
                                    ],
                                    span:10
                                },
                                {
                                    label: "填充方式",
                                    prop: "password_tianchong",
                                    type: "select",
                                    dicData: [
                                        {
                                            label:"pkcs5padding",
                                            value:"pkcs5padding",
                                        },
                                        {
                                            label:"pkcs7padding",
                                            value:"pkcs7padding",
                                        },
                                        {
                                            label:"zeropadding",
                                            value:"zeropadding",
                                        }
                                    ],
                                    span:10,
                                },
                                {
                                    label: "偏移量",
                                    prop: "password_cheap",
                                    span:10
                                },
                                {
                                    label: "加密密钥",
                                    prop: "password_Gpass",
                                    span:10
                                },
                                {
                                    label: "输出",
                                    prop: "password_Pout",
                                    span:10,
                                    type: "select",
                                    dicData: [
                                        {
                                            label:"16进制",
                                            value:"hex",
                                        },
                                        {
                                            label:"base64",
                                            value:"base64",
                                        }
                                    ],
                                },
                                {
                                    label: "加密关键字处理方法",
                                    prop: "password_signDataType",
                                    type: "select",
                                    dicData: [
                                        {
                                            label:"按照关键字ascii码排序(去除空值)(key-value形式)",
                                            value:"key-ascii-sort",
                                        },
                                        {
                                            label:"按照指定关键字排序",
                                            value:"key-appoint",
                                        },
                                        {
                                            label:"按Json字符串",
                                            value:"key-json",
                                        }
                                    ],
                                    span:10,
                                    rules: [{
                                        required: true,
                                        message: "请选择加密关键字处理方法",
                                        trigger: "blur"
                                    }],
                                },
                                {
                                    label: "指定关键字的值",
                                    prop: "password_signValue",
                                    span:20,
                                    row:true,
                                },
                                {
                                    label: "指定关键字的值前缀拼接",
                                    prop: "password_signBefore",
                                    span:20,
                                    row:true,
                                },
                                {
                                    label: "指定关键字的值后缀拼接",
                                    prop: "password_signAppend",
                                    span:20,
                                    row:true,
                                },
                            ],
                        },
                    ]
                }
            }
        },
        methods: {
            clickProSetHandler(row){
                this.objForm={}
                // let loadingInstance1 = Loading.service({ fullscreen: true });

                paypassRulesGet({
                    params : {
                        paypassid : row.paypassid
                    },
                    callback : (res) => {
                        this.objForm = res.data.data
                        // loadingInstance1.close()
                    }
                })
                this.proSet = true
                this.obj=row
            },
            proSetSubmit(form,done){
                paypassRulesAdd({
                    data:{
                        paypassid : this.obj.paypassid,
                        requestData : this.objForm
                    },
                    callback : (res) => {
                        this.$message.success("操作成功!")
                        done()
                    },
                    errorcallback : () => {
                        done()
                    }
                })
            },
            dateChange(date){
                this.filter_params.date = date
                this.queryData()
            },
            queryData(){
                this.loading = true
                paypass_query({
                    params : {
                        page : this.page.currentPage,
                        page_size : this.page.pageSize,
                        paypassid : this.filter_params.paypassid
                    },
                    callback : (res) => {
                        this.data = res.data.data
                        this.page.total = Number(res.headers.total)
                        this.loading = false
                    },
                    errorcallback : () => {
                        this.loading = false
                    }
                })
            },
            rowSave(form,done,loading){
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    loading();
                    var data={}
                    this.$set(data,'name',form['name'])
                    this.$set(data,'concat',form.concat)
                    this.$set(data,'contype',form.contype)
                    this.$set(data,'callback_ip',form.callback_ip)
                    paypass_add({
                        data :data,
                        callback : () => {
                            this.$message.success("添加成功!")
                            done()
                            this.queryData()
                        },
                        errorcallback : () => {
                            done()
                        }
                    })
                })
            },
            rowUpdate(form,index,done,loading){
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    loading();
                    var data={}
                    console.log(form)
                    this.$set(data,'paypassid',form['paypassid'])
                    this.$set(data,'name',form['name'])
                    this.$set(data,'concat',form.concat)
                    this.$set(data,'contype',form.contype)
                    this.$set(data,'status',form.status)
                    this.$set(data,'isdayfu',form.isdayfu)
                    this.$set(data,'custom',form.custom)
                    this.$set(data,'callback_ip',form.callback_ip)
                    paypass_upd({
                        data :data,
                        callback : () => {
                            this.$message.success("添加成功!")
                            done()
                            this.queryData()
                        },
                        errorcallback : () => {
                            done()
                        }
                    })
                })
            },
            rowDel(form){
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    var data={}
                    this.$set(data,'paypassid',form['paypassid'])
                    paypass_del({
                        data :data,
                        callback : () => {
                            this.$message.success("删除成功!")
                            this.queryData()
                        }
                    })
                })
            },
            refresh(){
                this.queryData()
            },
            sizeChange(val) {
                this.page.currentPage = 1
                this.page.pageSize = val
                this.queryData()
            },
            currentChange(val) {
                this.page.currentPage = val
                this.queryData()
            },
            searchChange(params){
                this.filter_params.paypassid = params.paypassid
                this.queryData()
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
                            console.log(this.PayObj.addlist.insert)
                            paypasslinktype_add({
                                data :this.PayObj.addlist,
                                callback : () => {
                                    this.$refs['PayObj'].resetFields();
                                    this.PayObj.showFlag = false;
                                    this.PayObj.loading= false;
                                    this.$message.success("操作成功!")
                                    this.queryData()
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
                console.log("111")
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
                            console.log(item.typename,item.name,item.rate)
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
            handleCheckAllChange(val) {
                this.Pays.pays = val ? this.PayObj.cityOptions : [];
                this.PayObj.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.PayObj.checkAll = checkedCount === this.PayObj.cities.length;
                this.PayObj.isIndeterminate = checkedCount > 0 && checkedCount < this.PayObj.cities.length;
            },
        },
        mounted(){
            this.queryData()
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