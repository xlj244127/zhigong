/**
 * Created by Administrator on 2017/5/26.
 */
import curry from 'lodash/curry'
import flowRight from 'lodash/flowRight'
// Cache processor
const Cache = {
  get: (key) => {
    if (!window.sessionStorage) {return false}
    return JSON.parse(window.sessionStorage.getItem(key))
  },
  set: (key, data) => {
    if (!window.sessionStorage) {return false}
    window.sessionStorage.setItem(key, JSON.stringify(data))
    return true
  },
  has: (key) => Boolean(window.sessionStorage && window.sessionStorage.hasOwnProperty(key)),
  clear: () => {
    if (!window.sessionStorage) {return false}
    window.sessionStorage.clear()
  },
  del: (key) => {
    if (!window.sessionStorage) {return false}
    window.sessionStorage.removeItem(key)
  }
}
const LocalCache = {
  get: (key) => {
    if (!window.localStorage) {return false}
    return JSON.parse(window.localStorage.getItem(key))
  },
  set: (key, data) => {
    if (!window.localStorage) {return false}
    window.localStorage.setItem(key, JSON.stringify(data))
    return true
  },
  has: (key) => Boolean(window.localStorage && window.localStorage.hasOwnProperty(key)),
  clear: () => {
    if (!window.localStorage) {return false}
    window.localStorage.clear()
  },
  del: (key) => {
    if (!window.localStorage) {return false}
    window.localStorage.removeItem(key)
  }
}

/**
 *
 * 常用工具类
 *
 */

const commonly = {
  match: curry(function (what, str) {
    return str.match(what)
  }),
  filter: curry(function (f, arr) {
    return arr.filter(f)
  }),
  map: curry(function (f, arr) {
    return arr.map(f)
  }),
  replace: curry(function (what, replacement, str) {
    return str.replace(what, replacement)
  }),
  split: curry(function (what, str) {
    return str.split(what)
  }),
  find: curry(function (f, arr) {
    return arr.find(f)
  }),
  prop: curry(function (p, obj) {
    return obj[p]
  }),
  /**
   *  组合函数  从右到左 (左倾)
   * @param f
   * @param g
   * @returns {Function}
   */
  compose: flowRight,
  /**
   * 辅助函数  用于组合debug
   */
  trace: curry(function (tag, x) {
    console.log(tag, x)
    return x
  }),
  isEmptyObject (obj) {
    for (let o in obj) {
      return false
    }
    return true
  }

};

let getQuery = function (para) {
  var reg = new RegExp('(^|&)' + para + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
};

let getTimer = function (time) {
  time = time >> 0
  if (time <= 60 && time > 0) {
    return '1分钟'
  }
  /*let hour = Math.floor(time / 60 / 60);
  let minute = Math.floor(time / 60 % 60);
  let second = time % 60 % 60;
  if (hour < 10) {
      hour = "0" + hour;
  }
  if (minute < 10) {
      minute = "0" + minute;
  }
  if (second < 10) {
      second = "0" + second;
  }*/

  return Math.round(time / 60) + '分钟'
};

/** * 用于把用utf16编码的字符转换成实体字符，以供后台存储 * @param {string} str 将要转换的字符串，其中含有utf16字符将被自动检出 * @return {string} 转换后的字符串，utf16字符将被转换成&#xxxx;形式的实体字符 */
let utf16toEntities = function utf16toEntities (str) {
  var patt = /[\ud800-\udbff][\udc00-\udfff]/g // 检测utf16字符正则
  str = str.replace(patt, function (char) {
    var H, L, code
    if (char.length === 2) {
      H = char.charCodeAt(0) // 取出高位
      L = char.charCodeAt(1) // 取出低位
      code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00 // 转换算法
      return '&#' + code + ';'
    } else {
      return char
    }
  });
  return str
};

let fiiterEmoji = function (str) {
  var patt = /[\ud800-\udbff][\udc00-\udfff]/g // 检测utf16字符正则
  str = str.replace(patt, '');
  return str
};

let getScrollParent = function getScrollParent (elm) {
  if (elm.tagName == 'BODY') {
    return window
  } else if (['scroll', 'auto'].indexOf(window.getComputedStyle(elm).overflowY) > -1) {
    return elm
  }
  return getScrollParent(elm.parentNode)
};

let getCurrentDistance = function getCurrentDistance (elm, dir) {
  let distance;
  const scrollTop = isNaN(elm.scrollTop) ? elm.pageYOffset : elm.scrollTop
  if (dir === 'top') {
    distance = scrollTop
  } else {
    const scrollElmHeight = elm === window ? window.innerHeight : elm.getBoundingClientRect().height;

    distance = this.$el.offsetTop - scrollTop - scrollElmHeight - (elm.offsetTop || 0)
  }
  return distance;
};

let validator = {
    isWeiXin () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 判断是否是一个正确的中文名字，名字只能包含中英文
     * @param name
     */
    isChineseName(name) {
        var reg = /^([\u4E00-\u9FA5\uF900-\uFA2D a-zA-Z]+，?)+$/;
        return reg.test(name);
    },
    /**
     * 判断是否是一个手机号
     * @param mobile
     */
    isMobile(mobile) {
        var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|19[0-9]|14[57])[0-9]{8}$/;
        return reg.test(mobile);
    },
    /**
     * 判断是否是数字
     * @param num
     */
    isNumber(num) {
        var reg = /^[0-9]*$/;
        return reg.test(num);
    },
    /**
     * 判断是否是英文和数字
     * @param eng
     */
    isEng(eng) {
        var reg = /^\w+$/;
        return reg.test(eng);
    },
    /**
     * 判断是否是一个邮箱
     * @param email
     */
    isEmail(email) {
        var reg = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        return reg.test(email);
    }
};

export {
    Cache,
    LocalCache,
    commonly,
    getQuery,
    utf16toEntities,
    fiiterEmoji,
    getTimer,
    getScrollParent,
    getCurrentDistance,
    validator
}
