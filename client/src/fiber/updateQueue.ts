import { Fiber } from "./fiber";

const updateQueue = Object.create(Array.prototype);

updateQueue.sortByPriority = function() {
  this.sort((a: Fiber, b: Fiber) => {
    return b.priority - a.priority;
  });
};

updateQueue.clearSameStream = function() {
  const streamSet = new Set();
  for (let i = updateQueue.length; i >= 0; i--) {
    if (streamSet.has(updateQueue[i].streamID)) {
      updateQueue.pop(i);
    }
    streamSet.add(updateQueue[i].streamID);
  }
};

updateQueue.flush = function(this: typeof updateQueue) {
  this.sortByPriority();
  if (updateQueue.length > 0) {
    requestAnimationFrame(updateQueue[0].renderMethod);
    updateQueue.splice(0, 1);
  }
  requestAnimationFrame(this.flush);
}.bind(updateQueue);

Object.defineProperty(updateQueue, "sortByPriority", {
  enumerable: false
});

Object.defineProperty(updateQueue, "flush", {
  enumerable: false
});

export { updateQueue };
