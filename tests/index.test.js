import { TextArea, Selection } from '../src/index';
import $ from 'jquery';

var textArea;

describe('TextArea', () => {
  beforeAll(() => {
    document.body.innerHTML = window.__html__['tests/index'];
    window.jQuery = $;
    window.$ = $;
    // console.log(text);
    textArea = new TextArea($('#textarea'), 'Fake placeholder');
  });

  describe('DOM', () => {
    it('should be in DOM', () => {
      // textArea.$container.focusin();
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
    it('should clean placeholder', () => {
      textArea.onInputText({ which: 2 }, );
      expect(textArea.$container.text()).toEqual('');
    });
    it('should set placeholder', () => {
      textArea.setPlaceholder();
      expect(textArea.$container.text()).toEqual('Fake placeholder');
    });
  });
});