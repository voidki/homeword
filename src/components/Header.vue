<template>
  <div class="header-container">
    <div class="l-container">
      <el-button
        @click="collapseMenu()"
        icon="el-icon-menu"
        size="mini"
      ></el-button>
    </div>
    <div class="r-container">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <img class="user" :src="avatar" alt="" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
          <el-dropdown-item command="exit">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="80px"
        :inline="false"
        size="normal"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="form.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input v-model="form.checkPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { verifyPwd, resetUserPwd } from "@/api/system/user";
export default {
  data() {
    // 验证密码
    var checkPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      }
      verifyPwd(value).then((response) => {
        if (response === true) {
          callback();
        } else {
          callback(new Error("原密码错误"));
        }
      });
    };
    var samePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      form: {
        oldPassword: "",
        newPassword: "",
        checkPassword: "",
      },
      rules: {
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
        ],
        oldPassword: [
          { validator: checkPassword, trigger: "blur" },
          { required: true, message: "请输入新密码", trigger: "blur" },
        ],
        checkPassword: [
          { validator: samePassword, trigger: "blur" },
          { required: true, message: "请输入新密码", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    avatar() {
      return (
        this.$store.state.user.avatar || require("@/assets/user-default.png")
      );
    },
  },
  methods: {
    ...mapMutations("tab", ["collapseMenu"]),
    onSubmit() {
      resetUserPwd(this.form.newPassword).then(()=>{
        this.$message({
          showClose: true,
          message: '修改成功，请重新登录',
          type: 'success'
        });
        setTimeout(()=>{
          this.handleLogout();
        },1000);
      })
    },
    cancel() {
      this.resetForm();
      this.dialogVisible = false;
    },
    resetForm() {
      this.form.oldPassword = "";
      this.form.newPassword = "";
      this.form.checkPassword = "";
    },
    handleLogout() {
      this.$store
        .dispatch("LogOut")
        .then((result) => {
          this.$store.dispatch("FedLogOut").then((result) => {
            this.$router.push({ path: "/login" });
          });
        })
        .catch((err) => {});
    },
    handleCommand(command) {
      if (command === "exit") {
        this.handleLogout();
      }
      if (command === "updatePassword") {
        this.dialogVisible = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.header-container {
  padding: 0 20px;
  background-color: #333;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .r-container {
    .user {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
}
</style>
