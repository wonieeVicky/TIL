"use strict";
window.addEventListener('load', function () {
    var image = new MotionImage();
    image.render();
    var video = new MotionVideo();
    video.render();
    var note = new MotionNote();
    note.render();
    var task = new MotionTask();
    task.render();
});
