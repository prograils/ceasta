import { TextArea } from '../src/index';
import $ from 'jquery';

describe('TextArea', () => {
  beforeAll(() => {
    document.body.innerHTML = window.__html__['tests/index'];
  });

  it('should init correctly', () => {
    let textArea = new TextArea($('#textarea'));
    expect(textArea.highlight).toEqual('Lorem');
  });
});