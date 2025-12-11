<template>
	<view class="container">
		<view class="header">
			<text class="title">打牌记账</text>
			<text class="subtitle">记录每一局的得分</text>
		</view>

		<view class="score-board">
			<view v-if="players.length === 0" class="empty-tip">
				<text>请先添加玩家</text>
				<button class="go-to-players" type="primary" size="mini" @click="goToPlayers">去添加</button>
			</view>
			<view v-else class="players-score">
				<view class="score-list">
					<view v-for="(player, index) in sortedPlayers" :key="player.id"
						  class="score-item" :class="{ 'winner': player.totalScore > 0, 'loser': player.totalScore < 0 }">
						<view class="rank">{{ index + 1 }}</view>
						<view class="player-info">
							<text class="player-name">{{ player.name }}</text>
							<text class="total-score" :class="{ 'positive': player.totalScore > 0, 'negative': player.totalScore < 0 }">
								{{ player.totalScore > 0 ? '+' : '' }}{{ player.totalScore }}
							</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="quick-actions">
			<button class="action-btn" type="primary" @click="goToRecord">开始记账</button>
			<button class="action-btn" @click="goToHistory">查看历史</button>
		</view>

		<view class="footer-actions">
			<button class="clear-btn" type="warn" size="mini" @click="clearAllData">清空所有数据</button>
		</view>
	</view>
</template>

<script>
import { DataManager } from '@/utils/dataManager.js'

export default {
	data() {
		return {
			players: []
		}
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
			this.players = DataManager.getPlayers();
		},

		goToRecord() {
			if (this.players.length === 0) {
				uni.showToast({
					title: '请先添加玩家',
					icon: 'none'
				});
				return;
			}
			uni.switchTab({
				url: '/pages/record/record'
			});
		},

		goToHistory() {
			uni.switchTab({
				url: '/pages/history/history'
			});
		},

		goToPlayers() {
			uni.switchTab({
				url: '/pages/players/players'
			});
		},

		clearAllData() {
			uni.showModal({
				title: '确认清空',
				content: '确定要清空所有数据吗？此操作不可恢复！',
				confirmText: '确定清空',
				confirmColor: '#FF0000',
				success: (res) => {
					if (res.confirm) {
						DataManager.clearAllData();
						this.loadPlayers();
						uni.showToast({
							title: '已清空所有数据',
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

.header {
	text-align: center;
	margin-bottom: 40rpx;
}

.title {
	font-size: 48rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.subtitle {
	font-size: 28rpx;
	color: #999;
}

.score-board {
	background-color: #fff;
	border-radius: 15rpx;
	padding: 30rpx;
	margin-bottom: 40rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.empty-tip {
	text-align: center;
	padding: 60rpx 0;
	color: #999;
}

.go-to-players {
	margin-top: 20rpx;
}

.players-score {

}

.score-list {

}

.score-item {
	display: flex;
	align-items: center;
	padding: 25rpx 0;
	border-bottom: 1rpx solid #eee;
}

.score-item:last-child {
	border-bottom: none;
}

.rank {
	width: 60rpx;
	height: 60rpx;
	background-color: #f0f0f0;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	color: #666;
	margin-right: 25rpx;
}

.winner .rank {
	background-color: #e6f7e6;
	color: #52c41a;
}

.loser .rank {
	background-color: #fff2f0;
	color: #ff4d4f;
}

.player-info {
	flex: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.player-name {
	font-size: 32rpx;
	color: #333;
}

.total-score {
	font-size: 36rpx;
	font-weight: bold;
}

.positive {
	color: #52c41a;
}

.negative {
	color: #ff4d4f;
}

.quick-actions {
	display: flex;
	gap: 20rpx;
	margin-bottom: 40rpx;
}

.action-btn {
	flex: 1;
	height: 90rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
}

.footer-actions {
	text-align: center;
}

.clear-btn {

}
</style>