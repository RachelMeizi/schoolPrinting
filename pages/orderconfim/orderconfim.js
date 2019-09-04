import {
  get,
  post
} from '../../utils/util.js'
import {
  pay
} from '../../utils/pay.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    tabList: ['外送', '自提'],
    showShuoMing: false,
    couponPrice: 0, //商品价格
    freight: 0, //商品运费
    goodPrice:0,//商品总价
    desc:'1.asdaada  2.sada',
    totalPrice: 0, //订单总计=商品总价+商品运费
    // 收货人地址
    addressInfo: {
      name: 'Rachel',
      phone: 455436758,
      address: 'asdafsvsdadc'
    },
    //  商品信息
    goods: [{
      black:false,
      color:true,
      goodsName:'44444',
      image:      "https://jgzycz.store/images/20190819/9a8f129183f287ed10b675d15926be01.png",
      isA3:false,
      num:1,
      price:10,
    }],
    sendTime: [{
      id: 1,
      name: '12.00',
    },
    {
      id: 1,
      name: '13.00',
    },
    {
      id: 1,
      name: '15.00',
    }
    ]

  },
  getDesc(e){
    console.log(e,'4444')
this.data.desc=e.detail.value
  },
  showShuoMing() {
    this.setData({
      showShuoMing: !this.data.showShuoMing
    })
    console.log(this.data.showShuoMing)
  },
  changeTab(e) {
    let index = e.currentTarget.dataset.index

    wx.navigateTo({
      url: "/pages/addAdress/addAdress?index="+index,
    })
    this.setData({
      tabIndex: index
    })
  
  },

  onGopPay() {
    console.log(this.data.desc,'00000')
    if (this.data.orderDate && (this.data.orderTime || this.data.sendOrderTimeId) && this.data.addressInfo) {
      let json = {
        orderDate: this.data.orderDate,
        orderTime: this.data.orderTime,
        time_id: this.data.sendOrderTimeId || 0,
        address_id:this.data.tabIndex==1?'0':this.data.addressInfo.id,
        order_id: this.data.order_id,
        desc:this.data.desc ||''
      }
      post('/sendOrder', {
        json: JSON.stringify(json)
      })
        .then(res => {
          if (res.data.status == 200) {
            wx.showToast({
              title: '生成订单成功',
              success: () => {
                this.setData({
                  currentSpecList: ''
                })
                setTimeout(() => {
                  wx.redirectTo({
                    url: '/pages/orderForm/orderForm',
                  })
                }, 1000)
              }
            })
          }
        })
    } else {
      wx.showToast({
        title: '请填写日期和时间,地址',
        icon: 'none'
      })
    }
    console.log(this.data.orderDate, this.data.orderTime)

  },
  onDateChange(e) {
    this.setData({
      orderDate: e.detail.value
    })
  },
  onTimeChange(e) {
    this.setData({
      orderTime: e.detail.value
    })
  },
  onTimeSendChange(e) {
    let index = e.detail.value
    let arr = this.data.sendTime
    console.log(e, arr[index], '777777')

    this.setData({
      sendOrderTime: arr[index].name,
      sendOrderTimeId: arr[index].id
    })
  },

  onShow() {
    let total=0.00;
    get('/address?order_id=' + this.data.order_id).then(res => {
      res.data.orderInfo.map(item => {
        if (item.black == 1) {
          item.black = true
        } else {
          item.black = false
        }
        if (item.color == 1) {
          item.color = true
        } else {
          item.color = false
        }
       
        if (item.isThree==1){//是A3
          item.isThree = true
        }
        else{
          item.isThree = false

        }
        total += parseFloat(item.price)   // 所有价格加起来
      })     
  
      // res.data.desc = '1. 不满2元的一律按2元计算'

      
      if (total > 2) {
        this.data.freight = res.data.price[0]
      }
      else {
        this.data.freight = res.data.price[1]
      }

      this.setData({
        goods: res.data.orderInfo,
        addressInfo: res.data.address,
        totalPrice: total + parseFloat(this.data.freight) ,
        freight: this.data.freight,
        goodPrice: total,
        desc:res.data.desc,
      })
      console.log(this.data.goods,'商品列表')

    })
    if (this.data.addressInfo == null) {
      wx.showToast({
        title: '你还没有添加地址',
        icon: 'none'
      })
    }
  },

  onLoad(options) {
    console.log(options,'000')

    this.setData({
      order_id: options.orderNum,
      isImg:options.isImg,
    })
    console.log(this.data.goods)
    if (this.data.tabIndex==0){
      get('/timeList').then(res => {
        this.setData({
          sendTime: res.data
        })
      })

    }
  

  }
})