
;(function(global){
function StateModified($el){
  var isModified = $el.attr("modified") !== undefined;
  var changedTitle = $("> .title-wrap .title", $el).text().trim();

  this.state= function(){
    return isModified;
  };

  this.changeset = function(current){
    if(!isModified)
      return {};

    var origin = current.clone();
    current.title = changedTitle;
    return {
      id: current.id,
      now: current.title,
      old: origin.title
    };
  };
  this.registerIfTrue = function(status){
    if(isModified)
      status.modified = this;
  };
}

function StateMoved($el){
  var isMoved = $el.attr("moved") !== undefined;

  this.state= function(){
    return isMoved;
  };
  this.changeset = function(current){
    if(!isMoved)
      return {};

    var tostr = function(item){
      return item.id +
        ":" + item.parent + ":" + item.prev + ":" + item.next + ":" + item.firstChild;
    };

    return {
      id: current.id,
      item: tostr(current)
    };
  };
  this.registerIfTrue = function(status){
    if(isMoved)
      status.moved = this;
  };
}

function StateCreated($el){
  var isOk = $el.attr("created") !== undefined;
  return new State(isOk, "created");
}

function StateDeleted($el){
  var isOk = $el.attr("deleted") !== undefined;
  return new State(isOk, "deleted");
}


function State(isOk, state){
  this.state= function(){
    return isOk;
  };
  this.changeset = function(current){
    if(!isOk)
      return {};

    var tostr = function(item){
      return item.toString();
    };

    return {
      id: current.id,
      item: tostr(current)
    };
  };
  this.registerIfTrue = function(status){
    if(isOk)
      status[state] = this;
  };
}


function Item(id, title, status, parent, prev, next, firstChild){
  this.id = id;
  this.title = title;
  this.status = status || {};
  this.parent = parent || "nil_parent";
  this.prev = prev || "nil_prev";
  this.next = next || "nil_next";
  this.firstChild = firstChild || "nil_firstchild";

  this.isSeed =  function(){
      return (this.parent == "nil_parent") && (this.prev == "nil_prev");
  };
  this.hasParent = function(){
    return this.parent != "nil_parent";
  };
  this.hasPrev = function(){
    return this.prev != "nil_prev";
  };
  this.hasNext = function(){
    return this.next != "nil_next";
  };
  this.hasChildren = function(){
    return this.firstChild != "nil_firstchild";
  };
  this.isNull = function(){
    return false;
  };
  this.isTouched = function(){
    return this.status.modified || this.status.moved || this.status.deleted || this.status.created;
  };
  this.getChangeset = function(){
    var current = this;
    var changeset = {};
    for(var i in this.status){
      console.log(i);
      changeset[i] = this.status[i].changeset(current);
    }
    return changeset;
  };
  this.clone = function(){
    return new Item(this.id, this.title, this.status, this.parent, this.prev, this.next, this.firstChild);
  };
  this.toString = function(){
    return this.id + ":" + this.title +
      ":" + this.parent + ":" + this.prev + ":" + this.next + ":" + this.firstChild;
  };

}

Item.create = function(id, title, parent, prev, next, firstChild){
  return new Item(id, title, {}, parent, prev, next, firstChild);
};

Item.createDeletedItem = function(id, title, parent, prev, next, firstChild){
  var status = {};
  (new State(true, "deleted")).registerIfTrue(status);
  return new Item(id, title, status, parent, prev, next, firstChild);
};


var root = Item.create("##","##",null,null,null,null);
Item.root = function(){
  return root;
};

Item.null = function(){
  var item = Item.create("nil_id", "nil_title", "nil_parent", "nil_prev", "nil_next", "nil_firstchild");
  item.isNull = function() { return true; };
  return item;
};

Item.createByElement = function($el){
  if($el.length === 0)
    return Item.null();

  var id = ID($el);
  var title = $el.attr("title");
  var parent = (function(){
    var $parent = $el.parent().parent();
    return $parent.prop("tagName") === "LI" ? ID($parent) : "nil_parent";
  })();
  var prev = ID($el.prev()) || "nil_prev";
  var next = ID($el.next()) || "nil_next";
  var firstChild = (function(){
    var $item = $(".item:first-child", $el);
    return $item.prop("tagName") === "LI" ? ID($item) : "nil_firstchild";
  })();


  var status = {};
  (new StateModified($el)).registerIfTrue(status);
  (new StateMoved($el)).registerIfTrue(status);
  (new StateCreated($el)).registerIfTrue(status);
  (new StateDeleted($el)).registerIfTrue(status);

  var item = new Item(id, title, status, parent, prev, next, firstChild);
  return item;

  function ID($el){
    return $el.attr("id") || $el.attr("title");
  }
};

Item.createByJson = function(json){
  if(!json)
    return Item.null();

  if(!json.id)
    throw new Error("id is null");

  var id = json.id;
  var title = json.title || "nil_title";
  var parent = json.parent || "nil_parent";
  var prev = json.prev || "nil_prev";
  var next = json.next || "nil_next";
  var firstChild = json.firstChild || "nil_firstchild";
  var status = {};

  return new Item(id, title, status, parent, prev, next, firstChild);
};

global.Item = Item;

})(this);
