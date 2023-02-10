<template>
  <div class="manage">
    <el-dialog :title="tiptitle" :visible.sync="dialogVisible" width="40%">
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
              <img v-if="form.image" :src="form.image" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
          <!-- 其他表单数据 -->
          <el-col :span="16" :offset="0">
            <!-- 用户名 -->
            <el-form-item label="商品名" size="normal" prop="title">
              <el-input
                v-model="form.title"
                placeholder="输入商品名称"
                size="normal"
                clearable
              ></el-input>
            </el-form-item>
            <!-- 价格 -->
            <el-form-item label="商品价格" prop="price">
              <el-input
                v-model="form.price"
                placeholder="输入商品价格"
                size="normal"
                clearable
              ></el-input>
            </el-form-item>
            <!-- 数量 -->
            <el-form-item label="商品数量" prop="num">
              <el-input
                v-model="form.num"
                placeholder="输入商品数量"
                size="normal"
                clearable
              ></el-input>
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
      <div class="header-button">
        <el-button type="primary" size="default" @click="handleAdd"
          >新增商品</el-button
        >
      </div>
      <div class="header-search">
        <el-input
          v-model="queryParams.title"
          placeholder="输入商品名"
          size="normal"
          clearable
          @change="getList()"
        ></el-input>
        <el-button type="primary" size="default" @click="getList()"
          >搜索</el-button
        >
      </div>
    </div>
    <el-table :data="productList" stripe style="width: 100%">
      <el-table-column prop="title" label="商品名" align="center">
        <template slot-scope="scope">
          <span style="cursor: pointer" @click="handleUpdate(scope.row)">{{
            scope.row.title
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        label="商品价格"
        :formatter="show"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="num"
        label="商品数量"
        :formatter="show"
        align="center"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleUpdate(scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
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
  listProduct,
  updateProduct,
  delProduct,
  addProduct,
  getProduct,
} from "@/api/system/product";
export default {
  data() {
    var checkprice = (rule, value, callback) => {
      if (value < 0) {
        return callback(new Error("数字必须大于零"));
      } else {
        callback();
      }
    };
    return {
      // 用户表格数据
      productList: null,
      // 总条数
      total: 0,
      // 标签名称
      tiptitle: "",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
      },
      dialogVisible: false,
      form: {
        id: undefined,
        title: undefined,
        price: undefined,
        num: undefined,
        image: "",
      },
      rules: {
        title: [
          { required: true, message: "商品名称不能为空", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "商品名称长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
        price: [{ validator: checkprice, trigger: "blur" }],
        num: [{ validator: checkprice, trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateProduct(this.form).then((response) => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.dialogVisible = false;
              this.getList();
            });
          } else {
            addProduct(this.form).then((response) => {
              this.$message({
                message: "添加成功",
                type: "success",
              });
              this.dialogVisible = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      this.tiptitle = "修改商品";
      getProduct(id).then((response) => {
        this.form = response;
        this.form.price = parseInt(this.form.price);
        this.form.num = parseInt(this.form.num);
        this.dialogVisible = true;
      });
    },
    handleDelete(row) {
      this.$confirm("是否确认删除数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delProduct(row.id)
          .then((response) => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.dialogVisible = false;
            this.getList();
          })
          .catch(() => {});
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
      listProduct(this.queryParams).then((response) => {
        this.productList = response.rows;
        this.total = response.total;
      });
    },
    /** 新增用户 */
    handleAdd() {
      this.reset();
      this.dialogVisible = true;
      this.tiptitle = "新增商品";
    },
    cancel() {
      this.dialogVisible = false;
      this.reset();
    },
    // 上传成功回传图片url
    handleAvatarSuccess(res, file) {
      this.form.image = res.data;
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
        title: undefined,
        price: undefined,
        num: undefined,
        image: "",
      };
    },
  },
};
</script>

<style lang="less" scoped>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 98%;
  .header-search {
    display: flex;
  }
}
</style>
