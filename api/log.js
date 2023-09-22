const log = wx.getRealtimeLogManager();

module.exports = {
    info() {
        if (!log) return
        log.info.apply(log, arguments)
        console.info(...arguments)
    },
    warning() {
        if (!log) return
        log.error.apply(log, arguments)
        console.info("Error", ...arguments)
    },
    error() {
        if (!log) return
        log.error.apply(log, arguments)
        console.info("Error", ...arguments)
    }
}