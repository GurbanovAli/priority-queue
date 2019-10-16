const Node = require('./node');

class MaxHeap {
	constructor() {
		this.root = null;
		this.parentNodes = [];
	}

	push(data, priority) {
		const node = new Node(data, priority);
		this.insertNode(node);
		this.shiftNodeUp(node);
	}

	pop() {
		if (!this.isEmpty()) {
			const detached = this.detachRoot();
			this.restoreRootFromLastInsertedNode(detached);
			this.shiftNodeDown(this.root);
			return detached.data;
		}
	}

	detachRoot() {
		const {root} = this;
		if (this.parentNodes.includes(root)) this.parentNodes.shift();
		this.root = null;
		return root;
	}

	restoreRootFromLastInsertedNode(detached) {
		if (!this.isEmpty()) {
			const lastNode = this.parentNodes.pop();
			if (!lastNode.parent) return this.root = lastNode;
			if (lastNode.parent.right === lastNode && lastNode.parent !== detached) this.parentNodes.unshift(lastNode.parent);
			lastNode.remove();
			if (detached !== lastNode.parent) {
				if (detached.left) lastNode.appendChild(detached.left);
				if (detached.right) lastNode.appendChild(detached.right);
			}
			if (!lastNode.right) this.parentNodes.unshift(lastNode);
			this.root = lastNode;
		}
	}

	size() {
		function count(node) {
			return node === null ? 0 : 1 + count(node.left) + count(node.right);
		}
		return count(this.root);
	}

	isEmpty() {
		return this.root === null && this.parentNodes.length === 0;
	}

	clear() {
		this.root = null;
		this.parentNodes = [];
	}

	insertNode(node) {
		if (this.isEmpty()) {
			this.root = node;
			this.parentNodes.push(node);
		} else {
			this.parentNodes.push(node);
			this.parentNodes[0].appendChild(node);
		}
		if (this.parentNodes[0].left && this.parentNodes[0].right) this.parentNodes.shift();
	}

	shiftNodeUp(node) {
		if (node.parent) {
			if (node.priority > node.parent.priority) {
				const parentIndex = this.parentNodes.indexOf(node.parent);
				const nodeIndex = this.parentNodes.indexOf(node);
				if (nodeIndex !== -1) {
					(parentIndex !== -1) ? 
						[this.parentNodes[nodeIndex], this.parentNodes[parentIndex]] = [this.parentNodes[parentIndex], this.parentNodes[nodeIndex]] 
						: this.parentNodes[nodeIndex] = node.parent;
				}
				node.swapWithParent();
				this.shiftNodeUp(node);
			}
		} else this.root = node;
	}

	shiftNodeDown(node) {
		const chooseChild = node => {
			if (node.left && node.right) {
				return node.left.priority > node.right.priority ?
					node.left : node.right;
			} else return node.left;
		}
		if (!this.isEmpty() && node.left) {
			const chosenChild = chooseChild(node);
			if (node.priority < chosenChild.priority) {
				const nodeIndex = this.parentNodes.indexOf(node);
				const childIndex = this.parentNodes.indexOf(chosenChild);
				if (node === this.root) this.root = chosenChild;
				if (childIndex !== -1) {
					(nodeIndex !== -1) ? 
						[this.parentNodes[childIndex], this.parentNodes[nodeIndex]] = [this.parentNodes[nodeIndex], this.parentNodes[childIndex]] 
						: this.parentNodes[childIndex] = node;
				}
				chosenChild.swapWithParent();
				this.shiftNodeDown(node);
			}
		}
	}
}

module.exports = MaxHeap;
