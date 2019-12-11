<template>
    <basic-container>

        <el-button type="primary" @click="addTaskFlag=true">+</el-button>
        <div style="margin-bottom:20px;"></div>
        <div class="block">
            <el-date-picker
                    v-model="StDate"
                    type="date"
                    :picker-options="pickerOptions"
                    placeholder="选择日期">
            </el-date-picker>
        </div>
        <div style="margin-bottom:20px;"></div>
        <el-row :gutter="12" v-if="TaskQF">
            <el-col :span="4" v-for="item in this.data" :key="item.taskid" >
                <el-card shadow="hover"  body-style="padding:5px;background-color:#00a680" >
                    <div style="margin:1px;">
                        <div style="color:white">
                            <div style="display: flex">
                                <h3 style="margin:5px;width:100px;margin-right:75px;">{{item.taskname}}</h3>
                                <el-row class="kks" style="margin-bottom: 5px; ">
                                    <img v-if="item.umark=='0'" class="xuanzhuan"  style="width:30px;height:30px;" src="../assets/xuanzhuan.png">
                                    <img v-else style="width:30px;height:30px;" src="../assets/xuanzhuan.png">
                                </el-row>
                            </div>

                            <div style="display: flex">
                                <p style="margin:5px;width:100px;margin-right:75px;">{{item.date_format}}</p>
                                <el-row style="margin-bottom: 5px;">
                                    <el-button v-if="item.umark=='0'" size="mini" type="primary" @click="startumark(item)">{{item.umark_format}}</el-button>
                                    <el-button v-else size="mini" type="danger" @click="startumark(item)">{{item.umark_format}}</el-button>
                                </el-row>
                            </div>

                            <el-row style="margin-bottom: 5px;">
                                <el-card shadow="hover" body-style="padding:5px;">
                                    {{item.groupid}}
                                </el-card>
                            </el-row>
                            <el-row style="margin-bottom: 5px;">
                                <el-card shadow="hover" body-style="padding:5px;">
                                    {{item.minamount}}-{{item.maxamount}}
                                </el-card>
                            </el-row>
                            <el-row style="margin-bottom: 5px;">
                                <el-card shadow="hover" body-style="padding:5px;">
                                    {{item.amountTot}}
                                </el-card>
                            </el-row>
                            <el-row style="margin-bottom: 5px;">
                                <el-card shadow="hover" body-style="padding:5px;">
                                    {{item.progree_format}}
                                </el-card>
                            </el-row>

                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>


        <el-dialog title="添加任务" :visible.sync="addTaskFlag" :close-on-click-modal="false" width="20%">
            <el-form  ref="form" size="small" label-width="80px" :rules="rules" :model="form">
                <el-form-item label="日期" prop="date" >
                    <el-col :span="22">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.date" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="任务名称" prop="name" >
                    <el-input clearable v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="微博群ID" prop="group">
                    <el-input clearable v-model="form.group"></el-input>
                </el-form-item>
                <el-form-item label="执行顺序" prop="sort">
                    <el-input clearable type="number" v-model="form.sort"></el-input>
                </el-form-item>
                <el-form-item label="最小金额" prop="minamount" >
                    <el-input clearable type="number" v-model="form.minamount"></el-input>
                </el-form-item>
                <el-form-item label="最大金额" prop="maxamount" >
                    <el-input clearable type="number" v-model="form.maxamount"></el-input>
                </el-form-item>
                <el-form-item label="一个账号跑多少" prop="group">
                    <el-input clearable type="number" v-model="form.amountwhat"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('form')">立即添加</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>


    </basic-container>

</template>

<script>

    import { addTask,getTask,updUmark } from '~/api/request/request';
    import { dateformart } from '~/api/utils'

    export default {
        data(){
            return {
                form:{},
                data:[],
                addTaskFlag:false,
                TaskQF:false,
                StDate:"",
                rules: {
                    date: [
                        { type :"date",required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请输入任务名称', trigger: 'blur' },
                        { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
                    ],
                    group: [
                        { required: true, message: '请输入群ID', trigger: 'blur' },
                    ],
                    sort: [
                        { required: true, message: '请输入执行顺序', trigger: 'blur' },
                    ],
                    minamount: [
                        {  required: true, message: '请输入最小金额', trigger: 'blur' },
                    ],
                    maxamount: [
                        {  required: true, message: '请输入最大金额', trigger: 'blur' },
                    ],
                    amountwhat: [
                        {  required: true, message: '请输入一个账号跑多少', trigger: 'blur' },
                    ],
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
            };
        },
        watch : {
            StDate(val){
                this.TaskQuery()
            }
        },
        methods:{
            startumark(item){
                updUmark({
                    data:{taskid:item.taskid},
                    callback: (res)=>{
                        this.TaskQuery()
                    }
                })
            },
            TaskQuery(){
                this.StDate = dateformart(this.StDate)
                getTask({
                    params:{date:this.StDate},
                    callback:(res)=>{
                        this.data = res.data.data
                        console.log(this.data)
                        this.TaskQF=true
                    }
                })
            },
            submitForm(formName){
                console.log(formName)
                this.$refs[formName].validate((valid) => {
                    var data = {}
                    data=this.form
                    data.date = dateformart(data.date)
                    addTask({
                        data:data,
                        callback:(res)=>{
                            this.addTaskFlag = false
                            this.$message.success("添加成功!")
                        }
                    })
                });
            }
        },
        create(){
        }
    }
</script>

<style scoped>
    .xuanzhuan {
        -webkit-animation: xuanzhuan 5s linear;
        -webkit-animation-iteration-count: infinite;
    }
    @-webkit-keyframes xuanzhuan {
    from {
        -webkit-transform: rotateZ(0);
    }
    to{
        -webkit-transform: rotateZ(360deg);
        }
    }
</style>