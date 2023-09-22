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

    onShareAppMessage() {
        return {
            title: '测试',
            imageUrl: '',
            path: '/pages/tabbar-package/login/login',
        }
    },

    toMiniProgram(e) {
        console.log("跳转其他小程序", e)
        wx.navigateToMiniProgram({
            'appId': e.currentTarget.dataset.appid,
        })
    },
})