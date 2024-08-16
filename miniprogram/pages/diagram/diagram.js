import uCharts from '../../src/u-charts.min'
//注意！基础库【2.9.0】起支持 2d 模式，如不显示请检查基础库版本！
var uChartsInstance = {};
Page({
  data: {
    nian: new Date().getFullYear(),
    yue1: (new Date().getMonth() + 1).toString(),
    index: 0,
    monthArr: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    cWidth: 750,
    cHeight: 500,
    pixelRatio: 2,
    message: [],
    arr: []
  },
  //月选择器
  click(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      yue1: this.data.monthArr[e.detail.value]
    })
    this.getMessage()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    //这里的第一个 750 对应 css .charts 的 width
    const cWidth = 750 / 750 * wx.getSystemInfoSync().windowWidth;
    //这里的 500 对应 css .charts 的 height
    const cHeight = 500 / 750 * wx.getSystemInfoSync().windowWidth;
    const pixelRatio = wx.getSystemInfoSync().pixelRatio;
    this.setData({
      cWidth,
      cHeight,
      pixelRatio
    });
    this.getMessage()
  },
  //获取云数据库中的账单
  getMessage() {
    wx.showLoading({
      title: '加载中',
    })
    const db = wx.cloud.database()
    //按月份查询云数据库的账单
    db.collection('tally').where({
      yue: this.data.yue1
    }).orderBy('priceDate', 'desc').orderBy('addTime', 'desc').get().then(res => {
      this.setData({
        message: res.data
      })
      //提取价格
      const priceString = Array.from(res.data, ({
        result1
      }) => result1)
      //提取类型
      const textStirng = Array.from(res.data, ({
        text
      }) => text)
      //将价格的String转化为Int型, 存入priceInt数组
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
      }) // 将b数组中的正负数分离
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
      //将类型数组和价格数组合并成uChart组件需要的数据格式
      let newarr = []
      for (let i = 0; i < priceString.length; i++) {
        let fy = {}
        fy.name = textStirng[i]
        fy.value = priceInt[i]
        newarr.push(fy)
      }
      this.setData({
        arr: newarr
      })
      //定义收入数组
      const arrIn = []
      //定义支出数组
      const arrEx = []
      //分离收支
      for (var i = 0; i < priceInt.length; i++) {
        if (newarr[i].value < 0) {
          arrEx.push(newarr[i])
        } else {
          arrIn.push(newarr[i])
        }
      }
      //合并数组对象，相同key键的某一项数组求和
      //arr：数组，judgeKey：判断的键,mergeKey：求和的键
      function compare(arr, judgeKey, mergeKey) {
        let result = [];
        arr.forEach(item => {
          let index = -1;
          result.forEach((m, n) => {
            if (m[judgeKey] == item[judgeKey]) {
              index = n;
            }
          });
          if (index != -1) {
            result[index][mergeKey] += item[mergeKey];
          } else {
            result.push(item);
          }
        });
        return result;
      }
      
      const income = compare(arrIn, 'name', 'value')
      const expend = compare(arrEx, 'name', 'value')
      console.log(income)
      let res1 = {
        series: [{
          data: income
        }]
      };
      this.drawCharts('qwe', res1);
      let res2 = {
        series: [{
          data: expend
        }]
      };
      this.drawCharts('asd', res2);
    })
    wx.hideLoading()
  },
  drawCharts(id, data) {
    const query = wx.createSelectorQuery().in(this);
    query.select('#' + id).fields({
      node: true,
      size: true
    }).exec(res => {
      if (res[0]) {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        canvas.width = res[0].width * this.data.pixelRatio;
        canvas.height = res[0].height * this.data.pixelRatio;
        uChartsInstance[id] = new uCharts({
          type: "pie",
          context: ctx,
          width: this.data.cWidth * this.data.pixelRatio,
          height: this.data.cHeight * this.data.pixelRatio,
          series: data.series,
          pixelRatio: this.data.pixelRatio,
          animation: true,
          background: "#FFFFFF",
          color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
          padding: [5, 5, 5, 5],
          enableScroll: false,
          extra: {
            pie: {
              activeOpacity: 0.5,
              activeRadius: 10,
              offsetAngle: 0,
              labelWidth: 15,
              border: true,
              borderWidth: 3,
              borderColor: "#FFFFFF"
            }
          }
        });
      } else {
        console.error("[uCharts]: 未获取到 context");
      }
    });
  },
  tap(e) {
    uChartsInstance[e.target.id].touchLegend(e);
    uChartsInstance[e.target.id].showToolTip(e);
  }
})