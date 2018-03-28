import $ from "jquery";
import { TextArea } from './index';

$(function () {
  window.jQuery = $;
  window.$ = $;
  var textArea;
  textArea = new TextArea($('#textarea'), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit');
});