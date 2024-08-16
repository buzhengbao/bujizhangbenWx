// components/tButton/tButton.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    text:{
      type:String,
      value:''
    },
    img:{
      type:String,
      value:''
    },
    IAE:{
      type:Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dialog3: false,
    wrap: false,
    wrap1: false,
    back: 'back',
    C: 'C',
    addSub: 'addSub',
    add: '+',
    sub: '-',
    mut: '×',
    div: '÷',
    equ: '=',
    percent: '%',
    dot: '.',
    id0: '0',
    id1: '1',
    id2: '2',
    id3: '3',
    id4: '4',
    id5: '5',
    id6: '6',
    id7: '7',
    id8: '8',
    id9: '9',
    result1: '0.00',
    valiBackOfArray: ['+', '-', '×', '÷', '.'],
    completeCalculate: false,
    priceDate:new Date().toISOString().substring(0, 10),
    remark:'',
    yue:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
  close() {
    this.setData({
      dialog3: false,
    });
  },
  open3() {
    this.setData({
      dialog3: true,
    });
  },
  dateChange: function(e) {
    this.setData({
      priceDate: e.detail.value,
      yue: e.detail.value.slice(5,7)
    })
  },
  getValue(a){
    // console.log(a)
    this.setData({
      remark:a.detail.value
    })
  },
  // 计算结果
  calculate: function (str) {
    // 判断是不是有负数
    var isNagativeNum = false;
    if (str.charAt(0) == '-') {
      str = str.replace('-', '').replace('(', '').replace(')', '');
      isNagativeNum = true;
    }
    // 对字符串解析并运算
    var addArray = str.split('+');
    var sum = 0.0;
    for (var i = 0; i < addArray.length; i++) {
      if (addArray[i].indexOf('-') == -1) {
        if (addArray[i].indexOf('×') != -1 || addArray[i].indexOf('÷') != -1)
          sum += this.calculateMutDiv(addArray[i]);
        else sum += Number(addArray[i]);
      }
      else {
        var subArray = addArray[i].split('-');
        var subSum = 0;
        if (subArray[0].indexOf('×') != -1 || subArray[0].indexOf('÷') != -1) subSum = this.calculateMutDiv(subArray[0]);
        else subSum = Number(subArray[0]);
        for (var j = 1; j < subArray.length; j++) {
          if (subArray[i].indexOf('×') != -1 || subArray[i].indexOf('÷') != -1)
            subSum -= this.calculateMutDiv(subArray[j]);
          else subSum -= Number(subArray[j]);
        }
        sum += subSum;
      }
    }
    if (isNagativeNum) return (-sum).toString();
    else return sum.toString();
  },
  // 分块乘除运算
  calculateMutDiv: function (str) {
    var addArray = str.split('×');
    var sum = 1.0;
    for (var i = 0; i < addArray.length; i++) {
      if (addArray[i].indexOf('÷') == -1) {
        sum *= Number(addArray[i]);
      }
      else {
        var subArray = addArray[i].split('÷');
        var subSum = Number(subArray[0]);
        for (var j = 1; j < subArray.length; j++) {
          subSum /= Number(subArray[j]);
        }
        sum *= subSum;
      }
    }
    return sum;
  },
  // 是否以运算符结尾
  isOperatorEnd: function (str) {
    for (var i = 0; i < this.data.valiBackOfArray.length; i++) {
      if (str.charAt(str.length - 1) == this.data.valiBackOfArray[i]) return true;
    }
    return false;
  },
  clickButton: function (event) {
    const { IAE, priceDate, remark, result1, text, img, yue  } = this.data
    if (this.data.result1 == 0) {
      if (event.target.id == 'back' || event.target.id == 'C' || event.target.id == 'addSub' || event.target.id == '%' || event.target.id == '+' || event.target.id == '-' || event.target.id == '×' || event.target.id == '÷' || event.target.id == '=') return;
      this.setData({
        result1: event.target.id
      });
    }
    else if (event.target.id == 'back') {
      this.setData({
        result1: this.data.result1.length == 1 ? '0' : this.data.result1.substring(0, this.data.result1.length - 1)
      });
    }
    else if (event.target.id == 'C') {
      this.setData({
        result1: '0'
      });
    }
    else if (event.target.id == 'addSub') {
      var r = this.data.result1;
      if (this.isOperatorEnd(r)) return;
      if (r.charAt(0) == '-') this.setData({ result1: r.replace('-', '').replace('(', '').replace(')', '') });
      else this.setData({
        result1: '-(' + r + ')'
      });
    }
    else if (event.target.id == '%') {
    }
    else if (event.target.id == '=') {
      if (this.isOperatorEnd(this.data.result1)) return;
      this.setData({
        result1: this.calculate(this.data.result1),
        
      });
      this.setData({
        completeCalculate: true
      });
      //显示等待窗口
      wx.showLoading();
      //调用云函数,判断IAE（收支）和月是否选择，月不选择默认为当前月
      if(this.data.IAE == false && this.data.yue == ''){
      wx.cloud.callFunction({
        name:'addPrice',
        data:{
          IAE,
          priceDate,
          remark,
          result1: '-'+this.calculate(this.data.result1),
          text,
          img,
          yue: (new Date().getMonth() + 1).toString()
        },
        success:res=>{
          console.log(res)
          wx.hideLoading()
        },
        fail:err=>{
          wx.hideLoading()
          console.log(err)
        }
      })}
      if(this.data.IAE == true && this.data.yue == ''){
        wx.cloud.callFunction({
          name:'addPrice',
          data:{
            IAE,
            priceDate,
            remark,
            result1: this.calculate(this.data.result1),
            text,
            img,
            yue: (new Date().getMonth() + 1).toString()
          },
          success:res=>{
            console.log(res)
            wx.hideLoading()
          },
          fail:err=>{
            wx.hideLoading()
            console.log(err)
          }
        })
      }
      if(this.data.IAE == true && this.data.yue !== ''){
        wx.cloud.callFunction({
          name:'addPrice',
          data:{
            IAE,
            priceDate,
            remark,
            result1: this.calculate(this.data.result1),
            text,
            img,
            yue
          },
          success:res=>{
            console.log(res)
            wx.hideLoading()
          },
          fail:err=>{
            wx.hideLoading()
            console.log(err)
          }
        })
      }
      if(this.data.IAE == false && this.data.yue !== ''){
        wx.cloud.callFunction({
          name:'addPrice',
          data:{
            IAE,
            priceDate,
            remark,
            result1: '-'+this.calculate(this.data.result1),
            text,
            img,
            yue
          },
          success:res=>{
            console.log(res)
            wx.hideLoading()
          },
          fail:err=>{
            wx.hideLoading()
            console.log(err)
          }
        })
      }
    }
    else {
      if (this.isOperatorEnd(this.data.result1) && this.isOperatorEnd(event.target.id)) return;
      // 如果计算结果有小数点，直到输入运算符前不能再输入小数点
      if (this.data.completeCalculate && this.data.result1.indexOf('.') != -1 && event.target.id == '.') return;
      // 如果数额为零则不能完成
      if (result1 == '0.00') return;
      for (var i = 0; i < this.data.valiBackOfArray.length - 1; i++) {
        if (this.data.valiBackOfArray[i] == event.target.id) {
          this.setData({
            completeCalculate: false
          });
          break;
        }
      }
      this.setData({
        result1: this.data.result1 + event.target.id
      });
    }
  }
  }
}) 