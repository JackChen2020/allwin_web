<template>
    <div>
        <basic-container>
            <el-button type="primary" @click="CacheWhiterHandler">刷新白名单数据缓存</el-button>
        </basic-container>

    </div>
</template>


<script>
    import { refeshWhiteList } from '@/api/request/request'

    export default {
        methods : {
            CacheWhiterHandler(){
                this.$confirm('(危险操作)确认刷新白名单缓存吗？', '提示', {}).then(() => {
                    refeshWhiteList({
                        callback : ()=>{
                            this.$message.success("刷新成功!")
                        }
                    })
                })
            }
        }
    }
</script>