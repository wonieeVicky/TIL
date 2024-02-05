"use strict";
var MotionNote = /** @class */ (function () {
    function MotionNote() {
        console.log('Note class created');
    }
    MotionNote.prototype.render = function () {
        document.querySelector('#MotionFunc').innerHTML +=
            '<button class="motionBtn">NOTE</button>';
    };
    return MotionNote;
}());
