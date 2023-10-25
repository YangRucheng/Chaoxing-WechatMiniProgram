// app.js
App({
	onLaunch() {
		const updateManager = wx.getUpdateManager();
		updateManager.onUpdateReady(() => {
			wx.showModal({
				title: '更新提示',
				content: '新版本已准备好，即将重启应用',
				confirmText: '立即重启',
				showCancel: false,
			}).then(res => {
				if (res.confirm) {
					updateManager.applyUpdate();
				}
			})
		})
	},
})