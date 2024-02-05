"use strict";
var MotionImage = /** @class */ (function () {
    function MotionImage() {
        console.log('Image class created');
    }
    MotionImage.prototype.render = function () {
        document.querySelector('#MotionFunc').innerHTML +=
            '<button class="motionBtn">IMAGE</button>';
    };
    return MotionImage;
}());
