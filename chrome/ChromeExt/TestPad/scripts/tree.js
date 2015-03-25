$(function () {


});


function TreePad(selector) {

    var me = this;
    var $obj = $(selector);
    $obj.addClass("tree");
    $obj.bind('click', function (e) {
        $(".tree li > span.selected").removeClass("selected");
        e.stopPropagation();
    });

    var node_states = {
        collapsed: { title: "Expand", img_old: "minus", img_new: "plus" },
        expanded: { title: "Collapse", img_old: "plus", img_new: "minus" }
    }

    function clickLabel(e) {
        var $old = $(".tree li > span.selected");
        if ($old.length > 0) {
            var text = $("#text").val();
            $old.parent().data("text", text);
            $old.removeClass("selected");
        }

        var text = $(this).parent().data("text");
        $("#text").val(text);
        $(this).addClass("selected");

        e.stopPropagation();
    }

    function clickIcon(e) {
        var children = $(this.parentNode).parent('li.parent_li').find(' > ul > li');
        var is_expanded = children.is(":visible");
        var state = is_expanded ? node_states.collapsed : node_states.expanded;

        if (is_expanded) {
            children.hide('fast');
        }
        else {
            children.show('fast');
        }

        $(this.parentNode)
            .attr('title', state.title)
            .find(' > i')
            .addClass('glyphicon-' + state.img_new)
            .removeClass('glyphicon-' + state.img_old);

        e.stopPropagation();
    }

    this.show = function (nodes) {
        if (nodes.length > 0) {
            var $ul = $("ul", $obj.append("<ul></ul>"));
            for (var i = 0; i < nodes.length; i++) {
                new TreeNode($ul, nodes[i], true, clickLabel, clickIcon);
            }
        }
    }

    this.add = function (node_data) {

        var selected = $(".tree li > span.selected");

        if (selected.length == 0){
            selected = $('.tree');
        }
        else {
            selected = selected.parent();
        }

        var $ul = $('> ul', selected);
        if ($ul.length == 0) {
            $ul = $('> ul', selected.append('<ul></ul>'));
        }

        new TreeNode($ul, node_data, true, clickLabel, clickIcon);
    }
}

function TreeNode(parent, node_data, visible, onClickLabel, onClickIcon) {

    var me = this;
    var $parent = parent;

    this.title = "";
    this.text = "";

    var li_class = '';
    var i_class = 'file';

    if (node_data.children != undefined) {
        li_class = ' class="parent_li"';
        var i_class = 'plus';
    }

    var $li = $parent.parent();
    if (!$li.hasClass('parent_li')) {
        $li.addClass('parent_li');
    }

    var $i = $('> span > i', $li);
    if ($i.hasClass('glyphicon-file')) {
        $i.removeClass('glyphicon-file');
        $i.addClass('glyphicon-minus');
    }

    var html = '<li' + li_class + '><span><i class="glyphicon glyphicon-' + i_class + '"></i>' + node_data.title + '</span></li>';
    var $me = $(html);
    $parent.append($me);
    if (!visible) {
        $me.hide();
    }
    $me.data("text", node_data.text);

    $("span", $me).bind("click", onClickLabel);
    $("span > i", $me).bind("click", onClickIcon);

    if (node_data.children != undefined) {
        if (node_data.children.length > 0) {
            var $ul = $("<ul></ul>");
            $me.append($ul);
            for (var i = 0; i < node_data.children.length; i++) {
                new TreeNode($ul, node_data.children[i], false, onClickLabel, onClickIcon);
            }
        }
    }

}