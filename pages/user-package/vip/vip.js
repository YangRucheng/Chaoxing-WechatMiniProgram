import util from '../../../api/util';
import API from '../../../api/api';
import log from '../../../api/log';
import config from '../../../api/config';


Page({
    data: {
        keyInput: "",
    },

    input(e) {
        this.setData({
            'keyInput': e.detail.value,
        })
    },

    activation() { // 激活
        this.showLoading("请稍候")
        util.post(`${config.host}/account/vip`, {
                'key': this.data.keyInput,
                'token': util.getStorage('token', 'no-token'),
            })
            .then(res => {
                this.showInfo(res.msg)
                log.info(res)
                if (res.status == 0)
                    util.setStorage('vip', res.data.vip);
            })
            .catch(e => {
                this.showInfo("网络拥挤 请稍后重试");
                log.error(e);
            })
            .finally(() => {
                this.hideLoading();
            })
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