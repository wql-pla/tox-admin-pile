// var ajaxUrl = "http://elec.toxchina.com/ToxElec_2"; //服务器
// var ajaxUrl = "http://electest.toxchina.com:8081"; //涛
var ajaxUrl = "http://192.168.1.64:8081"; //磊
// var ajaxUrl = "http://192.168.1.120:8080"; //涛
// var ajaxUrl = "http://192.168.1.146:8080"; //涛11
// var ajaxUrl = "http://192.168.1.91:8085"; //星

//弹出层控件
var layer = layui.layer;
//元素控件
var element = layui.element;
//分页控件
var laypage = layui.laypage;
//时间控件
var laydate = layui.laydate;
//表单控件
var form = layui.form;
//下拉多选
var formSelects = layui.formSelects;

var utils = {
    ajaxbefore: function() {
        $.ajaxSetup({            
            beforeSend: function(XMLHttpRequest) {
                var cpname = window.sessionStorage.getItem("cpname");
                var token = window.sessionStorage.getItem("token");
                if (token != null) {
                    XMLHttpRequest.setRequestHeader("token", token); // 增加一个自定义请求头
                    XMLHttpRequest.setRequestHeader("cpname", cpname); // 增加一个自定义请求头
                } else {
                    XMLHttpRequest.setRequestHeader("token", "");
                    // window.location.href = utils.getRootPath() + "/tox-admin-pile1/html/login.html"
                }
            },
            xhrFields: {  withCredentials: true  },
            crossDomain: true,
        });
    },
    getRootPath: function() {
        var strFullPath = window.document.location.href;
        var strPath = window.document.location.pathname;
        var pos = strFullPath.indexOf(strPath);
        var prePath = strFullPath.substring(0, pos);
        return prePath;
    },
    /*弹出层*/
    /*
        参数解释：
        title   标题
        url     请求的url
        id      需要操作的数据id
        w       弹出层宽度（缺省调默认值）
        h       弹出层高度（缺省调默认值）
    */
    _open: function(title, url, w, h) {
        if (title == null || title == '') {
            title = false;
        };
        if (url == null || url == '') {
            url = "404.html";
        };
        if (w == null || w == '') {
            w = 90;
        };
        if (h == null || h == '') {
            h = 90;
        };
        if ($(window).width() < 768) {
            w = 100;
            h = 100;
        }
        layer.open({
            type: 2,
            // anim: 2,
            // shift: 1,
            /*0-6*/
            area: [w + '%', h + '%'],
            fix: false, //不固定
            maxmin: true,
            shade: 0.6,
            title: title,
            content: url,
            scrollbar: false,
        });
    },
    /*关闭弹出框口*/
    _close: function() {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    },
    _msg: function(msg, callback) {
        layer.msg(msg || '操作成功', {
            icon: 1,
            time: 1000,
            shade: 0.4,
        }, function() {
            ("function" == typeof callback) && callback();
        });
    },
    _confirm: function(msg, callback) {
        layer.confirm(msg || '确认操作？', {
            icon: 3,
            time: 0, //不自动关闭
            btn: ['确认', '取消'] //按钮
        }, function() {
            ("function" == typeof callback) && callback();
        }, function(index) {
            layer.close(index);
        });
    },
    _alert: function(msg, callback) {
        layer.alert(msg, {
            icon: 7,
            shift: 6, //shake
        }, function(index) {
            layer.close(index);
            (callback && ("function" == typeof callback)) && callback();
        });
    },
    _tips: function(content, duringTime) {
        layer.msg(content, { time: duringTime, shift: 6, shade: 0.6 }, function() {});
    },
    _loading: function(callback, msg) {
        var myloading = layer.msg(msg || '加载中...', {
            icon: 16,
            shade: 0.4,
            time: false
        });
        new Promise(function(resolve, reject) {
            ("function" == typeof callback) && callback();
            // setTimeout(resolve, 200)
            resolve('数据加载完毕');
        }).then(function(value) {
            layer.close(myloading);
        })
    },
    /**
     * [pages 分页]
     * @param  {[type]}   total [数据总数]
     * @param  {Function} cb    [回调]
     * @param  {[type]}   data  [传入回调的参数]
     * @return {[type]}         [description]
     */
    pages: function(total, cb, data) {
        var mypgs = data.pageSize;
        var mylimit = (mypgs == -1 ? total : mypgs);
        laypage.render({
            elem: 'pageWrap',
            count: total,
            limit: mylimit,
            groups: 10, //连续显示分页数
            first: '首页', //将首页显示为数字1,。若不显示，设置false即可
            last: '尾页', //将尾页显示为总页数。若不显示，设置false即可
            prev: '<i class="layui-icon"></i>',
            next: '<i class="layui-icon"></i>',
            layout: ['prev', 'page', 'next', 'count', 'limit', 'skip'],
            jump: function(obj, first) {
                // console.log(obj)
                if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                    data.pageNum = obj.curr - 1;
                    data.pageSize = obj.limit;
                    utils._loading(function() {
                        cb && cb(data);
                    });
                }
            }
        });
    },
    start2endDate: function(startEle, endEle, startCb, endCb) {
        var startDate = laydate.render({
            elem: startEle,
            type: 'datetime',
            max: "2099-12-31 23:59:59", //设置一个默认最大值
            done: function(value, datas) {
                //开始日选好后，重置结束日的最小日期
                var date = {
                    year: datas.year,
                    month: datas.month - 1, //关键
                    date: datas.date,
                    hours: datas.hours,
                    minutes: datas.minutes,
                    seconds: datas.seconds
                };
                endDate.config.min = date; //开始日选好后，重置结束日的最小日期
                endDate.config.value = date; //将结束日的初始值设定为开始日
                (startCb && ("function" == typeof startCb)) && startCb(value);
            }
        });

        var endDate = laydate.render({
            elem: endEle,
            type: 'datetime',
            min: "1970-1-1 00:00:00", //设置min默认最小值
            done: function(value, datas) {
                var date = {
                    year: datas.year,
                    month: datas.month - 1, //关键
                    date: datas.date,
                    hours: datas.hours,
                    minutes: datas.minutes,
                    seconds: datas.seconds
                };
                startDate.config.max = date; //结束日选好后，重置开始日的最大日期
                (endCb && ("function" == typeof endCb)) && endCb(value);
            }
        });
    },
    selectAll: function(allChoose, choose) {
        // $('thead input[type="checkbox"]').prop("checked", false);
        // //全选  
        // form.on(`checkbox(${allChoose})`, function(data) {
        //     var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
        //     child.each(function(index, item) {
        //         item.checked = data.elem.checked;
        //     });
        //     form.render('checkbox');
        // });
        // form.on(`checkbox(${choose})`, function(data) {
        //     var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
        //     var childChecked = $(data.elem).parents('table').find('tbody input[type="checkbox"]:checked');
        //     if (childChecked.length == child.length) {
        //         $(data.elem).parents('table').find(`thead input#${allChoose}`).get(0).checked = true;
        //     } else {
        //         $(data.elem).parents('table').find(`thead input#${allChoose}`).get(0).checked = false;
        //     }
        //     form.render('checkbox');
        // });
        // form.render('checkbox');
        $('thead input[type="checkbox"]').prop("checked", false);
        //全选  
        form.on('checkbox(' + allChoose + ')', function(data) {
            var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
            child.each(function(index, item) {
                item.checked = data.elem.checked;
            });
            form.render('checkbox');
        });
        form.on('checkbox(' + choose + ')', function(data) {
            var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
            var childChecked = $(data.elem).parents('table').find('tbody input[type="checkbox"]:checked');
            if (childChecked.length == child.length) {
                $(data.elem).parents('table').find('thead input#' + allChoose).get(0).checked = true;
            } else {
                $(data.elem).parents('table').find('thead input#' + allChoose).get(0).checked = false;
            }
            form.render('checkbox');
        });
        form.render('checkbox');
    },
    //获取url参数
    GetUrlpara: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    initString: function() {
        String.prototype.format = function() {
            if (arguments.length == 0) return this;
            for (var s = this, i = 0; i < arguments.length; i++)
                s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
            return s;
        };
    },
    initDate: function() {
        Date.prototype.format = function(fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份 
                "d+": this.getDate(), //日 
                "h+": this.getHours(), //小时 
                "m+": this.getMinutes(), //分 
                "s+": this.getSeconds(), //秒 
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                "S": this.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        }
    },
    formatDate: function(millisecond, num) {
        if (!millisecond) return '';
        switch (num) {
            case 0:
                return new Date(millisecond).format('yyyy年MM月dd日');
                break;
            case 1:
                return new Date(millisecond).format('yyyy-MM-dd');
                break;
            case 2:
                return new Date(millisecond).format('yyyy-MM-dd hh:mm:ss');
                break;
            default:
                return new Date(millisecond).format('yyyy-MM-dd');
                break;
        }
    },

    /**
     * [toExcel 导出excel]
     * @param  {[type]}   tableName [列表id、类名]
     * @param  {[type]}   excelName [文件名]
     * @param  {[type]}   pageSize  [数据大小]
     * @param  {Function} callback  [回调]
     * @return {[type]}             [description]
     */
    toExcel: function(tableName, excelName, pageSize, callback) {
        utils._confirm('确认导出？', function() {
            utils._loading(function() {
                new Promise(function(resolve, reject) {
                    ("function" == typeof callback) && callback(pageSize);
                    resolve('列表数据全部加载完毕');
                    // setTimeout(resolve, 300)
                }).then(function(value) {
                    $(tableName).table2excel({
                        exclude: ".noExl",
                        name: "Excel Document Name",
                        filename: excelName + new Date().toLocaleString(),
                        fileext: ".xls",
                        exclude_img: true,
                        exclude_links: true,
                        exclude_inputs: true
                    });
                });
            }, '导出中，请稍后...');

            // layer.msg(, {
            //     icon: 16,
            //     shade: 0.6,
            //     time: 1500
            // }, function() {

            // });
        });
    },
    //下拉模板
    selTemplate: function(ele, num, type) {
        var urls = [
            { name: '门店', url: '/store/nameList' },
            { name: '供应商', url: '/firm/getFirmNames' },
            { name: '桩站', url: '/station/selectAllStations' },
            { name: '城市', url: '/station/selectStationCity' }
        ];
        $.ajax({
                async: false,
                url: ajaxUrl + urls[num].url,
                type: 'get',
                dataType: 'json',
                contentType: 'application/json',
            })
            .done(function(res) {
                // console.log(res);
                $(ele).html("");
                var str = "<option value='' name=''>请选择</option>";
                switch (type) {
                    case 0:
                        //门店信息
                        $.each(res.data, function(i, o) {
                            str += "<option name=" + o.name + " value=" + o.id + ">" + o.name + "</option>";
                        });
                        break;
                    case 1:
                        //供应商信息
                        $.each(res.firms, function(i, o) {
                            str += "<option name=" + o.firmName + " value=" + o.firmName + " data-firmid=" + o.id + ">" + o.firmName + "</option>";
                        });
                        break;
                    case 2:
                        //供应商默认选择第一项
                        $.each(res.firms, function(i, o) {
                            if (i == 0) {
                                str += "<option selected='selected' name=" + o.firmName + " value=" + o.id + ">" + o.firmName + "</option>";
                            } else {
                                str += "<option name=" + o.firmName + " value=" + o.id + ">" + o.firmName + "</option>";
                            }
                        });
                        break;
                    case 3:
                        //桩站信息
                        $.each(res.data, function(i, o) {
                            str += "<option name=" + o.stationName + " value=" + o.id + ">" + o.stationName + "</option>";
                        })
                        break;
                    case 4:
                        //城市
                        $.each(res.data, function(i, o) {
                            str += "<option value=" + o.CITY + ">" + utils.splice(o.CITY) + "</option>";
                        })
                        break;
                    case 5:
                        //门店信息默认选择第一项
                        $.each(res.data, function(i, o) {
                            if (i == 0) {
                                str += "<option selected='selected' name=" + o.name + " value=" + o.id + ">" + o.name + "</option>";
                            } else {
                                str += "<option name=" + o.name + " value=" + o.id + ">" + o.name + "</option>";
                            }
                        });
                        break;
                }
                $(ele).html(str);
                form.render('select');
            })
            .fail(function(err) { console.log(err); })
    },
    // //获取门店信息
    // getStore: function(strHtml, res) {
    //     $.each(res.data, function(i, o) {
    //         strHtml += "<option name=" + o.name + " value=" + o.id + ">" + o.name + "</option>";
    //     });
    //     return strHtml;
    // },
    // //获取供应商信息
    // getFirmNames: function(strHtml, res) {
    //     $.each(res.firms, function(i, o) {
    //         strHtml += "<option name=" + o.firmName + " value=" + o.firmName + " data-firmid=" + o.id + ">" + o.firmName + "</option>";
    //     })
    //     return strHtml;
    // },
    // getFirmNamesSelected: function(strHtml, res) {
    //     //获取默认选择第一个
    //     $.each(res.firms, function(i, o) {
    //         if (i == 0) {
    //             strHtml += "<option selected='selected' name=" + o.firmName + " value=" + o.id + ">" + o.firmName + "</option>";
    //         } else {
    //             strHtml += "<option name=" + o.firmName + " value=" + o.id + ">" + o.firmName + "</option>";
    //         }
    //     })
    //     return strHtml;
    // },
    // //获取桩站信息
    // getPile: function(strHtml, res) {
    //     $.each(res.data, function(i, o) {
    //         strHtml += "<option name=" + o.stationName + " value=" + o.id + ">" + o.stationName + "</option>";
    //     })
    //     return strHtml;
    // },
    // //获取城市
    // getCity: function(strHtml, res) {
    //     $.each(res.data, function(i, o) {
    //         strHtml += "<option value=" + o.CITY + ">" + utils.splice(o.CITY) + "</option>";
    //     })
    //     return strHtml;
    // },

    // getAuthority: function(ele, data) {
    //     $(ele).html("");
    //     var str = "<option value=''>请输入或选择</option>";
    //     var items = data.data;
    //     $.each(items, function(i, o) {
    //         str += "<option value=" + o.id + ">" + o.name + "</option>";
    //     })
    //     $(ele).html(str);
    //     form.render();
    // },
    getSelectList: function(ele, num, type) {
        var urls = [
            { name: '组织结构', url: '/organization/selectOrganizations' },
            { name: '角色选择', url: '/role/selectroleList' },
            { name: '优惠券信息', url: '/coupons/selectCoupons' },
            { name: '优惠组合', url: '/coupons/selectGroupCoupons' },
        ];
        $.ajax({
                async: false,
                url: ajaxUrl + urls[num].url,
                type: 'post',
                data: JSON.stringify({ pageNum: 0, pageSize: -1 }),
                dataType: 'json',
                contentType: 'application/json',
            })
            .done(function(res) {
                // console.log(res);
                $(ele).html("");
                var str = "<option value='' name=''>请选择</option>";
                switch (type) {
                    case 0:
                        //组织结构
                        $.each(res.data.list, function(i, o) {
                            str += "<option value=" + o.id + ">" + o.name + "</option>";
                        })
                        break;
                    case 1:
                        //组织结构所属部门
                        $.each(res.data.list, function(i, o) {
                            str += "<option value=" + o.id + ">" + o.rolename + "</option>";
                        })
                        break;
                    case 2:
                        //优惠券信息
                        $.each(res.data.list, function(i, o) {
                            str += "<option name='" + o.fromDate + "," + o.toDate + "'  value=" + o.id + ">" + o.name + "</option>";
                        })
                        break;
                    case 3:
                        //优惠组合信息
                        $.each(res.data.list, function(i, o) {
                            str += "<option value=" + o.id + ">" + o.name + "</option>";
                        })
                        break;

                }
                $(ele).html(str);
                form.render('select');
            })
            .fail(function(err) { console.log(err); })
    },
    splice: function(city) {
        var cityStr = '';
        if (city != null && city.indexOf('市') != -1) {
            cityStr = city.split('市')[0] + '市';
        } else {
            cityStr = city
        }
        return cityStr == null ? '' : cityStr
    },
    /**
     * 节流函数，通过控制每次事件执行的时间间隔控制短时间多次执行方法
     * @param  {[type]} handler [要执行的方法]
     * @param  {[type]} wait    [每次点击事件执行的时间间隔(毫秒)]
     * @return {[type]}         [description]
     */
    throttle: function(fn, delay) {
        var timer = null;
        return function() {
            var context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function() {
                fn.apply(context, args); //context调用fn的方法，指针指向了fn
            }, delay);
        }
    },
    /**
     * 解决小数精度问题
     * @param {*数字} a
     * @param {*数字} b
     * @param {*符号} sign
     * fixedFloat(0.3, 0.2, '-')
     */
    fixedFloat: function(a, b, sign) {
        // 补0
        function padding0(p) {
            var z = ''
            while (p--) {
                z += '0'
            }
            return z
        }

        function handle(x) {
            var y = String(x)
            var p = y.lastIndexOf('.')
            if (p === -1) {
                return [y, 0]
            } else {
                return [y.replace('.', ''), y.length - p - 1]
            }
        }
        // v 操作数1, w 操作数2, s 操作符, t 精度
        function operate(v, w, s, t) {
            switch (s) {
                case '+':
                    return (v + w) / t
                case '-':
                    return (v - w) / t
                case '*':
                    return (v * w) / (t * t)
                case '/':
                    return (v / w)
            }
        }

        var c = handle(a)
        var d = handle(b)
        var k = 0

        if (c[1] === 0 && d[1] === 0) {
            return operate(+c[0], +d[0], sign, 1)
        } else {
            k = Math.pow(10, Math.max(c[1], d[1]))
            if (c[1] !== d[1]) {
                if (c[1] > d[1]) {
                    d[0] += padding0(c[1] - d[1])
                } else {
                    c[0] += padding0(d[1] - c[1])
                }
            }
            return operate(+c[0], +d[0], sign, k)
        }
    },
    //对字符串进行加密 
    compileStr: function(code) {
        var c = String.fromCharCode(code.charCodeAt(0) + code.length);
        for (var i = 1; i < code.length; i++) {
            c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
        }
        return escape(c);
    },
    //字符串进行解密   
    uncompileStr: function(code) {
        code = unescape(code);
        var c = String.fromCharCode(code.charCodeAt(0) - code.length);
        for (var i = 1; i < code.length; i++) {
            c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
        }
        return c;
    },
    isNull: function(val) {
        return val == null ? '' : val;
    },
    nullToString: function(val) {
        return (val == null || val == '') ? '---' : val;
    },
    isUndefined: function(val) {
        return (val == undefined || val == 'undefined') ? '' : val;
    },
    fillZero: function(val) {
        return val == null ? 0 : val;
    },
    checkDate: function(val) {
        return (val == null || val == '') ? '' : new Date(val);
    },
    /**
     * [getJson description]
     * @param  {[type]} key [key]
     * @param  {[type]} num [后台转换数字]
     * @return {[type]}     [description]
     */
    getJson: function(key, num) {
        if (num == null) {
            return '';
        } else {
            var obj = {
                "chargeStatus": ['充电完成', '正在充电', '开启充电桩失败'], //充电状态
                "pileStatus": ['空闲', '占用', '空闲'], //电桩状态
                "publishStatus": ['下线', '上线'], //桩站发布状态
                "qtStatus": ['停用', '启用', '建设中'], //桩站启停状态
                "couponType": ['立减', '折扣', '首单免费', '满减', '免单'], //优惠券类型
                "qtActivity": ['停用', '启用'], //活动启停状态
                "qtType": ['新注册', '老带新'], //活动类型
            };
            for (var item in obj) {
                if (item == key) { //item 表示Json串中的属性，如'name'  
                    var arr = obj[item]; //key所对应的value  
                    return arr[num];
                }
            }
        }
    },
    checkPileStatus: function(val) {
        //电桩状态
        var str = '';
        if (val == null) {
            str = '初始版本';
        } else if (val == 0) {
            str = '电桩不在线';
        } else if (val == 1) {
            str = '升级中';
        } else if (val == 2) {
            str = '升级成功';
        } else {
            str = '升级失败';
        }
        return str;
    },
    //修改ip
    ipStatus: function(val) {
        var str = '';
        if (val == null) {
            str = '初始IP';
        } else if (val == 0) {
            str = '修改失败';
        } else if (val == 1) {
            str = '修改中';
        } else if (val == 2) {
            str = '修改成功';
        }
        return str;
    },
    productType: function(val) {
        var str = '';
        if (val == null) {
            str = '';
        } else if (val == 3) {
            str = '交流单枪';
        } else if (val == 4) {
            str = '交流双枪';
        } else if (val == 5) {
            str = '直流单枪';
        } else if (val == 6) {
            str = '直流双枪';
        }
        return str;
    }
}
/*
    发送token
 */
utils.ajaxbefore();
/*
    时间戳初始化
 */
utils.initDate();
/*
    字符串初始化
 */
utils.initString();