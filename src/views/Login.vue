<template>
  <el-form
    :model="form"
    ref="form"
    :rules="rules"
    label-width="80px"
    :inline="false"
    size="normal"
    class="login-container"
  >
    <h3 class="login_title">系统登陆</h3>
    <el-form-item label="用户名" prop="userName">
      <el-input v-model="form.userName"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="form.password" show-password></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        style="margin-left: 54px"
        type="primary"
        size="default"
        @click.native.prevent="handleLogin"
        >登录</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>

export default {
  data() {
    return {
      form: {
        userName: "",
        password: "",
      },
      rules: {
        userName: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
      loading: false,
    };
  },
  methods: {
    handleLogin() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('Login', this.form)
            .then(() => {
              this.$router.push({ path: '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
};
</script>

<style lang="less" scoped>
.login-container {
  width: 350px;
  height: 200px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  .login_title {
    text-align: center;
    margin-bottom: 40px;
    color: #505458;
  }
}
</style>
