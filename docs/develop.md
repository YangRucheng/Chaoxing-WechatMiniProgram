# 部署教程

## 注意

本项目仅供学习使用, 请遵守相关法律法规

本文档默认您有基础的小程序开发经验

## 发布小程序

1. 到 [微信公众平台](https://mp.weixin.qq.com) 注册一个小程序

2. 填写小程序基本信息和类目, 完成小程序备案和微信认证

3. 将本项目下载到本地并导入开发者工具

4. 添加配置文件 `config.js` 到 `/api` 目录下, 复制以下内容

   > 请自行修改后端地址, 没有后端不影响主要功能

    ```js
    module.exports = {
        host: "后端地址",

        cdn: "https://cdn.jsdelivr.net/gh/YangRucheng/Chaoxing-WechatMiniProgram", // GitHub代理地址
        timeout: 5, // 登录超时时间
        swiperList: [
            "/static/swiper/1.jpg",
            "/static/swiper/2.jpg",
        ],
        notice: "欢迎大家使用小程序, 本小程序仅用于快捷签到, 请勿滥用, 谢谢合作！", // 公告
        products: [{
            'title': '青空校园服务',
            'img': '/static/image/友情推荐/青空.jpg',
            'appid': 'wx95b96403e1619df7',
        }]
    }
    ```

5. 安装 [TDesign 组件库](https://tdesign.tencent.com/miniprogram)

    [官方安装教程](https://tdesign.tencent.com/miniprogram/getting-started)

