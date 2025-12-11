"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_dataManager = require("../../utils/dataManager.js");
const _sfc_main = {
  data() {
    return {
      players: [],
      showModal: false,
      isEdit: false,
      playerName: "",
      editPlayerId: null
    };
  },
  onShow() {
    this.loadPlayers();
  },
  methods: {
    loadPlayers() {
      this.players = utils_dataManager.DataManager.getPlayers();
    },
    showAddPlayerModal() {
      if (this.players.length >= 8) {
        common_vendor.index.showToast({
          title: "最多添加8位玩家",
          icon: "none"
        });
        return;
      }
      this.isEdit = false;
      this.playerName = "";
      this.editPlayerId = null;
      this.showModal = true;
    },
    editPlayer(player) {
      this.isEdit = true;
      this.playerName = player.name;
      this.editPlayerId = player.id;
      this.showModal = true;
    },
    savePlayer() {
      if (!this.playerName.trim()) {
        common_vendor.index.showToast({
          title: "请输入玩家姓名",
          icon: "none"
        });
        return;
      }
      if (this.isEdit) {
        const playerIndex = this.players.findIndex((p) => p.id === this.editPlayerId);
        if (playerIndex !== -1) {
          this.players[playerIndex].name = this.playerName.trim();
        }
      } else {
        const newPlayer = {
          id: Date.now().toString(),
          name: this.playerName.trim(),
          totalScore: 0
        };
        this.players.push(newPlayer);
      }
      utils_dataManager.DataManager.savePlayers(this.players);
      this.closeModal();
      this.loadPlayers();
      common_vendor.index.showToast({
        title: this.isEdit ? "修改成功" : "添加成功",
        icon: "success"
      });
    },
    deletePlayer(playerId) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除该玩家吗？",
        success: (res) => {
          if (res.confirm) {
            this.players = this.players.filter((p) => p.id !== playerId);
            utils_dataManager.DataManager.savePlayers(this.players);
            this.loadPlayers();
            common_vendor.index.showToast({
              title: "删除成功",
              icon: "success"
            });
          }
        }
      });
    },
    closeModal() {
      this.showModal = false;
      this.playerName = "";
      this.editPlayerId = null;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.showAddPlayerModal && $options.showAddPlayerModal(...args)),
    b: $data.players.length === 0
  }, $data.players.length === 0 ? {} : {
    c: common_vendor.f($data.players, (player, k0, i0) => {
      return {
        a: common_vendor.t(player.name),
        b: common_vendor.t(player.totalScore),
        c: common_vendor.o(($event) => $options.editPlayer(player), player.id),
        d: common_vendor.o(($event) => $options.deletePlayer(player.id), player.id),
        e: player.id
      };
    })
  }, {
    d: $data.showModal
  }, $data.showModal ? {
    e: common_vendor.t($data.isEdit ? "编辑玩家" : "添加玩家"),
    f: $data.playerName,
    g: common_vendor.o(($event) => $data.playerName = $event.detail.value),
    h: common_vendor.o((...args) => $options.closeModal && $options.closeModal(...args)),
    i: common_vendor.o((...args) => $options.savePlayer && $options.savePlayer(...args)),
    j: common_vendor.o(() => {
    }),
    k: common_vendor.o((...args) => $options.closeModal && $options.closeModal(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/players/players.js.map
