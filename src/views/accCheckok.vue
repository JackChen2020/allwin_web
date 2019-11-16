<template>
    <div>
        <basic-container>
            <el-button type="primary" @click="checkOk">内冲账务核对</el-button>
        </basic-container>

        <basic-container v-if="flag">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="余额">
                    <el-col class="line" :span="2">{{form.totbal}}</el-col>
                </el-form-item>
                <el-form-item label="流水">
                    <el-col class="line" :span="2">{{form.totamount}}</el-col>
                </el-form-item>
                <el-form-item label="上游余额">
                    <el-col class="line" :span="2">{{form.lasttotbal}}</el-col>
                </el-form-item>
                <el-form-item label="手续费">
                    <el-col class="line" :span="2">{{form.feetot}}</el-col>
                </el-form-item>
            </el-form>
        </basic-container>
    </div>
</template>


<script>

    import { accCheckok } from '~/api/request/request'

    export default {
        data() {
            return {
                form:{},
                flag:false,
            }
        },
        methods : {
            checkOk(){
                accCheckok({
                    callback : (res)=>{
                        this.form = res.data.data
                        this.flag = true
                    }
                })
            }
        }
    }
</script>