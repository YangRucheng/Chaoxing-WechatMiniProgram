import util from '../../../api/util';
import API from '../../../api/api';
import log from '../../../api/log';
import config from '../../../api/config';

Page({
    data: {
        swiperList: [`${config.cdn}${config.swiperList[Math.floor(Math.random() * config.swiperList.length)]}`],
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
    },

    login(options) { // 登录
        wx.login()
            .then(res => {
                util.post(`${config.host}/account/login`, {
                        'code': res.code,
                        'appid': util.info.miniProgram.appId,
                        'inviter': options.inviter ? options.inviter : 1, // 邀请者
                    }, {}, config.timeout * 1000)
                    .then(res => {
                        log.info(res)
                        if (res.status == 0) {
                            util.showInfo("登录成功")
                            util.setStorage('vip', res.data.vip);
                            util.setStorage('uid', res.data.uid);
                            util.setStorage('token', res.data.token);
                            util.setStorage('inviteNum', res.data.inviteNum);
                        } else
                            throw res.msg;
                    })
                    .catch(e => {
                        log.error("登录失败", e)
                        util.showInfo("登录失败\n不影响签到")
                    })
                    .finally(() => {
                        wx.switchTab({
                            url: '/pages/tabbar-package/home/home',
                        })
                    })
            })
    },
})