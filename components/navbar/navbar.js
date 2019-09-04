var singleLength //每个tab选项的长度

Component({
  /**
   *  组件的属性列表
   */
  properties: {
    tabBarList: {
      type: Array,
      value: ['选项一', '选项二', '选项三', '选项四']
    },
    direction: {
      type: String,
      value: 'row'
    },
    current: {
      type: Number,
      value: 0,
      observer(newVal,oldVal) {
        // console.log(singleLength)
        const sliderWidth = singleLength * 0.75
        this.setData({
          sliderWidth,
          sliderOffset: singleLength * newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    sliderWidth: 0,
    sliderHeight: 0,
    silderLeft: 0,
    silderTop: 0,
    sliderOffset: 0,
    scrollHeight: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChangeTab(e) {
      const current = e.currentTarget.dataset.index
      if (!this.directionIsColumn()) {
        var sliderOffset = e.currentTarget.offsetLeft
      } else {
        var sliderOffset = e.currentTarget.offsetTop
      }
      this.setData({
        current,
        sliderOffset
      })
      this.triggerEvent('change', {
        current: current
      })
    },
    setSliderX(width) {
      singleLength = width
      const sliderWidth = singleLength * 0.75
      this.setData({
        sliderWidth,
        silderLeft: (singleLength - sliderWidth) / 2
      })
    },
    setSliderY(height) {
      singleLength = height
      const sliderHeight = singleLength * 0.75
      this.setData({
        sliderHeight,
        silderTop: (singleLength - sliderHeight) / 2
      })
    },
    directionIsColumn() {
      if (this.data.direction == 'column') {
        return true
      } else {
        return false
      }
    }
  },
  lifetimes: {
    attached() {
      this.setData({
        scrollHeight: wx.getSystemInfoSync().windowHeight
      })
    },
    ready() {
      const query = this.createSelectorQuery()
      query.select('.tab-item').fields({
        size: true
      })
      query.exec(res => {
        if (!this.directionIsColumn()) {
          this.setSliderX(res[0].width)
        } else {
          this.setSliderY(res[0].height)
        }
      })
    },
  },
})