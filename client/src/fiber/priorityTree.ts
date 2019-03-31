/**
 * 既要考虑优先级，也要考虑依赖关系
 */

import createFiber, { Priority, Fiber } from "./fiber";

class TreeNode {
  public fiber: Fiber;
  public parent: TreeNode | null;
  public children: TreeNode[];
  public constructor(fiber: Fiber) {
    this.fiber = fiber;
    this.parent = null;
    this.children = [];
  }
}

class Tree {
  public root: TreeNode;
  public constructor(fiber: Fiber) {
    const node = new TreeNode(fiber);
    this.root = node;
  }

  public traverseDF(callback: Function) {
    (function recurse(currentNode) {
      for (let i = 0; i < currentNode.children.length; i++) {
        recurse(currentNode.children[i]);
      }
      callback(currentNode);
    })(this.root);
  }

  public traverseBF = function(this: Tree, callback: Function) {
    const queue = [];
    queue.push(this.root);
    let currentNode = queue.splice(0, 1)[0];
    while (currentNode) {
      for (let i = 0; i < currentNode.children.length; i++) {
        queue.push(currentNode.children[i]);
      }
      callback(currentNode);
      currentNode = queue.splice(0, 1)[0];
    }
  };

  public contains = function(this: Tree, callback: Function) {
    this.traverseBF(callback);
  };

  //
  public add = function(this: Tree, fiber: Fiber, toStreamID: string) {
    const child = new TreeNode(fiber);
    let parent: TreeNode | null = null;
    const callback = function(node: TreeNode) {
      if (node.fiber.streamID === toStreamID) {
        parent = node;
      }
    };
    this.contains(callback);
    parent = parent as TreeNode | null;
    if (parent) {
      parent.children.push(child);
      child.parent = parent;
      return true;
    }
    return false;
  };

  /** remove a `fiber` from tree,return the `fiber` */
  public remove = function(this: Tree, fiber: Fiber) {
    let parent = null;
    let childToRemove = null;
    let index;
    const fromStreamID = fiber.streamID;
    //find the parent by freamID
    const callback = function(node: TreeNode) {
      if (node.fiber.streamID === fromStreamID) {
        parent = node;
      }
    };
    parent = parent as TreeNode | null;
    this.contains(callback);
    if (parent) {
      index = this.findIndex(parent.children, fiber);
      if (index === undefined) {
        throw new Error("Node to remove does not exist.");
      } else {
        childToRemove = parent.children.splice(index, 1)[0];
      }
    } else {
      throw new Error("Parent does not exist.");
    }
    return childToRemove.fiber;
  };

  //find index of a fiber from a TreeNode list
  public findIndex(children: TreeNode[], fiber: Fiber) {
    for (let i = 0; i < children.length; i++) {
      if (children[i].fiber === fiber) {
        return i;
      }
    }
    return -1;
  }
}

const testFiber: Fiber = createFiber(() => {
  console.log("fiber execute"), 1, "q", "w";
});

const priorityTree = new Tree(testFiber);

export default priorityTree;
