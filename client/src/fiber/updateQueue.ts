/**
 * 
 * 优先级是使用树结构还是链表？
   用户交互在上一层，背景渲染在下一层
 */

import { Fiber } from "./fiber";
import priorityTree, { TreeNode } from "./priorityTree";
import { timeout } from "d3";
interface UpdateQueue extends Array<Fiber> {
  sortByPriority: Function;
  clearSameStream: Function;
  flush: Function;
  push: any;
}
const updateQueue: UpdateQueue = Object.create(Array.prototype);

updateQueue.sortByPriority = function() {
  const topStreams: string[] = [];
  priorityTree.traverseDF((node: TreeNode) => {
    const depth = priorityTree.getDepthOfNode(node);
    if (depth !== 1) return;
    topStreams.push(node.streamID);
  });
  console.log("topStreams: ", topStreams);
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
  const draw = () => {
    this.sortByPriority();
    if (this.length > 0) {
      requestAnimationFrame(this[0].renderMethod as FrameRequestCallback);
      updateQueue.splice(0, 1);
    }
    requestAnimationFrame(draw as FrameRequestCallback);
  };
  draw();
}.bind(updateQueue);

let timeoutID: number;
updateQueue.push = function(this: typeof updateQueue, ...args: Fiber[]) {
  Array.prototype.push.apply(this, args);
  for (let i = 0; i < args.length; i++) {
    priorityTree.add(args[i].streamID, 1);
    priorityTree.setWeight();
    /* clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => {
      priorityTree.setWeight();
    }, 0); */
  }
};

Object.defineProperty(updateQueue, "sortByPriority", {
  enumerable: false
});

Object.defineProperty(updateQueue, "flush", {
  enumerable: false
});

export { updateQueue };
