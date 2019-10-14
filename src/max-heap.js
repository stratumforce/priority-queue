const Node = require("./node");

class MaxHeap {
  constructor() {
    this.root = null;
    this.parentNodes = [];
  }

  push(data, priority) {
    const newNode = new Node(data, priority);
    this.insertNode(newNode);
    this.shiftNodeUp(newNode);
  }

  pop() {
    if (!this.isEmpty()) {
      let node = this.detachRoot();
      this.restoreRootFromLastInsertedNode(node);
      this.shiftNodeDown(this.root);

      return node.data;
    }
  }

  detachRoot() {
    let root = this.root;
    if (this.parentNodes[0] === root) this.parentNodes.shift();
    this.root = null;

    return root;
  }

  restoreRootFromLastInsertedNode(detached) {
    if (!this.isEmpty()) {
      const lastNode = this.parentNodes.pop();

      if (lastNode.parent) {
        let parent = lastNode.parent;

        if (parent !== detached && parent.right === lastNode)
          this.parentNodes.unshift(parent);

        lastNode.remove();
      }

      if (detached.left) lastNode.appendChild(detached.left);
      if (detached.right) lastNode.appendChild(detached.right);

      if (!lastNode.left || !lastNode.right) {
        this.parentNodes.unshift(lastNode);
      }

      this.root = lastNode;
    }
  }

  size() {
    const count = node => (node ? 1 + count(node.left) + count(node.right) : 0);

    return count(this.root);
  }

  isEmpty() {
    return !this.root && !this.parentNodes.length;
  }

  clear() {
    this.root = null;
    this.parentNodes = [];
  }

  insertNode(node) {
    if (!this.isEmpty()) {
      this.parentNodes[0].appendChild(node);

      if (this.parentNodes[0].left && this.parentNodes[0].right)
        this.parentNodes.shift();
    } else {
      this.root = node;
    }

    this.parentNodes.push(node);
  }

  shiftNodeUp(node) {
    if (node.parent && node.priority > node.parent.priority) {
      let parent = node.parent;
      node.swapWithParent();

      let nodeIndex = this.parentNodes.indexOf(node);
      let parentIndex = this.parentNodes.indexOf(parent);

      if (nodeIndex > -1) {
        if (parentIndex > -1) this.parentNodes[parentIndex] = node;

        this.parentNodes[nodeIndex] = parent;
      }

      this.shiftNodeUp(node);
    }

    if (!node.parent) this.root = node;
  }

  shiftNodeDown(node) {
    if (!this.isEmpty()) {
      let child;

      if (node.left && node.right) {
        child =
          node.left.priority > node.right.priority ? node.left : node.right;
      } else {
        child = node.left;
      }

      if (child && node.priority < child.priority) {
        let nodeIndex = this.parentNodes.indexOf(node);
        let childIndex = this.parentNodes.indexOf(child);

        if (childIndex > -1) {
          if (nodeIndex > -1) this.parentNodes[nodeIndex] = child;

          this.parentNodes[childIndex] = node;
        }

        if (this.root === node) {
          this.root = child;
        }

        child.swapWithParent();
        this.shiftNodeDown(node);
      }
    }
  }
}

module.exports = MaxHeap;
