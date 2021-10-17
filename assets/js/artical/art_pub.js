$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initCate();

    // 初始化富文本编辑器
    initEditor()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/artical/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }

                var htmlStr = template('tpl-cate', res);

                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择封面
    $('#btnChooseImage').on('click', function() {
        console.log("dksjflksd");
        $('#coverFile').click();
    })

    $('#coverFile').on('change', function(e) {
        var file = e.target.files;

        if (file.length === 0) {
            return layer.msg('请选择封面');
        }

        var newImgURL = URL.createObjectURL(file[0]);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    var art_state = '已发布';
    $('#btnSave2').on('click', function() {
        var art_state = '草稿';
    })

    $('#art-pub').on('sumbit', function(e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);

        fd.append('state', art_state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);

                publishAtical(fd);
            })


    })

    function publishAtical(fd) {
        $.ajax({
            method: "POST",
            url: '/my/artical/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("发布文章失败");
                }
                layer.msg("发布文章成功");

                location.href = '/artical/art_list.html';
            }
        })
    }
})