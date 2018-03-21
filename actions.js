// Generated by CoffeeScript 2.2.3
(function() {
  var Selection, TextArea;

  TextArea = (function() {
    var focusEvents, inputEvent;

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
      return $container.on('keyup', function(e) {
        var regexp;
        regexp = `\\b(${highlight}\\w*)`;
        if (e.which !== 13 && textArea.val() !== $(this).text()) {
          textArea.selection = new Selection(this);
          textArea.selection.saveCurrentSelection();
          $(this).html($(this).html().replace(/<b>|<\/b>/g, ''));
          $(this).html($(this).html().replace(new RegExp(regexp, "g"), "<b>$1</b>"));
          textArea.selection.restoreSelection();
          return textArea.value = $(this).text();
        }
      });
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
    var findNodeForPosition, getSelection, sumCurrentOffset;

    class Selection {
      constructor($container) {
        this.$container = $container;
      }

      saveCurrentSelection() {
        this.currentSelection = getSelection();
        this.startOffset = this.currentSelection.startOffset;
        return this.currentOffset = sumCurrentOffset(this.$container, this.currentSelection.startContainer, this.startOffset);
      }

      restoreSelection() {
        var node, range, sel;
        range = document.createRange();
        ({node, currentOffset: this.currentOffset} = findNodeForPosition(this.$container, this.currentOffset));
        range.setStart(node, this.currentOffset);
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

    sumCurrentOffset = function(root, node, startOffset) {
      var ele, i, len, ref, result;
      ref = Array.from(root.childNodes);
      for (i = 0, len = ref.length; i < len; i++) {
        ele = ref[i];
        if ((ele !== node) && (ele.contains(node))) {
          result = sumCurrentOffset(ele, node, 0);
          startOffset = startOffset + result;
          break;
        } else if (node !== ele) {
          startOffset = startOffset + ele.textContent.length;
        }
      }
      return startOffset;
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
      if (node.childNodes.length === 0) {
        return {node, currentOffset};
      } else {
        return findNodeForPosition(node, currentOffset);
      }
    };

    return Selection;

  }).call(this);

  $(function() {
    var textArea;
    return textArea = new TextArea($('#textarea'), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit');
  });

}).call(this);
