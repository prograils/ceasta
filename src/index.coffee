import $ from "jquery"
import _ from "underscore"

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

  setPlaceholder: ->
    return if @placeholderDisplay
    @$container.text(@placeholder)
    @placeholderDisplay = true

  cleanPlaceholder: ->
    return unless @placeholderDisplay
    @$container.text('')
    @placeholderDisplay = false

  inputEvent = (textArea, $container, highlight) ->
    $container.on 'keyup', (e) ->
      regexp = "\\b(#{highlight}\\w*)"
      if e.which != 13 && textArea.val() != $(this).text()
        textArea.selection = new Selection(this)
        textArea.selection.saveCurrentSelection()
        adjustText(textArea, $container, regexp)
        textArea.selection.restoreSelection()
  
  adjustText = (textArea, $container, regexp) ->
    $container.html($container.html().replace(/<b>|<\/b>/g, ''))
    $container.html($container.html().replace(new RegExp(regexp, "g"), "<b>$1</b>"))
    textArea.value = $container.text()

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

  restoreSelection: ->
    return if @currentOffset == 0
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
      if node == ele then break
      if (ele != node) && (ele.contains(node))
        result = sumCurrentOffset(ele, node, 0)
        startOffset += result
        break
      else if node != ele
        startOffset += ele.textContent.length
    return startOffset
  
  findNodeForPosition = ($container, currentOffset) ->
    node =  _.find Array.from($container.childNodes), (ele) ->
              if (currentOffset - ele.textContent.length) <=  0
                return true
              else
                currentOffset -= ele.textContent.length
                return false
    if node.childNodes.length == 0
      { node, currentOffset }
    else
      findNodeForPosition(node, currentOffset)

$ ->
  textArea = new TextArea($('#textarea'), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit')