import moment from "moment/moment";

let getToday = function getToday () {
  let today;

  today = moment(new Date()).format('YYYY-MM-DD');
  return today ;
}

let getYesterday = function getYesterday () {
  let yesterday;
  yesterday =moment(new Date()).add(-1, 'days').format('YYYY-MM-DD') ;
  return yesterday
}
let getCurrentMonth = function getCurrentMonth () {
  let currentMonth;
  currentMonth =moment(new Date()).format('YYYY-MM') ;
  return currentMonth
}

export {
  getToday,
  getYesterday,
  getCurrentMonth
}
