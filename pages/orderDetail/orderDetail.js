const tool = require("../../utils/util.js")
const pay = require("../../utils/pay.js")
const app = getApp()


Page({
  data: {
    appointTime: "2019-01-17 12:00-13:00",//送货&取货最晚时间
    allPrice: 35,//订单总计=每个商品总计之和
    orderNum: 222222,//订单号
    orderTime: "2019-01-17 11:06:09",//生成订单时间
    userName: "夏明",//收货用户
    userPhone: 1111111111,//电话
    // school:'南区芙蓉园',
    freight:0,//运费
    site: "山东阿萨",//收货地址=校区+园区+详细地址
    desc:'',
    // remark: "好好洗",//备注
    goods: [{
        goodsImg: "",
        goodsName: "蒸汽洗车",
        goodsNum: 1,
        goodsPrice: 5,//
        black:true,//黑白
      color: true,//彩印
      },
      {
        goodsImg: "",
        goodsName: "蒸汽洗车",
        goodsNum: 1,
        goodsPrice: 35,
        black: true,
        color: true,
      },
    ]

  },

  getOrderDetail(order_id) {//orderDetail？order_id
    tool.get(`/orderDetail?order_id=${order_id}`).then(res => {
      var res = res.data
      this.setData({
        appointTime: res.appointTime,
        allPrice: res.allPrice,
        orderNum: res.orderNum,
        orderTime: res.orderTime,
        userName: res.userName,
        userPhone: res.userPhone,
        site: res.site, 
        goods: res.goods,
        school: res.school,
        freight: res.freight,
        desc:res.desc
      })
    })
  },
  onLoad(options) {
    this.getOrderDetail(options.order_id)
    this.setData({
      status: options.tabIndex
    })
    console.log(options,"after")
  },
  gopay(){
    let orderNum=this.data.orderNum
    let allPrice = this.data.allPrice
    wx.showModal({
      title: '确认支付',
      content: '支付总价：' + allPrice + "元",
      success: ((res) => {
        if (res.confirm) {
          pay(app.host + '/prepayOrder', (res) => {
            this.setData({
              status:1
            })
            wx.navigateBack({
              delta: 1,
            })
          }, (err) => {
            console.log(err)
            return
          }, {
              orderNum: orderNum //传递的订单号
            })
        } else {
          return
        }
      })
    })

  },


  onShareAppMessage: function() {

  }
})