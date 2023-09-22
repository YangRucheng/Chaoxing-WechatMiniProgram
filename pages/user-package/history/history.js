import util from '../../../api/util';

const typeConfig = ["拍照签到", "普通签到", "二维码签到", "手势签到", "位置签到", "签到码签到"];


Page({
    data: {
        history: [],
        typeConfig: typeConfig,
    },

    onShow() {
        console.log(util.getStorage('history', []))
        this.setData({
            'history': util.getStorage('history', []),
        })
    },
})