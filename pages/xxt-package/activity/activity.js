import util from '../../../api/util';
import API from '../../../api/api';
import LZString from '../../../api/lz-string.min';

Page({
    data: {
        activities: [],
    },

    onLoad(options) {
        const uid = options.uid;
        const username = options.username;
        const password = options.password;
        const classId = options.classId;
        const courseId = options.courseId;
        const courseName = options.courseName;
        const api = new API(username, password);
        api.getActivity(courseId, classId).then(activities => {
            this.setData({
                'uid': uid,
                'activities': activities,
                'username': username,
                'password': password,
                'options': options,
            })
        }).finally(() => {
            wx.setNavigationBarTitle({
                title: `活动列表 - ${courseName}`,
            })
            wx.hideLoading();
        })
    },

    navigate(e) {
        const username = this.data.username;
        const password = this.data.password;
        const uid = this.data.uid;
        const index = e.currentTarget.dataset.index;
        const allData = JSON.stringify(Object.assign(
            this.data.activities[index], {
                'username': username,
                'password': password,
                'uid': uid,
            }));
        const compress = LZString.compressToBase64(allData)
        const url = `/pages/xxt-package/signin/signin?data=${compress}`;
        wx.navigateTo({
            url: url,
        })
    },

    onPullDownRefresh() {
        this.onLoad(this.data.options);
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