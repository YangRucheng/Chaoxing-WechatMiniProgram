import util from '../../../api/util';
import API from '../../../api/api';
import log from '../../../api/log';
import config from '../../../api/config';

Page({
    data: {
        swiperList: [config.swiperList[Math.floor(Math.random() * config.swiperList.length)]],
        notice: config.notice, // 公告
        products: config.products,
        config: {
            'notice': {
                speed: 60,
                loop: -1,
                delay: 0,
            },
        }
    },

    onLoad(options) {
        this.login(options);

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

    login(options) { // 登录
        wx.login()
            .then(res => {
                this.showLoading("正在登录")
                util.post(`${config.host}/account/login`, {
                        'code': res.code,
                        'appid': util.info.miniProgram.appId,
                        'inviter': options.inviter ? options.inviter : 1, // 邀请者
                    })
                    .then(res => {
                        log.info(res)
                        if (res.status == 0) {
                            this.showInfo("登录成功")
                            util.setStorage('vip', res.data.vip);
                            util.setStorage('uid', res.data.uid);
                            util.setStorage('token', res.data.token);
                            util.setStorage('inviteNum', res.data.inviteNum);
                        } else
                            throw res.msg;
                    })
                    .catch(e => {
                        log.error("登录失败", e)
                        this.showInfo("登录失败")
                    })
                    .finally(() => {
                        this.hideLoading();
                        wx.switchTab({
                            url: '/pages/tabbar-package/home/home',
                        })
                    })
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