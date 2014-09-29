
;(function(global){

function LivelistSerializer(){
  if(!(this instanceof LivelistSerializer)){
    return new LivelistSerializer();
  }
  this.init();
}

LivelistSerializer.prototype = {
  init: function(){
    this.seed = null;
    this.map = {};
    this.hierarchy = [];
  },
  buildMapperByJson: function(itemRawDatas){
    var self = this;
    itemRawDatas.map(function(rawItem){
      var item = Item.createByJson(rawItem);
      if(item.isSeed())
        self.seed = item;
      self.map[item.id] = item;
    });
  },
  buildMapperByElements: function($tree){
    var self = this;
    $(" .item", $tree).map(function(index) {
      var item = Item.createByElement($(this));
      if(item.isSeed())
        self.seed = item;
      self.map[item.id] = item;
    });
  },
  hierarchize: function(){
    var self = this;
    if(this.seed)
      this.hierarchy = traversal(this.seed, []);
    else
      this.hierarchy = [];

    function traversal(item, collection){
      if(item.isNull())
        return collection;
      collection.push(item);
      if(item.hasChildren())
        item.children = traversal(self.map[item.firstChild], []);
      if(item.hasNext())
        return traversal(self.map[item.next], collection);
      else
        return collection;
    }
  },
  toHTML: function(className){
    if(!this.hierarchy || this.hierarchy.length === 0)
      return "";
    return this.toListHTML(this.hierarchy, className) || [
        '<ul class="tree ' + className + '">',
          LivelistSerializer.newItem(),
        '</ul>'
    ].join("\n");
  },
  toItemHTML: function(json){
    return '' +
      '<li class="item" id="' + json.id + '" title="' + json.title + '">' +
        '<div class="title-wrap">' +
          '<span class="title" contenteditable>' + json.title + '</span>' +
        '</div>' +
        (json.children ? this.toListHTML(json.children) : '') +
      '</li>';
  },
  toListHTML: function(json, className){
    className = className || "";
    var output = [];
    if(json.length > 0){
      output.push('<ul class="tree ' + className +'">');
      for(var i=0; i < json.length; i++){
        var item = json[i];
        output.push(this.toItemHTML(item));
      }
      output.push('</ul>');
    }
    return output.join("\n");
  }
};

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x7|0x8)).toString(16);
  });
  return uuid;
}

LivelistSerializer.newTree = function(){
  return '<ul class="tree nav nav-sidebar _new"></ul>';
};

LivelistSerializer.newItem = function(){
  return '<li class="item" id="' + generateUUID() + '" created>' +
    '<div class="title-wrap">' +
    '<span class="title" contenteditable>' + '</span>' +
    '</div>' +
    '</li>';
};

LivelistSerializer.queryTouchedItem = function($listEl){
  var touchedItems = [];
  $("[created]", $listEl).each(function(i,item){
    if(!$(this).hasClass("selected"))
      touchedItems.push(this);
  });
  $("[modified]", $listEl).each(function(i,item){
    if(!$(this).hasClass("selected"))
      touchedItems.push(this);
  });
  $("[moved]", $listEl).each(function(i,item){
    if(!$(this).hasClass("selected"))
      touchedItems.push(this);
  });
  $("[deleted]", $listEl).each(function(i,item){
    if(!$(this).hasClass("selected"))
      touchedItems.push(this);
  });
  return $.unique(touchedItems).map(function(item){
    return Item.createByElement($(item));
  });
};

LivelistSerializer.getChangesets = function($listEl){
  var items = LivelistSerializer.queryTouchedItem($listEl);

  var changesets = [];
  $(items).each(function(i, item){
    changesets.push(item.getChangeset());
  });
  return changesets;
};

LivelistSerializer.createByJson = function(itemTree){
  var serializer = new LivelistSerializer();
  serializer.buildMapperByJson(itemTree);
  serializer.hierarchize();
  return serializer;
};

LivelistSerializer.createByEl = function(elTree){
  var serializer = new LivelistSerializer();
  serializer.buildMapperByElements(elTree);
  serializer.hierarchize();
  return serializer;
};

global.LivelistSerializer = LivelistSerializer;

})(this);
