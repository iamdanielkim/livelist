

simplefixture = window.__html__['fixture/simple.html']
complexfixture = window.__html__['fixture/complex.html']
hierarchyfixture = window.__html__['fixture/hierarchy.html']
modifiedfixture = window.__html__['fixture/modified.html']
movedfixture = window.__html__['fixture/moved.html']
movedAndModifiedfixture = window.__html__['fixture/movedAndModified.html']
createdfixture = window.__html__['fixture/created.html']
deletedfixture = window.__html__['fixture/deleted.html']

describe 'livelist_serializer', () ->

  describe "build from DOM", () ->
    describe 'buildMapperByElements()', () ->
      it 'buildMapperByElements()', () ->
        $("body").html(simplefixture)
        LivelistSerializer serializer = new LivelistSerializer()
        serializer.buildMapperByElements($("body .tree"))

        map = serializer.map
        assert.equal serializer.seed, map['first-child']
        assert.ok map['first-child']
        assert.ok map['1001']
        assert.ok map['1002']
        assert.ok map['1003']

    describe 'LivelistSerializer.createByEl()', () ->
      it 'simple list', () ->
        $("body").html(simplefixture)
        LivelistSerializer serializer = LivelistSerializer.createByEl($("body .tree"))
        hierarchy = serializer.hierarchy


        actual = hierarchy.length
        expectedSize = 4
        assert.equal actual, expectedSize, actual + " == " + expectedSize

      it 'tree data', () ->
        $("body").html(hierarchyfixture)
        LivelistSerializer serializer = LivelistSerializer.createByEl($("body .tree"))

        hierarchy = serializer.hierarchy

        expectedSize = 1
        assert.equal hierarchy.length, expectedSize, hierarchy.length + " == " + expectedSize
        assert.equal hierarchy[0].children.length, expectedSize
        assert.equal hierarchy[0].children[0].children.length, expectedSize


  describe "build from JSON", () ->
    it 'createByJson()', () ->
      itemTreeFixture = [
        {"id":"f11","title":"하하하","status":{},"parent":"nil_parent","prev":"nil_prev","next":"nil_next","firstChild":"f12"},
        {"id":"f12","title":"헤헤","status":{},"parent":"f11","prev":"nil_prev","next":"nil_next","firstChild":"f13"},
        {"id":"f13","title":"d","status":{},"parent":"f12","prev":"nil_prev","next":"nil_next","firstChild":"nil_firstchild"}
      ]
      LivelistSerializer serializer = LivelistSerializer.createByJson(itemTreeFixture)

      assert.equal serializer.seed.id, "f11"
      expectedSize = 1
      hierarchy = serializer.hierarchy
      assert.equal hierarchy.length, expectedSize, hierarchy.length + " == " + expectedSize
      assert.equal hierarchy[0].children.length, expectedSize
      assert.equal hierarchy[0].children[0].children.length, expectedSize

  describe 'toItemHTML()', () ->
    it 'simple item', () ->
      $("body").html(simplefixture)
      json = Item.createByElement $("#first-child")

      actual = (new LivelistSerializer()).toItemHTML(json)
      expected = """
      <li class="item" id="first-child" title="Cfirst-child"><div class="title-wrap"><span class="title" contenteditable>Cfirst-child</span></div></li>
      """
      assert.equal actual, expected, actual + " == " + expected

    it 'non-existance item', () ->
      json = Item.createByElement $("#NON_EL")

      actual = (new LivelistSerializer()).toItemHTML(json)
      expected = """
        <li class="item" id="nil_id" title="nil_title"><div class="title-wrap"><span class="title" contenteditable>nil_title</span></div></li>
      """
      assert.equal actual, expected, actual + " == " + expected


    it 'tree item', () ->
      $("body").html(hierarchyfixture)
      LivelistSerializer serializer = LivelistSerializer.createByEl($("body .tree"))
      hierarchy = serializer.hierarchy
      actual = serializer.toItemHTML(hierarchy[0])
      expected = """
      <li class="item" id="f11" title="하하하"><div class="title-wrap"><span class="title" contenteditable>하하하</span></div><ul class="tree ">
<li class="item" id="f12" title="헤헤"><div class="title-wrap"><span class="title" contenteditable>헤헤</span></div><ul class="tree ">
<li class="item" id="f13" title="d"><div class="title-wrap"><span class="title" contenteditable>d</span></div></li>
</ul></li>
</ul></li>
      """
      assert.equal actual, expected, actual + " == " + expected

  describe 'toHTML()', () ->
    it 'simple list', () ->
      $("body").html(simplefixture)
      LivelistSerializer serializer = LivelistSerializer.createByEl($("body .tree"))

      actual = serializer.toHTML()
      expected = """
      <ul class="tree ">
<li class="item" id="first-child" title="Cfirst-child"><div class="title-wrap"><span class="title" contenteditable>Cfirst-child</span></div></li>
<li class="item" id="1001" title="C1001"><div class="title-wrap"><span class="title" contenteditable>C1001</span></div></li>
<li class="item" id="1002" title="C1002"><div class="title-wrap"><span class="title" contenteditable>C1002</span></div></li>
<li class="item" id="1003" title="C1003"><div class="title-wrap"><span class="title" contenteditable>C1003</span></div></li>
</ul>
      """
      assert.equal actual, expected, actual + " == " + expected

    it 'non-existance list', () ->
      LivelistSerializer serializer = LivelistSerializer.createByEl($("body #NON-TREE"))

      actual = serializer.toHTML()
      expected = ""
      assert.equal expected, actual , "없는 element면 아무것도 생성되지 않음"


    it 'tree list', () ->
      $("body").html(hierarchyfixture)
      LivelistSerializer serializer = LivelistSerializer.createByEl($("body .tree"))

      actual = serializer.toHTML()
      expected = """
      <ul class="tree ">
<li class="item" id="f11" title="하하하"><div class="title-wrap"><span class="title" contenteditable>하하하</span></div><ul class="tree ">
<li class="item" id="f12" title="헤헤"><div class="title-wrap"><span class="title" contenteditable>헤헤</span></div><ul class="tree ">
<li class="item" id="f13" title="d"><div class="title-wrap"><span class="title" contenteditable>d</span></div></li>
</ul></li>
</ul></li>
</ul>
      """
      assert.equal actual, expected, actual + " == " + expected

  describe "serialize touched items", () ->
    it 'query touched items', () ->
      $("body").html(complexfixture)
      items = LivelistSerializer.queryTouchedItem($("body .tree"))

      assert.equal items.length, 6

    it 'serialize touched items', () ->
      $("body").html(complexfixture)
      changesets = LivelistSerializer.getChangesets($("body .tree"))

      expected = [
        { modified: id:"2nd", now:"2nd CHANGED TITLE", old:"C1001" }
        { modified: id:"3rd", now:"3rd CHANGED C1002", old:"C1002" }
        { moved: "id":"5th","item":"5th:nil_parent:4th:nil_next:6th" }
        { created: "id":"6th","item":"6th:헤헤:5th:nil_prev:9th:7th" }
        { created: "id":"7th","item":"7th:d:6th:nil_prev:8th:nil_firstchild" }
        {
          modified: "id":"9th","now":"9th Changed Title","old":"f14 title"
          moved:"id":"9th","item":"9th:5th:6th:nil_next:nil_firstchild"
        }
      ]

      assert.deepEqual changesets, expected
