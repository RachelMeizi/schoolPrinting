// pages/home/addAdress/address/address.js
const map = require("../../../utils/operateMap.js")
const tool = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    man: 0,
    woman: 1,
    schoolArea: '',
    parkName: '',
    // school:['sasca','55555','asdaca'],
    yuanqu: [{ id: 2, name: '芙蓉园', }, { id: 3, name: '香水园', },
    { id: 3, name: '香水园' }],

    school: [{ id: 2, name: '南区', }, { id: 3, name: '北区', }, { id: 3, name: '中区' }],
  },
  // radioChange(e) {
  //   this.setData({
  //     gender: e.detail.value
  //   })
  // },

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

    tool.post('/addUserAddress', { json: JSON.stringify(json) }).then(res => {
      if (res.data.status == 200) {
        wx.showToast({
          title: '保存成功',
          success: (res) => {
            wx.navigateBack({
              detail: 1
            })
          }
        })
        this.setData({
          showFrom: false
        })
      }
    })


    console.log(json, 'asd')


  },
  // submitForm(e) {
  //   var gender = this.data.gender
  //   let value = e.detail.value
  //   value = {
  //     ...value,
  //     gender
  //   }
  //   if (!gender) {
  //     wx.showToast({
  //       title: '数据不能为空',
  //       icon: 'none',
  //     })
  //     return
  //   } else {
  //     for (let x in value) {
  //       if (value[x] == "") {
  //         wx.showToast({
  //           title: '数据不能为空',
  //           icon: 'none',
  //         })
  //         return
  //       }
  //     }
  //   }
  //   console.log(value, "sss")
  //   tool.post('/addUserAddress', { json: JSON.stringify(value)})
  //     .then((res) => {
  //       if (res.data.status == 200) {
  //         wx.showToast({
  //           title: '添加成功',
  //           success:res=>{
  //           wx.navigateBack({
  //             delta: 0,
  //           })
  //           }
  //         })
  //         return
  //       }

  //     })
  // },
  getlocation() {
    wx.getSetting({
      success: (res) => {
        console.log(res, "s")
        if (!res.authSetting['scope.userLocation']) {
          console.log('用户未授权1')
          wx.authorize({
            scope: 'scope.userLocation',
            success: res => {
              console.log('用户同意授权1')
              wx.chooseLocation({
                success: (res) => {
                  this.setData({
                    address: res.address,
                    latitude: res.latitude,
                    longitude: res.longitude
                  })
                  console.log('打开位置成功1')
                },
              })
            },
            fail: res => {
              console.log('用户拒绝授权')
              wx.showModal({
                title: '提示',
                content: '请先打开地理位置授权',
                success: res => {
                  if (res.confirm) {
                    console.log('用户点击同意')
                    wx.openSetting({
                      success(res) {
                        console.log(res.authSetting)
                      },
                      fail: err => {
                        console.log(err)
                      }
                    })
                  }
                }
              })
            }
          })
        } else {
          console.log('用户已授权2')
          wx.chooseLocation({
            success: (res) => {
              console.log(res, '打开位置成功2')
              this.setData({
                address: res.address,
                latitude: res.latitude,
                longitude: res.longitude
              })
            },
          })
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    tool.get('/banner').then(res => {
      this.setData({
        notice: res.data.ad.img,
        banner_url: res.data.banner,
        school: res.data.school
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})