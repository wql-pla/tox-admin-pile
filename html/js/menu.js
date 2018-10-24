//加载元素
var element = layui.element;
//触发事件
var tab = {
    tabAdd: function(title, url, id) {
        //新增一个Tab项
        element.tabAdd('xbs_tab', {
            title: title,
            content: '<iframe tab-id="' + id + '" frameborder="0" src="' + url + '?timestamp=' + new Date().getTime() + '" scrolling="yes" class="x-iframe"></iframe>',
            id: id
        })
    },
    tabDelete: function(othis) {
        //删除指定Tab项
        element.tabDelete('xbs_tab', '44'); //删除
        othis.addClass('layui-btn-disabled');
    },
    tabChange: function(id) {
        //切换到指定Tab项
        $('#loading').fadeIn('fast', function() {
            var _this = this;
            $("iframe[tab-id='" + id + "']").attr("src", $("iframe[tab-id='" + id + "']").attr("src").split('?')[0] + '?timestamp=' + new Date().getTime()).on('load', function() {
                $(_this).fadeOut('fast', function() {
                    element.tabChange('xbs_tab', id); //切换
                    if ($(window).width() < 768) {
                        $('.left-nav').animate({ left: '-220px' }, 100);
                        $('.page-content').animate({ left: '0px' }, 100);
                        $('.page-content-bg').hide();
                    }
                });
            }); //切换后刷新框架
        });
    }
};

var menu = {
    init: function() {
        var data = [
            //系统管理
            {
                "F_ModuleId": "0",
                "F_FullName": "系统管理",
                "F_Icon": "&#xe6ce;",
                "F_UrlAddress": null,
                "F_ChildNodes": [
                    { "F_ModuleId": "0", "F_FullName": "组织机构管理", "F_UrlAddress": "./pages/system/organize/organizeList.html" },
                    { "F_ModuleId": "1", "F_FullName": "角色管理", "F_UrlAddress": "./pages/system/role/roleList.html" },
                    { "F_ModuleId": "2", "F_FullName": "管理员管理", "F_UrlAddress": "./pages/system/manager/managerList.html" },
                    { "F_ModuleId": "3", "F_FullName": "门店管理", "F_UrlAddress": "./pages/system/store/storeList.html" },
                    { "F_ModuleId": "4", "F_FullName": "充值模板", "F_UrlAddress": "./pages/system/rechargetpl/rechargetplList.html" },
                ]
            },
            {
                "F_ModuleId": "1",
                "F_FullName": "会员管理",
                "F_Icon": "&#xe723;",
                "F_UrlAddress": null,
                "F_ChildNodes": [
                    { "F_ModuleId": "5", "F_FullName": "会员信息", "F_UrlAddress": "./pages/membership/vip/vipList.html" },
                ]
            },
            {
                "F_ModuleId": "2",
                "F_FullName": "电桩信息管理",
                "F_Icon": "&#xe723;",
                "F_UrlAddress": null,
                "F_ChildNodes": [
                    { "F_ModuleId": "6", "F_FullName": "供应商管理", "F_UrlAddress": "./pages/pileInfo/supplier/supplierList.html" },
                    { "F_ModuleId": "7", "F_FullName": "电桩管理", "F_UrlAddress": "./pages/pileInfo/pile/pileList.html" },
                ]
            },
            {
                "F_ModuleId": "3",
                "F_FullName": "发布管理",
                "F_Icon": "&#xe723;",
                "F_UrlAddress": null,
                "F_ChildNodes": [
                    { "F_ModuleId": "8", "F_FullName": "桩站管理", "F_UrlAddress": "./pages/publish/station/stationList.html" },
                    { "F_ModuleId": "9", "F_FullName": "电桩发布", "F_UrlAddress": "./pages/publish/elecPublish/elecPileList.html" },
                ]
            },
            {
                "F_ModuleId": "4",
                "F_FullName": "订单管理",
                "F_Icon": "&#xe723;",
                "F_UrlAddress": null,
                "F_ChildNodes": [
                    { "F_ModuleId": "10", "F_FullName": "订单管理", "F_UrlAddress": "./pages/order/orderManage/orderList.html" },
                ]
            },
            {
                "F_ModuleId": "5",
                "F_FullName": "财务管理",
                "F_Icon": "&#xe723;",
                "F_UrlAddress": null,
                "F_ChildNodes": [
                    { "F_ModuleId": "11", "F_FullName": "充值流水信息", "F_UrlAddress": "./pages/finance/recharge/rechargeList.html" },
                    { "F_ModuleId": "12", "F_FullName": "余额退款流水信息", "F_UrlAddress": "./pages/finance/returnMoney/returnMoneyList.html" },
                    { "F_ModuleId": "13", "F_FullName": "用户资金明细", "F_UrlAddress": "./pages/finance/moneyDetail/moneyList.html" },
                ]
            },
            {
                "F_ModuleId": "6",
                "F_FullName": "运营管理",
                "F_Icon": "&#xe723;",
                "F_UrlAddress": null,
                "F_ChildNodes": [
                    { "F_ModuleId": "14", "F_FullName": "优惠券管理", "F_UrlAddress": "./pages/operate/coupon/couponList.html" },
                    { "F_ModuleId": "15", "F_FullName": "兑换码管理", "F_UrlAddress": "./pages/operate/exchangeCode/exchangeCodeList.html" },
                    { "F_ModuleId": "16", "F_FullName": "活动管理", "F_UrlAddress": "./pages/operate/activity/activityList.html" },
                ]
            },
        ];
        var serverData = JSON.parse(window.sessionStorage.getItem("menu"));
        if (serverData && serverData != null) {
            var _html = "";
            $.each(serverData, function(i, o) {
                _html += '<li class="' + (i == 0 ? "open" : "") + '">';
                _html += '<a href="javascript:;">';
                _html += '<i class="iconfont">&#xe723;</i>';
                _html += '<cite>' + o.name + '</cite>';
                _html += '<i class="iconfont nav_right">' + (i == 0 ? "&#xe6a6;" : "&#xe697;") + '</i>';
                _html += '</a>';
                var childNodes = o.bason;
                if (childNodes.length > 0) {
                    _html += '<ul class="sub-menu" style="' + (i == 0 ? "display:block" : "display:none") + '">';
                    $.each(childNodes, function(index, item) {
                        (i == 0 && index == 0) && $(".x-iframe").eq(0).attr('src', item.url);
                        _html += '<li class="' + ((i == 0 && index == 0) ? "active" : "") + '">';
                        _html += '<a href="javascript:void(0);" _id="' + item.id + '" _href="' + item.url + '">';
                        _html += '<cite>' + item.name + '</cite>';
                        _html += '</a>';
                        _html += '</li>';
                    });
                    _html += '</ul>';
                }
                _html += '</li>';
            });
            $("#nav").html(_html);
        } else {
            var _html = "";
            $.each(data, function(i, o) {
                _html += '<li class="' + (i == 0 ? "open" : "") + '">';
                _html += '<a href="javascript:;">';
                _html += '<i class="iconfont">' + o.F_Icon + '</i>';
                _html += '<cite>' + o.F_FullName + '</cite>';
                _html += '<i class="iconfont nav_right">' + (i == 0 ? "&#xe6a6;" : "&#xe697;") + '</i>';
                _html += '</a>';
                var childNodes = o.F_ChildNodes;
                if (childNodes.length > 0) {
                    _html += '<ul class="sub-menu" style="' + (i == 0 ? "display:block" : "display:none") + '">';
                    $.each(childNodes, function(index, item) {
                        (i == 0 && index == 0) && $(".x-iframe").eq(0).attr('src', item.url);
                        _html += '<li class="' + ((i == 0 && index == 0) ? "active" : "") + '">';
                        _html += '<a href="javascript:void(0);" _id="' + item.F_ModuleId + '" _href="' + item.F_UrlAddress + '">';
                        _html += '<cite>' + item.F_FullName + '</cite>';
                        _html += '</a>';
                        _html += '</li>';
                    });
                    _html += '</ul>';
                }
                _html += '</li>';
            });
            $("#nav").html(_html);
        }
    },
    options: function() {
        //展开左侧栏
        $('.container .left_open i').click(function(event) {
            if ($('.left-nav').css('left') == '0px') {
                $('.left-nav').animate({ left: '-220px' }, 100);
                $('.page-content').animate({ left: '0px' }, 100);
                $('.page-content-bg').hide();
            } else {
                $('.left-nav').animate({ left: '0px' }, 100);
                $('.page-content').animate({ left: '220px' }, 100);
                if ($(window).width() < 768) {
                    $('.page-content-bg').show();
                }
            }
        });
        //移动端遮罩
        $('.page-content-bg').click(function(event) {
            $('.left-nav').animate({ left: '-220px' }, 100);
            $('.page-content').animate({ left: '0px' }, 100);
            $(this).hide();
        });
        //初始加载去掉遮罩
        $(".x-iframe").eq(0).on('load', function() {
            $("#loading").fadeOut('fast');
        });
        //阻止第一个关闭
        $('.layui-tab-close').click(function(event) {
            // console.log(0);
            $('.layui-tab-title li').eq(0).find('i').remove();
        });

        //左侧菜单效果
        $('.left-nav #nav li').click(function(event) {
            if ($(this).children('.sub-menu').length) {
                // 点击的为第一层--打开菜单
                if ($(this).hasClass('open')) {
                    // 关
                    $(this).removeClass('open');
                    $(this).find('.nav_right').html('&#xe697;');
                    $(this).children('.sub-menu').stop().slideUp('false');
                    $(this).siblings().children('.sub-menu').slideUp();
                } else {
                    // 开
                    $(this).addClass('open');
                    $(this).children('a').find('.nav_right').html('&#xe6a6;');
                    $(this).children('.sub-menu').stop().slideDown();
                    $(this).siblings().children('.sub-menu').stop().slideUp();
                    $(this).siblings().find('.nav_right').html('&#xe697;');
                    $(this).siblings().removeClass('open');
                }
            } else {
                //点击的为第二层--跳转页面
                $(".left-nav #nav li .sub-menu li").removeClass('active');
                $(this).addClass('active');
                var hasTab = false;
                var title = $(this).find('cite').html();
                var url = $(this).children('a').attr('_href');
                var id = $(this).children('a').attr('_id');
                window.sessionStorage.setItem('_href', url);
                window.sessionStorage.setItem('_id', id);
                var index = $('.left-nav #nav li').index($(this));
                for (var i = 0; i < $('.x-iframe').length; i++) {
                    if ($('.x-iframe').eq(i).attr('tab-id') == index + 1) {
                        // 点击左侧，如果已经存在iframe，则切换Tab
                        hasTab = true;
                        tab.tabChange(index + 1);
                        event.stopPropagation();
                        return;
                    }
                };
                if (!hasTab) {
                    //动态新增一个Tab项
                    tab.tabAdd(title, url, index + 1);
                    //切换到指定Tab项
                    tab.tabChange(index + 1);
                }
            }
            event.stopPropagation();
        });

        if (window.sessionStorage.getItem('_href') != null && window.sessionStorage.getItem('_id') != null) {
            $('#loading').fadeIn('fast', function() {
                var _this = this;
                $(".left-nav #nav li .sub-menu li").removeClass('active');
                $(".left-nav #nav li").removeClass('open');

                $(".x-iframe").eq(0).attr("src", window.sessionStorage.getItem('_href').split('?')[0] + '?timestamp=' + new Date().getTime()).on('load', function() {
                    $(_this).fadeOut('fast');
                    $(".left-nav #nav li .sub-menu li a[_id=" + window.sessionStorage.getItem('_id') + "]").parent('li').addClass('active');
                    $(".left-nav #nav li .sub-menu li a[_id=" + window.sessionStorage.getItem('_id') + "]").parents('#nav>li').click();
                });
            });
        }
    }
}

//初始化左侧菜单栏
menu.init();
//初始化左侧菜单栏操作
menu.options();