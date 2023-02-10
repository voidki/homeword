<template>
  <div>
    <el-menu
      default-active="home"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <el-menu-item
        v-for="item in menuData"
        :key="item.name"
        :index="item.name"
        :route="item.path"
      >
        <i :class="`el-icon-${item.icon}`"></i>
        <span slot="title">{{ item.label }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data() {
    return {
      menuData: [
        {
          path: "/",
          name: "home",
          label: "首页",
          icon: "s-home",
        },
        {
          path: "/product",
          name: "product",
          label: "商品管理",
          icon: "video-play",
        },
        {
          path: "/user",
          name: "user",
          label: "用户管理",
          icon: "user",
        },
      ],
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  computed: {
      ...mapState('tab',['isCollapse'])
  },
};
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu {
  height: 100vh;
  border-right: 0px;
}
</style>