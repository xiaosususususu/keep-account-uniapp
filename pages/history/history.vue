<template>
	<view class="container">
		<view v-if="gameHistory.length === 0" class="empty-tip">
			<text>暂无游戏记录</text>
			<button class="go-to-record" type="primary" @click="goToRecord">开始记账</button>
		</view>

		<view v-else class="history-list">
			<view v-for="(game, gameIndex) in gameHistory" :key="game.id" class="game-record">
				<view class="game-header">
					<text class="game-date">{{ formatDate(game.date) }}</text>
					<text class="game-round">第 {{ gameHistory.length - gameIndex }} 局</text>
				</view>
				<view class="players-scores">
					<view v-for="player in game.players" :key="player.id" class="player-score">
						<text class="player-name">{{ player.name }}</text>
						<view class="scores">
							<text class="round-score" :class="{ 'positive': player.score > 0, 'negative': player.score < 0 }">
								{{ player.score > 0 ? '+' : '' }}{{ player.score }}
							</text>
							<text class="total-score">={{ player.totalScore }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view v-if="gameHistory.length > 0" class="history-actions">
			<button class="clear-history-btn" type="warn" @click="clearHistory">清空历史记录</button>
		</view>
	</view>
</template>

<script>
import { DataManager, storage, StorageKeys } from '@/utils/dataManager.js'

export default {
	data() {
		return {
			gameHistory: []
		}
	},

	onShow() {
		this.loadGameHistory();
	},

	methods: {
		loadGameHistory() {
			this.gameHistory = DataManager.getGameHistory();
		},

		formatDate(dateString) {
			const date = new Date(dateString);
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const hours = String(date.getHours()).padStart(2, '0');
			const minutes = String(date.getMinutes()).padStart(2, '0');
			return `${month}-${day} ${hours}:${minutes}`;
		},

		goToRecord() {
			uni.switchTab({
				url: '/pages/record/record'
			});
		},

		clearHistory() {
			uni.showModal({
				title: '确认清空',
				content: '确定要清空所有历史记录吗？此操作不可恢复！',
				confirmText: '确定清空',
				confirmColor: '#FF0000',
				success: (res) => {
					if (res.confirm) {
						storage.remove(StorageKeys.GAME_HISTORY);
						this.loadGameHistory();
						uni.showToast({
							title: '历史记录已清空',
							icon: 'success'
						});
					}
				}
			});
		}
	}
}
</script>

<style>
.container {
	padding: 30rpx;
	min-height: 100vh;
	background-color: #f5f5f5;
}

.empty-tip {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx 0;
	color: #999;
}

.go-to-record {
	margin-top: 30rpx;
}

.history-list {

}

.game-record {
	background-color: #fff;
	border-radius: 15rpx;
	padding: 25rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.08);
}

.game-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding-bottom: 15rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.game-date {
	font-size: 28rpx;
	color: #666;
}

.game-round {
	font-size: 26rpx;
	color: #999;
	background-color: #f5f5f5;
	padding: 5rpx 15rpx;
	border-radius: 20rpx;
}

.players-scores {

}

.player-score {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15rpx 0;
	border-bottom: 1rpx solid #f8f8f8;
}

.player-score:last-child {
	border-bottom: none;
}

.player-name {
	font-size: 30rpx;
	color: #333;
}

.scores {
	display: flex;
	align-items: center;
	gap: 15rpx;
}

.round-score {
	font-size: 32rpx;
	font-weight: bold;
}

.positive {
	color: #52c41a;
}

.negative {
	color: #ff4d4f;
}

.total-score {
	font-size: 28rpx;
	color: #999;
}

.history-actions {
	margin-top: 40rpx;
	text-align: center;
}

.clear-history-btn {

}
</style>