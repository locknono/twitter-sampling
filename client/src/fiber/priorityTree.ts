/**
 * 既要考虑优先级，也要考虑依赖关系
 * 优先级是对于流来说的
 * 流的优先级决定了这个流所有的帧能被分配资源的多少
 */

import createFiber, { Priority, Fiber } from "./fiber";

export type treverseCallBack = (node?: TreeNode) => void;
const ROOT = "root";
export class TreeNode {
  public streamID: string;
  public value: number;
  public weight: null | number;
  public parent: TreeNode | null;
  public children: TreeNode[];
  public constructor(streamID: string, value: number) {
    this.streamID = streamID;
    this.value = value;
    this.weight = null;
    this.parent = null;
    this.children = [];
  }
}

export class Tree {
  public root: TreeNode;
  public constructor(streamID: string, value: number) {
    const node = new TreeNode(streamID, value);
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

  public getDepthOfNode(node: TreeNode) {
    let current = node;
    let depth = 0;
    while (current.parent !== null) {
      current = current.parent;
      depth += 1;
    }
    return depth;
  }

  public traverseBF = function(this: Tree, callback: treverseCallBack) {
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

  public contains = function(this: Tree, callback: treverseCallBack) {
    this.traverseBF(callback);
  };
  /**
   * if the tree has the stream of fiber,add the fiber as the
   * child of the stream;
   * else add to fiber to 'root' stream as a new stream;
   */
  public add = function(
    this: Tree,
    streamID: string,
    value: number,
    toStreamID?: string
  ) {
    let parentID = toStreamID ? toStreamID : ROOT;
    const child = new TreeNode(streamID, value);
    let parent: TreeNode | null = null;
    const callback: treverseCallBack = function(node: TreeNode) {
      if (node.streamID === parentID) {
        parent = node;
      }
    };
    this.contains(callback);
    parent = parent as TreeNode | null;
    if (parent) {
      parent.children.push(child);
      child.parent = parent;
    } else {
      this.root.children.push(child);
    }
  };

  public setWeight() {
    const weightNodesDict = {};
    this.traverseDF((node: TreeNode) => {
      if (node.weight) return;
      const depth = this.getDepthOfNode(node);
      weightNodesDict[depth]
        ? (weightNodesDict[depth] += node.value)
        : (weightNodesDict[depth] = node.value);
    });
    this.traverseDF((node: TreeNode) => {
      if (node.weight) return;
      const depth = this.getDepthOfNode(node);
      node.weight = node.value / weightNodesDict[depth];
    });
  }
  /** remove a `fiber` from tree,return the `fiber` */
  public remove = function(this: Tree, streamID: string) {
    let parent = null;
    let childToRemove = null;
    let index;
    const fromStreamID = streamID;
    //find the parent by freamID
    const callback = function(node: TreeNode) {
      if (node.streamID === fromStreamID) {
        parent = node;
      }
    };
    parent = parent as TreeNode | null;
    this.contains(callback);
    if (parent) {
      index = this.findIndex(parent.children, streamID);
      if (index === undefined) {
        throw new Error("Node to remove does not exist.");
      } else {
        childToRemove = parent.children.splice(index, 1)[0];
      }
    } else {
      throw new Error("Parent does not exist.");
    }
    return childToRemove.streamID;
  };

  //find index of a fiber from a TreeNode list
  public findIndex(children: TreeNode[], streamID: string) {
    for (let i = 0; i < children.length; i++) {
      if (children[i].streamID === streamID) {
        return i;
      }
    }
    return -1;
  }
}

const testFiber: Fiber = createFiber(() => {
  console.log("fiber execute"), 1, "q", "w";
});

const priorityTree = new Tree(ROOT, -1);

priorityTree.add("a", 1);
priorityTree.add("c", 1);
priorityTree.add("d", 1, "c");
priorityTree.add("e", 1, "c");

console.log("priorityTree: ", priorityTree);

export default priorityTree;
