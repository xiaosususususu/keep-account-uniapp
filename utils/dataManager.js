export const StorageKeys = {
	PLAYERS: 'card_players',
	GAME_HISTORY: 'card_game_history',
	CURRENT_TOTAL: 'card_current_total'
}

export const storage = {
	set(key, data) {
		try {
			uni.setStorageSync(key, JSON.stringify(data));
		} catch (e) {
			console.error('存储数据失败:', e);
		}
	},

	get(key, defaultValue = null) {
		try {
			const data = uni.getStorageSync(key);
			return data ? JSON.parse(data) : defaultValue;
		} catch (e) {
			console.error('读取数据失败:', e);
			return defaultValue;
		}
	},

	remove(key) {
		try {
			uni.removeStorageSync(key);
		} catch (e) {
			console.error('删除数据失败:', e);
		}
	},

	clear() {
		try {
			uni.clearStorageSync();
		} catch (e) {
			console.error('清空数据失败:', e);
		}
	}
}

export const DataManager = {
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
		const playerIndex = players.findIndex(p => p.id === playerId);
		if (playerIndex !== -1) {
			players[playerIndex].totalScore += score;
			this.savePlayers(players);
		}
	},

	clearAllData() {
		storage.remove(StorageKeys.PLAYERS);
		storage.remove(StorageKeys.GAME_HISTORY);
	}
}