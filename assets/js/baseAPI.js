$.ajaxPrefilter(function(option) {
    option.url = 'http://api-breakingnews-web.itheima.net' + option.url;
    console.log(option.url);

    if (option.url.indexOf('/my') !== -1) {
        option.header = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    option.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败") {
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    }
})


// 唯有权限的请求统一设置header请求头