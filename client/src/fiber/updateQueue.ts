/**
 * 
 * 优先级是使用树结构还是链表？
   用户交互在上一层，背景渲染在下一层
 */

import { Fiber } from "./fiber";
import priorityTree from "./priorityTree";

interface UpdateQueue extends Array<Fiber> {
  sortByPriority: Function;
  clearSameStream: Function;
  flush: Function;
}
const updateQueue: UpdateQueue = Object.create(Array.prototype);

updateQueue.sortByPriority = function() {
  this.sort((a: Fiber, b: Fiber) => {
    return b.priority - a.priority;
  });
};

updateQueue.clearSameStream = function() {
  const streamSet = new Set();
  for (let i = updateQueue.length; i >= 0; i--) {
    if (streamSet.has(updateQueue[i].streamID)) {
      updateQueue.splice(i);
    }
    streamSet.add(updateQueue[i].streamID);
  }
};

updateQueue.flush = function(this: typeof updateQueue) {
  this.sortByPriority();
  if (this.length > 0) {
    requestAnimationFrame(this[0].renderMethod as FrameRequestCallback);
    updateQueue.splice(0, 1);
  }
  requestAnimationFrame(this.flush as FrameRequestCallback);
}.bind(updateQueue);

Object.defineProperty(updateQueue, "sortByPriority", {
  enumerable: false
});

Object.defineProperty(updateQueue, "flush", {
  enumerable: false
});

export { updateQueue };
