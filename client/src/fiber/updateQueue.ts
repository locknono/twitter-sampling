/* export const updateQueue: Function[] = [];

setTimeout(() => {
  for (let i = 0; i < updateQueue.length; i++) {
    console.log("i: ", i);
    setTimeout(function() {
      updateQueue[i]();
    }, 1000 * i);
  }
}, 5000);

class UpdateQueue extends Array {} */

import { Fiber } from "./fiber";

export const updateQueue = Object.create(null);

updateQueue.prototype = Array.prototype;

updateQueue.push = function(...args: Fiber[]) {
  Array.prototype.push.call(this, ...args);
  if (updateQueue.length === 1) {
    for (let i = 0; i < updateQueue.length; i++) {
      (updateQueue[i].renderMethod() as any);
    }
  }
  /*  for (let i = 0; i < args.length; i++) {
    args[i].renderMethod() as any;
  } */
  /* for (let i = 0; i < updateQueue.length; i++) {
    requestAnimationFrame(updateQueue[i].renderMethod as any);
  } */
};
