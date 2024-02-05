"use strict";
var MotionTask = /** @class */ (function () {
    function MotionTask() {
        console.log('Task class created');
    }
    MotionTask.prototype.render = function () {
        document.querySelector('#MotionFunc').innerHTML +=
            '<button class="motionBtn">TASK</button>';
    };
    return MotionTask;
}());
