import util from '../../../api/util';
import API from '../../../api/api';
import log from '../../../api/log';

Page({
    data: {
        swiperList: [
            "https://tdesign.gtimg.com/miniprogram/images/swiper1.png",
            "https://tdesign.gtimg.com/miniprogram/images/swiper2.png",
            "https://tdesign.gtimg.com/miniprogram/images/swiper1.png",
            "https://tdesign.gtimg.com/miniprogram/images/swiper2.png",
        ],
        img: 'https://tdesign.gtimg.com/miniprogram/images/example1.png',
        notice: "欢迎大家使用小程序, 本小程序仅用于快捷签到, 请勿滥用, 谢谢合作！", // 公告
        products: [{
            'title': '青空校园服务',
            'img': '/static/image/WechatIMG1325.jpg',
            'appid': 'wx95b96403e1619df7',
        }, {
            'title': '青空超级至尊校园服务',
            'img': '/static/image/WechatIMG1325.jpg',
            'appid': 'wx95b96403e1619df7',
        }, {
            'title': '青空宇宙无敌超级至尊校园服务',
            'img': '/static/image/WechatIMG1325.jpg',
            'appid': 'wx95b96403e1619df7',
        }, {
            'title': '青空',
            'img': '/static/image/WechatIMG1325.jpg',
            'appid': 'wx95b96403e1619df7',
        }],
        config: {
            'notice': {
                speed: 60,
                loop: -1,
                delay: 0,
            },
        }
    },

    onLoad(options) {
        this.setData({
            'history': util.getStorage('history', []),
        })
    },

    changeTabbar(e) { // 切换tabbar页面
        wx.switchTab({
            url: `/pages/tabbar-package/${e.detail.value}/${e.detail.value}`,
        })
    },

    navigate(e) { // 进入其他页面
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    },

    onShareAppMessage() { // 邀请用户
        const userInfo = util.getStorage('userInfo', {});
        return {
            title: '早八不迟到 ~',
            imageUrl: '',
            path: `/pages/tabbar-package/login/login?inviter=${userInfo.uid}`,
        }
    },

    toMiniProgram(e) { // 跳转其他小程序
        console.log("跳转其他小程序", e)
        wx.openEmbeddedMiniProgram({
            'appId': e.currentTarget.dataset.appid,
            'extraData': {},
        }).catch(e => {
            this.showInfo("用户取消打开小程序")
        })
    },

    showOfficial(e) { // 显示引导公众号
        this.setData({
            'showOfficial': true,
        })
    },

    lookImage(e) { // 查看图片
        wx.previewImage({
            urls: this.data.swiperList,
            current: this.data.swiperList[e.detail.index],
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