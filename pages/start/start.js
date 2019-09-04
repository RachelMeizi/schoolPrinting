//login.js
//获取应用实例
var app = getApp();
var tool = require('../../utils/util.js')
Page({
  data: {
    remind: '加载中',
    angle: 0,
    userInfo: {},
    show: false,
    reging: false,
    options: null,
    windowHeight: null,
    backvideo: null,
    disabled:false,
    url: "/pages/index/index",//跳转首页
    // url : "/pages/shopClassOther/shopClassOther"
  },
getOpenId(){
   wx.login({

      success: function (res) {
        console.log(res)

        if (res.code) {
          //发起网络请求
          wx.request({
            url: `https://api.weixin.qq.com/sns/jscode2session?appid=${'wx4919d8d964a1ad4a'}secret=${'5ca65172f0858fa66cd07c3b907d22c3'}&js_code=${res.code}&grant_type=authorization_code`,
            data: {
              appid: 'wx4919d8d964a1ad4a',
              secret: '5ca65172f0858fa66cd07c3b907d22c3',
              js_code: res.code,
              grant_type: 'authorization_code'
            },
            success(v) {
              console.log(v)
            }
          })

        } else {

          console.log('登录失败！' + res.errMsg)

        }

      }

    });
},

  //注册部分
  reg() {
    console.log('我在登陆')
  this.setData({
    disabled:true
  })
   
    wx.showLoading({
      title: '授权登陆中...',
    })
    if (this.data.reging == true) {
      return
    } else {
      this.data.reging = true
    }
    tool.login()
      .then((res) => {
        console.log(res)
        let code =res.code
        tool.userInfo()
          .then((res) => {
            console.log(res)
            let data = {
              headurl: app.globalData.userInfo.avatarUrl,
              nickname: app.globalData.userInfo.nickName,
              city: app.globalData.userInfo.city,
              gender: app.globalData.userInfo.gender,
              province: app.globalData.userInfo.province,
              code: code
            }
            tool.post("/login", data)
              .then((res) => { 
                console.log(res)            
                if (res.data.status == 200) {
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                  // this.hasParameter(this.data.options, this)
                  this.setData({
                    disabled: false
                  })
                }
                wx.hideLoading()
              })
          })
      })
  },


  //登录成功后的跳转控制
  tiaoZhuan() {
    //先访问适配公司,再跳转
    if (this.data.url == "") {
      // this.data.url = "/pages/shopHome/shopHome"
      this.data.url = "/pages/index/index"
    }
    wx.reLaunch({
      url: this.data.url
    })
  },

  hasParameter(options, that) {
    //如果onload带参数，交给这里处理
    console.log("options", options)
    if (!tool.isBlank(that.data.options)) {
      console.log("options2", options)
      if (tool.isBlank(that.data.options.scene)) {
        var tempUrl = '/recommendRecord?code=' + that.data.options.scene + '&relate_type=setting'
      } else {
        var tempUrl = '/recommendRecord?code=' + options.code + '&relate_type=setting'
      }
      tool.get(tempUrl) //请求添加推荐人
        .then((res) => {
          that.data.url = res.data.msg
          that.tiaoZhuan() //设置登录成功后跳转
        })
    } else {
      console.log("options1", options)
      that.tiaoZhuan() //设置登录成功后跳转
    }
    this.getUserInfo()//获取个人数据
  },
  getUserInfo(){
    tool.get("/getUserInfo").then((res) => {
      app.globalData.userInfo = res.data
    })
  },
  onLoad: function(options) {
    // var url = "/video?mdName=dd"
    // tool.cacheImg(this, url, "videoName", "backvideo")
    this.data.options = options
    var that = this
    //登录部分
   
        // tool.login()
        //   .then((res) => {
        //     tool.get("/login")
        //       .then((res) => {
        //         console.log(res.data,"login")
        //         if (res.data.status == "200") {
        //           //登录成功
        //           this.hasParameter(options, that) //跳转
        //         } else {
        //           let show = true
        //           this.setData({
        //             show,
        //           })
        //           //登录失败等待手动点击注册
        //         }
        //       })
        //   })
  },



  onShow: function() {
    //生命周期函数
    
  },

  onReady: function() {
    const res = wx.getSystemInfoSync()
    this.setData({
      windowHeight: res.windowHeight,
    })
    //生命周期函数
    var that = this;
    setTimeout(function() {
      that.setData({
        remind: ''
      });
    }, 1000);

    wx.onAccelerometerChange(function(res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) {
        angle = 14;
      } else if (angle < -14) {
        angle = -14;
      }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  }
});