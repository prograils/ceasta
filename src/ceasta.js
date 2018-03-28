export class Ceasta {
  constructor($container, placeholder, highlight) {
    if (placeholder == null) { placeholder = 'Test'; }
    if (highlight == null) { highlight = 'Lorem'; }
    this.$container = $container;
    this.placeholder = placeholder;
    this.highlight = highlight;
    this.value = this.$container.val();
    this.placeholderDisplay = false;
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
    if ((e.which !== 13) && (textArea.val() != $container.text())) {
      textArea.selection = new Selection($container.get(0));
      textArea.selection.saveCurrentSelection();
      textArea.adjustText(textArea, $container, regexp);
      textArea.selection.restoreSelection();
    }
  }

  adjustText(textArea, $container, regexp) {
    $container.html($container.html().replace(/<b>|<\/b>/g, ''));
    $container.html($container.html().replace(new RegExp(regexp, "g"), "<b>$1</b>"));
    textArea.value = $container.text();
  }

  focusEvents(textArea, $container, placeholder) {
    textArea.$container.on('focusin', e => textArea.cleanPlaceholder());
    textArea.$container.on('focusout', function (e) {
      if ($(this).text()) { return; }
      textArea.setPlaceholder();
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
    this.placeholderDisplay = true;
  }

  cleanPlaceholder() {
    if (!this.placeholderDisplay) { return; }
    this.$container.text('');
    this.placeholderDisplay = false;
  }
}

class Selection {
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
        const result = this.sumCurrentOffset(ele, node, 0);
        startOffset += result;
        break;
      } else if (node !== ele) {
        console.log(ele.textContent);
        startOffset += ele.textContent.length;
      }
    }
    return startOffset;
  }

  findNodeForPosition($container, currentOffset) {
    let node;
    ({ node, currentOffset } = this.findNode($container.childNodes, currentOffset));
    if (node.childNodes.length === 0) {
      return { node, currentOffset };
    } else {
      return this.findNodeForPosition(node, currentOffset);
    }
  }

  findNode(childNodes, currentOffset) {
    for(let node of Array.from(childNodes)) {
      if ((currentOffset - node.textContent.length) <= 0) {
        return { node, currentOffset };
      } else {
        currentOffset -= node.textContent.length;
      }
    }
  }
  
  saveCurrentSelection() {
    this.currentSelection = this.getSelection();
    this.startOffset = this.currentSelection.startOffset;
    this.currentOffset = this.sumCurrentOffset(this.$container, this.currentSelection.startContainer, this.startOffset);
    console.log(this.currentOffset);
  }

  restoreSelection() {
    let node;
    if (this.currentOffset === 0) { return; }
    const range = document.createRange();
    ({ node, currentOffset: this.currentOffset } = this.findNodeForPosition(this.$container, this.currentOffset));
    range.setStart(node, this.currentOffset);
    range.collapse(true);
    const sel = window.getSelection();
    console.log(sel);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}