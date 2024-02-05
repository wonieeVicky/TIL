window.addEventListener('load', () => {
  const image = new MotionImage();
  image.render();

  const video = new MotionVideo();
  video.render();

  const note = new MotionNote();
  note.render();

  const task = new MotionTask();
  task.render();
});
