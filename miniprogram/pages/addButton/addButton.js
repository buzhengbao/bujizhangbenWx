// pages/addButton/addButton.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc:'',//图片路径
    text:'',//标签名称
  },
 // 上传图片
 chooseImage() {
  var that = this;
  // 选择一张图片
  wx.chooseMedia({
    count: 1, // 选择1张图片
    success: re => { //选择图片成功的回调函数
      // 弹出“加载中”窗口
      wx.showLoading()
      // 获取图片临时路径
      const path = re.tempFiles[0].tempFilePath
      // 获取文件扩展名
      const extname = path.split('.').pop()
      // 使用当前时间戳+四位随机数，作为新文件名
      let fileName = new Date().getTime() + Math.floor(Math.random() * 10000)
      // 文件名拼接上.扩展名
      fileName += '.' + extname
      // 调运云API，将图片上传至云存储空间
      wx.cloud.uploadFile({
        // 上传的云路径
        cloudPath: `addIcon/${fileName}`,
        // 文件临时路径
        filePath: path,
        // 上传成功回调
        success: res => {
          if (res.statusCode == 204) {
            //把返回的图片云路径复制给imgSrc
            that.setData({
              imgSrc: res.fileID
            })
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '服务器错误',
              icon: 'error'
            })
          }
        },
      })
    },
  })
},
//图片加载完毕，隐藏“加载中”窗口
loaded(){
  wx.hideLoading()
},
//获取输入内容
getValue(e){
  //获取输入的内容
  const { value } = e.detail
    this.setData({
      text: value//保存标签名称text
    })
},
//保存数据
save() {
  // 从data中读取用户输入的信息
  const { imgSrc, text } = this.data
  // 必须上传图片
  if (imgSrc == '') {
    wx.showToast({
      title: '请上传图片',
      icon: 'error'
    })
    return
  }
  // 必须填写标题
  if (text == '') {
    wx.showToast({
      title: '请输入标签名称',
      icon: 'error'
    })
    return
  }
  // 显示 等待窗口
  wx.showLoading()
  //调用云函数
  wx.cloud.callFunction({
    name: 'addIcon', // 云函数名称
    data: { // 传递给云函数的参数
      imgSrc,
      text
    },
    success: res => { // 云函数执行成功的回调函数
      // 清空当前页面数据
      this.setData({
        imgSrc:'',
        text:''
      })
      // 关闭等待窗口
      wx.hideLoading()
      // 跳转至新闻列表页
      wx.switchTab({
        url: '../tally/tally',
      })
    },
    fail: err => { // 云函数执行失败的回调函数
      // 关闭等待窗口
      wx.hideLoading()
      // 控制台输出错误信息
      console.log(err)
    }
  })
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