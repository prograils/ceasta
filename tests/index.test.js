import Ceasta from '../src/ceasta';
import $ from 'jquery';

var textArea;

describe('TextArea', () => {
  beforeEach(() => {
    document.body.innerHTML = window.__html__['tests/index'];
    window.jQuery = $;
    window.$ = $;
    textArea = new Ceasta($('#textarea'), 'Fake placeholder');
  });

  describe('DOM', () => {
    it('should be in DOM', () => {
      expect(textArea.$textArea[0]).toBeInDOM();
    });
    it('should be contenteditable', () => {
      expect(textArea.$textArea).toHaveAttr('contenteditable');
    });
    it('should trigger click', () => {
      spyOn(textArea.$textArea, 'click');
      textArea.$textArea.click();
      expect(textArea.$textArea.click).toHaveBeenCalled();
    });
  });

  describe('Constructor', () => {
    it('should assign highlight', () => {
      expect(textArea.highlight).toEqual('Lorem');
    });
    it('should assign placeholder', () => {
      expect(textArea.placeholder).toEqual('Fake placeholder');
    });
    it('should assign value', () => {
      expect(textArea.value).toEqual('');
    });
    it('should assign $textArea', () => {
      expect(textArea.$textArea).toEqual($('#textarea'));
    });
  });

  describe('Placeholder', () => {
    it('should clean placeholder', () => {
      textArea.$textArea.focusin();
      expect(textArea.$textArea.text()).toEqual('');
    });
    it('should set placeholder', () => {
      textArea.$textArea.focusout();
      expect(textArea.$textArea.text()).toEqual('Fake placeholder');
    });
  });

  describe('OnInputText', () => {
    var rangeStub;
    var event;
    beforeEach(() => {
      var range = { startOffset: 0, startContainer: textArea.$textArea[0] };
      rangeStub = {
        getRangeAt: function() {
          return range;
        },
        removeAllRanges: function() {
          return {};
        },
        addRange: function(newRange) {
          range = newRange;
        }
      };
      event = jQuery.Event('keyup');
      event.which = 109;
    });

    it('should insert letter', () => {
      textArea.val('L');
      textArea.$textArea.text('Lm');
      spyOn(window, 'getSelection').and.returnValue(rangeStub);
      textArea.$textArea.trigger(event);
      expect(textArea.$textArea.text()).toEqual('Lm');
    });

    it('should highlight', () => {
      textArea.val('Lore');
      textArea.$textArea.text('Lorem');
      spyOn(window, 'getSelection').and.returnValue(rangeStub);
      textArea.$textArea.trigger(event);
      expect(textArea.$textArea.text()).toEqual('Lorem');
      expect(textArea.$textArea.html()).toEqual('<b>Lorem</b>');
    });
  });
});
