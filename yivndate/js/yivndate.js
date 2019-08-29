;
(function($, window, document, undefined) {

    //将日历样式文件插入页面

    //$("<link rel='stylesheet' href=''>")

    //为选择框创建容器
    var $yedate = $('<div class="hywdate"></div>');
    $("body").append($yedate);

    //创建日历类
    function Calendar(selector, options) {

        this.selector = selector;
        this.options = {
            type: options.type,
            outerdom: options.outerdom,
            callback: options.callback,
            isused: options.isused,
            toolbar: options.toolbar
        };
        this.init();

    }

    Calendar.prototype = {

        constructor: Calendar,

        init: function() {

            var _that = this;
            this.element = $('<div id="calendar-frame" class=""></div>');
            this.toolbarStr = '<div class="calendar-toolbar"><a class="clear-date">清空</a><a class="current-date">当前</a></div>';

            if (this.options.type === "date" || !this.options.type) { //当type为日期或者没指定type时默认显示日历

                this.initDate();

            } else if (this.options.type === "year") { //当type为年度时

                this.initYear();

            } else if (this.options.type === "month") { //当type为月份时

                this.initMonth();

            } else if (this.options.type === "quarter") { //当type为季度时

                this.initQuarter();

            } else if (this.options.type === "half") { //当type为半年时

                this.initHalf();

            }

            // if (this.options.toolbar == true) { //如果有工具栏参数，则显示工具栏
            //     var toolbarStr = '<div class="calendar-toolbar"><a class="clear-date">清空</a><a class="current-date">当前</a></div>';
            //     this.element.append(toolbarStr);

            // }

            // 点击绑定元素，显示选择框
            this.selector.off("click").on("click", function(e) {

                _that.showElement(e);

            });


            if (this.options.outerdom) { //如果外部触发元素存在
                $(this.options.outerdom).off("click").on("click", function(e) {
                    _that.showElement(e);
                });
            }

            if (this.options.isused) { //如果禁用日历弹窗
                //......
            }



            this.element.on("click", function(e) {
                var e = e ? e : window.event;
                if (document.all) { //只有ie识别
                    e.cancelBubble = true;
                } else {
                    e.stopPropagation();
                }
            });




        },

        showElement: function(e) { //显示选择框
            var _that = this;
            var e = e ? e : window.event;

            if (document.all) { //只有ie识别
                e.cancelBubble = true;
            } else {
                e.stopPropagation();
            }

            var position = _that.selector.offset(); //获得依靠元素在视口的位置
            _that.element.css("left", position.left);
            _that.element.css("top", position.top + _that.selector.outerHeight() + 5); //将选择框放置在绑定元素的下方

            $(".hywdate").append(_that.element);

            _that.element.siblings("#calendar-frame").hide();

            _that.element.fadeToggle(100);

            if (_that.element.is(":visible")) { //如果选择框可见，则点击其它地方选择框隐藏
                $(document).on("click", function() {
                    _that.element.fadeOut(200);
                });
            }

            // $(document).bind('click', function(e) {
            //     //如果筛选框显示
            //     if (_that.element.is(":visible")) {
            //         var e = e || window.event; //浏览器兼容性 
            //         var elem = e.target || e.srcElement;
            //         //循环判断至跟节点，防止点击的是div子元素 
            //         while (elem) {
            //             if (elem.id && elem.id == 'calendar-frame') {
            //                 return;
            //             }
            //             elem = elem.parentNode;
            //         }
            //         //点击的不是指定元素或其子元素则隐藏指定元素
            //         _that.element.fadeOut(200);
            //     }
            // });


            window.onresize = function() { //当窗口大小改变时，日期选择框的位置紧跟输入框
                var position = _that.selector.offset(); //获得依靠元素在视口的位置
                _that.element.css("left", position.left);
                _that.element.css("top", position.top + _that.selector.outerHeight() + 5); //将选择框放置在绑定元素的下方
            }
        },

        initHalf: function() { //初始化上下半年选择框

            var _that = this;
            var month = dateObj.getDate().getMonth() + 1;
            var cur_half = "";
            this.calendar_half = $('<div class="calendar-half"></div>');
            var halfStr = '<li class="item" data="1">上半年</li>' +
                '<li class="item" data="2">下半年</li>';
            this.calendar_half.html(halfStr);
            this.element.append(this.calendar_half);

            if (this.options.toolbar == true) { //如果有工具栏参数，则显示工具栏
                this.element.append(this.toolbarStr);
            }

            this.element.show();

            this.half_item = this.calendar_half.find(".item");
            this.tool_bar = this.element.find(".calendar-toolbar");
            this.clear_date = this.tool_bar.find(".clear-date");
            this.current_date = this.tool_bar.find(".current-date");
            if (month >= 1 && month < 7) {
                cur_half = "上半年";
            } else {
                cur_half = "下半年";
            }

            this.half_item.each(function(i) {
                if ($(this).text() === cur_half) {
                    $(this).attr("class", "item item-curHalf");
                } else {
                    $(this).attr("class", "item");
                }

            });

            this.clear_date.on("click", function() {
                _that.clearDate();
                _that.element.fadeOut(300);
            });

            this.current_date.on("click", function() {
                _that.selector.val(cur_half);
                _that.element.fadeOut(300);
            });

            this.half_item.on("click", function() {
                _that.half_item.removeClass("item-curHalf");
                $(this).addClass("item-curHalf");

                //将选定值放置到绑定元素中
                _that.selector.val($(this).text());
                _that.element.fadeOut(300);
                if (_that.options.callback) { //选定后回调
                    _that.options.callback($(this).text());
                }

            });

        },

        initQuarter: function() { //初始化季度选择框

            var _that = this;
            var month = dateObj.getDate().getMonth() + 1;
            var cur_quarter = "";
            this.calendar_quarter = $('<div class="calendar-quarter"></div>');
            var quarterStr = '<li class="item" data="1">第一季度</li>' +
                '<li class="item" data="2">第二季度</li>' +
                '<li class="item" data="3">第三季度</li>' +
                '<li class="item" data="4">第四季度</li>';
            this.calendar_quarter.html(quarterStr);
            this.element.append(this.calendar_quarter);

            if (this.options.toolbar == true) { //如果有工具栏参数，则显示工具栏
                this.element.append(this.toolbarStr);
            }

            this.element.show();

            this.quarter_item = this.calendar_quarter.find(".item");
            this.tool_bar = this.element.find(".calendar-toolbar");
            this.clear_date = this.tool_bar.find(".clear-date");
            this.current_date = this.tool_bar.find(".current-date");
            if (month >= 1 && month < 4) {
                cur_quarter = "第一季度";
            } else if (month < 7) {
                cur_quarter = "第二季度";
            } else if (month < 10) {
                cur_quarter = "第三季度";
            } else {
                cur_quarter = "第四季度";
            }

            this.quarter_item.each(function(i) {
                //console.log($(this).text());
                if ($(this).text() === cur_quarter) {
                    $(this).attr("class", "item item-curQuarter");
                } else {
                    $(this).attr("class", "item");
                }

            });

            this.clear_date.on("click", function() {
                _that.clearDate();
                _that.element.fadeOut(300);
            });


            this.current_date.on("click", function() {
                _that.selector.val(cur_quarter);
                _that.element.fadeOut(300);
            });

            this.quarter_item.on("click", function() {
                _that.quarter_item.removeClass("item-curQuarter");
                $(this).addClass("item-curQuarter");

                //将选定值放置到绑定元素中
                _that.selector.val($(this).text());
                _that.element.fadeOut(300);
                if (_that.options.callback) { //选定后回调
                    _that.options.callback($(this).text());
                }

            });

        },

        initMonth: function() { //初始化月份选择框

            var _that = this;
            var curMonth = dateObj.getDate().getMonth() + 1;

            this.renderMonth();
            this.month_item = this.calendar_month.find(".item");
            this.tool_bar = this.element.find(".calendar-toolbar");
            this.clear_date = this.tool_bar.find(".clear-date");
            this.current_date = this.tool_bar.find(".current-date");
            this.month_item.each(function(i) {
                var _flag = +$(this).attr("data");
                if (_flag === curMonth) {
                    $(this).attr("class", "item curMonth");
                } else {
                    $(this).attr("class", "item");
                }
            });

            this.clear_date.on("click", function() {
                _that.clearDate();
                _that.element.fadeOut(300);
            });

            this.current_date.on("click", function() {
                var _date = new Date();
                _that.selector.val((_date.getMonth() + 1));
                _that.element.fadeOut(300);
            })

            this.month_item.on("click", function() {
                _that.month_item.removeClass("curMonth");
                $(this).addClass("curMonth");

                //将选定值放置到绑定元素中
                _that.selector.val($(this).attr("data"));
                _that.element.fadeOut(200);
                if (_that.options.callback) { //选定后回调
                    _that.options.callback($(this).attr("data"));
                }

            });

        },

        renderMonth: function() { //渲染月份选择框

            this.calendar_month = $('<ul class="calendar-month"></ul>');
            var monthStr = '<li class="item" data="1">一月</li>' +
                '<li class="item" data="2">二月</li>' +
                '<li class="item" data="3">三月</li>' +
                '<li class="item" data="4">四月</li>' +
                '<li class="item" data="5">五月</li>' +
                '<li class="item" data="6">六月</li>' +
                '<li class="item" data="7">七月</li>' +
                '<li class="item" data="8">八月</li>' +
                '<li class="item" data="9">九月</li>' +
                '<li class="item" data="10">十月</li>' +
                '<li class="item" data="11">十一月</li>' +
                '<li class="item" data="12">十二月</li>';

            this.calendar_month.html(monthStr);
            this.element.append(this.calendar_month);

            if (this.options.toolbar == true) { //如果有工具栏参数，则显示工具栏
                this.element.append(this.toolbarStr);
            }

            this.element.show();


        },

        initYear: function() { //初始化年份选择框

            var _that = this;
            this.renderYear();
            this.tool_bar = this.element.find(".calendar-toolbar");
            this.year_range = this.calendar_title.find(".year");
            this.year_item = this.calendar_years.find(".item");
            this.year_pre = this.calendar_title.find(".years-pre"); //上一批年份
            this.year_next = this.calendar_title.find(".years-next"); //下一批年份
            this.clear_date = this.tool_bar.find(".clear-date");
            this.current_date = this.tool_bar.find(".current-date");
            this.loadYear();

            this.usableYear = this.calendar_years.find(".item-usableYear");
            this.disabledYear = this.calendar_years.find(".item-disabledYear");

            this.year_pre.on("click", function() { //上一批年份
                var _date = dateObj.getDate();
                dateObj.setDate(new Date(_date.getFullYear() - 15, _date.getMonth(), _date.getDate()));
                _that.loadYear();
            });

            this.year_next.on("click", function() { //下一批年份
                var _date = dateObj.getDate();
                dateObj.setDate(new Date(_date.getFullYear() + 15, _date.getMonth(), _date.getDate()));
                _that.loadYear();

            });

            this.year_item.hover(function() {
                if ($(this).hasClass("item-disabledYear")) { //如果年份不可用，则显示禁用鼠标
                    $(this).addClass("item-cursor");
                }
            });

            this.clear_date.on("click", function() {
                _that.clearDate();
                _that.element.fadeOut(300);
            });

            this.current_date.on("click", function() {
                //alert(231);
                var _date = new Date();
                _that.selector.val(_date.getFullYear());
                _that.element.fadeOut(300);

            })


            this.year_item.click(function() {
                if ($(this).hasClass("item-usableYear")) { //如果年份可用，则可选
                    _that.year_item.removeClass("item-curYear");
                    $(this).addClass("item-curYear");

                    //将选定值放置到绑定元素中
                    _that.selector.val($(this).attr("data"));
                    _that.element.fadeOut(300);
                    if (_that.options.callback) { //选定后回调
                        _that.options.callback($(this).attr("data"));
                    }

                }
            })

        },

        renderYear: function() { //渲染年份选择框
            var _that = this;
            this.calendar_title = $('<div class="calendar-title"></div>');
            this.calendar_years = $('<ul class="calendar-year"></ul>');

            var titleStr = '<span class="years-pre iconfont icon-left-db-arrow"></span>' +
                '<a class="title year" href="#">419684169</a>' + '<span class="years-next iconfont icon-right-db-arrow">';
            var yearStr = '<li class="item">1</li>' +
                '<li class="item">2</li>' +
                '<li class="item">3</li>' +
                '<li class="item">4</li>' +
                '<li class="item">5</li>' +
                '<li class="item">6</li>' +
                '<li class="item">7</li>' +
                '<li class="item">8</li>' +
                '<li class="item">9</li>' +
                '<li class="item">10</li>' +
                '<li class="item">11</li>' +
                '<li class="item">12</li>' +
                '<li class="item">13</li>' +
                '<li class="item">14</li>' +
                '<li class="item">15</li>';

            this.calendar_title.html(titleStr);
            this.calendar_years.html(yearStr);

            this.element.append(this.calendar_title, this.calendar_years);

            if (this.options.toolbar == true) { //如果有工具栏参数，则显示工具栏
                this.element.append(this.toolbarStr);
            }

            this.element.show();

        },

        clearDate: function() { //清空日期
            this.selector.val("");
        },

        loadYear: function() { //载入年份选择框数据

            var _that = this;
            this.curYear = dateObj.getDate().getFullYear();

            var titleStr = (this.curYear - 7) + "年 - " + (this.curYear + 7) + "年";

            this.year_range.text(titleStr);

            this.year_item.each(function(i) {
                $(this).text(_that.curYear - 7 + i);
                $(this).attr("data", _that.curYear - 7 + i);

                if ((new Date().getFullYear()) === _that.curYear - 7 + i) { //当前年份
                    $(this).attr("class", "item item-usableYear item-curYear");
                } else if ((new Date().getFullYear()) < _that.curYear - 7 + i) { //大于当前年份不可选
                    $(this).attr("class", "item item-disabledYear");
                } else if (1900 > _that.curYear - 7 + i) { //小于1900年不可选
                    $(this).attr("class", "item item-disabledYear");
                } else {
                    $(this).attr("class", "item item-usableYear"); //其余都是可选的
                }
            })

        },


        initDate: function() { //初始化日期选择框

            this.renderDate();

            this.calendarTitle_year = this.calendar_title.find(".year");
            this.calendarTitle_month = this.calendar_title.find(".month");
            this.calendarDate_item = this.calendar_date.find(".item");
            this.$left_arrow = this.calendar_title.find(".arrow-pre"); //上一月
            this.$left_db_arrow = this.calendar_title.find(".db-arrow-pre"); //上一年
            this.$right_arrow = this.calendar_title.find(".arrow-next");
            this.$right_db_arrow = this.calendar_title.find(".db-arrow-next");
            this.selected_data = 0;
            this.tool_bar = this.element.find(".calendar-toolbar");
            this.clear_date = this.tool_bar.find(".clear-date");
            this.current_date = this.tool_bar.find(".current-date");
            this.loadDate();

            //绑定事件
            var _that = this;
            this.$left_arrow.on("click", function() { //上一个月
                var _date = dateObj.getDate();
                dateObj.setDate(new Date(_date.getFullYear(), _date.getMonth() - 1, 1));
                _that.loadDate();
            });

            this.$right_arrow.on("click", function() { //下一个月
                var _date = dateObj.getDate();
                dateObj.setDate(new Date(_date.getFullYear(), _date.getMonth() + 1, 1));
                _that.loadDate();
            });

            this.$left_db_arrow.on("click", function() { //上一年
                var _date = dateObj.getDate();
                dateObj.setDate(new Date(_date.getFullYear() - 1, _date.getMonth(), 1));
                _that.loadDate();
            });

            this.clear_date.on("click", function() {
                _that.clearDate();
                _that.element.fadeOut(300);
            });

            this.current_date.on("click", function() {
                var _date = new Date();
                _that.selector.val(_date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + _date.getDate());
                _that.element.fadeOut(300);
            })

            this.$right_db_arrow.on("click", function() { //下一年
                var _date = dateObj.getDate();
                dateObj.setDate(new Date(_date.getFullYear() + 1, _date.getMonth(), 1));
                _that.loadDate();
            });

            this.calendarDate_item.on("click", function() { //点击天数
                var _dateStr = $(this).attr('data');
                var _date = new Date(addMark(_dateStr));
                var $curClick = null;

                _that.selected_data = _dateStr;

                dateObj.setDate(new Date(_date.getFullYear(), _date.getMonth(), 1));

                if (!$(this).hasClass('item-curMonth')) {
                    _that.loadDate();
                }

                $curClick = _that.calendar_date.find('[data=' + _dateStr + ']');
                if (!$curClick.hasClass('item-curDay')) {
                    _that.calendarDate_item.removeClass('item-curDay');
                    $curClick.addClass('item-curDay');

                }

                //将选定值放置到绑定元素中
                _that.selector.val(addMark(_dateStr));
                _that.element.fadeOut(300);
                if (_that.options.callback) { //选定后回调
                    _that.options.callback(addMark(_dateStr));
                }


            })


        },

        renderDate: function() { //渲染日期选择框

            this.calendar_title = $('<div class="calendar-title"></div>');
            this.calendar_week = $('<ul class="calendar-week"></ul>');
            this.calendar_date = $('<ul class="calendar-date"></ul>')

            var _title = '<a class="title year" href="#"></a>' + '<a class="title month" href="#"></a>' +
                '<a class="backToday" href="javascript:;"></a>' +
                '<span class="iconfont icon-left-db-arrow db-arrow-pre"></span><span class="iconfont icon-left-arrow arrow-pre"></span></span><span class="iconfont icon-right-arrow arrow-next"></span><span class="iconfont icon-right-db-arrow db-arrow-next">';

            var _week = '<li class="item">日</li>' +
                '<li class="item">一</li>' +
                '<li class="item">二</li>' +
                '<li class="item">三</li>' +
                '<li class="item">四</li>' +
                '<li class="item">五</li>' +
                '<li class="item">六</li>';

            var _date = "";
            for (var i = 0; i < 6; i++) {
                _date += '<li class="item"></li>' +
                    '<li class="item"></li>' +
                    '<li class="item"></li>' +
                    '<li class="item"></li>' +
                    '<li class="item"></li>' +
                    '<li class="item"></li>' +
                    '<li class="item"></li>';
            }

            this.calendar_title.html(_title);
            this.calendar_week.html(_week);
            this.calendar_date.html(_date);

            this.element.append(this.calendar_title, this.calendar_week, this.calendar_date);

            if (this.options.toolbar == true) { //如果有工具栏参数，则显示工具栏
                this.element.append(this.toolbarStr);
            }

            this.element.show();

        },

        loadDate: function() { //载入日期选择框数据

            var year = dateObj.getDate().getFullYear();
            var month = dateObj.getDate().getMonth() + 1;
            var dateStr = dateToStr(dateObj.getDate());
            var firstday = new Date(year, month - 1, 1);

            this.calendarTitle_year.html(dateStr.substr(0, 4) + "年");
            this.calendarTitle_month.html(dateStr.substr(4, 2) + "月");

            this.calendarDate_item.each(function(i) {
                var thisDay = new Date(year, month - 1, i + 1 - firstday.getDay());
                var thisDay_str = dateToStr(thisDay);

                $(this).text(thisDay.getDate()).attr("data", thisDay_str);


                if (dateToStr(new Date()) === thisDay_str) { //如果是当天
                    $(this).attr("class", "item item-curMonth item-curDay");
                } else if (dateToStr(firstday).substr(0, 6) === thisDay_str.substr(0, 6)) {
                    $(this).attr("class", "item item-curMonth");
                } else {
                    $(this).attr("class", "item");
                }

            });

            if (this.selected_data) {
                var selected_elem = this.calendar_date.find('[data=' + this.selected_data + ']');
                selected_elem.siblings().removeClass("item-curDay");
                selected_elem.addClass('item-curDay');
            }

        }
    }


    var dateObj = (function() {

        var _date = new Date();
        return {
            getDate: function() {
                return _date;
            },
            setDate: function(date) {
                _date = date;
            }
        }

    })();

    function dateToStr(date) { //将日期转化为字符串
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        month = month <= 9 ? ("0" + month) : ("" + month);
        day = day <= 9 ? ("0" + day) : ("" + day);
        return year + month + day;
    }

    function addMark(dateStr) { // 给传进来的日期字符串加-
        return dateStr.substr(0, 4) + '-' + dateStr.substr(4, 2) + '-' + dateStr.substring(6);
    };


    //为通过jQuery对象扩展方法calendar
    $.fn.calendar = function(options) {
        return new Calendar($(this), options);
    }

    //var 


})(jQuery, window, document)