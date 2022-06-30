<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-button
        v-permission="['admin']"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="showDialog(false)"
      >
        新增
      </el-button>
    </div>

    <!--表格渲染-->
    <el-table ref="table" v-loading="loading" :data="list" row-key="id">
      <el-table-column label="标题" prop="title" />
      <el-table-column label="来源" prop="source" />
      <el-table-column prop="publishTime" label="发布时间" />
      <el-table-column prop="createTime" label="创建日期" />
      <el-table-column
        v-if="checkPer(['admin'])"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['admin']"
            class="filter-item"
            size="mini"
            type="warning"
            icon="el-icon-edit"
            @click="showDialog(scope.row)"
          >
          </el-button>

          <el-popconfirm
            title="是否确定删除?"
            @confirm="handleRemove(scope.row)"
          >
            <el-button
              slot="reference"
              v-permission="['admin']"
              class="filter-item"
              size="mini"
              type="danger"
              icon="el-icon-delete"
            >
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right; margin-top: 6px">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="req.currentPage"
        :page-size="req.pageSize"
      />
    </div>
    <!--表单组件-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="dialog.visible"
      :title="form.id ? '编辑' : '新建'"
      width="800px"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title" required>
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="来源" prop="source" required>
          <el-input v-model="form.source" />
        </el-form-item>
        <el-form-item label="是否置顶" prop="isTop" required>
          <el-radio-group v-model="form.isTop">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布时间" prop="publishTime" required>
          <!-- <el-input v-model="form.publishTime" /> -->
          <el-date-picker
            v-model="form.publishTime"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="正文" prop="content" required>
          <div ref="editor" class="text" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialog.visible = false">取消</el-button>
        <el-button :loading="dialog.loading" type="primary" @click="submit"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { upload } from "@/utils/upload";
import { mapGetters } from "vuex";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import E from "wangeditor";

import { parseTime, deepClone } from "@/utils";

const defaultForm = {
  id: null,
  title: "",
  content: `<ul><li>请填写正文内容</li></ul>`,
  isTop: 1,
  source: "STEM",
  publishTime: parseTime(new Date(), "{y}-{m}-{d}"),
};

export default {
  name: "News",
  components: {},
  // mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  dicts: ["dept_status"],
  data() {
    return {
      loading: true,
      list: [],
      total: 0,
      req: {
        pageSize: 20,
        currentPage: 1,
      },
      form: deepClone(defaultForm),
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        source: [{ required: true, message: "请输入来源", trigger: "blur" }],
      },
      permission: {
        add: ["admin"],
        edit: ["admin"],
        del: ["admin"],
      },
      enabledTypeOptions: [
        { key: "true", display_name: "正常" },
        { key: "false", display_name: "禁用" },
      ],
      editor: null,
      dialog: {
        visible: false,
        loading: true,
      },
    };
  },
  computed: {
    ...mapGetters(["imagesUploadApi", "baseApi"]),
  },
  watch: {
    "dialog.visible"(val) {
      if (val && !this.editor) {
        this.$nextTick(() => this.initEditor());
      }
      if (!val) {
        this.form = deepClone(defaultForm);
        this.$refs.form.resetFields();
      }
    },
  },
  mounted() {
    this.getList();
    console.log(deepClone(defaultForm));
  },
  methods: {
    getList() {
      this.list = [
        {
          id: 1001,
          title: "xxxxxxx",
          source: "STEM",
          publishTime: "2020-01-01",
          content: "",
          isTop: 1,
        },
      ];
      this.loading = false;
    },
    initEditor() {
      console.log(this.form);
      const editor = new E(this.$refs.editor);
      // 自定义菜单配置
      editor.config.zIndex = 5;
      // 文件上传
      editor.config.customUploadImg = (files, insert) => {
        // files 是 input 中选中的文件列表
        // insert 是获取图片 url 后，插入到编辑器的方法
        files.forEach((image) => {
          upload(this.imagesUploadApi, image).then((res) => {
            const data = res.data;
            const url =
              this.baseApi + "/file/" + data.type + "/" + data.realName;
            insert(url);
          });
        });
      };
      editor.config.onchange = (html) => {
        this.form.content = html;
      };
      editor.create();
      // 初始化数据
      editor.txt.html(this.form.content);
      this.editor = editor;
    },

    showDialog(info) {
      if (info) this.form = deepClone(info);
      this.dialog.visible = true;
      this.dialog.loading = false;
    },
    /**
     * 提交弹窗
     */
    submit() {
      this.$refs.form.validate((valid) => {
        this.dialog.loading = true;
        if (!valid) {
          this.$message({
            message: "请正确填写新闻信息",
            type: "warning",
          });
          this.dialog.loading = false;
          return;
        }
        //TODO 新增/编辑新闻
      });
    },
    /**
     * 删除
     */
    handleRemove(info) {
      console.log(info);
    },
    /**
     * change pageSize
     */
    handleSizeChange(size) {
      this.req.pageSize = size;
      this.handleSizeChange(1);
    },
    /**
     * change currentPage
     */
    handleCurrentChange(page) {
      this.req.page = page;
      this.getList();
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control,
::v-deep .vue-treeselect__placeholder,
::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
