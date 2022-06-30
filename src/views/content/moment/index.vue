<template>
  <div class="app-container" style="background: #fff">
    <!--工具栏-->
    <div class="head-container">
      <el-button
        v-permission="['admin']"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="addTab"
      >
        新增
      </el-button>
    </div>
    <div>
      <el-tabs
        v-model="currentTab"
        type="card"
        closable
        @tab-remove="removeTab"
      >
        <el-tab-pane
          v-for="item in years"
          :key="item"
          :label="item + ''"
          :name="item + ''"
        >
          {{ item }}
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="新增年份" :visible.sync="dialog.visible">
      <el-form>
        <el-form-item label="年份" :label-width="80" required>
          <el-date-picker type="year" placeholder="选择年份"> </el-date-picker>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { upload } from "@/utils/upload";
import { mapGetters } from "vuex";

import { parseTime, deepClone } from "@/utils";

export default {
  name: "Moment",
  components: {},
  data() {
    return {
      loading: true,
      list: [],
      dialog: {
        visible: false,
        loading: true,
      },
      currentTab: "2021",
      years: [2021, 2020, 2019, 2018],
    };
  },
  computed: {
    ...mapGetters(["imagesUploadApi", "baseApi"]),
  },
  watch: {},
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = false;
    },
    removeTab(targetName) {
      let tabs = this.years;
      let activeName = this.currentTab;
      if (activeName == targetName) {
        tabs.forEach((tab, index) => {
          if (tab == targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab;
            }
          }
        });
      }
      this.currentTab = activeName;
      this.years = tabs.filter((tab) => tab.name !== targetName);
    },
    addTab() {},
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
