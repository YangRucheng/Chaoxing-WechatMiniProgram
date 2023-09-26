import util from '../../../api/util';
import API from '../../../api/api';
import log from '../../../api/log';
import config from '../../../api/config';
import LZString from '../../../api/lz-string.min';

const typeConfig = ["拍照签到", "普通签到", "二维码签到", "手势签到", "位置签到", "签到码签到"];

Page({
    data: {
        data: {}, // 签到活动信息
        fileList: [], // 本地图片链接
        srcList: [], // 图片链接
        notice: "", // 通知栏

        config: {
            'notice': {
                speed: 60,
                loop: -1,
                delay: 0,
            },
            'typeConfig': typeConfig,
        },
        location: {
            latitude: '',
            longitude: '',
            addressText: '湘潭大学',
            id: 666,
        },
        html: "", // 预签到 HTML
        showChooseType: false, // 是否显示手动选择类型
        debugNum: 0, // 进入 debug 模式点击次数
        pickerList: typeConfig.map((item, index) => {
            return {
                'label': item,
                'value': index,
            }
        }),
    },

    onPicker(e) { // 点击选择器
        this.setData({
            'pickerVisible': true,
        })
    },

    pickerChange(e) { // 选择器修改
        this.setData({
            ['data.type']: e.detail.value[0],
        })
    },

    onLoad(options) {
        const data = JSON.parse(LZString.decompressFromBase64(options.data));
        console.log("活动内容", data, options)
        const type = options.type != undefined ? options.type : '';
        (async () => {
            wx.showLoading({
                title: '正在加载...',
            })
            wx.setNavigationBarTitle({
                title: typeConfig[data.type],
            })
            const api = new API(data.username, data.password);
            this.setData({
                'notice': type == 'help' ? `你正在为用户${data.username}代签!` : config.notice,
                'data': data,
                'rawBase64': options.data,
                'type': type,
                'vip': util.getStorage('vip', false),
            })
            if (options.type == 'help') {
                await api.login();
            }
            this.data.token = data.type == 0 ? await api.getToken() : '';
            wx.hideLoading();
            const html = await api.beforeSign(data.activeId, data.courseId, data.classId);
            this.data.html = html;
            // console.log(html);
        })();
    },

    signin(e) { // 签到
        const data = this.data.data;
        const objectId = this.data.srcList.length != 0 ? this.data.srcList[0] : 0;
        const api = new API(data.username, data.password);
        const type = e.currentTarget.dataset.type;
        const vip = util.getStorage('vip');

        (async () => {
            let res = "";
            switch (type) {
                case "picture": { // 图片/普通
                    if (objectId == 0) {
                        const ok = await wx.showModal({
                            title: '确认直接签到吗?',
                            content: '你还没有上传图片',
                        })
                        if (ok.confirm != true)
                            break;
                    }
                    res = await api.defaultSign(data.activeId, objectId);
                    break;
                }
                case "code": { // 签到码/手势
                    res = await api.defaultSign(data.activeId, null, null, null, null, this.data.signCode, null, null);
                    break;
                }
                case "position": { // 位置
                    const location = this.data.location;
                    const longitude = location.longitude + (!vip ? 0.0065 : 0); // 家人们谁懂啊, 学习通定位有偏差
                    const latitude = location.latitude + (!vip ? 0.0060 : 0);
                    res = await api.defaultSign(data.activeId, null, longitude, latitude, location.addressText, null, null, null);
                    break;
                }
                case "qrcode": { // 二维码
                    const qrcode = await wx.scanCode();
                    console.log("扫码结果", qrcode)
                    let params = {};
                    qrcode.result.split('?')[1].split('&').forEach(function (param) {
                        const parts = param.split('=');
                        const key = decodeURIComponent(parts[0]);
                        const value = decodeURIComponent(parts[1]);
                        params[key] = value;
                    });
                    const enc = params.enc;
                    const location = this.data.location;
                    const longitude = location.longitude + (!vip ? 0.0065 : 0); // 家人们谁懂啊, 学习通定位有偏差
                    const latitude = location.latitude + (!vip ? 0.0060 : 0);
                    res = await api.defaultSign(data.activeId, null, longitude, latitude, location.addressText, null, null, enc);
                    break;
                }
            }
            this.showInfo(res);
            if (res == 'success' || res == 'success1' || res == 'success2')
                this.setHistory();
        })();
    },

    chooseLocation() { // 选择位置
        wx.chooseLocation()
            .then(res => {
                this.setData({
                    'location': Object.assign(this.data.location, res),
                })
            })
            .catch(e => {
                this.showInfo("取消位置选择")
            })
    },

    autoGetLocation() { // 自动获取位置信息
        const html = this.data.html;
        const token = util.getStorage('token', 'no-token');
        this.showLoading("正在解析签到位置")
        util.post(`${config.host}/signin/getLocation`, {
                'html': html,
                'token': token,
            })
            .then(res => {
                log.info(res);
                if (res.status != 0)
                    throw "解析失败 请手动获取";
                this.showInfo(res.msg);
                this.setData({
                    'location': Object.assign(this.data.location, res.data.location),
                })
            })
            .catch(e => {
                log.error(e);
                this.showInfo(e);
                this.setData({
                    'vip': false,
                })
            })
            .finally(() => {
                this.hideLoading();
            })
    },

    input(e) { // 输入内容
        this.setData({
            [`${e.currentTarget.dataset.input}`]: e.detail.value,
        })
    },

    setHistory() { // 写入签到记录
        let history = util.getStorage(`history-${this.data.data.username}`, []);
        history = [...history, ...[this.data.data]];
        util.setStorage(`history-${this.data.data.username}`, history);
    },

    handleAdd(e) {
        const files = e.detail.files;
        files.forEach(file => this.onUpload(file))
    },
    onUpload(file) {
        const token = this.data.token;
        const fileList = this.data.fileList;
        const data = this.data.data;

        this.setData({
            fileList: [...fileList, {
                ...file,
                status: 'loading'
            }],
        });
        const length = fileList.length;

        const task = wx.uploadFile({
            url: `https://pan-yz.chaoxing.com/upload?_token=${token}`,
            filePath: file.url,
            name: 'file',
            formData: {
                'puid': data.uid
            },
            success: (res) => {
                const data = JSON.parse(res.data);
                console.log("图片上传成功", data)
                this.setData({
                    [`fileList[${length}].status`]: 'done',
                    'srcList': [data.objectId],
                });
            },
        });
        task.onProgressUpdate((res) => {
            this.setData({
                [`fileList[${length}].percent`]: res.progress,
            });
        });
    },
    handleRemove(e) {
        this.setData({
            'fileList': [],
            'srcList': [],
        });
    },

    rotateFn(e) { // 卡片翻面
        this.debug();
        const id = e.currentTarget.dataset.id
        this.animation_main = wx.createAnimation({
            duration: 400,
            timingFunction: 'linear'
        })
        this.animation_back = wx.createAnimation({
            duration: 400,
            timingFunction: 'linear'
        })

        if (id == 1) { // 点击正面
            this.animation_main.rotateY(180).step()
            this.animation_back.rotateY(0).step()
            this.setData({
                animationMain: this.animation_main.export(),
                animationBack: this.animation_back.export(),
            })
        } else { // 点击背面
            this.animation_main.rotateY(0).step()
            this.animation_back.rotateY(-180).step()
            this.setData({
                animationMain: this.animation_main.export(),
                animationBack: this.animation_back.export(),
            })
        }
    },

    debug() { // DEBUG
        if (this.data.debugNum >= 5) {
            this.setData({
                'showChooseType': true,
            })
        } else {
            this.data.debugNum += 1;
        }
    },

    onShareAppMessage() { // 分享
        const data = this.data.rawBase64.replace('=', '');
        console.log("请求代签", `data=${data}`)
        return {
            title: '请帮我签到',
            imageUrl: this.data.data.img,
            path: `/pages/xxt-package/signin/signin?type=help&data=${data}`
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