/**
 *
 * @param {参数} options
 * @param {成功回调} success
 * @param {错误回调} error
 * @returns {Promise<MediaStream>|void}
 */

export function getUserMedia(options, success, error) {
  // 1. 现代 Promise API
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return navigator.mediaDevices
               .getUserMedia(options)
               .then(success)
               .catch(error);
  }

  // 2. 旧回调 API
  const legacyGetUserMedia =               // ← 起个不会冲突的名字
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

  // 浏览器连旧 API 也没有 → 直接抛错
  if (!legacyGetUserMedia) {
    return Promise.reject(
      new Error('getUserMedia is not supported in this browser')
    );
  }

  // 旧 API 必须手动包一层 Promise，保持接口统一
  return new Promise((resolve, reject) => {
    legacyGetUserMedia.call(
      navigator,
      options,
      stream => { resolve(stream); success && success(stream); },
      err   => { reject(err);   error && error(err); }
    );
  });
}

export const isSafariBrowser = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)

export const isFirefox = /Firefox/.test(navigator.userAgent)
