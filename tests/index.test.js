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
      expect(textArea.$container[0]).toBeInDOM();
    });
    it('should be contenteditable', () => {
      expect(textArea.$container).toHaveAttr('contenteditable');
    });
    it('should trigger click', () => {
      spyOn(textArea.$container, 'click');
      textArea.$container.click();
      expect(textArea.$container.click).toHaveBeenCalled();
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
    it('should assign $container', () => {
      expect(textArea.$container).toEqual($('#textarea'));
    });
  });

  describe('Placeholder', () => {
    it('should clean placeholder', () => {
      textArea.$container.focusin();
      expect(textArea.$container.text()).toEqual(''); 
    });
    it('should set placeholder', () => {
      textArea.$container.focusout();
      expect(textArea.$container.text()).toEqual('Fake placeholder');
    });
  });

  describe('OnInputText', () => {
    var rangeStub; 
    var event;
    beforeEach(() => {
      var range = { startOffset: 0, startContainer: textArea.$container[0] };
      rangeStub = {
        getRangeAt: function () { return range; },
        removeAllRanges: function () { return {} },
        addRange: function (newRange) { range = newRange; }
      };
      event = jQuery.Event("keyup");
      event.which = 109;
    });
    
    it('should insert letter', () => {
      textArea.val('L');
      textArea.$container.text('Lm');
      spyOn(window, 'getSelection').and.returnValue(rangeStub);
      textArea.$container.trigger(event);
      expect(textArea.$container.text()).toEqual('Lm');
    });

    it('should highlight', () => {
      textArea.val('Lore');
      textArea.$container.text('Lorem');
      spyOn(window, 'getSelection').and.returnValue(rangeStub);
      textArea.$container.trigger(event);
      expect(textArea.$container.text()).toEqual('Lorem');
      expect(textArea.$container.html()).toEqual('<b>Lorem</b>');
    });
  });
});