$(function() {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称的长度要在1~6之间';
            }
        }
    })

    initUserInfo();

    function initUserInfo() {
        $.ajax({
            method: 'Get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');
                }
                console.log(res);
                form.val('formUserinfo', res.data);
            }
        })
    }

    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo();
    })

    $('.layui-form').on('submit', function(e) {
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg("更新用户信息失败");
                }

                layer.msg("更新用户信息成功");

                window.parent.getUserInfo();
            }
        })
    })
})