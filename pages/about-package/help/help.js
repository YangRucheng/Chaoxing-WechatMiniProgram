const help = [{
    'question': "如何绑定账号?",
    'answer': "点击首页的『互助签到』, 或者在用户页点击头像, 进入账号绑定页面。也可以点击他人分享的链接, 快速绑定好友账号! ",
}, {
    'question': "怎么反馈小程序的BUG?",
    'answer': "可以通过用户页的『意见反馈』, 也可以直接发邮件到『feedback@yangrucheng.top』, 非常感谢您对我们的支持! ",
}, {
    'question': "普通用户有什么使用限制?",
    'answer': "普通用户至多绑定2个账号, 且『求助次数』至多是『互助次数』的两倍! ",
}, {
    'question': "会员用户有什么权益?",
    'answer': "没有绑定账号数量限制, 没有『求助次数』限制, 支持自动获取『位置签到』的目标地点! ",
}];

Page({
    data: {
        help: []
    },

    onShow() {
        help.sort((a, b) => Math.random() - 0.5);
        this.setData({
            'help': help,
        })
    },
})