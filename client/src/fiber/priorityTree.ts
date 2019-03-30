/** 
 * 既要考虑优先级，也要考虑依赖关系
 */

import { Priority } from "./fiber";

class TreeNode {
  public frameID: string;
  public priority: Priority;
  public constructor(frameID: string, priority: Priority) {
    this.frameID = frameID;
    this.priority = priority;
  }
}

class Tree {
  public root: TreeNode;
  public constructor(frameID: string, priority: Priority) {
    const node = new TreeNode(frameID, priority);
    this.root = node;
  }
}

const priorityTree = new Tree("some frame id", Priority.backgroud);

export default priorityTree;


