function uploadImage(file, callback) {
  showLoading("上传图片中...");
  $.post({
    url: '/manage/upload_token',
    dataType: "json",
    success: function (res) {
      var token = res.uptoken;
      var fd = new FormData();
      fd.append('file', file);
      fd.append('token', token);
      $.post({
        url: '//upload.qiniup.com/',
        data: fd,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (res) {
          if (typeof callback === 'function') {
            callback(res);
          } else {
            throw new Error('callback is not type of function')
          }
        },
        fail: function () {
          alert("图片上传失败！(qiniu)")
        }
      })
    },
    fail: function () {
      alert('系统错误，上传失败！(token fail)')
    },
    complete: function () {
      hideLoading();
    }
  });
}


function uploadVideo(file, callback) {
  showLoading("上传视频中...");
  $.post({
    url: '/manage/upload_video_token',
    dataType: "json",
    success: function (res) {
      var token = res.uptoken;
      var fd = new FormData();
      fd.append('file', file);
      fd.append('token', token);
      $.post({
        url: '//upload.qiniup.com/',
        data: fd,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (res) {
          if (typeof callback === 'function') {
            callback(res);
          } else {
            throw new Error('callback is not type of function')
          }
        },
        fail: function () {
          alert("视频上传失败！(qiniu)")
        }
      })
    },
    fail: function () {
      alert('系统错误，上传失败！(token fail)')
    },
    complete: function () {
      hideLoading();
    }
  });
}
