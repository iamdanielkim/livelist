

simplefixture = window.__html__['fixture/simple.html']
hierarchyfixture = window.__html__['fixture/hierarchy.html']
modifiedfixture = window.__html__['fixture/modified.html']
movedfixture = window.__html__['fixture/moved.html']
movedAndModifiedfixture = window.__html__['fixture/movedAndModified.html']
createdfixture = window.__html__['fixture/created.html']
deletedfixture = window.__html__['fixture/deleted.html']

describe 'Item', () ->
  describe 'Item.createByElement()', () ->
    it 'first element', () ->
      $("body").html(simplefixture)
      item = Item.createByElement($("#first-child"))

      expected = "first-child:Cfirst-child:nil_parent:nil_prev:1001:nil_firstchild"
      assert.equal item.isSeed(), true, "최상위 List의 첫번째 Item "
      assert.equal item, expected , item + " == " + expected

    it 'second element', () ->
      $("body").html(simplefixture)
      item = Item.createByElement($("#1001"))

      expected = "1001:C1001:nil_parent:first-child:1002:nil_firstchild"
      assert.equal item.isSeed(), false, "최상위 List의 첫번째 Item가 아닌 경우 "
      assert.equal item, expected , item + " == " + expected

    it 'non element', () ->
      $("body").html(simplefixture)
      item = Item.createByElement($("#NON_ELEMENT"))

      expected = "nil_id:nil_title:nil_parent:nil_prev:nil_next:nil_firstchild"
      assert.equal item, expected , item + " == " + expected

    it 'first element w/ child', () ->
      $("body").html(hierarchyfixture)
      item = Item.createByElement($("#f11"))

      expected = "f11:하하하:nil_parent:nil_prev:nil_next:f12"
      assert.equal item, expected , item + " == " + expected

    it 'second element element w/ child', () ->
      $("body").html(hierarchyfixture)
      item = Item.createByElement($("#f12"))

      expected = "f12:헤헤:f11:nil_prev:nil_next:f13"
      assert.equal item, expected , item + " == " + expected

  describe 'Item.createByJson()', () ->
    it 'ok', () ->
      json = {
          id: "1001",
          title: "C1001"
          parent: "nil_parent"
          prev: "first-child"
          next: "1002"
          firstChild: "nil_firstchild"
      };
      item = Item.createByJson(json)
      assert.ok !item.isNull()

  describe '상태 또는 값이 변경된 item의 manuplation', () ->
    it 'isTouched() - 특정 item이 변경되었는지 확인', () ->
      $("body").html(modifiedfixture)
      item = Item.createByElement($("#1001"))
      assert.ok item.isTouched(), item.isTouched()

    it 'getChangeset() -  값이 변경된 item의 이전, 이후 상태를 추춣함', () ->
      $("body").html(modifiedfixture)
      item = Item.createByElement($("#1001"))
      changeset = item.getChangeset()

      expected =
        modified:
          id: "1001"
          now: "CHANGED TITLE"
          old: "C1001"

      assert.deepEqual changeset, expected

    it 'getChangeset() - moved item의 이전, 이후 상태를 추춣함', () ->
      $("body").html(movedfixture)
      item = Item.createByElement($("#f14"))
      changeset = item.getChangeset()

      expected =
          moved:
            id: "f14"
            item: "f14:f11:f12:nil_next:nil_firstchild"

      assert.deepEqual changeset, expected

    it 'getChangeset() - item이 동시에 moved & modified 일때 상태 추출', () ->
      $("body").html(movedAndModifiedfixture)
      item = Item.createByElement($("#f14"))
      changeset = item.getChangeset()

      expected_modified =
        id: "f14"
        now: "F14 Changed Title"
        old: "f14 title"

      expected_moved =
        id: "f14"
        item: "f14:f11:f12:nil_next:nil_firstchild"

      assert.deepEqual changeset.modified, expected_modified
      assert.deepEqual changeset.moved, expected_moved

    it 'getChangeset() - item이 created 일때 상태 추출', () ->
      $("body").html(createdfixture)
      item = Item.createByElement($("#f14"))
      changeset = item.getChangeset()

      expected_created =
        created:
          id: "f14"
          item: "f14:f14 title:f11:f13:f15:nil_firstchild"

      assert.deepEqual changeset, expected_created

    it 'getChangeset() - item이 deleted 일때 상태 추출', () ->
      $("body").html(deletedfixture)
      deletedItem = Item.createDeletedItem("f14","f14 title","f11","f13","f15")
      changeset = deletedItem.getChangeset()

      expected_deleted =
        deleted:
          id: "f14"
          item: "f14:f14 title:f11:f13:f15:nil_firstchild"

      assert.deepEqual changeset, expected_deleted
