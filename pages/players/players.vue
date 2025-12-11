<template>
	<view class="container">
		<view class="header">
			<button class="add-btn" type="primary" @click="showAddPlayerModal">添加玩家</button>
		</view>

		<view class="players-list">
			<view v-if="players.length === 0" class="empty-tip">
				暂无玩家，请添加玩家开始记账
			</view>
			<view v-else>
				<view v-for="player in players" :key="player.id" class="player-item">
					<view class="player-info">
						<text class="player-name">{{ player.name }}</text>
						<text class="player-score">总分：{{ player.totalScore }}</text>
					</view>
					<view class="player-actions">
						<button class="edit-btn" size="mini" @click="editPlayer(player)">编辑</button>
						<button class="delete-btn" size="mini" type="warn" @click="deletePlayer(player.id)">删除</button>
					</view>
				</view>
			</view>
		</view>

		<view v-if="showModal" class="modal-mask" @click="closeModal">
			<view class="modal-content" @click.stop>
				<view class="modal-title">{{ isEdit ? '编辑玩家' : '添加玩家' }}</view>
				<input class="player-input" v-model="playerName" placeholder="请输入玩家姓名" />
				<view class="modal-buttons">
					<button class="cancel-btn" @click="closeModal">取消</button>
					<button class="confirm-btn" type="primary" @click="savePlayer">确定</button>
				</view>
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
			showModal: false,
			isEdit: false,
			playerName: '',
			editPlayerId: null
		}
	},

	onShow() {
		this.loadPlayers();
	},

	methods: {
		loadPlayers() {
			this.players = DataManager.getPlayers();
		},

		showAddPlayerModal() {
			if (this.players.length >= 8) {
				uni.showToast({
					title: '最多添加8位玩家',
					icon: 'none'
				});
				return;
			}
			this.isEdit = false;
			this.playerName = '';
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
				uni.showToast({
					title: '请输入玩家姓名',
					icon: 'none'
				});
				return;
			}

			if (this.isEdit) {
				const playerIndex = this.players.findIndex(p => p.id === this.editPlayerId);
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

			DataManager.savePlayers(this.players);
			this.closeModal();
			this.loadPlayers();

			uni.showToast({
				title: this.isEdit ? '修改成功' : '添加成功',
				icon: 'success'
			});
		},

		deletePlayer(playerId) {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除该玩家吗？',
				success: (res) => {
					if (res.confirm) {
						this.players = this.players.filter(p => p.id !== playerId);
						DataManager.savePlayers(this.players);
						this.loadPlayers();

						uni.showToast({
							title: '删除成功',
							icon: 'success'
						});
					}
				}
			});
		},

		closeModal() {
			this.showModal = false;
			this.playerName = '';
			this.editPlayerId = null;
		}
	}
}
</script>

<style>
.container {
	padding: 20rpx;
}

.header {
	margin-bottom: 30rpx;
}

.add-btn {
	width: 100%;
}

.players-list {
	background-color: #fff;
	border-radius: 10rpx;
	padding: 20rpx;
}

.empty-tip {
	text-align: center;
	color: #999;
	padding: 50rpx 0;
}

.player-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #eee;
}

.player-item:last-child {
	border-bottom: none;
}

.player-info {
	flex: 1;
}

.player-name {
	font-size: 32rpx;
	color: #333;
	margin-right: 20rpx;
}

.player-score {
	font-size: 28rpx;
	color: #666;
}

.player-actions {
	display: flex;
	gap: 20rpx;
}

.edit-btn, .delete-btn {
	min-width: 100rpx;
}

.modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 999;
}

.modal-content {
	background-color: #fff;
	padding: 40rpx;
	border-radius: 10rpx;
	width: 80%;
}

.modal-title {
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 30rpx;
	text-align: center;
}

.player-input {
	border: 1rpx solid #ddd;
	padding: 20rpx;
	border-radius: 5rpx;
	margin-bottom: 30rpx;
}

.modal-buttons {
	display: flex;
	justify-content: space-between;
	gap: 20rpx;
}

.cancel-btn, .confirm-btn {
	flex: 1;
}
</style>