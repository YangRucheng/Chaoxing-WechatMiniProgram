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
        util.post(`${config.host}/account/vip`, {
                'key': this.data.keyInput,
                'token': util.getStorage('token', 'no-token'),
            })
            .then(res => {
                util.showInfo(res.msg)
                log.info(res)
                if (res.status == 0)
                    util.setStorage('vip', res.data.vip);
            })
            .catch(e => {
                util.showInfo("网络拥挤 请稍后重试");
                log.error(e);
            })
    },
})