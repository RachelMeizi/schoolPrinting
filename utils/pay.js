// 发起微信支付
// payUrl     ：支付接口
// successFn  :支付成功之后要做的事
// errFn      :取消支付之后要做的事
var app = getApp()
var http =function(url,){
  wx.request({
    url: '',
  })
}
var pay = function (payUrl, successFn, errFn, data = {},) {
  wx.request({
    url: payUrl,
    data:data,
    method:"POST",
    header:app.globalData.header,
    success(res) {
      console.log(res)
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: 'MD5',
        paySign: res.data.paySign,
        success: (res) => {
          console.log(res)
        },
        fail: (res) => {
          console.log(res)
        },
        complete: (payInfo) => {
          console.log(payInfo)
          if (payInfo.errMsg === 'requestPayment:ok') {
            successFn()
          }
          if (payInfo.errMsg === 'requestPayment:fail cancel') {
            errFn()
          }
        }
      })
    }
  })
}
module.exports = pay;