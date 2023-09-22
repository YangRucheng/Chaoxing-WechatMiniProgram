import util from '../../../api/util';
import API from '../../../api/api';

Page({

    data: {
        img: 'https://tdesign.gtimg.com/miniprogram/images/example1.png',

        userInfo: {},
    },

    navigate(e) { // 进入其他页面
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    },

    changeTabbar(e) { // 切换tabbar页面
        wx.switchTab({
            url: `/pages/tabbar-package/${e.detail.value}/${e.detail.value}`,
        })
    },

    onShow() {
        const accounts = util.getStorage('accounts', []);
        const activeIndex = util.getStorage('activeIndex', 0);
        this.setData({
            'userInfo': accounts[activeIndex],
        })
    },
})