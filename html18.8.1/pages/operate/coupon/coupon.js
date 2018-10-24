(function($) {
    var pca = {};

    pca.keys = {};
    pca.ckeys = {};

    var initname = '';

    pca.init = function(eleId1, eleId2, initdata1, initdata2) {
        if (!$(pca.G(eleId1)) || !$(pca.G(eleId1)).length) return;
        $(pca.G(eleId1)).html('');
        for (var i in arr) {
            $(pca.G(eleId1)).append('<option>' + arr[i].name + '</option>');
            pca.keys[arr[i].name] = arr[i];
            initname = arr[0];
        }
        form.render('select');
        if (initdata1) $(pca.G(eleId1)).next().find('[lay-value="' + initdata1 + '"]').click();


        if (!pca.G(eleId2) || !$(pca.G(eleId2)).length) return;
        pca.formRender(pca.G(eleId2), initname);
        form.on('select(' + eleId1 + ')', function(data) {
            var ks = pca.keys[data.value];
            pca.formRender(pca.G(eleId2), ks);
            $(pca.G(eleId2)).next().find('.layui-this').removeClass('layui-this').click();
            pca.formHidden(eleId1, data.value);
        });
        if (initdata1) $(pca.G(eleId1)).next().find('[lay-value="' + initdata1 + '"]').click();
        if (initdata2) $(pca.G(eleId2)).next().find('[lay-value="' + initdata2 + '"]').click();


        var ljtpl = $('#lj').detach(); //立减
        var mjtpl = $('#mj').detach(); //满减
        var zktpl = $('#zk').detach(); //折扣
        $(pca.G('moneyInput')).html(ljtpl);
        form.on('select(' + eleId2 + ')', function(data) {
            var cks = pca.ckeys[data.value];
            var title = cks.name;
            if (title === '立减') {
                $(pca.G('moneyInput')).html(ljtpl);
            } else if (title === '满减') {
                $(pca.G('moneyInput')).html(mjtpl);
            } else if (title === '折扣') {
                $(pca.G('moneyInput')).html(zktpl);
            } else if (title === '免单') {
                $(pca.G('moneyInput')).html('');
            }
        });
        if (initdata1) $(pca.G(eleId1)).next().find('[lay-value="' + initdata1 + '"]').click();
        if (initdata2) $(pca.G(eleId2)).next().find('[lay-value="' + initdata2 + '"]').click();
    }

    pca.formRender = function(obj, res) {
        $(obj).html('');
        if (res) {
            res = res.subs;
            for (var i in res) {
                $(obj).append('<option>' + res[i].name + '</option>');
                pca.ckeys[res[i].name] = res[i];
            }
            $(obj).find('option:eq(0)').attr('selected', true);
        }
        form.render('select');
    }

    pca.formHidden = function(obj, val) {
        // 添加隐藏域
        if (!$('#pca-hide-' + obj).length)
            $('body').append('<input id="pca-hide-' + obj + '" type="hidden" value="' + val + '" />');
        else
            $('#pca-hide-' + obj).val(val);
    }
    pca.G = function(id) {
        return document.getElementById(id);
    }
    var arr = [
        { "name": "固定金额", "subs": [{ "name": "立减" }, { "name": "满减" }] },
        { "name": "浮动金额", "subs": [{ "name": "折扣" }, { "name": "免单" }] }
    ];

    window.pca = pca;
    return pca;
})($);