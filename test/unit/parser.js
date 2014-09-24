
;(function(global){
  var Parser = function(){
      this.delim = "|";
      this.mapper = {
          "##": {
              children: []
          }
      };
  };
  Parser.prototype = {
      stringifyItem: function($item){
          var info = this.getHierarchyByItem($item);
          return info.hierarchy + $item.find("> .title-wrap > .title").text() + this.delim + info.rank;
      },
      stringifyModifiedItem: function($item){
          var info = this.getHierarchyByItem($item);
          return {
            origin: info.hierarchy + $item.attr("title") + this.delim + info.rank,
            changed: info.hierarchy + $item.find("> .title-wrap > .title").text() + this.delim + info.rank
          };
      },
      getHierarchyByItem: function($item){
          var self = this;
          var rank = 0, prefix = "##" + this.delim;
          var parentTitleNodes = $item.parents(".item").find(" > .title-wrap > .title");
          var parentTitles = parentTitleNodes.map(function(i, item){
             return $(item).text();
          });
          if(parentTitles.length > 0){
             rank = parentTitles.length;
             prefix += [].join.call(parentTitles, self.delim) + this.delim;
          }
          return { hierarchy: prefix, rank: rank};
      },
      stringify: function($list){
          var self = this;
          var list = [];
          $list.find(".item").map(function(i, item){
              list.push(self.stringifyItem($(item)));
          });
          return list;
      },

      toTreeJson: function(exportedData){
          this.mapper = {
              "##": {
                  children: []
              }
          };
          for(var i=0; i < exportedData.length; i++){
              var item = this.toItemJson(exportedData[i]);
              var parent = item.parents.pop();

              if(this.mapper[parent]){
                  this.mapper[parent].children.push(item);
                  this.mapper[item.title] = item;
              }else{
                  throw new Error(parent + " is not exist");
              }
          }
          return this.mapper["##"].children;
      },
      toItemJson: function(itemData){
          var raw = itemData.split(this.delim);
          var rank = raw.pop(),
              title = raw.pop(),
              parents = raw;

          return {
              id: title,
              title: title,
              rank: rank,
              parents: raw,
              children: []
          };
      },
      toTreeHTML: function(treeData){
          console.log(this.toTreeJson(treeData));
          return livelist.nestedSerializer.jsonToLive(this.toTreeJson(treeData));
      },
      toItemHTML: function(itemData){
          return livelist.nestedSerializer.jsonToItem(this.toItemJson(itemData));
      },
      updateHtmlByModifiedItem: function(itemData){

      }
  };

  global.Parser = Parser;
})(this);
