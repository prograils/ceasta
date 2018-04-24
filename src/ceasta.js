class Ceasta {
  constructor($textArea, placeholder, highlight) {
    if (placeholder == null) {
      placeholder = 'Test';
    }
    if (highlight == null) {
      highlight = 'Lorem';
    }
    this.$textArea = $textArea;
    this.placeholder = placeholder;
    this.highlight = highlight;
    this.value = this.$textArea.val();
    this.placeholderDisplay = false;
    this.init();
  }

  init() {
    this.setPlaceholder();
    this.inputEvent();
    this.focusEvents();
  }

  inputEvent() {
    this.$textArea.on('keyup', e => {
      this.onInputText(e);
    });
  }

  onInputText(e) {
    const regexp = `\\b(${this.highlight}\\w*)`;
    if (e.which !== 13 && this.val() != this.$textArea.text()) {
      this.selection = new Selection(this.$textArea.get(0));
      this.selection.saveCurrentSelection();
      this.adjustText(regexp);
      this.selection.restoreSelection();
    }
  }

  adjustText(regexp) {
    let $textArea = this.$textArea;
    $textArea.html($textArea.html().replace(/<b>|<\/b>/g, ''));
    $textArea.html(
      $textArea.html().replace(new RegExp(regexp, 'g'), '<b>$1</b>')
    );
    this.value = $textArea.text();
  }

  focusEvents() {
    this.$textArea.on('focusin', e => this.cleanPlaceholder());
    this.$textArea.on('focusout', e => {
      if (this.$textArea.text()) {
        return;
      }
      this.setPlaceholder();
    });
  }

  val(value = null) {
    if (value === null) {
      return this.value;
    } else {
      this.$textArea.text(value);
      return (this.value = value);
    }
  }

  setPlaceholder() {
    if (this.placeholderDisplay) {
      return;
    }
    this.$textArea.text(this.placeholder);
    this.placeholderDisplay = true;
  }

  cleanPlaceholder() {
    if (!this.placeholderDisplay) {
      return;
    }
    this.$textArea.text('');
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
    for (let ele of Array.from(root.childNodes)) {
      if (node === ele) {
        break;
      }
      if (ele.contains(node)) {
        const result = this.sumCurrentOffset(ele, node, 0);
        startOffset += result;
        break;
      } else {
        startOffset += ele.textContent.length;
      }
    }
    return startOffset;
  }

  findNodeForPosition($container, currentOffset) {
    let node;
    ({ node, currentOffset } = this.findNode(
      $container.childNodes,
      currentOffset
    ));
    if (node.childNodes.length === 0) {
      return { node, currentOffset };
    } else {
      return this.findNodeForPosition(node, currentOffset);
    }
  }

  findNode(childNodes, currentOffset) {
    for (let node of Array.from(childNodes)) {
      if (currentOffset - node.textContent.length <= 0) {
        return { node, currentOffset };
      } else {
        currentOffset -= node.textContent.length;
      }
    }
  }

  saveCurrentSelection() {
    this.currentSelection = this.getSelection();
    this.startOffset = this.currentSelection.startOffset;
    this.currentOffset = this.sumCurrentOffset(
      this.$container,
      this.currentSelection.startContainer,
      this.startOffset
    );
  }

  restoreSelection() {
    let node;
    if (this.currentOffset === 0) {
      return;
    }
    const range = document.createRange();
    ({ node, currentOffset: this.currentOffset } = this.findNodeForPosition(
      this.$container,
      this.currentOffset
    ));
    range.setStart(node, this.currentOffset);
    range.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

export default Ceasta;
