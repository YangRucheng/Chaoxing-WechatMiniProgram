import util from '../../../api/util';
import API from '../../../api/api';
import log from '../../../api/log';
import config from '../../../api/config';


Page({
    data: {
        results: [], // 签到结果
    },

    onLoad(options) {
        // 
        (async () => {
            const accounts = util.getStorage('accounts', []);
            if (accounts.length == 0) {
                this.showInfo('请先绑定账号!');
                wx.redirectTo({
                    url: '/pages/user-package/bind/bind',
                })
                return;
            }

            const location = await wx.getLocation();
            const qrcode = await wx.scanCode();
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
            const longitude = location.longitude + 0.0065; // 家人们谁懂啊, 学习通定位有偏差
            const latitude = location.latitude + 0.0060;

            accounts.forEach(async account => {
                this.showLoading("请稍候...")
                const api = new API(account.username, account.password);
                const html = await api.beforeSign(activeId, null, null);
                const res = await api.defaultSign(activeId, null, longitude, latitude, null, null, null, enc);
                this.setData({
                    results: this.data.results.concat([Object.assign(account, {
                        'result': res
                    })]),
                })
                console.log(this.data.results)
                this.hideLoading();
                this.showInfo(`${account.nickname}\n${res}`);
            })
        })();
    },

    showLoading(msg) {
        wx.showLoading({
            title: msg,
            mask: true,
        })
    },

    hideLoading() {
        wx.hideLoading({
            noConflict: true,
        });
    },

    showInfo(msg, icon = "none") {
        wx.showToast({
            title: msg,
            mask: true,
            icon: icon,
        })
    },
})