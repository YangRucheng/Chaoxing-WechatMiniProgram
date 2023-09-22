Page({
    data: {
        notice: [], // 通知列表
    },

    onLoad(options) {

    },


    changeTabbar(e) { // 切换tabbar页面
        wx.switchTab({
            url: `/pages/tabbar-package/${e.detail.value}/${e.detail.value}`,
        })
    },
})