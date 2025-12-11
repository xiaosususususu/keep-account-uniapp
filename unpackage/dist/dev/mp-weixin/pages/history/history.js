"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_dataManager = require("../../utils/dataManager.js");
const _sfc_main = {
  data() {
    return {
      gameHistory: []
    };
  },
  onShow() {
    this.loadGameHistory();
  },
  methods: {
    loadGameHistory() {
      this.gameHistory = utils_dataManager.DataManager.getGameHistory();
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${month}-${day} ${hours}:${minutes}`;
    },
    goToRecord() {
      common_vendor.index.switchTab({
        url: "/pages/record/record"
      });
    },
    clearHistory() {
      common_vendor.index.showModal({
        title: "确认清空",
        content: "确定要清空所有历史记录吗？此操作不可恢复！",
        confirmText: "确定清空",
        confirmColor: "#FF0000",
        success: (res) => {
          if (res.confirm) {
            utils_dataManager.storage.remove(utils_dataManager.StorageKeys.GAME_HISTORY);
            this.loadGameHistory();
            common_vendor.index.showToast({
              title: "历史记录已清空",
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
    a: $data.gameHistory.length === 0
  }, $data.gameHistory.length === 0 ? {
    b: common_vendor.o((...args) => $options.goToRecord && $options.goToRecord(...args))
  } : {
    c: common_vendor.f($data.gameHistory, (game, gameIndex, i0) => {
      return {
        a: common_vendor.t($options.formatDate(game.date)),
        b: common_vendor.t($data.gameHistory.length - gameIndex),
        c: common_vendor.f(game.players, (player, k1, i1) => {
          return {
            a: common_vendor.t(player.name),
            b: common_vendor.t(player.score > 0 ? "+" : ""),
            c: common_vendor.t(player.score),
            d: player.score > 0 ? 1 : "",
            e: player.score < 0 ? 1 : "",
            f: common_vendor.t(player.totalScore),
            g: player.id
          };
        }),
        d: game.id
      };
    })
  }, {
    d: $data.gameHistory.length > 0
  }, $data.gameHistory.length > 0 ? {
    e: common_vendor.o((...args) => $options.clearHistory && $options.clearHistory(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/history/history.js.map
