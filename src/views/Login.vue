<template>
  <div class="main" :style="'background-image:'+'url('+image+')'">
      <el-form  name="ruleForm2"  status-icon  auto-complete="on" autocomplete="on" :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h3 class="title">登录</h3>
        <el-form-item prop="account">
          <el-input name="account" type="text" v-model="ruleForm2.account" autocomplete="on"  placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="verifycode">
          <div class="identifybox">
            <el-input style="width :170px" v-model="ruleForm2.verifycode" placeholder="请输入验证码" class="identifyinput"></el-input>
            <div @click="refreshCode">
              <s-identify :identifyCode="identifyCode"></s-identify>
            </div>
          </div>
        </el-form-item>


        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
          <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
        </el-form-item>
        
      </el-form>
  </div>
</template>

<script>
  import { request_login,user_query,get_menu } from '../api/request/request';
  import SIdentify from './com/ident'
  import { mapState,mapMutations } from 'vuex'
  export default {
    components: {
      SIdentify
    },
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: '',
          verifycode: ''
        },

        images : [
          require('../assets/backs/1.jpg'),
          require('../assets/backs/2.jpg'),
          require('../assets/backs/3.jpg'),
        ],
        image : require('../assets/backs/1.jpg'),
        images_index:1,

        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
          verifycode: [
            { required: true, trigger: 'blur', validator: (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请输入验证码'))
                } else if (value !== this.identifyCode) {
                  callback(new Error('验证码不正确!'))
                } else {
                  callback()
                }
              }
            }
          ]
        },
        checked: true,

        identifyCodes: '1234567890',
        identifyCode: '',
        token:'',
      };
    },
    methods: {
      ...mapMutations(['handleUser','handlerRouters']),
      setTimer: function () {
        this.timer = setTimeout( () => {
          this.image = this.images[this.images_index]
          if(this.images.length === this.images_index+1){
            this.images_index=0
          }else{
            this.images_index +=1
          }

        }, 1000*5)
      },
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      callBackhandleSubmit2(res){
        this.loginParams = true;
        this.token=res.headers.authorization;
        localStorage.authorization=this.token

        user_query({
          callback : (res) => {
            this.handleUser(res.data.data)
            this.$router.push({ path: '/dashboard' });
          },
          errorcallback : () =>{
            this.logining = false
          }
        })
      },
      errorcallBackhandleSubmit2(res){
        this.refreshCode()
        this.logining = false;
      },
      handleSubmit2() {
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            this.logining = true;
            request_login({
              data :{
                loginname : this.ruleForm2.account,
                passwd: this.$md5(this.ruleForm2.checkPass)
              },
              callback: this.callBackhandleSubmit2,
              errorcallback:this.errorcallBackhandleSubmit2
            })
          } else {
            return false;
          }
        });
      },
      // 生成随机数
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
      },
      // 切换验证码
      refreshCode() {
        this.identifyCode = ''
        this.makeCode(this.identifyCodes, 4)
      },
      // 生成四位随机验证码
      makeCode(o, l) {
        for (let i = 0; i < l; i++) {
          this.identifyCode += this.identifyCodes[
                  this.randomNum(0, this.identifyCodes.length)
                  ]
        }
      }
    },
    mounted() {
      localStorage.clear()
      this.refreshCode()
      this.setTimer()
    },
  }
</script>

<style lang="scss" scoped>
  .main {
    background-repeat:no-repeat;
    background-size:100% 100%;
    -moz-background-size:100% 100%;
    width:100%;
    height:100%;
    margin:0;
    padding: 0;
    overflow: hidden;
  }
  .login-container {
    box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    /*background: #fff;*/
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }

  .identifybox{
    display: flex;
    justify-content: space-between;
    margin-top:7px;
  }

</style>
