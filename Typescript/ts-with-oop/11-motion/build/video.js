"use strict";
var MotionVideo = /** @class */ (function () {
    function MotionVideo() {
        console.log('Video class created');
    }
    MotionVideo.prototype.render = function () {
        document.querySelector('#MotionFunc').innerHTML +=
            '<button class="motionBtn">VIDEO</button>';
    };
    return MotionVideo;
}());
