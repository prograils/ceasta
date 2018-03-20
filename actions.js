// Generated by CoffeeScript 2.2.3
(function() {
  var Selection, TextArea;

  TextArea = (function() {
    var focusEvents, inputEvent, saveSelection;

    class TextArea {
      constructor($container, placeholder = 'Test', highlight = 'Lorem') {
        this.$container = $container;
        this.placeholder = placeholder;
        this.highlight = highlight;
        this.value = this.$container.val();
        this.test = null;
        this.init();
      }

      init() {
        this.setPlaceholder();
        inputEvent(this, this.$container, this.highlight);
        return focusEvents(this, this.$container, this.placeholder);
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
        if (this.placeholderDisplay) {
          return;
        }
        this.$container.text(this.placeholder);
        return this.placeholderDisplay = true;
      }

      cleanPlaceholder() {
        if (!this.placeholderDisplay) {
          return;
        }
        this.$container.text('');
        return this.placeholderDisplay = false;
      }

    };

    inputEvent = function(textArea, $container, highlight) {
      return $container.on('input', function(e) {
        var regexp, selection;
        regexp = `\\b(${highlight}\\w*)`;
        // textArea.value = $(this).text()
        // textArea.test = saveSelection()
        // startOffset = textArea.test.startOffset
        // startNodesLength = this.childNodes.length
        // parentNode = textArea.test.startContainer.parentNode
        // nodeArray = Array.from(this.childNodes)
        // if parentNode != this
        //   parentIndex = nodeArray.indexOf(textArea.test.startContainer.parentNode)
        //   nodeIndex = Array.from(parentNode.childNodes).indexOf(textArea.test.startContainer)
        // else
        //   nodeIndex = nodeArray.indexOf(textArea.test.startContainer)
        // offsetSum = _.reduce nodeArray.slice(0, (parentIndex || nodeIndex)), ((sum, node) ->
        //   sum + node.textContent.length
        // ), startOffset
        selection = new Selection(this);
        selection.saveCurrentSelection();
        $(this).html($(this).text().replace(new RegExp(regexp, "g"), "<b>$1</b>"));
        return selection.restoreSelection();
      });
    };

    // range = document.createRange()
    // if startNodesLength != this.childNodes.length
    //   ele = _.find Array.from(this.childNodes), (ele) ->
    //     if (offsetSum - ele.textContent.length) <= 0
    //       return true
    //     else
    //       offsetSum -= ele.textContent.length
    //       return false
    //   if ele.childNodes.length > 0
    //     range.setStart(ele.childNodes[0], offsetSum)
    //   else
    //     range.setStart(ele, offsetSum)
    // else
    //   if parentIndex
    //     start = this.childNodes[parentIndex].childNodes[nodeIndex]
    //   else
    //     start = this.childNodes[nodeIndex]
    //   range.setStart(start, startOffset)
    // range.collapse(true)
    // sel = window.getSelection()
    // sel.removeAllRanges()
    // sel.addRange(range)
    saveSelection = function() {
      if (window.getSelection) {
        return window.getSelection().getRangeAt(0);
      } else if (document.selection) {
        return document.selection.createRange();
      }
    };

    focusEvents = function(textArea, $container, placeholder) {
      $container.on('focusin', function(e) {
        return textArea.cleanPlaceholder();
      });
      return $container.on('focusout', function(e) {
        if ($(this).text()) {
          return;
        }
        return textArea.setPlaceholder();
      });
    };

    return TextArea;

  }).call(this);

  Selection = (function() {
    var fetchNode, findNodeForPosition, getCurrentNodeIndexes, getSelection, saveNodesIndexes, sumCurrentOffset;

    class Selection {
      constructor($container) {
        this.$container = $container;
        this.nodeArray = Array.from(this.$container.childNodes);
        this.nodesLength = this.nodeArray.length;
      }

      saveCurrentSelection() {
        this.currentSelection = getSelection();
        this.startOffset = this.currentSelection.startOffset;
        // @nodesIndexes = saveNodesIndexes(@$container, @currentSelection.startContainer)
        // if parentNode != this
        //     parentIndex = nodeArray.indexOf(textArea.test.startContainer.parentNode)
        //     nodeIndex = Array.from(parentNode.childNodes).indexOf(textArea.test.startContainer)
        //   else
        //     nodeIndex = nodeArray.indexOf(textArea.test.startContainer)
        ({parentIndex: this.parentIndex, nodeIndex: this.nodeIndex} = getCurrentNodeIndexes(this.nodeArray, this.currentSelection.startContainer, this.$container));
        return this.currentOffset = sumCurrentOffset(this.nodeArray, this.parentIndex || this.nodeIndex, this.startOffset);
      }

      restoreSelection() {
        var element, node, range, sel, start;
        range = document.createRange();
        if (this.nodesLength !== this.$container.childNodes.length) {
          ({node, currentOffset: this.currentOffset} = findNodeForPosition(this.$container, this.currentOffset));
          element = node.childNodes.length > 0 ? node.childNodes[0] : node;
          range.setStart(element, this.currentOffset);
        } else {
          if (this.parentIndex) {
            start = this.$container.childNodes[this.parentIndex].childNodes[this.nodeIndex];
          } else {
            start = this.$container.childNodes[this.nodeIndex];
          }
          range.setStart(start, this.startOffset);
        }
        range.collapse(true);
        sel = window.getSelection();
        sel.removeAllRanges();
        return sel.addRange(range);
      }

    };

    getSelection = function() {
      if (window.getSelection) {
        return window.getSelection().getRangeAt(0);
      } else if (document.selection) {
        return document.selection.createRange();
      }
    };

    getCurrentNodeIndexes = function(nodeArray, startContainer, $container) {
      var nodeIndex, parentIndex;
      if (startContainer.parentNode !== $container) {
        parentIndex = nodeArray.indexOf(startContainer.parentNode);
        nodeIndex = Array.from(startContainer.parentNode.childNodes).indexOf(startContainer);
      } else {
        nodeIndex = nodeArray.indexOf(startContainer);
      }
      return {parentIndex, nodeIndex};
    };

    sumCurrentOffset = function(nodeArray, index, startOffset) {
      return _.reduce(nodeArray.slice(0, index), (function(sum, node) {
        return sum + node.textContent.length;
      }), startOffset);
    };

    findNodeForPosition = function($container, currentOffset) {
      var node;
      node = _.find(Array.from($container.childNodes), function(ele) {
        if ((currentOffset - ele.textContent.length) <= 0) {
          return true;
        } else {
          currentOffset = currentOffset - ele.textContent.length;
          return false;
        }
      });
      return {node, currentOffset};
    };

    saveNodesIndexes = function($container, startContainer) {
      var currentLeafe, nodesIndexes;
      currentLeafe = startContainer;
      nodesIndexes = [];
      while (currentLeafe !== $container) {
        nodesIndexes.push(Array.from(currentLeafe.parentNode.childNodes).indexOf(currentLeafe));
        currentLeafe = currentLeafe.parentNode;
      }
      return nodesIndexes;
    };

    fetchNode = function($container, nodeIndexes) {
      var i, len, nodeIndex, root;
      root = $container;
      for (i = 0, len = nodeIndexes.length; i < len; i++) {
        nodeIndex = nodeIndexes[i];
        root = root.childNodes[nodeIndex];
      }
      return root;
    };

    return Selection;

  }).call(this);

  $(function() {
    var textArea;
    return textArea = new TextArea($('#textarea'), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit');
  });

}).call(this);