

simplefixture = window.__html__['fixture/simple.html']
hierarchyfixture = window.__html__['fixture/hierarchy.html']

describe 'Parser', () ->
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

  describe 'item 정보 수정', () ->
    beforeEach () ->
      $("body").html(simplefixture)
      parser = new Parser()

  
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
