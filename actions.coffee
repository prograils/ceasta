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
    $container.on 'keyup', (e) ->
      regexp = "\\b(#{highlight}\\w*)"
      if e.which != 13 && textArea.val() != $(this).text()
        textArea.selection = new Selection(this)
        textArea.selection.saveCurrentSelection()
        $(this).html($(this).html().replace(/<b>|<\/b>/g, ''))
        $(this).html($(this).html().replace(new RegExp(regexp, "g"), "<b>$1</b>"))
        textArea.selection.restoreSelection()
        textArea.value = $(this).text()

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

class Selection
  constructor: ($container) ->
    @$container = $container

  saveCurrentSelection: ->
    @currentSelection = getSelection()
    @startOffset = @currentSelection.startOffset
    @currentOffset = sumCurrentOffset(@$container, @currentSelection.startContainer, @startOffset)

  restoreSelection: () ->
    range = document.createRange()
    { node, @currentOffset } = findNodeForPosition(@$container, @currentOffset)
    range.setStart(node, @currentOffset)
    range.collapse(true)
    sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)

  getSelection = () ->
    if(window.getSelection)
      return window.getSelection().getRangeAt(0)
    else if(document.selection)
      return document.selection.createRange()

  sumCurrentOffset = (root, node, startOffset) ->
    for ele in Array.from(root.childNodes)
      if (ele != node) && (ele.contains(node))
        result = sumCurrentOffset(ele, node, 0)
        startOffset = startOffset + result
        break
      else if node != ele
        startOffset = startOffset + ele.textContent.length
    return startOffset
  
  findNodeForPosition = ($container, currentOffset) ->
    node =  _.find Array.from($container.childNodes), (ele) ->
              if (currentOffset - ele.textContent.length) <=  0
                return true
              else
                currentOffset = currentOffset - ele.textContent.length
                return false
    if node.childNodes.length == 0
      { node, currentOffset }
    else
      findNodeForPosition(node, currentOffset)

$ ->
  textArea = new TextArea($('#textarea'), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit')