// pages/home/addAdress/addAdress.js
const tool = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // shopList:[{
    //   name:'南区',
    //   time:'10:00-21:00',
    //   address:'南区A栋三楼打油诗',
    //   flag:true,
    //   id:0
    // },

    //   {
    //     name: '北区',
    //     time: '10:00-21:00',
    //     address: '南区A栋三楼打油诗',
    //     flag: false,
    //     id: 1
    //   }
    // ],
    addressList: [],
    showAddress: 0
  },
  //设置默认地址
  setAddress(e) {
    let address_id = e.currentTarget.dataset.item.id //地址列表id
    let index = e.currentTarget.dataset.index
    tool.post('/setAddress', {
        id: address_id
      })
      .then((res) => {
        if (res.data.status == 200) {
          wx.showToast({
            title: '设置成功',
            success: res => {
              this.data.addressList.forEach((item) => {
                item.is_defalut = 0
              })
              this.data.addressList[index].is_defalut = 1 //选中状态
              this.setData({
                addressList: this.data.addressList,
                [`addressList[${index}].is_defalut`]: 1
              })
            }
          })
        }
      })
  },
  // setAddress(e) {
  //   let address_id = e.currentTarget.dataset.item.id //地址列表id
  //   // console.log(this.data.shopList[address_id])
  //   let index = e.currentTarget.dataset.index
  //   this.data.shopList.forEach((item) => {
  //     item.flag = false
  //   })
  //   this.data.shopList[address_id].flag = true //选中状态
  //   this.setData({
  //     shopList: this.data.shopList
  //   })
  //   tool.post('/setAddress', {//设置默认地址
  //     id: address_id
  //   })
  //     .then((res) => {
  //       if (res.data.status == 200) {
  //         wx.showToast({
  //           title: '设置成功',
  //           success: res => {
  //             this.data.shopList.forEach((item) => {
  //               item.flag = false
  //             })
  //             this.data.shopList[address_id].flag = true //选中状态
  //             this.setData({
  //               shopList: this.data.shopList
  //             })
  //           }
  //         })
  //       }
  //     })
  // },
  radioChange(e) {
    console.log(e)

  },

  getAddressList() {
    if (this.data.showAddress == 0) {


      tool.get('/userAddressList') //获取地址列表
        .then((res) => {
          this.setData({
            addressList: res.data
          })

        })
    } else {
      wx.showModal({
        title: '提示',
        content: '自提请联系管理员说明自提地址，或者下单备注地址',
        success: () => {
          wx.navigateBack({
            delta: 1

          })
        }
      })
    }
    console.log(this.data.addressList)

  },
  deladdress(e) {
    let address_id = e.currentTarget.dataset.item.id
    console.log(address_id, "25255")
    tool.post('/delAddress', { //删除地址
        id: address_id
      })
      .then((res) => {
        if (res.data.status == 200) {

          wx.showToast({
            title: '删除成功！',
          })
          this.getAddressList()
        }
      })
  },
  goAdd() {
    wx.navigateTo({
      url: 'address/address',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      showAddress: options.index
    })
    console.log(options.index)

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
    this.getAddressList()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})