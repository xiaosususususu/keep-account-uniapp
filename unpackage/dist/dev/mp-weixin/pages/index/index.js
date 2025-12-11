"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_dataManager = require("../../utils/dataManager.js");
const _sfc_main = {
  data() {
    return {
      players: []
    };
  },
  computed: {
    sortedPlayers() {
      return [...this.players].sort((a, b) => b.totalScore - a.totalScore);
    }
  },
  onShow() {
    this.loadPlayers();
  },
  methods: {
    loadPlayers() {
      this.players = utils_dataManager.DataManager.getPlayers();
    },
    goToRecord() {
      if (this.players.length === 0) {
        common_vendor.index.showToast({
          title: "请先添加玩家",
          icon: "none"
        });
        return;
      }
      common_vendor.index.switchTab({
        url: "/pages/record/record"
      });
    },
    goToHistory() {
      common_vendor.index.switchTab({
        url: "/pages/history/history"
      });
    },
    goToPlayers() {
      common_vendor.index.switchTab({
        url: "/pages/players/players"
      });
    },
    clearAllData() {
      common_vendor.index.showModal({
        title: "确认清空",
        content: "确定要清空所有数据吗？此操作不可恢复！",
        confirmText: "确定清空",
        confirmColor: "#FF0000",
        success: (res) => {
          if (res.confirm) {
            utils_dataManager.DataManager.clearAllData();
            this.loadPlayers();
            common_vendor.index.showToast({
              title: "已清空所有数据",
              icon: "success"
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.players.length === 0
  }, $data.players.length === 0 ? {
    b: common_vendor.o((...args) => $options.goToPlayers && $options.goToPlayers(...args))
  } : {
    c: common_vendor.f($options.sortedPlayers, (player, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(player.name),
        c: common_vendor.t(player.totalScore > 0 ? "+" : ""),
        d: common_vendor.t(player.totalScore),
        e: player.totalScore > 0 ? 1 : "",
        f: player.totalScore < 0 ? 1 : "",
        g: player.id,
        h: player.totalScore > 0 ? 1 : "",
        i: player.totalScore < 0 ? 1 : ""
      };
    })
  }, {
    d: common_vendor.o((...args) => $options.goToRecord && $options.goToRecord(...args)),
    e: common_vendor.o((...args) => $options.goToHistory && $options.goToHistory(...args)),
    f: common_vendor.o((...args) => $options.clearAllData && $options.clearAllData(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
