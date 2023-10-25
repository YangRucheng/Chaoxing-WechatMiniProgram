// 此文件封装 GET / POST 方法

/**
 * GET请求
 * @param {string} url 
 * @param {object} data 
 * @param {object} cookies
 */
const get = (url, data = {}, cookies = {}, timeout = 15000) => {
	return new Promise((resolve, reject) => {
		wx.request({
			method: "GET",
			url: url,
			data: data,
			timeout: timeout,
			header: {
				'content-type': 'application/json',
				'cookie': stringifyCookie(cookies),
			},
			success(res) {
				resolve(Object.assign(res.data, {
					'cookies': parseCookie(res.cookies)
				}));
			},
			fail(err) {
				reject(err)
			}
		})
	})
}


/**
 * POST请求
 * @param {string} url 
 * @param {object} data 
 * @param {object} cookies
 */
const post = (url, data = {}, cookies = {}, timeout = 15000) => {
	return new Promise((resolve, reject) => {
		wx.showLoading({
			title: '请稍候',
			mask: true,
		})
		wx.request({
			method: "POST",
			url: url,
			data: data,
			timeout: timeout,
			header: {
				'content-type': 'application/json',
				'cookie': stringifyCookie(cookies),
			},
			success(res) {
				resolve(Object.assign(res.data, {
					'cookies': parseCookie(res.cookies)
				}));
			},
			fail(err) {
				reject(err)
			}
		})
	})
}

/**
 * GET网页请求
 * @param {string} url 
 * @param {object} data 
 * @param {object} cookies
 */
const getText = (url, data = {}, cookies = {}) => {
	return new Promise((resolve, reject) => {
		wx.request({
			method: "GET",
			url: url,
			data: data,
			header: {
				'cookie': stringifyCookie(cookies),
			},
			success(res) {
				resolve(res.data);
			},
			fail(err) {
				reject(err)
			}
		})
	})
}

/**
 * 上传文件
 * @param {string} url
 * @param {string} filePath
 * @param {object} formData
 * @param {object} cookies
 */
const uploadFile = (url, filePath, formData = {}, cookies = {}) => {
	return new Promise((resolve, reject) => {
		wx.uploadFile({
			url: url,
			filePath: filePath,
			name: 'file',
			formData: formData,
			header: {
				'cookie': stringifyCookie(cookies),
			},
			success(res) {
				const data = JSON.parse(res.data);
				console.log("上传文件", data);
				resolve(data);
			},
			fail(err) {
				reject(err)
			}
		})
	})
}

/**
 * 延时函数
 * @param {number} seconds 秒
 */
const delay = (seconds) => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, seconds * 1000);
	});
}

/**
 * 解析返回的cookies
 * @param {string[]} cookieList wx.request返回的cookies列表
 */
const parseCookie = (cookieList = []) => {
	let cookies = {};
	for (let i = 0; i < cookieList.length; i++) {
		const parts = cookieList[i].split(';');
		const nameValue = parts[0].split('=');
		const name = nameValue[0].trim();
		const value = decodeURIComponent(nameValue[1]);
		cookies[name] = value;
	}
	return cookies;
}

/**
 * 把cookies列表编码成header中的格式
 * @param {string[]} cookieObject 编码cookies
 */
const stringifyCookie = (cookieObject = {}) => {
	return Object.entries(cookieObject).map(
		([name, value]) => `${name}=${encodeURIComponent(value)}`).join(';');
}

var cache = {};

/**
 * 写入缓存
 * @param {string} key 
 * @param {object} value 
 */
const setStorage = (key, value) => {
	Object.assign(cache, {
		[key]: value,
	})
	wx.setStorageSync(key, value)
}

/**
 * 读取缓存
 * 未来可能实现多设备缓存同步
 * @param {string} key 
 * @param {*} defaultValue
 */
const getStorage = (key, defaultValue = null) => {
	if (cache[key] != undefined)
		return cache[key];
	const value = wx.getStorageSync(key);
	if (value === '')
		return defaultValue;
	return value;
}

const showLoading = (msg) => {
	wx.showLoading({
		title: msg,
		mask: true,
	})
}

const hideLoading = () => {
	wx.hideLoading({
		noConflict: true,
	});
}

const showInfo = (msg, icon = "none", mask = false) => {
	wx.showToast({
		title: msg,
		mask: mask,
		icon: icon,
	})
}

module.exports = {
	get,
	post,
	delay,
	getText,
	uploadFile,
	setStorage,
	getStorage,
	info: wx.getAccountInfoSync(),
	showLoading,
	hideLoading,
	showInfo,
}