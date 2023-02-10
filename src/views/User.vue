<template>
  <div class="manage">
    <el-dialog title="用户信息" :visible.sync="dialogVisible" width="40%">
      <!-- 表单的内容 -->
      <!-- 图片上传 -->
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="80px"
        :inline="false"
        size="normal"
        :limit="1"
      >
        <el-row :gutter="20">
          <el-col :span="8" :offset="0">
            <el-upload
              class="avatar-uploader"
              action="http://localhost:7777/image/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              multiple
            >
              <img v-if="form.avatar" :src="form.avatar" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
          <!-- 其他表单数据 -->
          <el-col :span="16" :offset="0">
            <!-- 用户名 -->
            <el-form-item label="用户名" size="normal" prop="userName">
              <el-input
                v-model="form.userName"
                placeholder="输入用户名"
                size="normal"
                clearable
              ></el-input>
            </el-form-item>
            <!-- 性别 -->
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option :key="'0'" label="男" :value="'0'" />
                <el-option :key="'1'" label="女" :value="'1'" />
                <el-option :key="'2'" label="未知" :value="'2'" />
              </el-select>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio :key="'0'" :label="'0'">正常</el-radio>
                <el-radio :key="'1'" :label="'1'">停用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input
                v-model="form.phonenumber"
                placeholder="请输入手机号码"
                maxlength="11"
              />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增按钮 -->
    <div class="manage-header">
      <el-input
        v-model="queryParams.userName"
        placeholder="输入用户名"
        size="normal"
        clearable
        @change="getList()"
      ></el-input>
      <el-button type="primary" size="default" @click="getList()">搜索</el-button>
      
    </div>
    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column prop="userName" label="用户名" align="center">
        <template slot-scope="scope">
          <span style="cursor: pointer" @click="handleUpdate(scope.row)">{{
            scope.row.userName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        :formatter="show"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="phonenumber"
        label="手机号"
        :formatter="show"
        align="center"
      ></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" />
    </el-table>
    <el-pagination
      :page-size.sync="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-sizes="[10, 20, 30, 40]"
      :current-page.sync="queryParams.pageNum"
      @current-change="getList"
      @size-change="getList"
    >
    </el-pagination>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  changeUserStatus,
} from "@/api/system/user";
export default {
  data() {
    return {
      // 用户表格数据
      userList: null,
      // 总条数
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
      },
      dialogVisible: false,
      form: {
        id: undefined,
        userName: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        avatar: "",
      },
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "用户名称长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getUser(id).then((response) => {
        this.form = response;
        this.dialogVisible = true;
      });
    },
    // 修改状态
    handleStatusChange(row) {
      const text = row.status === "0" ? "启用" : "停用";
      changeUserStatus(row.id, row.status)
        .then(() => {})
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // 展示 没数据显示暂无数据
    show(row, column, cellValue, index) {
      if (cellValue) {
        return cellValue;
      }
      return "暂无数据";
    },
    // 获得用户列表信息
    getList() {
      listUser(this.queryParams).then((response) => {
        this.userList = response.rows;
        this.total = response.total;
      });
    },
    submitForm() {
      this.reset();
      this.dialogVisible = false;
    },
    cancel() {
      this.dialogVisible = false;
      this.reset();
    },
    // 上传成功回传图片url
    handleAvatarSuccess(res, file) {
      this.form.avatar = res.data;
    },
    // 上传前看下大小和格式
    beforeAvatarUpload(file) {
      const isFormat =
        file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "image/jpeg";
      const isLt5M = file.size / 1024 / 1024 < 10;

      if (!isFormat) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isFormat && isLt5M;
    },
    // form重置
    reset() {
      this.form = {
        id: undefined,
        userName: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        avatar: "",
      };
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.manage-header {
  margin: 5px 5px;
  display: flex;
  width: 300px;

}
</style>
