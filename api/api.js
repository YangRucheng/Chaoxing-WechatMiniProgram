const util = require('./util.js');
const log = require('./log.js');

class API {
    constructor(username = "", password = "") {
        this.cookies = util.getStorage(`cookies-${username}`, {});
        this.uid = "";
        this.username = username;
        this.password = password;
        if (this.cookies == {}) {
            this.login();
        }
    }

    /**
     * 登录
     */
    login = async () => {
        wx.showLoading({
            title: '正在登录...',
            mask: true,
        })
        const account = await util.get('https://passport2-api.chaoxing.com/v11/loginregister', {
            "cx_xxt_passport": "json",
            "roleSelect": "true",
            "uname": this.username,
            "code": this.password,
            "loginType": "1",
        })
        wx.hideLoading({
            noConflict: true,
        })
        console.log("登录", account);
        Object.assign(this.cookies, account.cookies);
        this.uid = this.cookies.UID != undefined ? this.cookies.UID : this.cookies._uid;
        util.setStorage(`cookies-${this.username}`, this.cookies);
        return account;
    }

    /**
     * 获取课程
     */
    getCourse = async () => {
        const url = 'https://mooc1-api.chaoxing.com/mycourse/backclazzdata';
        const res = await util.get(url, {
            'view': 'json',
            'rss': '1',
        }, this.cookies)
        Object.assign(this.cookies, res.cookies);
        var data = res.channelList.filter(item => {
            return item.cataName == '课程' && item.content.course != undefined;
        });
        var data = data.map(item => {
            return {
                '课程': item.content.course.data[0].name,
                '班级': item.content.name,
                '教师': item.content.course.data[0].teacherfactor,
                'courseName': item.content.course.data[0].name,
                'courseId': item.content.course.data[0].id,
                'classId': item.key,
                'isShow': item.cfid == -1, // 是否在文件夹内
                'img': item.content.course.data[0].imageurl,
                'school': item.content.course.data[0].schools,
            };
        });
        data.sort((a, b) => b.isShow - a.isShow);
        console.log("获取课程", res, data)
        return data;
    }

    /**
     * 获取活动
     * @param {*} courseId 
     * @param {*} classId 
     */
    getActivity = async (courseId, classId) => {
        const url = 'https://mobilelearn.chaoxing.com/v2/apis/active/student/activelist'
        const res = await util.get(url, {
            'fid': '0',
            'courseId': courseId,
            'classId': classId,
            'showNotStartedActive': '0',
        }, this.cookies)
        Object.assign(this.cookies, res.cookies);
        var data = res['data']['activeList'];
        var data = data.map(item => {
            return {
                'type': Number(item.otherId),
                'name': item.nameOne,
                'time': item.nameFour ? item.nameFour : '无',
                'activeId': item.id,
                'courseId': courseId,
                'classId': classId,
                'img': item.logo,
                'isExpire': item.endTime < (new Date().getTime()),
            };
        });
        var data = data.filter(item => {
            return 0 <= item.type && item.type <= 5;
        })
        console.log("获取活动", res, data)
        return data.slice(0, 50);
    }

    /**
     * 预签到
     * @param {*} activeId 
     * @param {*} courseId 
     * @param {*} classId 
     */
    beforeSign = async (activeId, courseId, classId) => {
        const url = 'https://mobilelearn.chaoxing.com/newsign/preSign'
        const res = await util.getText(url, {
            'activePrimaryId': activeId,
            'courseId': courseId,
            'classId': classId,
            'uid': this.uid,
            'appType': '15',
            'general': '1',
            'sys': '1',
            'ls': '1',
            'tid': '',
            'ut': 's',
        }, this.cookies)
        console.log("预签到, 访问签到页面")
        return res;
    }

    /**
     * 普通签到
     * @param {*} activeId 
     * @param {*} objectId  上传的图片的ID
     * 
     * @param {*} longitude 
     * @param {*} latitude 
     * @param {*} addressText 
     * 
     * @param {*} signCode 签到码
     * @param {*} role 手势
     * 
     * @param {*} enc 
     */
    defaultSign = async (activeId, objectId=null, longitude = null, latitude = null, addressText = null, signCode = null, role = null, enc = null) => {
        const url = 'https://mobilelearn.chaoxing.com/pptSign/stuSignajax'
        const res = await util.getText(url, {
            'activeId': activeId,
            'objectId': objectId,

            'longitude': longitude,
            'latitude': latitude,
            'address': addressText,

            'signCode': signCode,
            'appType': '15',
            'ifTiJiao': '1',
            'role': role,
            'enc': enc,
            'fid': '0',
        }, this.cookies)
        console.log("默认签到/图片签到", res);
        return res;
    }
    
    /**
     * 获取超星云盘token
     */
    getToken = async () => {
        const url = 'https://pan-yz.chaoxing.com/api/token/uservalid';
        const res = await util.get(url, {}, this.cookies);
        return res._token;
    }

    /**
     * 获取账号信息
     */
    getUserInfo = async () => {
        let name = '',
            sex = '',
            phone = '',
            avatar = '',
            numberCard = '',
            school = '';

        const url = 'http://passport2.chaoxing.com/mooc/accountManage'
        const html = await util.getText(url, {}, this.cookies)

        let nameReg = /id="messageName">(.*?)<\/p>/mi
        if (nameReg.test(html))
            name = nameReg.exec(html)[1]

        let phoneReg = /id="messagePhone">((\+?0?86\-?)?1[3-9]\d{9})<\/span>/mi
        if (phoneReg.test(html))
            phone = phoneReg.exec(html)[1]

        let numberCardReg = /xuehao.*?:(\d+)<\/p>/mi
        if (numberCardReg.test(html))
            numberCard = numberCardReg.exec(html)[1]

        let avatarReg = /"(http:\/\/photo.chaoxing.com\/p\/.*?)"/mi
        if (avatarReg.test(html))
            avatar = avatarReg.exec(html)[1]

        let schoolReg = /<ul class="listCon" id="messageFid">\s+<li> (\S+)/mi
        if (schoolReg.test(html))
            school = schoolReg.exec(html)[1]

        let sexReg = /checked"\s*?value="\d{1}"><\/i>(男|女|male|female)\s*<\/span>/mi
        if (sexReg.test(html))
            sex = sexReg.exec(html)[1]

        const entity = {
            'name': name.trim(),
            'sex': sex.trim().replace('female', '女').replace('male', '男'),
            'phone': phone.trim(),
            'numberCard': numberCard.trim(),
            'avatar': avatar.trim(),
            'school': school.trim()
        }

        console.log("UserEntity", entity)
        return;
    }

}

module.exports = API;