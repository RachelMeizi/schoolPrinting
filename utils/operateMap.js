// 打开地图选择位置
function chooseLocation () {
  return new Promise((resolve, reject) => {
    wx.chooseLocation({
      success: (res) => {
        resolve(res)
      },
      fail: err => {
        resolve(false)
      }
    })
  })
}


// 打开用户授权界面
function openSetting () {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: res => {
        console.log(res,"openSetting")
        if (res.authSetting['scope.userLocation']) {
          console.log("true")
          resolve(res)
        } else {
          console.log("false")
          resolve(false)
        }
      }
    })
  })
}


/**
 * [获取用户的授权信息]
 * @Author   tomorrow-here
 * @DateTime 2018-12-20
 */
function getSetting () {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userLocation']) {
          console.log('授权成功')
          resolve(res)
        } else {
          console.log('shibai')
          reject(false)
        }
      },
      fail: err => {
        reject(false)
      }
    })
  })
}

/**
 * [获取用户当前位置]
 * @Author   tomorrow-here
 * @DateTime 2018-12-20
 * @return   {object}      如果用户授权，则返回用户的当前经纬度信息
 */
function getMyPos () {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => resolve(res)
    })
  })
}

/**
 * 获取地理位置授权
 * @Author   tomorrow-here
 * @DateTime 2018-12-20
 * @return   {object}      返回获取的地理位置坐标
 */
function getAuth () {
  return new Promise((resolve, reject) => {
    getSetting()
    .then(res => {
      chooseLocation()
        .then(res => resolve(res))
    })
    .catch(err => {
      wx.showModal({
        title: '请先打开位置授权',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: result => {
          if (result.confirm) {
            openSetting()
              .then((res) => {
                resolve(res)
              })
          } else {
            resolve(false)
          }
        }
      })
    })
    .then((res) => {
      if (Boolean(res)) {
        chooseLocation()
          .then(res => resolve(res))
          .catch(err => {
            wx.showToast({
              title: '授权失败1',
              icon: 'none'
            })
          })
      }
    })
    .catch((err) => {
      wx.showToast({
        title: '授权失败2',
        icon: 'none'
      })
    })
  })
}

module.exports = {
  chooseLocation,
  openSetting,
  getSetting,
  getMyPos,
  getAuth
}
