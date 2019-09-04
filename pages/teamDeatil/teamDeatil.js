// pages/company/teamDeatil/teamDeatil.js
const tool =require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    team: [
      {
        teams_img: 'https://dwz.cn/k1UL8i2a', //动态照片
        name: '小明', //标题
        schoolName: '软件工程师', //发布时间
        phone: '4546546546', //毕业学校
      },
    ],
    
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    tool.get('/kefuList')
    .then(res=>{
      this.setData({
        team:res.data
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