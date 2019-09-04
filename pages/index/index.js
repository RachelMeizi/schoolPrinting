//index.js
//获取应用实例
const app = getApp()
const tool = require('../../utils/util.js')
Page({
  data: {
    notice: '足协杯战线连续第2年上演广州德比战，上赛季半决赛上恒大以两回合5-3的总比分淘汰富力。',
    loginUser: {},
    address: '',
    phone: '',
    userName: '',
    wechat: '',
    schoolArea: '',
    parkName: '',
    // school:['sasca','55555','asdaca'],
    yuanqu: [{ id: 2, name: '芙蓉园', }, { id: 3, name: '香水园', },
    { id: 3, name: '香水园' }],

    school: [{ id: 2, name: '南区', }, { id: 3, name: '北区', }, { id: 3, name: '中区' }],
    banner_url: [
      // 'https://dwz.cn/r7ceHhdF', 
      // 'https://dwz.cn/k1UL8i2a',
      // 'https://dwz.cn/gYtBh85c',

    ],
    showFrom: false,
    nav_list: [
      {
        title: '订单',
        url: '/pages/orderForm/orderForm'
      },
      {
        title: '建议&意见',
        url: '/pages/go-comments/go-comments'
      }, {
        title: '客服',
        url: '/pages/teamDeatil/teamDeatil'
      }

    ],
    open: false,
    indicatorDots: true,//是否显示面板指示点
    autoplay: true,//是否开启自动切换
    interval: 3000,//自动切换时间间隔
    duration: 500//滑动动画时长
  },

  onGoBestRider() {
    let showFrom = !this.data.showFrom
    this.setData({
      showFrom: showFrom
    });
  },
  //列表的操作函数
  open_list() {
    //此处进行操作
    this.setData({
      open: false
    });
  },
  //左侧导航的开关函数
  offCanvas() {
    console.log(this.data.open, '88')
    if (this.data.open) {
      this.setData({
        open: false
      });
    } else {
      this.setData({
        open: true
      });
    }
  },
  changeYuanQu(e) {
    let index = e.detail.value
    let park_id = this.data.yuanqu[index].id

    this.setData({
      parkName: this.data.yuanqu[index].name,
      park_id,
    })
  },
  changeSchool(e) {
    console.log(e, '000')
    let index = e.detail.value
    let school_id = this.data.school[index].id
    tool.get('/park?school_id=' + school_id).then(res => {
      this.setData({
        yuanqu: res.data,
        school_id,
      })
    })
    this.setData({
      schoolArea: this.data.school[index].name
    })
  },
  onGoRiderRanking() {
    wx.navigateTo({
      url: '/pages/upload/upload',
    })
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
  onAddressChange(e) {
    this.setData({
      address: e.detail
    })
  },
  onPhoneChange(e) {
    this.setData({
      phone: e.detail
    })
  },
  onUserNameChange(e) {
    this.setData({
      userName: e.detail
    })
  },
  onRemarkChange(e) {
    this.setData({
      remark: e.detail
    })
  },
  onWeChatChange(e) {
    this.setData({
      wechat: e.detail
    })
  },
  onSave() {
    let {
      address,
      userName,
      phone,
      wechat,
      school_id,
      park_id
    } = this.data

    if (school_id == '' || address == '' || userName == '' || phone == '' || park_id == '') {
      wx.showToast({
        title: '必填信息不能为空',
        icon: 'none'
      })
      return
    }
    let json = {
      address,
      userName,
      phone,
      school_id,
      park_id,
      wechat
    }
   
    tool.post('/addUserAddress',{json:JSON.stringify(json)}).then(res=>{
  if (res.data.status == 200) {
        wx.showToast({
          title: '保存成功'
        })
        this.setData({
          showFrom: false
        })
      }
})


    console.log(json, 'asd')


  },
  onLoad() {
    this.setData({
      loginUser: app.globalData.userInfo
    })
    tool.get('/banner').then(res => {
      this.setData({
        notice: res.data.ad.img,
        banner_url: res.data.banner,
        school: res.data.school
      })
    })
  },
})
