import util from '../../../api/util';
import API from '../../../api/api';

Page({
    data: {
        courses: [],
        account: {},
    },

    onLoad(options) {
        const accounts = util.getStorage('accounts', []);
        const activeIndex = util.getStorage('activeIndex', -1);
        if (accounts.length == 0) {
            util.showInfo('请先绑定账号!');
            wx.redirectTo({
                url: '/pages/user-package/bind/bind',
            })
            return;
        }
        const account = accounts[activeIndex];
        const api = new API(account.username, account.password);
        api.getCourse()
            .then(courses => {
                this.setData({
                    'courses': courses,
                    'account': account,
                })
            })
            .finally(() => {
                util.showInfo("获取课程成功")
            })
    },

    onPullDownRefresh() { // 刷新
        wx.showModal({
                title: '确认重新获取课程吗?',
                content: '获取次数过多可能造成风控',
            })
            .then(res => {
                if (res.confirm) {
                    this.onLoad();
                }
            })
    },

    navigate(e) { // 进入活动列表页面
        const account = this.data.account;
        const classId = e.currentTarget.dataset.classid;
        const courseId = e.currentTarget.dataset.courseid;
        const courseName = e.currentTarget.dataset.coursename;
        wx.navigateTo({
            url: `/pages/xxt-package/activity/activity?username=${account.username}&password=${account.password}&classId=${classId}&courseId=${courseId}&uid=${account.uid}&courseName=${courseName}`,
        })
    },
})