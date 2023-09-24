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
            'vip': util.getStorage('vip', 0),
            'accountNum': util.getStorage('accounts', []).length,
            'uid': util.getStorage('uid', 'Guest') + 10000,
            'inviteNum': util.getStorage('inviteNum', 0),
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
})