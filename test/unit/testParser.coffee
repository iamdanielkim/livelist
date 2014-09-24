

simplefixture = window.__html__['fixture/simple.html']
hierarchyfixture = window.__html__['fixture/hierarchy.html']


describe 'livelist', () ->
  parser = null

  describe 'stringifyItem() - livelist item을 text data 형태로 변환 ', () ->
    beforeEach () ->
      $("body").html(hierarchyfixture)
      parser = new Parser()

    it '최상위 item은 ##|title|0 의 형태로 변환된다.', () ->
      title=parser.stringifyItem($("#f11"))
      expected = "##|하하하|0"
      assert.equal title, expected , title + " == " + expected

    it '두번째 nested 리스트의 item은 parent_title:title:1 형태로 변환된다.', () ->
      title=parser.stringifyItem($("#f12"))
      expected = "##|하하하|헤헤|1"
      assert.equal title, expected , title + " == " + expected

    it '세번째 nested 리스트의 item은 parent_title:title:2 형태로 변환된다.', () ->
      title=parser.stringifyItem($("#f13"))
      expected = "##|하하하|헤헤|d|2"
      assert.equal title, expected , title + " == " + expected

  describe 'stringify() - livelist tree를 text data 형태로 변환', () ->
    it 'tree는 변환된 item을 포함하는 array로 반환된다.', () ->
      console.log("===")
      list=parser.stringify($("#f1"))
      expected = [
        "##|하하하|0",
        "##|하하하|헤헤|1",
        "##|하하하|헤헤|d|2"
      ]

      assert.equal list.join(""), expected.join("") , list + " == " + expected

  describe 'toItemHTML() & toTreeHTML() - text data를 html로 변환', () ->
    beforeEach () ->
      $("body").html(hierarchyfixture)
      parser = new Parser()

    it 'item data format을 livelist item html으로 변환한다.', () ->
      fixture = "##|하하하|0"

      listHtml = parser.toItemHTML(fixture)
      expected = """
          <li class="item" id="하하하" title="하하하"><div class="title-wrap"><span class="title" contenteditable>하하하</span></div></li>
      """
      assert.equal listHtml, expected , listHtml + " == " + expected

    it 'item list format을 livelist list html으로 변환한다.', () ->
      fixture = [
        "##|하하하|0",
        "##|하하하|헤헤|1",
        "##|하하하|헤헤|d|2"
      ]

      treeHtml = parser.toTreeHTML(fixture)

      expected = """
<ul class="tree">
<li class="item" id="하하하" title="하하하"><div class="title-wrap"><span class="title" contenteditable>하하하</span></div><ul class="tree">
<li class="item" id="헤헤" title="헤헤"><div class="title-wrap"><span class="title" contenteditable>헤헤</span></div><ul class="tree">
<li class="item" id="d" title="d"><div class="title-wrap"><span class="title" contenteditable>d</span></div></li>
</ul></li>
</ul></li>
</ul>
"""
      assert.equal treeHtml, expected , treeHtml + " == " + expected

  describe 'item 정보 수정', () ->
    beforeEach () ->
      $("body").html(simplefixture)
      parser = new Parser()

    it 'item 이름 변경', () ->
      # 이름을 변경한다. (focus가 벗어나면 변경 완료로 간주함)
      # 변경한 item의 status는 title-updated로 mark된다
      # id는 그대로 내용은 변경된다

      assert.fail() 

    setupModifiedItemFixture = () ->
      fixtureModifiedItem = """
          <ul><li class="item" id="하하하" title="하하하" status="_modified"><div class="title-wrap"><span class="title" contenteditable>하하하_변경됨</span></div></li></ul>
      """
      $("body").html(fixtureModifiedItem)

    it '변경된 item을 Store Data Type으로 변경', () ->
      setupModifiedItemFixture()
      actual = parser.stringifyModifiedItem $('.item[status="_modified"]')

      expected = { origin: "##|하하하|0", changed: "##|하하하_변경됨|0" }
      assert.equal actual.origin, expected.origin , "]" + actual.origin + "[==]" + expected.origin + "["
      assert.equal actual.changed, expected.changed , actual.changed + " == " + expected.changed

    it 'modifiedItem정보를 dom에 반영', () ->
      setupModifiedItemFixture()

      actual = parser.updateHtmlByModifiedItem "##|하하하_변경됨|0"
      expected = """
          <li class="item" id="하하하_변경됨" title="하하하_변경됨"><div class="title-wrap"><span class="title" contenteditable>하하하_변경됨</span></div></li></ul>
      """

      assert.equal actual, expected , actual + " == " + expected

    # 이름을 변경한다. (focus가 벗어나면 변경 완료로 간주함)
    # 이미 있는 이름이라는 알림을 보여준다.
    # 원래 이름으로 롤백한다.
      assert.fail()


    it '이미 존재하는 이름으로 item 이름 변경 불가', () ->

    # 이름을 변경한다. (focus가 벗어나면 변경 완료로 간주함)
    # 이미 있는 이름이라는 알림을 보여준다.
    # 원래 이름으로 롤백한다.
      assert.fail()


  describe 'item 위치 변경(들여쓰기,내어쓰기,DnD)', () ->
    before () ->
      $("body").html(simplefixture)
      parser = new Parser()

    it 'item의 위치를 이동한다.', () ->
    # 위치를 변경한다.
    # 변경한 item 이하 children 모두 location-updated로 mark된다
    # update될 item의 이전 -> 이후 상태를 확인한다.
      assert.fail()

    it '위치 변경된 item상태 저장하기', () ->
    # location-updated 상태인 item이 있다.
    # update될 item의 이전 -> 이후 상태 정보의 변경을 요청한다.
    # update-success 응답을 받는다.
      assert.fail()
