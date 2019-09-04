// pages/logs/orderForm/orderForm.js
const tool = require("../../utils/util.js")
const pay = require("../../utils/pay.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    tabBarList: ["待付款", "未打印", "已打印"],
    totalNum: 1,
    totalprice: "444",
    page: 1,
    orderList: [
      //   {
      //   time:'2019-12-10',//生成订单的世界

      //   orderNum: "55555sssssssss21", //d订单号
      //   status: 0, //1=未支付，2=未打印，4=已打印 给前端提供判断条件
      //   allPrice: '555',
      //   goods: [
      //     // {
      //     //   img: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550658037006&di=de9077ac6c152b305981bfc60a95cc14&imgtype=0&src=http%3A%2F%2Fpic19.nipic.com%2F20120216%2F1772123_170257337120_2.jpg", //商品照片
      //     //   name: "草莓", //商品名称
      //     //   price: "12", //商品价格=数量*（彩印+黑白）
      //     //   num: "1", //购买数量
      //     //   black: true, //商品规格
      //     //   color:true,
      //     // },

      //   ],
      // },

    ]
  },
  // 导航栏事件
  changeNavbar(e) {
    console.log(e)
    this.setData({
      current: e.detail.index
    })
    this.getUserNoPay()
  },
  onDetail(e) {
    let orderNum = e.currentTarget.dataset.item.orderNum
    let order_id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?order_id=' + order_id + '&&tabIndex=' + this.data.current ,
    })
  },
  gopay(e) {
    let goodTotalPrice = e.currentTarget.dataset.item.allPrice
    let orderNum = e.currentTarget.dataset.item.orderNum
    console.log(app.host, app, orderNum, 'orderNum')
    // prepayOrder ? orderNum
    wx.showModal({
      title: '确认支付',
      content: '支付总价：' + goodTotalPrice + "元",
      success: ((res) => {
        if (res.confirm) {
          pay(app.host + '/prepayOrder', (res) => {
            this.getUserNoPay()
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
  // 取消订单 取消订单接口delOrder？order_id=
  cancel(e) {
    wx.showModal({
      title: '确认取消订单？',
      success: res => {
        if (res.confirm) {
          tool.get(`/delOrder?order_id=${e.currentTarget.dataset.item.id  }`)
            .then(res => {
              if (res.data.status == 200) {
                wx.showToast({
                  title: "取消成功"
                })
                this.getUserNoPay()
              } else {
                wx.showToast({
                  title: "取消失败"
                })
                this.getUserNoPay()
              }
            })
        }
      }
    })
  },
  // 数据请求
  // 0待支付  1等待接单   2已接单  3以完成  4评价
  getUserNoPay() {
    let current = this.data.current
    wx.showLoading({
      title: '加载中',
      success: res => {
        setTimeout(() => {
          wx.hideLoading()
          tool.get(`/orderList?status=${current}` + "&&page=1").then(res => {
            this.setData({
              orderList: res.data
            })
          })
        }, 500)

      }
    })



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("erere4", options)
    if (options != undefined && JSON.stringify(options) != "{}") {
      this.setData({
        current: options.orderIndex
      })
    }

    console.log("eerer6")



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getUserNoPay()

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let current = this.data.current

    let page = this.data.page
    page++
    wx.showLoading({
      title: '加载中',
      success: res => {
        setTimeout(() => {
          wx.hideLoading()
          tool.get(`/orderList?status=${current}` + "&&page=" + page).then(res => {
            if (res.data == []||res.data=='') {
              wx.showToast({
                title: '加载完了',
                icon: 'none',
                duration:1000,
              })
            }
            else{
              this.data.orderList.concat(res.data)

            }
            this.setData({
              orderList: this.data.orderList
            })
          })
        }, 500)

      }
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})