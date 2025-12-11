"use strict";
const common_vendor = require("../common/vendor.js");
const StorageKeys = {
  PLAYERS: "card_players",
  GAME_HISTORY: "card_game_history",
  CURRENT_TOTAL: "card_current_total"
};
const storage = {
  set(key, data) {
    try {
      common_vendor.index.setStorageSync(key, JSON.stringify(data));
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/dataManager.js:12", "存储数据失败:", e);
    }
  },
  get(key, defaultValue = null) {
    try {
      const data = common_vendor.index.getStorageSync(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/dataManager.js:21", "读取数据失败:", e);
      return defaultValue;
    }
  },
  remove(key) {
    try {
      common_vendor.index.removeStorageSync(key);
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/dataManager.js:30", "删除数据失败:", e);
    }
  },
  clear() {
    try {
      common_vendor.index.clearStorageSync();
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/dataManager.js:38", "清空数据失败:", e);
    }
  }
};
const DataManager = {
  getPlayers() {
    return storage.get(StorageKeys.PLAYERS, []);
  },
  savePlayers(players) {
    storage.set(StorageKeys.PLAYERS, players);
  },
  getGameHistory() {
    return storage.get(StorageKeys.GAME_HISTORY, []);
  },
  saveGameRecord(record) {
    const history = this.getGameHistory();
    history.unshift(record);
    storage.set(StorageKeys.GAME_HISTORY, history);
  },
  updatePlayerTotal(playerId, score) {
    const players = this.getPlayers();
    const playerIndex = players.findIndex((p) => p.id === playerId);
    if (playerIndex !== -1) {
      players[playerIndex].totalScore += score;
      this.savePlayers(players);
    }
  },
  clearAllData() {
    storage.remove(StorageKeys.PLAYERS);
    storage.remove(StorageKeys.GAME_HISTORY);
  }
};
exports.DataManager = DataManager;
exports.StorageKeys = StorageKeys;
exports.storage = storage;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/dataManager.js.map
