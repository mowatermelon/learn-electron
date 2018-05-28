'use strict'

/**
 * 时间格式化方法
 * @param {Date} iDate，需要进行转换的日期
 * @param {Number} type 格式，一共有两种情况，。
 *                      一种是0，将原始的日期转成yyyy-MM-dd hh:mm:ss格式，默认的格式。
 *                      一种是1，是将原始的日期转换成yyyyMMddhhmmss格式
 *                      一种是2，是将原始的日期转换成yyyy-MM-dd
 */
function formatDate(iDate, type) {
  iDate = iDate.toLocaleString("zh-CN", {
    hour12: false
  }); //将默认的日期按照当地的日期格式进行转移，这边转化的效果是yyyy/M/d h:m:s
  iDate = iDate.replace(/\b\d\b/g, '0$&'); //将yyyy/M/d h:m:s中的月份，日期，时间只有一位的，用0进行补位，比如将2018/5/14 转换成2018/05/14
  switch (type) {
    case 0:
      {
        iDate = iDate.replace(new RegExp('/', 'gm'), '-'); //将日期转换成yyyy-MM-dd hh:mm:ss
        break;
      }
    case 1:
      {
        iDate = iDate.replace(/\/|\:|\s/g, ''); //将日期转换成yyyyMMddhhmmss
        break;
      }
    case 2:
      {
        iDate = iDate.replace(new RegExp('/', 'gm'), '-').substr(0, 10); //将日期转换成yyyy-MM-dd hh:mm:ss
        break;
      }
  }
  return iDate;
}

/**
 * 打印正常日志的方法
 * @param {Any} variable  需要打印的变量值，必选
 */
function log(variable) {
  console.log(variable);
}
/**
 * 打印消息日志的方法
 * @param {Any} variable  需要打印的变量值，必选
 */
function info(variable) {
  console.info(variable);
}
/**
 * 打印错误日志的方法
 * @param {Any} variable  需要打印的变量值，必选
 */
function err(variable) {
  console.error(variable);
}