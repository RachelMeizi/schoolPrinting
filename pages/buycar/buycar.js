import {
  get,
  post
} from '../../utils/util.js'
const tool = require('../../utils/util.js')
const imgArr = []
const word = '/images/word.jpg'
const pdf = '/images/pdf.jpg'
const excel = '/images/Excel.jpg'
const rar = '/images/rar.jpg'
const defaultPic = '/images/doc.png'
const file_pic = (name) => {
  let suffix = (name.split('.')[1] + '').toLowerCase()
  if (/doc|docx/.test(suffix)) {
    return word
  } else if (/xlsx|xls/.test(suffix)) {
    return excel
  } else if (/pdf/.test(suffix)) {
    return pdf
  }
}
Page({
  data: {
    adminShow: false, //管理      
    shopcarData: [], //购物车数据  {addCarId: 1, img: 'https://dwz.cn/Ri6gsioB',  goodsName: '照片',  specName: '2',result: [] }
    total: 0, //总金额      
    allsel: false, //全选      
    selarr: [], //选择的货物      
    hintText: '', //提示的内容      
    hintShow: false, //是否显示提示  
    // shopcarData: [],
    noList: true,

    result: [], //选择打印结果
    imgs: [],
    black: false,
    color: true,
    isThree: true,
    // isA4: false,


  },
  //点击加减按钮  
  numchangeTap: function(e) {
    let index = e.currentTarget.dataset.index, //点击的商品下标值        
      shopcar = this.data.shopcarData;
    const oldNum = shopcar[index].num,
      newNum = e.detail
    shopcar[index].num = newNum //将改变后的新数量赋给对应的商品

    this.setData({
      shopcarData: shopcar,
    });
  },
  deleteGood(e) {

    var that = this
    const index = e.currentTarget.dataset.index
    wx.showModal({
      title: '删除提示',
      content: '确定删除吗？',
      success: (res) => {
        if (res.confirm) {
          that.data.shopcarData.splice(index, 1)
          that.setData({
            shopcarData: that.data.shopcarData
          })
        }
      }
    })

  },
  file_pic(name) {
    let suffix = (name.split('.')[1] + '').toLowerCase()
    if (/doc|docx/.test(suffix)) {
      return word
    } else if (/xlsx|xls/.test(suffix)) {
      return excel
    } else if (/pdf/.test(suffix)) {
      return pdf
    } else if (/rar|zip|iso\jar|z/.test(suffix)) {
      return rar
    } else {
      return defaultPic
    }
  },
  uploadDoc() {
    let _this = this;
    wx.chooseMessageFile({
      count: 5,
      type: 'file',
      success(res) {
        console.log(res.tempFiles, 'res.tempFiles')
        var tempFiles = []
        var tempFiles1 = []
        var shopcarData = _this.data.shopcarData
        res.tempFiles.map(item => {
          tempFiles.push(item.path)
          tempFiles1.push({
            name: item.name
          })
        })
        console.log(tempFiles1, '455')
        // tempFilePath可以作为img标签的src属性显示图片
        tempFiles.map((item, i) => {
          tool.uploadImage("/returnFileInfo", item).then(res => {
            console.log(res.data, 'returnFileInfo')
            wx.hideLoading()
            let url = JSON.parse(res.data)
            let obj = {
              imgName: _this.file_pic(tempFiles1[i].name), //传递给后台的文档路径 
              goodsName: tempFiles1[i].name,
              num: 1,
              img: url.path, //前端显示的默认照片
              black: true,
              color: false,
              isThree: 2, //A3  A4=2

            };
            shopcarData.push(obj)
            _this.setData({
              shopcarData: shopcarData
            })
            console.log(_this.data.shopcarData, '辅值 以后的B数组')
          })
        })
      }
    })
  },

  uploadImg() {
    let _this = this;

    wx.chooseImage({
      success: res => {
        console.log(res.tempFilePaths, '选择的本地照片')
        res.tempFilePaths.map((item, i) => {
          tool.uploadImage("/returnFileInfo", item).then(res => {
            var shopcarData = [] //定义临时数组
            res.tempFilePaths = []
            console.log(res.data, '选择的照片')
            wx.hideLoading()
            let url = JSON.parse(res.data)

            imgArr.push(url.path)
            console.log(_this.data.shopcarData, 'before')
            imgArr.map((item, i) => {
              let obj = {
                img: item,
                goodsName: '照片',
                num: 1,
                black: false,
                color: true,
                imgName: item,
                isThree:0
              };

              shopcarData.push(obj) //循环push进临时数组
            })
            _this.setData({ //更新数组
              shopcarData: shopcarData
            })
            console.log(_this.data.shopcarData, '辅值 以后的B数组')
          })
        })
      }
    })
  },


  //点击复选框
  onChange(e) {
    let i = e.currentTarget.dataset.index;
    let value = e.detail.value;
    console.log(value, '44444')
    let shopcarData = this.data.shopcarData;
    // shopcarData[i].result=value;
    //默认  属性为 未选中
    shopcarData[i].black = false;
    shopcarData[i].color = false;
    value.map(item => {
      if (item == '黑白') {
        shopcarData[i].black = true;
      }
      if (item == '彩色') {
        shopcarData[i].color = true;
      }
    });


    this.setData({
      shopcarData: shopcarData
    });
    console.log(this.data.shopcarData)
  },
  radioChange(e) {
    let i = e.currentTarget.dataset.index;
    let value = e.detail.value;


    let shopcarData = this.data.shopcarData;
    // shopcarData[i].result=value;
    //默认  属性为 未选中
    shopcarData[i].isThree = false;
    // shopcarData[i].isA4 = false;

    if (value == 'A3') {
      shopcarData[i].isThree = 1;
    }
    if (value == 'A4') {
      shopcarData[i].isThree = 2;
    }

    this.setData({
      shopcarData: shopcarData
    });
    console.log(this.data.shopcarData, '555555555555555')

  },
  goclearingTap() {
    if (!this.data.shopcarData.length) {
      wx.showToast({
        title: '您还未上传文件哦~',
        icon: 'none'
      })
      return
    }
    console.log(this.data.shopcarData, 'sellArr')
    // wx.setStorageSync('sellArr', this.data.shopcarData)

    post('/addOrder', {
      json: JSON.stringify(this.data.shopcarData)
    }).then(res => {

      if (res.data.status == 200) {

        wx.navigateTo({
          url: '/pages/orderconfim/orderconfim?orderNum=' + res.data.msg + '&&isImg=' + this.data.isImg,
        })
        this.setData({
          shopcarData: []
        })
      }
    })



  },
  /**   * 生命周期函数--监听页面显示   */
  onShow: function() {

    this.setData({
      selarr: [],
      noList: false,
      allsel: false,
      adminShow: false,
      shopcarData: []
    });

  },
  onLoad(options) {
    console.log(options)
    this.setData({
      isImg: options.isImg
    })
    if (this.data.isImg == "false") {
   
      this.setData({
        black: true,
        color:false,
        isThree: false
      })
    console.log(this.data.isThree, this.data.black, '00000')
    }
  },
})