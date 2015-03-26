(function ($) {

    $.fn.treepad = function (options) {

        // Создаём настройки по-умолчанию, расширяя их с помощью параметров, которые были переданы
        var settings = $.extend(
            {},
            options
        );

        var methods = {
            init: function (options) {

                console.log(options);

            },
            show: function () {
            },
            hide: function () {
            },
            update: function (content) {
            }
        };

        return this.each(function (method) {

            // логика вызова метода
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (typeof method === 'object' || !method) {
                return methods.init.apply(this, arguments);
            } else {
                $.error('Method ' + method + ' not exists');
            }

        });

    };
})(jQuery);