;

(function($, window, document, undefined) {

    function AutoComplete(element, options) {
        this.element = element;
        this.options = {
            min: 1,
            selections: 0,
            list: [],
            caseSensitive: false,
            maxResults: 10,
            sortKey: false,
            ajax: false,
            openUp: false,
            outerHandle: function() {}, //外部处理函数，可用于Ajax，但要返回处理后的数组列表
            onItemSelect: function() {}
        };

        $.extend(true, this.options, options);
        this.init();
    }

    AutoComplete.prototype = {
        constructor: AutoComplete,

        init: function() {
            var that = this;
            // var cpLock = true;

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
            // if (this.options.list.length > 0) { //有传递查询数组
            //     //console.log(this.options.list);
            //     this.setList(this.selectItems(val));
            //     this.print();

            // } else 
            $("body").find("ul.autocomplete-list").remove();

            if (val != 0) {

                if (this.options.ajax) { //需要请求数据,必须使用outerHandle来获取请求的数据，具体如何获得需要自己实现，这里只需获得一个处理后的返回数组

                    this.setList(this.rmDuplicOfArr(this.options.outerHandle(val)));
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
                _top = position.top + this.element.outerHeight() - 5,
                itemHeight = 28;

            var $auto_list = $('<ul class="autocomplete-list"></ul>').hide();

            $auto_list.css({
                "left": _left + "px",
                "top": _top + "px",
                "width": _width + "px",
            });

            if (this.options.list && this.options.list.length) {

                var html = '';
                this.options.list.forEach(function(item) {
                    html += '<li class="autocomplete-list-item">' + item + '</li>';
                });
                $auto_list.append(html);

                $("body").append($auto_list);
                $auto_list.show();

                $(".autocomplete-list-item").on("click", function() {
                    that.element.val($(this).text());
                });

            }

            window.onresize = function() { //当窗口大小改变时，日期选择框的位置紧跟输入框
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