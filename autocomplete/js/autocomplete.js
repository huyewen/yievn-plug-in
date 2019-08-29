;

(function($, window, document, undefined) {

    function AutoComplete(element, options) {
        this.element = element;
        this.options = {
            list: [], //查询列表
            maxResults: 5, //最大显示条数
            isCustomStyle: false, //是否自定义样式
            customStyleObj: {},
            isItemHover: false,
            itemHoverStyleObj: {},
            isAjax: false, //是否通过ajax获取数据
            outerHandle: function() {}, //外部处理函数，可用于Ajax，但要返回处理后的数组列表
        };
        this.defaultStyle = { //默认样式
            "background": "#fff",
            "color": "#777",
            "font-size": "13px"
        };

        $.extend(true, this.options, options);
        this.init();
    }

    AutoComplete.prototype = {
        constructor: AutoComplete,

        init: function() {
            var that = this;
            this.element.on("keyup", function(e) {
                var flag = e.target.isNeedPrevent;
                var _this = this;
                setTimeout(function() {
                    if (!flag) {
                        that.handle($(_this).val());
                    }
                }, 0)

            });

            this.element.on("keydown", function(e) {
                e.target.keyEvent = true;
            });

            this.element.on("input", function(e) {
                if (!e.target.keyEvent) {
                    that.handle($(this).val());
                }
            })

            this.element.on("compositionstart", function(e) { //当输入为非直接文字时触发
                e.target.isNeedPrevent = true;
            });

            this.element.on("compositionend", function(e) { //当输入为直接文字时触发
                e.target.isNeedPrevent = false;
            });

        },

        handle: function(val) {
            $("body").find("ul.autocomplete-list").remove();
            if (val != 0) {
                if (this.options.isAjax) { //需要请求数据,必须使用outerHandle来获取请求的数据，具体如何获得需要自己实现，这里只需获得一个处理后的返回数组
                    this.setList(this.rmDuplicOfArr(this.options.outerHandle(val))); //通过外部处理函数的ajax获取数据并返回
                    this.print();
                } else {
                    alert("无查询来源")
                }
            }
        },

        selectItems: function() { //获得相匹配的选项

        },

        print: function() { //打印选项

            var that = this;
            var position = this.element.offset(),
                _width = this.element.outerWidth(),
                _left = position.left,
                _top = position.top + this.element.outerHeight() - 5;

            var $auto_list = $('<ul class="autocomplete-list"></ul>').hide();

            $auto_list.css({
                "left": _left + "px",
                "top": _top + "px",
                "width": _width + "px",
                "border-radius": "4px"
            });

            if (this.options.list && this.options.list.length) {

                var html = '';
                this.options.list.forEach(function(item, index) {
                    if (index < that.options.maxResults) {
                        html += '<li class="autocomplete-list-item">' + item + '</li>';
                    }
                });

                $auto_list.append(html);
                $("body").append($auto_list);
                $auto_list.slideDown(200);

                if (this.options.isCustomStyle) { //当自定义样式时
                    $auto_list.css(that.options.customStyleObj);
                }

                if (this.options.isItemHover) { //是否鼠标悬浮时改变样式
                    $(".autocomplete-list-item").hover(function() {
                        $(this).css(that.options.itemHoverStyleObj);
                    }, function() {
                        if (that.options.isCustomStyle) { //当本身有自定义样式时
                            $(this).css(that.defaultStyle);
                            $(this).css(that.options.customStyleObj);
                        } else {
                            $(this).css(that.defaultStyle);
                        }
                    })
                }

                if ($auto_list.is(":visible")) { //当提示框可见时，点击其它地方消失
                    $(document).on("click", function() {
                        $auto_list.slideUp(500).remove();
                    });
                }

                $auto_list.on("click", function(e) { //阻止冒泡
                    var e = e ? e : window.event;
                    if (document.all) { //只有ie识别
                        e.cancelBubble = true;
                    } else {
                        e.stopPropagation();
                    }
                })

                $(".autocomplete-list-item").on("click", function() { //选中选项
                    that.element.val($(this).text());
                    $auto_list.slideUp(200).remove();
                });
            }

            window.onresize = function() { //当窗口大小改变时，提示框的位置紧跟输入框
                var position = that.element.offset(); //获得依靠元素在视口的位置
                $auto_list.css("left", position.left);
                $auto_list.css("top", position.top + that.element.outerHeight()) - 5; //将选择框放置在绑定元素的下方
            }
        },

        setList: function(list) { //设置列表
            this.options.list = list;
        },

        rmDuplicOfArr: function(list) { //简单类型数组重复
            return list.filter(function(element, index, self) {
                return self.indexOf(element) === index;
            });
        },
    }

    $.fn.extend({
        autocomplete: function(options) {
            return new AutoComplete($(this), options);
        }
    })

})(jQuery, window, document);