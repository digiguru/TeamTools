define(["require", "exports"], function (require, exports) {
    "use strict";
    var Breadcrumb = (function () {
        function Breadcrumb(name, command, params) {
            this.name = name;
            this.command = command;
            this.params = params;
            this.enabled = false;
        }
        return Breadcrumb;
    }());
    exports.Breadcrumb = Breadcrumb;
});
//# sourceMappingURL=Breadcrumb.js.map