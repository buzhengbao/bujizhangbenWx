//index.js
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    const { imgSrc, text } = event //获取传递给云函数的参数
    const result = await db.collection('tallyInIcon').add({//向数据库集合news中添加记录
      data:{
        imgSrc,
        text,
        addTime: Date.now()//当前时间
      }
    })
    return{//返回成功信息
      status:'ok',
      result
    }
  }catch(error){
    console.log(error)
    return{//返回失败信息
      status:'fail',
      error
    }
  }
}