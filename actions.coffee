class TextArea
  constructor: ($container, placeholder = 'Test', highlight = 'Lorem') ->
    @$container = $container
    @placeholder = placeholder
    @highlight = highlight
    @value = @$container.val()
    @test = null
    @init()

  init: ->
    @setPlaceholder()
    inputEvent(@, @$container, @highlight)
    focusEvents(@, @$container, @placeholder)

  val: (value = null) ->
    if value == null
      return @value
    else
      @$container.text(value)
      @value = value

  inputEvent = (textArea, $container, highlight) ->
    $container.on 'input', (e) ->
      regexp = "\\b(#{highlight}\\w*)"
      textArea.value = $(this).text()
      textArea.test = saveSelection()
      startOffset = textArea.test.startOffset
      startNodesLength = this.childNodes.length
      parentNode = textArea.test.startContainer.parentNode
      nodeArray = Array.from(this.childNodes)
      if parentNode != this
        parentIndex = nodeArray.indexOf(textArea.test.startContainer.parentNode)
        nodeIndex = Array.from(parentNode.childNodes).indexOf(textArea.test.startContainer)
      else
        nodeIndex = nodeArray.indexOf(textArea.test.startContainer)
      offsetSum = _.reduce nodeArray.slice(0, (parentIndex || nodeIndex)), ((sum, node) ->
        sum + node.textContent.length
      ), startOffset
      $(this).html($(this).text().replace(new RegExp(regexp, "g"), "<b>$1</b>"))
      range = document.createRange()
      if startNodesLength != this.childNodes.length
        ele = _.find Array.from(this.childNodes), (ele) ->
          if (offsetSum - ele.textContent.length) <= 0
            return true
          else
            offsetSum = offsetSum - ele.textContent.length
            return false
        if ele.childNodes.length > 0
          range.setStart(ele.childNodes[0], offsetSum)
        else
          range.setStart(ele, offsetSum)
      else
        if parentIndex
          start = this.childNodes[parentIndex].childNodes[nodeIndex]
        else
          start = this.childNodes[nodeIndex]
        range.setStart(start, startOffset)
      range.collapse(true)
      sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
      
  saveSelection = () ->
    if(window.getSelection)
      return window.getSelection().getRangeAt(0)
    else if(document.selection)
      return document.selection.createRange()

  restoreSelection = (textArea) ->
    isInFocus = true
    # document.getElementById('textarea').focus()
    if textArea.test != null
      if window.getSelection
        s = window.getSelection()
        if s.rangeCount > 0
          s.removeAllRanges()
        s.addRange textArea.test
      else if document.createRange
        window.getSelection().addRange textArea.test
      else if document.selection
        textArea.test.select()

  setCursor: ($container, position) ->
    _.each $container.get(0).childNodes, (node), ->



  setPlaceholder: ->
    return if @placeholderDisplay
    @$container.text(@placeholder)
    @placeholderDisplay = true

  cleanPlaceholder: ->
    return unless @placeholderDisplay
    @$container.text('')
    @placeholderDisplay = false

  focusEvents = (textArea, $container, placeholder) ->
    $container.on 'focusin', (e) ->
      textArea.cleanPlaceholder()
    
    $container.on 'focusout', (e) ->
      return if $(this).text()
      textArea.setPlaceholder()

$ ->
  textArea = new TextArea($('#textarea'), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit')