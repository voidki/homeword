<template>
  <div>
    <el-container>
      <el-aside width="auto">
          <Aside></Aside>
      </el-aside>
      <el-container>
        <el-header>
            <Header></Header>
        </el-header>
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Aside from '@/components/Aside'
import Header from '@/components/Header'
export default {
    data(){
        return{

        }
    },
    components:{
        Aside,
        Header,

    }
};
</script>

<style lang="less" scoped>
  .el-header{
    padding: 0;
  }
</style>
