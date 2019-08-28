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
        // min: options.min,
        //     selections: options.selections,
        //     list: options.list,
        //     caseSensitive: options.caseSensitive,
        //     maxResults: options.maxResults,
        //     sortKey: options.sortKey,
        //     ajax: options.ajax,
        //     openUp: options.openUp,
        //     outerHandle: options.outerHandle, //外部处理函数，可用于Ajax，但要返回处理后的数组列表
        //     onItemSelect: options.onItemSelect


        console.log(this.options);
        this.init(options);
    }

    AutoComplete.prototype = {
        constructor: AutoComplete,

        init: function(options) {
            var that = this;
            var cpLock = true;
            this.options = $.extend(this.options, options);
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
            if (this.options.list.length > 0) { //有传递查询数组
                console.log(this.options.list);
                this.setList(this.selectItems(val));
                this.print();

            } else if (this.options.ajax) { //需要请求数据,必须使用outerHandle来获取请求的数据，具体如何获得需要自己实现，这里只需获得一个处理后的返回数组

                this.setList(this.options.outerHandle(val));
                this.print();

            } else {
                alert("无查询来源")
            }

        },

        selectItems: function() { //获得相匹配的选项

        },

        print: function() { //打印选项

        },

        setList: function(list) { //设置列表
            this.options.list = list;
        },

        rmDuplicOfArr: function(list) { //简单类型数组重复
            return list.filter(function(element, index, self) {
                return self.indexOf(element) === index;
            });
        },

        // rmDuplicOfObj: function(obj) { //对象数组去重
        //     var test = {};
        //     return obj.reduce(function(item, cur) { //对对象数组根据用户ID进行去重
        //         test[cur.USER_ID] ? '' : test[cur.USER_ID] = true && item.push(cur);
        //         return item;
        //     }, []);
        // }

    }

    $.fn.autocomplete = function(options) {
        return new AutoComplete($(this), options);
    }



})(jQuery, window, document);