// pages/tally/tally.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 支出页显示控制
    incomea: false,
    // 收入页显示控制   
    expenda: true,
    iconList: [{}]
  },
  // 支出按钮
  income() {
    this.setData({
      incomea: true,
      expenda: false
    })
  },
  // 收入按钮
  expend() {
    this.setData({
      incomea: false,
      expenda: true
    })
  },
  //进入添加支出按钮界面
  add() {
    wx.navigateTo({
      url: '../addButton/addButton',
    })
  },
  //进入添加收入按钮界面
  addIn() {
    wx.navigateTo({
      url: '../addInButton/addInButton',
    })
  },
  //获取收入按钮
  getInIcon() {
    //加载中提示窗口
    wx.showLoading({
      title: '加载中',
    })
    //获取云数据库
    const db = wx.cloud.database()
    //读取数据库，按照发布事件降序排列
    db.collection('tallyInIcon').orderBy('addTime', 'desc').get().then(res => {
      // console.log(res)
      //读取的数据赋值给newList
      this.setData({
        iconInList: res.data
      })
    }).catch(console.error)
    //关闭加载中提示窗
    wx.hideLoading()
  },
  //获取支出按钮
  getIcon() {
    //加载中提示窗口
    wx.showLoading({
      title: '加载中',
    })
    //获取云数据库
    const db = wx.cloud.database()
    //读取数据库，按照发布事件降序排列
    db.collection('tallyIcon').orderBy('addTime', 'desc').get().then(res => {
      // console.log(res)
      //读取的数据赋值给newList
      this.setData({
        iconList: res.data
      })
    }).catch(console.error)
    //关闭加载中提示窗
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getIcon()
    this.getInIcon()
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