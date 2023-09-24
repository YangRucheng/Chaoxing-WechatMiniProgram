import util from '../../../api/util';
import API from '../../../api/api';
import log from '../../../api/log';
import config from '../../../api/config';


Page({
    data: {
        account: [],
        activeIndex: 0,

        nicknameValue: '',
        usernameValue: '',
        passwordValue: '',
    },

    input(e) { // 输入绑定
        const key = e.currentTarget.dataset.key;
        this.setData({
            [`${key}Value`]: e.detail.value,
        })
    },

    login(e) { // 添加账号
        const nickname = this.data.nicknameValue;
        const username = this.data.usernameValue;
        const password = this.data.passwordValue;
        const that = this;
        log.info("登录", nickname, username, password)
        if (username == "") {
            this.showInfo("手机号不能为空!")
            return;
        }
        if (password == "") {
            this.showInfo("密码不能为空!")
            return;
        }
        if (that.data.account.some(item => item.username == username)) {
            this.showInfo("账号不能重复!")
            return;
        }

        const api = new API(username, password);
        this.showLoading("正在登录...")
        api.login()
            .then(res => {
                this.showInfo(res.mes);
                if (res.status) {
                    const account = that.data.account.concat([{
                        'username': username,
                        'password': password,
                        'uid': res.cookies.UID,
                        'nickname': nickname ? nickname : username,
                    }]);
                    that.setData({
                        'account': account,
                        'usernameValue': '',
                        'passwordValue': '',
                        'nicknameValue': '',
                    })
                    util.setStorage('accounts', account);
                    util.setStorage('activeIndex', that.data.account.length - 1);
                    this.uploadAccounts(account);
                }
            })
            .catch(e => {
                this.showInfo("网络不稳定 请稍后重试");
            })
            .finally(() => {
                wx.hideLoading();
            })
    },

    uploadAccounts(accounts) { // 同步账号数据
        util.post(`${config.host}/account/sync`, {
                'token': util.getStorage('token'),
                'accounts': accounts,
            })
            .then(res => {
                log.info(res);
            })
            .catch(e => {
                log.error(e)
            })
    },

    changeAccount(e) { // 切换当前账号
        const index = e.currentTarget.dataset.index;
        this.setData({
            'activeIndex': index,
        });
        util.setStorage('activeIndex', index);
    },

    changeNick(e) { // 修改账号备注
        const index = e.currentTarget.dataset.index;
        const account = this.data.account;
        wx.showModal({
                title: '修改账号备注',
                content: account[index].nickname,
                editable: true,
            })
            .then(res => {
                if (res.confirm) {
                    account[index].nickname = res.content;
                    util.setStorage('accounts', account);
                    this.setData({
                        account: account,
                    })
                }
            })
    },

    logout(e) { // 退出登录
        const index = e.currentTarget.dataset.index;
        const activeIndex = this.data.activeIndex;
        const account = this.data.account;
        wx.showModal({
            title: '确认退出登录吗?',
            content: `即将退出账号${account[index].nickname}`,
        }).then(res => {
            if (!res.confirm)
                return;
            if (account.length == 1) { // 只有一个账号
                this.setData({
                    'account': [],
                })
                util.setStorage('accounts', []);
                return;
            }
            if (index == activeIndex) { // 删除当前登录的账号
                this.showInfo("请先切换到其他账号")
                return;
            }
            if (index < activeIndex) { // 删除前面的账号
                account.splice(index, 1);
                this.setData({
                    'account': account,
                    'activeIndex': activeIndex - 1,
                })
                util.setStorage('activeIndex', activeIndex - 1);
                util.setStorage('accounts', account);
                return;
            }
            if (index > activeIndex) { // 删除后面的账号
                account.splice(index, 1);
                this.setData({
                    'account': account,
                })
                util.setStorage('accounts', account);
                return;
            }
        })
    },

    onLoad(options) {
        this.setData({
            'vip': util.getStorage('vip', false),
            'type': options.type != undefined ? options.type : '',
            'usernameValue': options.username != undefined ? options.username : '',
            'passwordValue': options.password != undefined ? options.password : '',
        });
    },

    onShow() {
        this.setData({
            'account': util.getStorage('accounts', []),
            'activeIndex': util.getStorage('activeIndex', 0),
        });
    },

    onShareAppMessage() {
        const nickname = this.data.nicknameValue;
        const username = this.data.usernameValue;
        const password = this.data.passwordValue;
        if (password.includes('=') || password.includes('&')) {
            this.showInfo("密码中含有不支持的符号!")
            throw "密码中含有不支持的符号";
        }
        if (password == '' || username == '') {
            this.showInfo("手机号或密码为空!")
            throw "手机号或密码为空";
        }
        return {
            title: '快速添加我的账号',
            imageUrl: '',
            path: `/pages/user-package/bind/bind?username=${username}&password=${password}&nickname=${nickname}&type=share`,
        }
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