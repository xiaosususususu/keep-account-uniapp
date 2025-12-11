"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_dataManager = require("../../utils/dataManager.js");
const _sfc_main = {
  data() {
    return {
      players: [],
      scores: {}
    };
  },
  computed: {
    currentDate() {
      const now = /* @__PURE__ */ new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
  },
  onShow() {
    this.loadPlayers();
    this.resetScores();
  },
  methods: {
    loadPlayers() {
      this.players = utils_dataManager.DataManager.getPlayers();
      this.scores = {};
      this.players.forEach((player) => {
        this.scores[player.id] = "";
      });
    },
    adjustScore(playerId, amount) {
      const currentValue = parseInt(this.scores[playerId]) || 0;
      this.scores[playerId] = (currentValue + amount).toString();
    },
    validateInput(playerId) {
      const value = this.scores[playerId];
      if (value === "" || value === null || value === void 0) {
        this.scores[playerId] = "";
        return;
      }
      const numValue = parseInt(value);
      if (isNaN(numValue)) {
        this.scores[playerId] = "0";
      } else {
        this.scores[playerId] = numValue.toString();
      }
    },
    resetScores() {
      this.players.forEach((player) => {
        this.scores[player.id] = "";
      });
    },
    saveScores() {
      const hasScores = Object.values(this.scores).some((score) => score !== "" && score !== null && score !== void 0);
      if (!hasScores) {
        common_vendor.index.showToast({
          title: "请至少输入一位玩家的得分",
          icon: "none"
        });
        return;
      }
      const gameRecord = {
        id: Date.now().toString(),
        date: (/* @__PURE__ */ new Date()).toISOString(),
        players: []
      };
      this.players.forEach((player) => {
        const score = parseInt(this.scores[player.id]) || 0;
        gameRecord.players.push({
          id: player.id,
          name: player.name,
          score,
          totalScore: player.totalScore + score
        });
        utils_dataManager.DataManager.updatePlayerTotal(player.id, score);
      });
      utils_dataManager.DataManager.saveGameRecord(gameRecord);
      common_vendor.index.showToast({
        title: "保存成功",
        icon: "success"
      });
      setTimeout(() => {
        this.resetScores();
        this.loadPlayers();
      }, 1e3);
    },
    goToPlayers() {
      common_vendor.index.switchTab({
        url: "/pages/players/players"
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
    c: common_vendor.t($options.currentDate),
    d: common_vendor.f($data.players, (player, k0, i0) => {
      return {
        a: common_vendor.t(player.name),
        b: common_vendor.t(player.totalScore),
        c: common_vendor.o(($event) => $options.adjustScore(player.id, -10), player.id),
        d: common_vendor.o(($event) => $options.validateInput(player.id), player.id),
        e: $data.scores[player.id],
        f: common_vendor.o(($event) => $data.scores[player.id] = $event.detail.value, player.id),
        g: common_vendor.o(($event) => $options.adjustScore(player.id, 10), player.id),
        h: player.id
      };
    }),
    e: common_vendor.o((...args) => $options.resetScores && $options.resetScores(...args)),
    f: common_vendor.o((...args) => $options.saveScores && $options.saveScores(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/record/record.js.map
