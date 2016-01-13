/**
 * The default templates for the shipped modules. The templates are organized according to the `Module.name` property.
 *
 * These template are internally parsed using `lodash.template`, see [https://lodash.com/docs#template](https://lodash.com/docs#template) for more information.
 *
 * @type {Object}
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
  checkin: "\n    <% if (waiting || !label) { %>\n      <div class=\"section-top\"></div>\n      <div class=\"section-center flex-center\">\n        <p class=\"big\"><%= waiting || error %></p>\n      </div>\n      <div class=\"section-bottom\"></div>\n    <% } else { %>\n      <div class=\"section-top flex-middle\">\n        <p class=\"big\"><%= labelPrefix %></p>\n      </div>\n      <div class=\"section-center flex-center\">\n        <div class=\"checkin-label\">\n          <p class=\"huge bold\"><%= label %></p></div>\n      </div>\n      <div class=\"section-bottom flex-middle\">\n        <p class=\"small\"><%= labelPostfix %></p>\n      </div>\n    <% } %>\n  ",

  control: "\n    <h1 class=\"big\"><%= title %></h1>\n  ",

  loader: "\n    <div class=\"section-top flex-middle\">\n      <p><%= loading %></p>\n    </div>\n    <div class=\"section-center flex-center\">\n      <% if (showProgress) { %>\n      <div class=\"progress-wrap\">\n        <div class=\"progress-bar\" id=\"progress-bar\"></div>\n      </div>\n      <% } %>\n    </div>\n    <div class=\"section-bottom\"></div>\n  ",

  locator: "\n    <div class=\"section-square flex-middle\"></div>\n    <div class=\"section-float flex-middle\">\n      <% if (!activateBtn) { %>\n        <p class=\"small\"><%= instructions %></p>\n      <% } else { %>\n        <button class=\"btn\"><%= send %></button>\n      <% } %>\n    </div>\n  ",

  orientation: "\n    <div class=\"section-top\"></div>\n    <div class=\"section-center flex-center\">\n      <p><%= !error ? instructions : errorMessage %></p>\n    </div>\n    <div class=\"section-bottom flex-middle\">\n      <% if (!error) { %>\n        <button class=\"btn\"><%= send %></button>\n      <% } %>\n    </div>\n  ",

  placer: "\n    <div class=\"section-square flex-middle\"></div>\n    <div class=\"section-float flex-middle\">\n      <% if (mode === 'graphic') { %>\n        <p><%= instructions %></p>\n      <% } else if (mode === 'list') { %>\n        <% if (showBtn) { %>\n          <button class=\"btn\"><%= send %></button>\n        <% } %>\n      <% } %>\n    </div>\n  ",

  sync: "\n    <div class=\"section-top\"></div>\n    <div class=\"section-center flex-center\">\n      <p class=\"soft-blink\"><%= wait %></p>\n    </div>\n    <div class=\"section-bottom\"></div>\n  ",

  survey: "\n    <div class=\"section-top\">\n      <% if (counter <= length) { %>\n        <p class=\"counter\"><%= counter %> / <%= length %></p>\n      <% } %>\n    </div>\n    <% if (counter > length) { %>\n      <div class=\"section-center flex-center\">\n        <p class=\"big\"><%= thanks %>\n      </div>\n    <% } else { %>\n      <div class=\"section-center\"></div>\n    <% } %>\n    <div class=\"section-bottom flex-middle\">\n      <% if (counter < length) { %>\n        <button class=\"btn\"><%= next %></button>\n      <% } else if (counter === length) { %>\n        <button class=\"btn\"><%= validate %></button>\n      <% } %>\n    </div>\n  ",

  welcome: "\n    <div class=\"section-top flex-middle\">\n      <% if (!error) { %>\n        <p class=\"big\"><%= welcome %> <b><%= globals.appName %></b></p>\n      <% } %>\n    </div>\n    <div class=\"section-center flex-center\">\n      <% if (error) { %>\n        <p class=\"big\"><%= error %></p>\n      <% } else { %>\n        <p class=\"small\"><%= touchScreen %></p>\n      <% } %>\n    </div>\n    <div class=\"section-bottom flex-middle\"></div>\n  "
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9kZWZhdWx0VGVtcGxhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztxQkFPZTtBQUNiLFNBQU8sMHBCQW1CTjs7QUFFRCxTQUFPLGlEQUVOOztBQUVELFFBQU0sdVdBWUw7O0FBRUQsU0FBTyx1U0FTTjs7QUFFRCxhQUFXLCtUQVVWOztBQUVELFFBQU0sbVdBV0w7O0FBRUQsTUFBSSxvTUFNSDs7QUFFRCxRQUFNLDZvQkFvQkw7O0FBRUQsU0FBTyxxY0FjTjtDQUNGIiwiZmlsZSI6InNyYy9jbGllbnQvZGlzcGxheS9kZWZhdWx0VGVtcGxhdGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgZGVmYXVsdCB0ZW1wbGF0ZXMgZm9yIHRoZSBzaGlwcGVkIG1vZHVsZXMuIFRoZSB0ZW1wbGF0ZXMgYXJlIG9yZ2FuaXplZCBhY2NvcmRpbmcgdG8gdGhlIGBNb2R1bGUubmFtZWAgcHJvcGVydHkuXG4gKlxuICogVGhlc2UgdGVtcGxhdGUgYXJlIGludGVybmFsbHkgcGFyc2VkIHVzaW5nIGBsb2Rhc2gudGVtcGxhdGVgLCBzZWUgW2h0dHBzOi8vbG9kYXNoLmNvbS9kb2NzI3RlbXBsYXRlXShodHRwczovL2xvZGFzaC5jb20vZG9jcyN0ZW1wbGF0ZSkgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICBjaGVja2luOiBgXG4gICAgPCUgaWYgKHdhaXRpbmcgfHwgIWxhYmVsKSB7ICU+XG4gICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3BcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LWNlbnRlclwiPlxuICAgICAgICA8cCBjbGFzcz1cImJpZ1wiPjwlPSB3YWl0aW5nIHx8wqBlcnJvciAlPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tXCI+PC9kaXY+XG4gICAgPCUgfSBlbHNlIHsgJT5cbiAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcCBmbGV4LW1pZGRsZVwiPlxuICAgICAgICA8cCBjbGFzcz1cImJpZ1wiPjwlPSBsYWJlbFByZWZpeCAlPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaGVja2luLWxhYmVsXCI+XG4gICAgICAgICAgPHAgY2xhc3M9XCJodWdlIGJvbGRcIj48JT0gbGFiZWwgJT48L3A+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbSBmbGV4LW1pZGRsZVwiPlxuICAgICAgICA8cCBjbGFzcz1cInNtYWxsXCI+PCU9IGxhYmVsUG9zdGZpeCAlPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwlIH0gJT5cbiAgYCxcblxuICBjb250cm9sOiBgXG4gICAgPGgxIGNsYXNzPVwiYmlnXCI+PCU9IHRpdGxlICU+PC9oMT5cbiAgYCxcblxuICBsb2FkZXI6IGBcbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3AgZmxleC1taWRkbGVcIj5cbiAgICAgIDxwPjwlPSBsb2FkaW5nICU+PC9wPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LWNlbnRlclwiPlxuICAgICAgPCUgaWYgKHNob3dQcm9ncmVzcykgeyAlPlxuICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLXdyYXBcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDwlIH0gJT5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b21cIj48L2Rpdj5cbiAgYCxcblxuICBsb2NhdG9yOiBgXG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tc3F1YXJlIGZsZXgtbWlkZGxlXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tZmxvYXQgZmxleC1taWRkbGVcIj5cbiAgICAgIDwlIGlmICghYWN0aXZhdGVCdG4pIHsgJT5cbiAgICAgICAgPHAgY2xhc3M9XCJzbWFsbFwiPjwlPSBpbnN0cnVjdGlvbnMgJT48L3A+XG4gICAgICA8JSB9IGVsc2UgeyAlPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuXCI+PCU9IHNlbmQgJT48L2J1dHRvbj5cbiAgICAgIDwlIH0gJT5cbiAgICA8L2Rpdj5cbiAgYCxcblxuICBvcmllbnRhdGlvbjogYFxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LWNlbnRlclwiPlxuICAgICAgPHA+PCU9ICFlcnJvciA/IGluc3RydWN0aW9ucyA6IGVycm9yTWVzc2FnZSAlPjwvcD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b20gZmxleC1taWRkbGVcIj5cbiAgICAgIDwlIGlmICghZXJyb3IpIHsgJT5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0blwiPjwlPSBzZW5kICU+PC9idXR0b24+XG4gICAgICA8JSB9ICU+XG4gICAgPC9kaXY+XG4gIGAsXG5cbiAgcGxhY2VyOiBgXG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tc3F1YXJlIGZsZXgtbWlkZGxlXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tZmxvYXQgZmxleC1taWRkbGVcIj5cbiAgICAgIDwlIGlmIChtb2RlID09PSAnZ3JhcGhpYycpIHsgJT5cbiAgICAgICAgPHA+PCU9IGluc3RydWN0aW9ucyAlPjwvcD5cbiAgICAgIDwlIH0gZWxzZSBpZiAobW9kZSA9PT0gJ2xpc3QnKSB7ICU+XG4gICAgICAgIDwlIGlmIChzaG93QnRuKSB7ICU+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0blwiPjwlPSBzZW5kICU+PC9idXR0b24+XG4gICAgICAgIDwlIH0gJT5cbiAgICAgIDwlIH0gJT5cbiAgICA8L2Rpdj5cbiAgYCxcblxuICBzeW5jOiBgXG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgICA8cCBjbGFzcz1cInNvZnQtYmxpbmtcIj48JT0gd2FpdCAlPjwvcD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b21cIj48L2Rpdj5cbiAgYCxcblxuICBzdXJ2ZXk6IGBcbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3BcIj5cbiAgICAgIDwlIGlmIChjb3VudGVyIDw9IGxlbmd0aCkgeyAlPlxuICAgICAgICA8cCBjbGFzcz1cImNvdW50ZXJcIj48JT0gY291bnRlciAlPiAvIDwlPSBsZW5ndGggJT48L3A+XG4gICAgICA8JSB9ICU+XG4gICAgPC9kaXY+XG4gICAgPCUgaWYgKGNvdW50ZXIgPiBsZW5ndGgpIHsgJT5cbiAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LWNlbnRlclwiPlxuICAgICAgICA8cCBjbGFzcz1cImJpZ1wiPjwlPSB0aGFua3MgJT5cbiAgICAgIDwvZGl2PlxuICAgIDwlIH0gZWxzZSB7ICU+XG4gICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXJcIj48L2Rpdj5cbiAgICA8JSB9ICU+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+XG4gICAgICA8JSBpZiAoY291bnRlciA8IGxlbmd0aCkgeyAlPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuXCI+PCU9IG5leHQgJT48L2J1dHRvbj5cbiAgICAgIDwlIH0gZWxzZSBpZiAoY291bnRlciA9PT0gbGVuZ3RoKSB7ICU+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJidG5cIj48JT0gdmFsaWRhdGUgJT48L2J1dHRvbj5cbiAgICAgIDwlIH0gJT5cbiAgICA8L2Rpdj5cbiAgYCxcblxuICB3ZWxjb21lOiBgXG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+XG4gICAgICA8JSBpZiAoIWVycm9yKSB7ICU+XG4gICAgICAgIDxwIGNsYXNzPVwiYmlnXCI+PCU9IHdlbGNvbWUgJT4gPGI+PCU9IGdsb2JhbHMuYXBwTmFtZSAlPjwvYj48L3A+XG4gICAgICA8JSB9ICU+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgICA8JSBpZiAoZXJyb3IpIHsgJT5cbiAgICAgICAgPHAgY2xhc3M9XCJiaWdcIj48JT0gZXJyb3IgJT48L3A+XG4gICAgICA8JSB9IGVsc2UgeyAlPlxuICAgICAgICA8cCBjbGFzcz1cInNtYWxsXCI+PCU9IHRvdWNoU2NyZWVuICU+PC9wPlxuICAgICAgPCUgfSAlPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbSBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuICBgLFxufTtcbiJdfQ==