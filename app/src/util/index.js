export const urlParse = (url) => {
  let arr = []
  let obj = {}
  if (url.indexOf('?') !== -1) {
    var parseStr = url.split('?')[1]
    if (parseStr.indexOf('&') !== -1) {
      arr = parseStr.split('&')
      for (var i = 0; i < arr.length; i++) {
        obj[arr[i].split('=')[0]] = arr[i].split('=')[1]
      }
    } else {
      obj[parseStr.split('=')[0]] = parseStr.split('=')[1]
    }
  }
  return obj
}

export const os = (() => {
  const u = navigator.userAgent
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  return {
    isAndroid,
    isIOS
  }
})()
