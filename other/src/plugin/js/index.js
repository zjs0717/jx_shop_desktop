export const S4 = () =>
  (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
export const guid = () =>
  `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;



// LocalStorage与SessionStorage封装
function StorageSet(storageString) {
  const storage = window[storageString];

  if (!window[storageString]) {
    // alert("浏览器支持"+storageString);
    return false;
  }

  const set = (key, value) => {
    storage.setItem(key, JSON.stringify(value));
  };

  const get = (key) => {
    let mydata = storage.getItem(key);

    if (!mydata) {
      return false;
    }
    try {
      mydata = JSON.parse(mydata);
    }
    catch(err) {
      return mydata;
    }
    
    return mydata;
  };

  const remove = (key) => {
    storage.removeItem(key);
  };

  const clear = () => {
    storage.clear();
  };

  return {
    set,
    get,
    remove,
    clear,
  };
}
// 图片加载失败之后再加载次数
export let errorNum = 4

// 匹配 \textcircled{1}、\textcircled{ 1 }、\textcircled 1 等多种写法
var convertTextcircledToUnicode = (str, tag) => {
  if(str.indexOf('textcircled') == -1) return str;
  const mapping = {
        // 数字 1-9 -> ①-⑨
        '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤',
        '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨',
        // 汉字数字 一至九 -> ㊀-㊉
        '一': '㊀', '二': '㊁', '三': '㊂', '四': '㊃', '五': '㊄',
        '六': '㊅', '七': '㊆', '八': '㊇', '九': '㊈',
        '十': '㊉',
        // 方向
        '上': '㊤', '下': '㊦', '左': '㊧', '右': '㊨'
  };
  // 正确的 validChars：数字 1-9 用 [1-9] 表示字符类，其他汉字直接写
    const validChars = '[1-9]|一|二|三|四|五|六|七|八|九|十|上|下|左|右';
    const regex = new RegExp(`\\\\textcircled\\s*(?:\\{\\s*(${validChars})\\s*\\}|\\s*(${validChars}))`, 'g');

    return str.replace(regex, (match, withBraces, withoutBraces) => {
        const token = withBraces || withoutBraces;
        return mapping[token] || match;
    });

}
// .replace(/\\left\\{/g, '\\left \\{')
// 渲染前强制标准化
const normalizeLatex = (latex) =>{
  // 修复 \left 和定界符粘连：\left( → \left (
  // 修复 \right 和定界符粘连：\right) → \right )
  return latex
    .replace(/\\left\s*\(/g, '\\left (')
    .replace(/\\left\s*\[/g, '\\left [')
    .replace(/\\left\s*\{/g, '\\left {')
    .replace(/\\right\s*\)/g, '\\right )')
    .replace(/\\right\s*\]/g, '\\right ]')
    .replace(/\\right\s*\}/g, '\\right }')
}
/*图片*/
export var strToUrlCmelement = (str) => {
  
// console.log('[ str ] >', str)
  if (!str || typeof str != "string") return "";

  str = str.toString();
  // str += `<span class="latex"></span>`;
  // 匹配latex 公式
  try {
    // 处理成<span class="latex">
      str = str.replace(/<(\w+)([^>]*)>/g, function(match, tag, attrs) {
                            if (/\bclass=["']latex["']/.test(attrs)) {
                                // 只保留class="latex"
                                return '<' + tag + ' class="latex">';
                            }
                            return match;
                        });
    var pattern = /<span class="latex">(.+?)<\/span>|\$\$(.+?)\$\$|\$(.*?)\$|\\\((.*?)\\\)|\\\[(.*?)\\\]/g;
    str = convertTextcircledToUnicode(str);
    str = str.replace(/\\symbfit\{([^}]+)\}/g, '\\boldsymbol{$1}');
    str = str.replace(/\\begin\{array\}\{\*\{\d+\}\{([lrc|]+)\}\}/g, '\\begin{array}{$1}');

    // 将begin{align}替换为begin{aligned}
    str = str.replace(/\\begin\{align\}/g, '\\begin{aligned}').replace(/\\end\{align\}/g, '\\end{aligned}');
    str = normalizeLatex(str);
    // console.log('str', str);
    // var pattern1 = /<(span)\s+class="(latex)">(.*?)<\/span>/;
    str = str.replace(pattern, function ($1, $2, $3, $4, $5, $6) {
      try {
        let formula = $2 || $3 || $4 || $5 || $6 || $1;
        const isDisplay = !!($2 || $3); // $$ 或 \[ ] 为块级公式
        formula = htmlUnescape(formula);
        let katexHtml = katex.renderToString(formula, {
          displayMode: isDisplay,
          throwOnError: false,
        });
        // 去除katexHtml换行符
        katexHtml = katexHtml.replace(/[\r\n]/g, "");
        return katexHtml
      } catch (e) {
        console.error('KaTeX 渲染错误:', e);
        return $1;
      }
    })
  } catch (error) {
    console.error(error)
  }

  str = str.replace(/[\r\n]/g, "<br>");
  str = str.replace(/[\r\n]{1,}/g, "");
  str = str.replace(/[\r\n]*$/g, "");
  str = str.replace(/http:\/\//g, "https:\/\/");
  // 替换全角下划线为半角双划线
  str = str.replace(/＿/g, "__");
  try {
    // 去除text-wrap: nowrap;
    str = str.replace(/text-wrap:\s*nowrap;?\s*/g, '');
  } catch (error) {
    console.error('text-wrap:\s*nowrap;?\s*/g',error)
  }

  return autoEmbedUrls(str);

  try {
    //如果已经是html格式  直接返回
    if (/<img\b[^>]*>|<audio\b[^>]*>/.test(str)){
      // 处理图片标签  只保留src属性
      str = str.replace(/<\s*img\s+[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi, (match, src) => {
        let imgSrc = src.replace(/(https?:\/\/[\w/.-]+\.(?:mp3|jpg|jpeg|png|gif))(?:\?[^"\s<>]*)?/gi,'$1');
        // 检查 src 是否以指定扩展名结尾（不区分大小写）
        if (/\.(mp3|jpg|jpeg|png|gif)$/i.test(imgSrc)) {
          return imgSrc;   // 符合条件，替换为链接
        }
        return match;     // 不符合条件，保留原标签
      });
    };
  }catch (error) {
    console.error('mp3|jpg|jpeg|png|gif',error)
  }
  return str.replace(
    /https?:\/\/[^<>]+?\.(mp3|jpg|jpeg|png|gif)/gi,
    function(w) {
      
      if (/mp3$/i.test(w)) {
        return "<audio src=" + w + " controls />";
      } else {
        return `<img style='max-width:100%;vertical-align:middle;' src="${w}" />`;
      }
    }
  );
};
const autoEmbedUrls = (text) => {
const tags = [];

// 1. 先解码常见 HTML 实体（可选，更健壮）
// text = decodeHtmlEntities(text); // 如果需要，启用此行

// 2. 保护所有 HTML 标签
let clean = text.replace(/<[^>]*>/g, tag => {
  tags.push(tag);
  return `__TAG_${tags.length - 1}__`;
});

// 3. 将 &nbsp; 替换为空格（关键修复！）
// clean = clean.replace(/&nbsp;/gi, ' ');
// 4. 将媒体链接转换为 HTML（音频和图片）此时里面不包含标签
clean = clean.replace(
  /https?:\/\/[^\s<>"]+?\.(mp3|jpg|jpeg|png|gif)(\?[^\s<>"]*)?/gi,
  (url, ext) => {
    ext = ext.toLowerCase();
    if (ext === 'mp3') {
      return `<audio src="${url}" controls />`;
    } else {
      return `<img class="media-middle" style="vertical-align: middle; max-width: 100%;" src="${url}" />`;
    }
  }
);
clean = clean.replace(/__TAG_(\d+)__/g, (_, idx) => tags[parseInt(idx, 10)]);
return clean;
}


// HTML 实体解码辅助函数
export const htmlUnescape = (str) => {
  const tmp = document.createElement('textarea');
  tmp.innerHTML = str;
  return tmp.value;
};

export const LocalStorage = StorageSet("localStorage");
export const SessionStorage = StorageSet("sessionStorage");


/**
 * 将秒转化为时分秒
 * @param {Number | String}  = [value]  秒
 * @param {String}   = [type]  返回时间格式 d:h m:s
 * @param {Boolean} filter 去除时间段为0的
 */
export const cmFormatSeconds = (value, type = 'h:m:s', filter) => {
  
  value = value || 0;
  type = type || 'h:m:s'
  let result = parseInt(value)
    function minTen(num) {
            return num > 9 ? num : "0" + num;
    }
    
    const times = {
            d: minTen(Math.floor(result / 86400)),
            h: type.length > 6 ? minTen(Math.floor(result / 3600 % 24)) : minTen(Math.floor(result / 3600)),
            m: minTen(Math.floor((result / 60 % 60))),
            s: minTen(Math.floor((result % 60)))
    }
  let time = "";
  for (let t of type) {
        time = time + (times[t] || t);
  }
  
	if (filter) {
		time = time.replace(/^((00\D{1})*)|((00\D{1})*)$/, '')
	}
  return time;

};

/**
 *
 * @param {数字转中文数字} value
 */
export const ArabelToCN = (i) => {
  var arrNum = [
    "零",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
    "十",
    "佰",
  ];
  if (i <= 10) {
    return arrNum[i];
  } else if (i < 20) {
    return arrNum[10] + (i % 10 > 0 ? arrNum[parseInt(i % 10)] : "");
  } else if (i < 100) {
    return (
      arrNum[parseInt(i / 10)] +
      arrNum[10] +
      (i % 10 > 0 ? arrNum[parseInt(i % 10)] : "")
    );
  }
  return i;
};

/**
 * 题型，题型code转文字
 */
export const questionType = (val) => {
  let str = "单选";
  const num = val + "";
  switch (num) {
    case "2":
      str = "多选";
      break;
    case "3":
      str = "判断";
      break;
    case "4":
      str = "填空";
      break;
    case "5":
      str = "主观";
      break;
    case "6":
      str = "复合";
      break;
    default:
      str = "单选";
  }
  
  return str;
};


/**
 * 处理数据
 */
export const paperDataHandler = (item) => {
  if (!item.type) {
    item.type = item.type || item.smallType
  }
  return item;
};


// 节流
let previous = 0;
export const cmThrottle = (that, func, wait) => {
	
	let now = Date.now();
	let args = arguments;
	if (now - previous > wait) {
		func.apply(that, args);
		previous = now;
	}
}


/**
 * 获取媒体设备权限并处理各种错误情况
 * @param {Boolean} videoEnabled  
 * @param {Boolean} audioEnabled 
 * @returns {Promise<MediaStream>}
 * @throws {Error} 如果获取媒体设备失败，将抛出错误
 * 此函数用于请求用户的媒体设备权限（摄像头和麦克风），并处理可能出现的各种错误情况。
 * 如果成功获取媒体流，将返回一个 MediaStream 对象。
 * 如果获取失败，将根据错误类型显示相应的提示信息。
 */
export const liveHandleUserMedia = (videoEnabled = true, audioEnabled = true) => {
  console.log('请求媒体设备权限', videoEnabled, audioEnabled);
    return new Promise(async (resolve, reject) => {
        try {
          // 请求媒体设备权限
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      
          // 检查视频轨道是否存在（如果请求了视频）
          if (videoEnabled && !stream.getVideoTracks().length) {
            resolve({
              code: 1001,
              message: "没有获取到视频轨道"
            }); // 成功获取媒体流，返回
            return
          }
      
          // 检查音频轨道是否存在（如果请求了音频）
          if (audioEnabled && !stream.getAudioTracks().length) {
            resolve({
              code: 1002,
              message: "没有获取到音频轨道"
            })
            return
          }
          resolve({
            code: '000000',
            stream: stream
          })
      
        } catch (error) {
          console.log(error, '获取媒体设备失败');
          // 处理各种错误情况
          const errList = [{
              code: 'NotAllowedError',
              message: '用户拒绝授权'
            }, {
              code: 'NotFoundError',
              message: '没有找到媒体设备'
            }, {
              code: 'SecurityError',
              message: '安全错误'
            }, {
              code: 'NotAllowedError',
              message: '用户拒绝授权'
            }, {
              code: 'AbortError',
              message: '获取媒体设备的请求被中止'
            }, {
              code: 'TypeError',
              message: `请使用https://${window.location.host}访问`
            }, {
              code: 'UnknownError',
              message: '获取媒体设备失败'
            },
          ];
          const err = errList.find(item => item.code === error.name);
          if (err) {
            resolve({
              code: 1003,
              message: err.message
            }) // 成功获取媒体流，返回
          } else {
            resolve({
              code: 1004,
              message: '未知错误：' + error.message
            }) // 成功获取媒体流，返回
          }
        }
    })
}

