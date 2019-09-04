// pages/index/business/admin/orders/go-comments/go-comments.js

const tool = require("../../utils/util.js")
const imgArr = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户评价上传的图片
    imgs: [],
    content: null
  },


  /** 
   * @Author: tomorrow-here 
   * @Date: 2018-12-22 17:57:12 
   * @Desc: 图片上传 
   */
  uploadImg() {
    var that = this
    wx.chooseImage({
      // count: 1,
      success: res => {
        res.tempFilePaths.map((item, i) => {
          tool.uploadImage("/returnFileInfo", item).then(res => {
            wx.hideLoading()
            let url = JSON.parse(res.data)          
            imgArr.push(url.path)
            console.log(imgArr, 'after imgArr')
            that.setData({            
              imgs: imgArr
            })
          })

        })
       
      }
    })
  },
  /** 
   * @Author: tomorrow-here 
   * @Date: 2018-12-22 18:22:23 
   * @Desc: 删除图片 
   */
  close(e) {
    const index = e.currentTarget.dataset.index
    this.data.imgs.splice(index, 1)
    this.setData({
      imgs: this.data.imgs
    })
  },

  //获取用户输入
  getcomtent(e) {
    console.log(e)
    this.setData({
      content: e.detail.value
    })
  },
  //发布
  submit() {
    if (!this.data.content) {
      wx.showToast({
        title: '请输入内容~~',
        icon: 'none'
      })
      return
    }
    // addProposal？desc = img =
    let json = {
      desc: this.data.content,
      img: this.data.imgs
    }
    console.log(json,'888888888')
    tool.post('/addProposal', {
      json: JSON.stringify(json)
    }).then(res => {
      console.log(res.data)
      wx.showToast({
        title: res.data.msg
      })
      setTimeout(() => {
        wx.navigateBack({})
      }, 1000)
    })
    // tool.get(`/addProposal?desc=${this.data.content}&img=${this.data.imgArr}`)
    //   .then(res => {
    //     wx.showToast({
    //       title: res.data.msg
    //     })
    //     setTimeout(() => {
    //       wx.navigateBack({})
    //     }, 1000)
    //   })
  },
  onLoad() {

  }
})