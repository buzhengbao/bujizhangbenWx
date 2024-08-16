// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
//定义云数据库
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    
    const { IAE, priceDate, remark, result1, text, img, yue } = event
    const result = await db.collection('tally').add({
      data:{
        IAE,
        priceDate,
        remark,
        result1,
        text,
        img,
        yue,
        addTime:Date.now()
      }
    })
    return {
      status: 'ok',
      result
    }
  }catch{
    console.log(err)
    return {
      status:'fail',
      error
    }
  }

}