

simplefixture = window.__html__['fixture/simple.html']
hierarchyfixture = window.__html__['fixture/hierarchy.html']


describe 'livelist', () ->

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
