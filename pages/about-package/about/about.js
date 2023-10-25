const author = [{
    'name': 'YangRucheng',
    'email': 'sakana@yangrucheng.top',
    'weight': 3, // 权重, 越高靠前概率越高
}, {
    'name': 'Lanqi',
    'email': 'sike@idceo.cn',
    'weight': 1, // 权重, 越高靠前概率越高
}]

Page({
    data: {
        author: [],
        uid: -1,

        clickCount: 0, // 点击次数
        timer: null, // 定时器
        animation: '', // 动画类
    },

    onLoad(options) {
        this.data.uid = options.uid;
    },

    onShow() {
        this.sortAuthor();
    },

    sortAuthor() { // 作者排序
        const rawAuthor = JSON.stringify(author);
        while (rawAuthor == JSON.stringify(author)) {
            author.sort((a, b) => Math.random() * b.weight - Math.random() * a.weight);
        }
        this.setData({
            'author': author,
        })
    },

    click() { // 点击Logo
        this.sortAuthor();
        this.setData({
            'animation': 'rotate-center',
            'clickCount': this.data.clickCount + 1,
        })
        if (this.data.timer != null)
            clearTimeout(this.data.timer);
        this.data.timer = setTimeout(() => {
            this.setData({
                'animation': '',
                'clickCount': 0,
            })
        }, 3000)
        if (this.data.clickCount >= 6) { // 点击6次及以上
            wx.setClipboardData({
                data: `UID: ${this.data.uid}`,
            });
            wx.clearStorageSync();
            return;
        }
        if (this.data.clickCount >= 3) { // 点击3次以上
            wx.showToast({
                title: `还差${6-this.data.clickCount}步即可复制UID`,
                icon: 'none'
            })
            return;
        }
    },
})