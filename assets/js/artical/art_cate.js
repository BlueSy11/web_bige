$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initArtCateList();

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/artical/cates',
            success: function(res) {
                var htmlStr = template('tel-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    var indexAdd = null;
    $('#btnAddCate').on('click', function() {

        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章类别',
            content: $('#dialog-add').html()
        })
    })

    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/artical/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('添加类别失败');
                }
                initArtCateList();
                layer.msg('添加类别成功');

                layer.close(indexAdd);
            }
        })
    })

    var indexEdit = null;

    $('tbody').on('click', '#btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章类别',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id');
        $.ajax({
            method: "GET",
            url: '/my/artical/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        })
    })

    $('tbody').on('sumbit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/artical/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('更新数据失败');
                }
                layer.msg('更新数据成功');
                layer.close(indexEdit);
                initArtCateList();
            }

        })
    })

    $('tbody').on('click', '#btn-delete', function(e) {
        var id = $(this).attr('data-id');
        layer.confirm('is not?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/artical/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败');
                    }
                    layer.msg('删除分类成功');
                    layer.close(index);
                    initArtCateList();
                }
            })

            // layer.close(index);
        });

    })


})