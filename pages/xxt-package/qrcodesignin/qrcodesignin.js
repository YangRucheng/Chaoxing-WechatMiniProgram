import util from '../../../api/util';
import API from '../../../api/api';
import log from '../../../api/log';
import config from '../../../api/config';


Page({
	data: {
		results: [], // 签到结果
		location: {}, // 签到位置
	},

	onLoad(options) {
		(async () => {
			const accounts = util.getStorage('accounts', []);
			if (accounts.length == 0) {
				util.showInfo('请先绑定账号!');
				wx.redirectTo({
					url: '/pages/user-package/bind/bind',
				})
				return;
			}

			wx.getLocation()
				.then(res => {
					this.setData({
						'location': res,
						'showSetting': false,
					})
					wx.scanCode()
						.then(qrcode => {
							log.info("扫码结果", qrcode)
							let params = {};
							qrcode.result.split('?')[1].split('&').forEach(param => {
								const parts = param.split('=');
								const key = decodeURIComponent(parts[0]);
								const value = decodeURIComponent(parts[1]);
								params[key] = value;
							});
							const enc = params.enc;
							const activeId = params.id;
							const longitude = this.data.location.longitude + 0.0065; // 家人们谁懂啊, 学习通定位有偏差
							const latitude = this.data.location.latitude + 0.0060;

							accounts.forEach(async account => {
								util.showLoading("请稍候...")
								const api = new API(account.username, account.password);
								const html = await api.beforeSign(activeId, null, null);
								const res = await api.defaultSign(activeId, null, longitude, latitude, null, null, null, enc);
								this.setData({
									results: this.data.results.concat([Object.assign(account, {
										'result': res
									})]),
								})
								const info = await api.getActivityInfo(activeId);
								console.log(info, this.data.results)
								util.hideLoading();
								util.showInfo(`${account.nickname}\n${res}`);

								let history = util.getStorage('history', []);
								history = [...history, {
									'username': account.username,
									'paasword': account.password,
									'activeId': activeId,
								}];
								util.setStorage('history', history);
							})
						})
						.catch(e => {
							util.showInfo("扫码失败")
						})
				})
				.catch(e => {
					util.showInfo("用户拒绝定位")
					this.setData({
						'showSetting': true,
					})
				})
		})();
	},

	input(e) { // 输入内容
		this.setData({
			[`${e.currentTarget.dataset.input}`]: e.detail.value,
		})
	},
})