class Node {
  constructor(data, priority) {
    this.data = data;
    this.priority = priority;
    this.parent = null;
    this.left = null;
    this.right = null;
  }

  appendChild(node) {
    if (!node) return this;

    if (!this.left) {
      node.parent = this;
      this.left = node;
    } else if (!this.right) {
      node.parent = this;
      this.right = node;
    }
  }

  removeChild(node) {
    if (!node) return this;

    if (this.left === node) {
      node.parent = null;
      this.left = null;
    } else if (this.right === node) {
      node.parent = null;
      this.right = null;
    } else {
      throw new Error("Not a child");
    }
  }

  remove() {
    if (this.parent) this.parent.removeChild(this);
  }

  swapWithParent() {
    if (this.parent) {
      let parent = this.parent;
      let leftChild = this.left;
      let rightChild = this.right;
      let grandParent = parent.parent;
      let isRight = parent.right === this;

      // remove parent from it's parent
      if (grandParent) grandParent.removeChild(parent);

      // remove children from 'this'
      this.removeChild(leftChild);
      this.removeChild(rightChild);

      // remove 'this' from parent and append parent to 'this'
      // according to the side at which 'this' was on
      parent.removeChild(this);

      this.appendChild(parent);
      if (isRight) {
        this.right = this.left;
        this.left = null;
      }

      // append 'this' to parent's parent
      if (grandParent) grandParent.appendChild(this);

      // if there's sibling - get one
      let sibling = parent.left || parent.right;

      // remove sibling from parent
      // and append it to 'this' as a child
      parent.removeChild(sibling);
      this.appendChild(sibling);

      // append children to this.parent
      parent.appendChild(leftChild);
      parent.appendChild(rightChild);
    }
  }
}

module.exports = Node;
