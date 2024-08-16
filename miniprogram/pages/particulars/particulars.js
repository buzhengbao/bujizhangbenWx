// pages/particulars/particulars.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nian: new Date().getFullYear(),
    yue1: (new Date().getMonth() + 1).toString(),
    income: 0.00,
    expend: 0.00,
    //云数据库账单数据保存在message中
    message: [],
    number: [],
    index: 0,
    remark1: '',
    result2: '',
    monthArr: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],

  },
  //获取 input 中remark的值
  getRemark(e) {
    // console.log(e)
    this.setData({
      remark1: e.detail.value
    })
  },
  //获取 input 中result1的值
  getResult1(e) {
    // console.log(e)
    this.setData({
      result2: e.detail.value
    })
  },
  //更新
  update(e) {
    wx.showLoading({
      title: '正在提交',
    })
    var {
      result2,
      remark1
    } = this.data
    const db = wx.cloud.database()
    const {
      index
    } = e.currentTarget.dataset
    const record = this.data.message[index]
    const id = record._id.toString()
    // console.log( id )
    if (result2 == '' || remark1 == '') {
      wx.showToast({
        title: '点击备注或价格',
        icon: 'error'
      })
    } else {
      db.collection('tally').doc(id).update({
        data: {
          result1: result2,
          remark: remark1,
        },
        success: res => {
          wx.hideLoading()
          wx.showToast({
            title: '修改成功',
          })
        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({
            title: '修改失败',
            icon: 'error'
          })
          console.log(err)
        }
      })
      // console.log(remark1,result2)
      // console.log(e)
      // console.log(record)
      this.getMessage()
    }
  },
  //删除
  delete(e) {
    console.log(e)
    const {
      id
    } = e.currentTarget.dataset
    //确认
    wx.showModal({
      title: '确认',
      content: '您确认执行删除操作吗？',
      complete: (res) => {
        if (res.cancel) { //取消

        }
        if (res.confirm) { //确定
          wx.showLoading({
            title: '正在删除',
          })
          //删除
          const db = wx.cloud.database()
          db.collection('tally').doc(id).remove().then(res => {
            wx.hideLoading()
            this.getMessage()
          }).catch(err => {
            console.log(err)
            wx.showLoading({
              title: '删除失败',
            })
            wx.hideLoading()
            this.getMessage()
          })
        }
      }
    })
  },
  //月选择器
  click(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      yue1: this.data.monthArr[e.detail.value]
    })
    this.getMessage()
  },
  //获取云数据库中的账单
  getMessage() {
    wx.showLoading({
      title: '加载中',
    })
    const db = wx.cloud.database()
    //按月份查询云数据库中的账单
    db.collection('tally').where({
      yue: this.data.yue1
    }).orderBy('priceDate', 'desc').orderBy('addTime','desc').get().then(res => {
      this.setData({
        message: res.data
      })
      //提取价格
      const priceString = Array.from(res.data, ({
        result1
      }) => result1)
      //将价格的String转化为Int型,存入b数组
      const priceInt = []
      //将-价格存入c数组
      const c = []
      //将+价格存入d数组
      const d = []
      //ex表示-价格之和
      var ex = 0
      //inc表示+价格之和
      var inc = 0
      //转化数据类型
      priceString.forEach(function (data, index, arr) {
        priceInt.push(+data)
      })
      // 将b数组中的正负数分离
      for (var i = 0; i < priceInt.length; i++) {
        if (priceInt[i] < 0) {
          c.push(priceInt[i])
        } else {
          d.push(priceInt[i])
        }
      }
      //计算支出
      for (var i = 0; i < c.length; i++) {
        ex += c[i]
      }
      //计算收入
      for (var i = 0; i < d.length; i++) {
        inc += d[i]
      }
      this.setData({
        income: inc,
        expend: ex
      })
      // console.log(priceString)
      // console.log(priceInt)
      // console.log(c)
      // console.log(d)
      // console.log(ex)
      // console.log(inc)
      // console.log(res)
    })
    wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getMessage()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getMessage()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})