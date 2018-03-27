import $ from "jquery";
import _ from "underscore";

export class TextArea {
  constructor($container, placeholder, highlight) {
    if (placeholder == null) { placeholder = 'Test'; }
    if (highlight == null) { highlight = 'Lorem'; }
    this.$container = $container;
    this.placeholder = placeholder;
    this.highlight = highlight;
    this.value = this.$container.val();
    this.test = null;
    this.init();
  }

  init() {
    this.setPlaceholder();
    this.inputEvent(this, this.$container, this.highlight);
    this.focusEvents(this, this.$container, this.placeholder);
  }

  inputEvent(textArea, $container, highlight) {
    $container.on('keyup', function (e) {
      textArea.onInputText(e, textArea, $container, highlight);
    });
  }

  onInputText(e, textArea, $container, highlight) {
    const regexp = `\\b(${highlight}\\w*)`;
    if ((e.which !== 13) && (textArea.val() !== $container.text())) {
      textArea.selection = new Selection($container.get(0));
      textArea.selection.saveCurrentSelection();
      textArea.adjustText(textArea, $container, regexp);
      return textArea.selection.restoreSelection();
    }
  }

  adjustText(textArea, $container, regexp) {
    $container.html($container.html().replace(/<b>|<\/b>/g, ''));
    $container.html($container.html().replace(new RegExp(regexp, "g"), "<b>$1</b>"));
    return textArea.value = $container.text();
  }

  focusEvents(textArea, $container, placeholder) {
    $container.on('focusin', e => textArea.cleanPlaceholder());

    return $container.on('focusout', function (e) {
      if ($(this).text()) { return; }
      return textArea.setPlaceholder();
    });
  }

  val(value = null) {
    if (value === null) {
      return this.value;
    } else {
      this.$container.text(value);
      return this.value = value;
    }
  }

  setPlaceholder() {
    if (this.placeholderDisplay) { return; }
    this.$container.text(this.placeholder);
    return this.placeholderDisplay = true;
  }

  cleanPlaceholder() {
    if (!this.placeholderDisplay) { return; }
    this.$container.text('');
    return this.placeholderDisplay = false;
  }
}

export class Selection {
  constructor($container) {
    this.$container = $container;
  }


  getSelection() {
    if (window.getSelection) {
      return window.getSelection().getRangeAt(0);
    } else if (document.selection) {
      return document.selection.createRange();
    }
  }

  sumCurrentOffset(root, node, startOffset) {
    for (let ele of Array.from(Array.from(root.childNodes))) {
      if (node === ele) { break; }
      if ((ele !== node) && (ele.contains(node))) {
        const result = sumCurrentOffset(ele, node, 0);
        startOffset += result;
        break;
      } else if (node !== ele) {
        startOffset += ele.textContent.length;
      }
    }
    return startOffset;
  }

  findNodeForPosition($container, currentOffset) {
    const node = _.find(Array.from($container.childNodes), function (ele) {
      if ((currentOffset - ele.textContent.length) <= 0) {
        return true;
      } else {
        currentOffset -= ele.textContent.length;
        return false;
      }
    });
    if (node.childNodes.length === 0) {
      return { node, currentOffset };
    } else {
      return findNodeForPosition(node, currentOffset);
    }
  }
  
  saveCurrentSelection() {
    this.currentSelection = this.getSelection();
    this.startOffset = this.currentSelection.startOffset;
    return this.currentOffset = this.sumCurrentOffset(this.$container, this.currentSelection.startContainer, this.startOffset);
  }

  restoreSelection() {
    let node;
    if (this.currentOffset === 0) { return; }
    const range = document.createRange();
    ({ node, currentOffset: this.currentOffset } = this.findNodeForPosition(this.$container, this.currentOffset));
    range.setStart(node, this.currentOffset);
    range.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    return sel.addRange(range);
  }
}

$(function () {
  let textArea;
  return textArea = new TextArea($('#textarea'), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit');
});


// import $ from "jquery"
// import _ from "underscore"

// class TextArea
//   constructor: ($container, placeholder = 'Test', highlight = 'Lorem') ->
//     @$container = $container
//     @placeholder = placeholder
//     @highlight = highlight
//     @value = @$container.val()
//     @test = null
//     @init()

//   init: ->
//     @setPlaceholder()
//     inputEvent(@, @$container, @highlight)
//     focusEvents(@, @$container, @placeholder)

//   val: (value = null) ->
//     if value == null
//       return @value
//     else
//       @$container.text(value)
//       @value = value

//   setPlaceholder: ->
//     return if @placeholderDisplay
//     @$container.text(@placeholder)
//     @placeholderDisplay = true

//   cleanPlaceholder: ->
//     return unless @placeholderDisplay
//     @$container.text('')
//     @placeholderDisplay = false

//   inputEvent = (textArea, $container, highlight) ->
//     $container.on 'keyup', (e) ->
//       regexp = "\\b(#{highlight}\\w*)"
//       if e.which != 13 && textArea.val() != $(this).text()
//         textArea.selection = new Selection(this)
//         textArea.selection.saveCurrentSelection()
//         adjustText(textArea, $container, regexp)
//         textArea.selection.restoreSelection()
  
//   adjustText = (textArea, $container, regexp) ->
//     $container.html($container.html().replace(/<b>|<\/b>/g, ''))
//     $container.html($container.html().replace(new RegExp(regexp, "g"), "<b>$1</b>"))
//     textArea.value = $container.text()

//   focusEvents = (textArea, $container, placeholder) ->
//     $container.on 'focusin', (e) ->
//       textArea.cleanPlaceholder()
    
//     $container.on 'focusout', (e) ->
//       return if $(this).text()
//       textArea.setPlaceholder()

// class Selection
//   constructor: ($container) ->
//     @$container = $container

//   saveCurrentSelection: ->
//     @currentSelection = getSelection()
//     @startOffset = @currentSelection.startOffset
//     @currentOffset = sumCurrentOffset(@$container, @currentSelection.startContainer, @startOffset)

//   restoreSelection: ->
//     return if @currentOffset == 0
//     range = document.createRange()
//     { node, @currentOffset } = findNodeForPosition(@$container, @currentOffset)
//     range.setStart(node, @currentOffset)
//     range.collapse(true)
//     sel = window.getSelection()
//     sel.removeAllRanges()
//     sel.addRange(range)

//   getSelection = () ->
//     if(window.getSelection)
//       return window.getSelection().getRangeAt(0)
//     else if(document.selection)
//       return document.selection.createRange()

//   sumCurrentOffset = (root, node, startOffset) ->
//     for ele in Array.from(root.childNodes)
//       if node == ele then break
//       if (ele != node) && (ele.contains(node))
//         result = sumCurrentOffset(ele, node, 0)
//         startOffset += result
//         break
//       else if node != ele
//         startOffset += ele.textContent.length
//     return startOffset
  
//   findNodeForPosition = ($container, currentOffset) ->
//     node =  _.find Array.from($container.childNodes), (ele) ->
//               if (currentOffset - ele.textContent.length) <=  0
//                 return true
//               else
//                 currentOffset -= ele.textContent.length
//                 return false
//     if node.childNodes.length == 0
//       { node, currentOffset }
//     else
//       findNodeForPosition(node, currentOffset)

// $ ->
//   textArea = new TextArea($('#textarea'), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit')