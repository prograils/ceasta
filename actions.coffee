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
      # textArea.value = $(this).text()
      # textArea.test = saveSelection()
      # startOffset = textArea.test.startOffset
      # startNodesLength = this.childNodes.length
      # parentNode = textArea.test.startContainer.parentNode
      # nodeArray = Array.from(this.childNodes)
      # if parentNode != this
      #   parentIndex = nodeArray.indexOf(textArea.test.startContainer.parentNode)
      #   nodeIndex = Array.from(parentNode.childNodes).indexOf(textArea.test.startContainer)
      # else
      #   nodeIndex = nodeArray.indexOf(textArea.test.startContainer)
      # offsetSum = _.reduce nodeArray.slice(0, (parentIndex || nodeIndex)), ((sum, node) ->
      #   sum + node.textContent.length
      # ), startOffset
      selection = new Selection(this)
      selection.saveCurrentSelection()
      $(this).html($(this).text().replace(new RegExp(regexp, "g"), "<b>$1</b>"))
      selection.restoreSelection()
      # range = document.createRange()
      # if startNodesLength != this.childNodes.length
      #   ele = _.find Array.from(this.childNodes), (ele) ->
      #     if (offsetSum - ele.textContent.length) <= 0
      #       return true
      #     else
      #       offsetSum -= ele.textContent.length
      #       return false
      #   if ele.childNodes.length > 0
      #     range.setStart(ele.childNodes[0], offsetSum)
      #   else
      #     range.setStart(ele, offsetSum)
      # else
      #   if parentIndex
      #     start = this.childNodes[parentIndex].childNodes[nodeIndex]
      #   else
      #     start = this.childNodes[nodeIndex]
      #   range.setStart(start, startOffset)
      # range.collapse(true)
      # sel = window.getSelection()
      # sel.removeAllRanges()
      # sel.addRange(range)

  saveSelection = () ->
    if(window.getSelection)
      return window.getSelection().getRangeAt(0)
    else if(document.selection)
      return document.selection.createRange()

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
    @nodeArray = Array.from(@$container.childNodes)
    @nodesLength = @nodeArray.length

  saveCurrentSelection: ->
    @currentSelection = getSelection()
    @startOffset = @currentSelection.startOffset
    { @parentIndex, @nodeIndex } =
      getCurrentNodeIndexes(@nodeArray, @currentSelection.startContainer, @$container)
    @currentOffset = sumCurrentOffset(@nodeArray, (@parentIndex || @nodeIndex), @startOffset)

  restoreSelection: () ->
    range = document.createRange()
    { node, @currentOffset } = findNodeForPosition(@$container, @currentOffset)
    element = if node.childNodes.length > 0 then node.childNodes[0] else node
    range.setStart(element, @currentOffset)
    range.collapse(true)
    sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)

  getSelection = () ->
    if(window.getSelection)
      return window.getSelection().getRangeAt(0)
    else if(document.selection)
      return document.selection.createRange()

  getCurrentNodeIndexes = (nodeArray, startContainer, $container) ->
    if startContainer.parentNode != $container
      parentIndex = nodeArray.indexOf(startContainer.parentNode)
      nodeIndex = Array.from(startContainer.parentNode.childNodes).indexOf(startContainer)
    else
      nodeIndex = nodeArray.indexOf(startContainer)
    return { parentIndex, nodeIndex }

  sumCurrentOffset = (nodeArray, index, startOffset) ->
    _.reduce nodeArray.slice(0, index), ((sum, node) ->
        sum + node.textContent.length
    ), startOffset
  
  findNodeForPosition = ($container, currentOffset) ->
    node =  _.find Array.from($container.childNodes), (ele) ->
              if (currentOffset - ele.textContent.length) <=  0
                return true
              else
                currentOffset = currentOffset - ele.textContent.length
                return false
    { node, currentOffset }
  
  saveNodesIndexes = ($container, startContainer) ->
    currentLeafe = startContainer
    nodesIndexes = []
    while currentLeafe != $container
      nodesIndexes.push(Array.from(currentLeafe.parentNode.childNodes).indexOf(currentLeafe))
      currentLeafe = currentLeafe.parentNode
    nodesIndexes

  fetchNode = ($container, nodeIndexes) ->
    root = $container
    for nodeIndex in nodeIndexes
      root = root.childNodes[nodeIndex]
    root

$ ->
  textArea = new TextArea($('#textarea'), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit')