$(function() {
    var layer = layui.layer;
    var form = layer.form;
    var laypage = layui.laypage;

    // 定义时间过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = dt.getMonth() + 1;
        var d = dt.getDay();

        var h = dt.getHours();
        var mm = dt.getMinutes();
        var ss = dt.getSeconds();

        return y + '-' + m + '-' + d + '' + h + ':' + mm + ':' + ss;
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initable();
    initcate();

    function initable() {
        $.ajax({
            method: 'GET',
            url: '/my/artical/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据局失败');
                }
                layer.msg('获取数据局成功');

                var htmlStr = template('tel-table', res);
                $('tbody').html(htmlStr);

                renderPage(res.total);
            }
        })
    }

    function initcate() {
        $.ajax({
            method: 'GET',
            url: '/my/artical/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取数据失败");
                }
                var dt = template('tel-cate', res);
                $('[name=cate_id]').html(dt);

                form.render();
            }
        })
    }

    $('#form-search').on('sumbit', function(e) {
        e.preventDefault();

        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();

        q.cate_id = cate_id;
        q.state = state;

        initable();
    })

    // 渲染分页
    function renderPage(total, first) {
        laypage.render({
            elem: 'pagebox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 页面发生跳转是，被调用
            jump: function(obj) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;

                if (!first) {
                    initable();
                }
            }
        })
    }

    $('tbody').on('', '.btn-delete', function(e) {
        var len = $('.btn-delete').length;

        var id = $(this).attr('data-id');
        layer.confirm('is not?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/artical/delete' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除数据失败");
                    }

                    layer.msg("删除数据成功");

                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initable();
                }
            })
            layer.close(index);
        });

    })
})