
;(function(global){

  var toBeNotNull = function(fn){
    var nullFunction = function(){};
    return (typeof fn == "function") ? fn : nullFunction;
  };

  var livelist = function (hook, callback){
    var self = this;
    var $hook = this.$hook = $(hook);
    var cb =  this.cb = callback || {};
    var keydownListener = this.keydownListener = new KeydownListener(cb);

    bindMouseEvents($hook, cb);

    function bindMouseEvents($hook, cb){
      $(".item", $hook).on("click", function(ev){
        var $item = $(this);
        toBeNotNull(cb["item:selected"])(Item.createByElement($item), $item);
        ev.stopPropagation();
      });

      $(".item", $hook).on("mouseenter", function(ev){
        var el = ev.currentTarget;
        $(".hover", $hook).removeClass("hover");
        $(el).addClass("hover");

        ev.stopPropagation();
      }).on("mouseleave", function(ev){
        var el = ev.currentTarget;

        $(".hover", $hook).removeClass("hover");
        $(ev.relatedTarget).parent().addClass("hover");
      });

      $(".icon", $hook).on("click", function(ev){
        var icon = ev.currentTarget;
        var $parent = $(icon).parent();
        if($parent.hasClass("expand")){
          $parent.removeClass("expand");
        }else{
          $(".expand", $hook).removeClass("expand");
          $parent.addClass("expand");
        }
        ev.stopPropagation();
      });

      $(".item .commands .open", hook).on("click", function(ev){
        var open = ev.currentTarget;
        var $item = $(open).parent().parent();

        toBeNotNull(cb["shift+enter"])(Item.createByElement($item));
        ev.stopPropagation();
      });

      $(".item .commands .delete", hook).on("click", function(ev){
        var open = ev.currentTarget;
        var $item = $(open).parent().parent();

        toBeNotNull(cb["cmd:delete"])(Item.createByElement($item), $item);
        ev.stopPropagation();
      });
    }


    $(hook).keydown(function(ev){
      $(" .hover", hook).removeClass("hover");
      var $item = this.$currentItem = $(ev.target).parent().parent();

      if(ev.shiftKey && ev.keyCode == 9){ // shift+tab
        ev.preventDefault();
        keydownListener["shift+tab"](self.$hook, $item);
      }else if(ev.shiftKey && ev.keyCode == 13){ // shift+enter
        ev.preventDefault();
        (function(){
          toBeNotNull(cb["shift+enter"])(Item.createByElement($item), $item);
        })();
      }else if(ev.keyCode == 9){ // tab
        ev.preventDefault();
        keydownListener['tab'](self.$hook, $item);
      }else if(ev.keyCode == 13){ // enter
        ev.preventDefault();
        keydownListener['enter'](self.$hook, $item);
      }else if(ev.keyCode == 38){ //up
        ev.preventDefault();
        keydownListener['up'](self.$hook, $item);
      }else if(ev.keyCode == 40){ //down
        ev.preventDefault();
        keydownListener['down'](self.$hook, $item);
      }else if(ev.keyCode == 8 && isCaretInFront()){ //delete
        console.log("delete");
      }else{
        (function(){
          if($item.attr("status") !== "_created"){
            $item.attr("modified", "");
          }
        })();
      }
    });


  };

  livelist.prototype = {
    focus: function($item){
      this.$item = $($item);
      return this;
    },
    command: function(keymap){
      this.keydownListener[keymap](this.$hook, this.$item);
      return this;
    }
  };

  livelist.create = function($hook, callback){
    return new livelist($($hook), callback);
  };

  //////////
  function focus(target){
    var rawTarget = target[0];
    window.getSelection().collapse(rawTarget, rawTarget.length);
  }

  function isCaretInFront(){
    sel = window.getSelection();
    return (sel.anchorOffset === 0 && sel.focusOffset === 0);
  }

  function hasChildren($item){
    return $item.find(".tree").size() > 0;
  }

  function newItemAfter(item){
    $(item).after(LivelistSerializer.newItem());
  }
  function newItemBefore(item){
    $(item).before(LivelistSerializer.newItem());
  }
  function newItemInside(tree){
    $(tree).prepend(LivelistSerializer.newItem());
  }
  ////////


  function KeydownListener(callback){
    this.cb = callback;
  }
  KeydownListener.prototype = {
    'tab': function($hook, $item){
      var $prevItem = $item.prev();
      var $tree;
      if($("> .tree", $prevItem).size() !== 0){
        $tree = $("> .tree", $prevItem);
      }else{
        $prevItem.append(LivelistSerializer.newTree());
        $tree = $("._new");
      }
      $tree.append($item).removeClass("_new");

      focus($item.find(".title-wrap > .title"));
    },
    'shift+tab': function($hook, $item){
      var $tree = $item.parent();
      var $parentItem = $tree.parent();
      var $nextSiblings = $item.nextAll();

      if($hook.find($parentItem).size() === 0) return;

      //nextSibling을 넣을 nestedList의 유무 확인 후 없으면 생성
      if($("> .tree", $item).size() !== 0){
        $nestedList = $("> .tree", $item);
      }else if($nextSiblings.size() > 0){
        $item.append(LivelistSerializer.newTree());
        $nestedList = $("._new");
      }
      //
      if($nextSiblings.size() > 0)
        $nestedList.append($nextSiblings).removeClass("_new");

      // parentItem의 sibling으로 append
      $parentItem.after($item);
      // item 이동후 기존 tree에 item이 하나도 없으면 제거
      if($tree.children().size() === 0){
        $tree.remove();
      }


      focus($item.find(".title-wrap .title"));
    },
    'enter': function($hook, $item){

      if(isCaretInFront()){
        //caret이 맨 앞에 있음 위에 삽입. caret은 현재 li 그대로
        newItemBefore($item);
        focus($item.find(".title-wrap > .title"));
      }else if(hasChildren($item)){
        //child가 있을 경우, child로 생성
        var $tree = $item.find(".tree");
        newItemInside($tree);
        focus($tree.find(".item:first-child .title-wrap > .title"));
      }else{
        //기본 동작은 sibliing으로 생성
        newItemAfter($item);
        var $nextItem = $item.next();
        focus($nextItem.find(".title-wrap > .title"));
      }
    },
    'up': function($hook, $item){
      var $prevItem;

      if($item.prev().find(".item:last-child").size() > 0) {
        $prevItem = $item.prev().find(".item:last-child").last();

      }else if($item.prev().size() > 0) {
        $prevItem = $item.prev();
      }else{
        $prevItem = $item.parents(".item").first();
      }

      if($prevItem[0])
        focus($prevItem.find(".title-wrap > .title"));
      toBeNotNull(this.cb["item:selected"])(Item.createByElement($prevItem), $prevItem);
    },
    'down': function($hook, $item){

      var $nextItem;
      if($item.find(".tree .item:first-child").size() > 0) {
        $nextItem = $item.find(".tree .item:first-child");
      }else if($item.next().size() > 0) {
        $nextItem = $item.next();
      }else{
        $nextItem = $item.parents(".item").not(function(){
          return ($(this).next().size() === 0);
        }).first().next();
      }

      if($nextItem[0]){
        focus($nextItem.find(".title-wrap > .title"));
        console.log($(":focus").html())
      }
      toBeNotNull(this.cb["item:selected"])(Item.createByElement($nextItem), $nextItem);
    }
  };




  global.LiveList = livelist;
})(this);
