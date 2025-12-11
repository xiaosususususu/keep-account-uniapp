<template>
	<view class="container">
		<view v-if="players.length === 0" class="empty-tip">
			<text>请先添加玩家</text>
			<button class="go-to-players" type="primary" @click="goToPlayers">去添加</button>
		</view>

		<view v-else class="record-form">
			<view class="form-header">
				<text class="title">记录本局得分</text>
				<text class="current-date">{{ currentDate }}</text>
			</view>

			<view class="players-input">
				<view v-for="player in players" :key="player.id" class="player-score-input">
					<view class="player-header">
						<text class="player-name">{{ player.name }}</text>
						<text class="current-score">当前总分: {{ player.totalScore }}</text>
					</view>
					<view class="input-wrapper">
						<button class="score-btn minus" @click="adjustScore(player.id, -10)">-10</button>
						<input class="score-input"
							   type="number"
							   v-model="scores[player.id]"
							   placeholder="输入得分"
							   @blur="validateInput(player.id)" />
						<button class="score-btn plus" @click="adjustScore(player.id, 10)">+10</button>
					</view>
				</view>
			</view>

			<view class="form-actions">
				<button class="reset-btn" @click="resetScores">重置</button>
				<button class="save-btn" type="primary" @click="saveScores">保存</button>
			</view>
		</view>
	</view>
</template>

<script>
import { DataManager } from '@/utils/dataManager.js'

export default {
	data() {
		return {
			players: [],
			scores: {}
		}
	},

	computed: {
		currentDate() {
			const now = new Date();
			const year = now.getFullYear();
			const month = String(now.getMonth() + 1).padStart(2, '0');
			const day = String(now.getDate()).padStart(2, '0');
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			return `${year}-${month}-${day} ${hours}:${minutes}`;
		}
	},

	onShow() {
		this.loadPlayers();
		this.resetScores();
	},

	methods: {
		loadPlayers() {
			this.players = DataManager.getPlayers();
			this.scores = {};
			this.players.forEach(player => {
				this.scores[player.id] = '';
			});
		},

		adjustScore(playerId, amount) {
			const currentValue = parseInt(this.scores[playerId]) || 0;
			this.scores[playerId] = (currentValue + amount).toString();
		},

		validateInput(playerId) {
			const value = this.scores[playerId];
			if (value === '' || value === null || value === undefined) {
				this.scores[playerId] = '';
				return;
			}

			const numValue = parseInt(value);
			if (isNaN(numValue)) {
				this.scores[playerId] = '0';
			} else {
				this.scores[playerId] = numValue.toString();
			}
		},

		resetScores() {
			this.players.forEach(player => {
				this.scores[player.id] = '';
			});
		},

		saveScores() {
			const hasScores = Object.values(this.scores).some(score => score !== '' && score !== null && score !== undefined);

			if (!hasScores) {
				uni.showToast({
					title: '请至少输入一位玩家的得分',
					icon: 'none'
				});
				return;
			}

			const gameRecord = {
				id: Date.now().toString(),
				date: new Date().toISOString(),
				players: []
			};

			let hasValidScore = false;
			this.players.forEach(player => {
				const score = parseInt(this.scores[player.id]) || 0;
				if (score !== 0) {
					hasValidScore = true;
				}
				gameRecord.players.push({
					id: player.id,
					name: player.name,
					score: score,
					totalScore: player.totalScore + score
				});

				DataManager.updatePlayerTotal(player.id, score);
			});

			DataManager.saveGameRecord(gameRecord);

			uni.showToast({
				title: '保存成功',
				icon: 'success'
			});

			setTimeout(() => {
				this.resetScores();
				this.loadPlayers();
			}, 1000);
		},

		goToPlayers() {
			uni.switchTab({
				url: '/pages/players/players'
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

.go-to-players {
	margin-top: 30rpx;
}

.record-form {
	background-color: #fff;
	border-radius: 15rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.form-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #eee;
}

.title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.current-date {
	font-size: 28rpx;
	color: #666;
}

.players-input {

}

.player-score-input {
	margin-bottom: 40rpx;
	padding: 25rpx;
	background-color: #f8f8f8;
	border-radius: 10rpx;
}

.player-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.player-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.current-score {
	font-size: 26rpx;
	color: #666;
}

.input-wrapper {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.score-btn {
	width: 80rpx;
	height: 70rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	border-radius: 8rpx;
}

.minus {
	background-color: #fff2f0;
	color: #ff4d4f;
	border: 1rpx solid #ffccc7;
}

.plus {
	background-color: #e6f7e6;
	color: #52c41a;
	border: 1rpx solid #b7eb8f;
}

.score-input {
	flex: 1;
	height: 70rpx;
	padding: 0 20rpx;
	border: 1rpx solid #ddd;
	border-radius: 8rpx;
	font-size: 30rpx;
	text-align: center;
	background-color: #fff;
}

.form-actions {
	display: flex;
	gap: 20rpx;
	margin-top: 40rpx;
}

.reset-btn, .save-btn {
	flex: 1;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	border-radius: 8rpx;
}

.reset-btn {
	background-color: #f5f5f5;
	color: #666;
	border: 1rpx solid #ddd;
}
</style>