
complexfixture = window.__html__['fixture/complex.html']

livelist = null;

describe 'LiveList', () ->
  beforeEach () ->
    $("body").html(complexfixture)
    livelist = LiveList.create("#list-grand-parent")

  describe '들여쓰기', () ->
    it '리스트의 1st인 Item은 들여쓰기가 불가능하다.', () ->
      livelist.focus("#1st").command("tab")
      assert.equal $("#1st").parent()[0],  $("#list-grand-parent")[0], "위치 변경 없음"

    it '들여쓰기 시, prev-sibling의 child로 append한다.', () ->
      livelist.focus("#2nd").command("tab")
      assert.equal $("#1st")[0],  $("#2nd").parent().parent()[0]

    it '현재 Item의 child가 있으면 child가 속한 list에 들어가고 해당 list는 prev-sibling의 list에 포함된다..', () ->



  describe '내어쓰기', () ->
    it '대상 Item이 속한 list의 parent list가 없으면 내어쓰기가 불가능하다.', () ->
      livelist.focus("#1st").command("shift+tab")
      assert.equal $("#1st").parent()[0],  $("#list-grand-parent")[0], "위치 변경 없음"

    it 'parent의 next-sibling으로 append한다.', () ->
      livelist.focus("#7th").command("shift+tab")
      assert.equal $("#7th").prev()[0],  $("#6th")[0]

    it 'next-siblings가 있을 경우, next-siblings를 children으로 append한다.', () ->
      livelist.focus("#7th").command("shift+tab")
      assert.equal $("#8th").parent().parent()[0],  $("#7th")[0]

  describe '생성하기', () ->

    it 'item의 맨 앞에서 enter를 치면 위에 새로운 Item이 생성된다', () ->
      livelist.focus("#2nd").command("enter")
      assert.equal $("#1st")[0], $("#2nd").prev().prev()[0]

    it 'item의 중간이나 끝에서 enter를 치면 아래에 새로운 Item이 생성된다', () ->
      livelist.focus("#2nd").command("enter")
      console.log $("#1st")[0], $("#2nd").prev()[0]

      assert.fail()


  describe 'caret 이동', () ->
    it '리스트의 선택된 Item의 caret은 위,아래로 이동가능하다.', () ->
      livelist.focus("#2nd").command("up")
      ##assert.equal $("#1st")[0], $(":focus")[0]

    it '선택된 Item은 자신이 포함하고 있는 list가 있을 경우 해당 list의 item으로 이동하다.', () ->

    it '선택된 Item은 위로 이동 시, 해당 Item이 list를 가지고 있을 경우 해당 list의 최 하단 item으로 이동하다.', () ->

    it '리스트의 1st인 Item은 이동이 불가능하다.', () ->
