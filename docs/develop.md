# 部署教程

## 注意

本项目仅供学习使用, 请遵守相关法律法规

## 发布小程序

1. 到 [微信公众平台](https://mp.weixin.qq.com) 注册一个小程序

2. 填写小程序基本信息和类目, 完成小程序备案

3. 将本项目下载到本地并导入开发者工具

4. 添加配置文件 `config.js` 到 `/api` 目录下, 复制以下内容

    ```js
    module.exports = {
        host: "http://127.0.0.1:8080",
        swiperList: [
            "https://tdesign.gtimg.com/miniprogram/images/swiper1.png",
            "https://tdesign.gtimg.com/miniprogram/images/swiper2.png",
            "https://tdesign.gtimg.com/miniprogram/images/swiper1.png",
            "https://tdesign.gtimg.com/miniprogram/images/swiper2.png",
        ],
        notice: "欢迎大家使用小程序, 本小程序仅用于快捷签到, 请勿滥用, 谢谢合作！", // 公告
        products: [{ // 
            'title': '青空校园服务',
            'img': '/static/image/友情推荐/青空.jpg',
            'appid': 'wx95b96403e1619df7',
        }],
    }
    ```

## 本地缓存

> 本项目将账号储存在本地, 未来也可能会考虑支持同步

```json
{
    "accounts": [], // 仅包含基本信息 (账号/ 密码/ 用户名)
    "cookies-13788888888": [], // cookies列表 (以手机号13788888888为例)
    "activeIndex": 0, // 当前登录的账号索引
    
    "history-13788888888": [], // 签到记录
    "vip": false, // 是否是 VIP 用户
    "userInfo": { // 微信用户基本数据
        "uid": 1,
        "token": "",
    }, 
}
```
