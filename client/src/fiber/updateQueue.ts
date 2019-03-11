import { Fiber } from "./fiber";

export const updateQueue = Object.create(Array.prototype);

updateQueue.flush = function() {
  updateQueue.sortByPriority();
  function drawFrame() {
    setTimeout(() => {
      if (updateQueue.length > 0) {
        updateQueue[0].renderMethod();
        updateQueue.splice(0, 1);
        drawFrame();
      }
    });
  }
  drawFrame();
};

updateQueue.push = function(...args: Fiber[]) {
  Array.prototype.push.call(this, ...args);
};

updateQueue.sortByPriority = function() {
  updateQueue.sort((a: Fiber, b: Fiber) => {
    return b.priority - a.priority;
  });
};
