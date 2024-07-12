class Node {
    constructor(client, distance) {
      this.client = client; // WebSocket client or any client object
      this.distance = distance; // Haversine distance from the request point
      this.left = null; // Reference to the left child node
      this.right = null; // Reference to the right child node
    }
  }
  
  class DistanceBinarySearchTree {
    constructor() {
      this.root = null; // Initialize root node of the BST
    }
  
    // Method to insert a new client with its distance into the BST
    insert(client, distance) {
      const newNode = new Node(client, distance);
  
      if (!this.root) {
        this.root = newNode;
      } else {
        this.insertNode(this.root, newNode);
      }
    }
  
    // Helper method to recursively insert a node into the BST
    insertNode(node, newNode) {
      // If the new node's distance is less than the current node, move left
      if (newNode.distance < node.distance) {
        if (node.left === null) {
          node.left = newNode;
        } else {
          this.insertNode(node.left, newNode);
        }
      } else {
        // If the new node's distance is greater or equal, move right
        if (node.right === null) {
          node.right = newNode;
        } else {
          this.insertNode(node.right, newNode);
        }
      }
    }
  
    // Method to find nodes within a specific distance threshold
    findNodesWithinThreshold(threshold) {
      if (!this.root) {
        return []; // Return empty array if the tree is empty
      }
  
      const nodesWithinThreshold = [];
      this.searchNodesWithinThreshold(this.root, threshold, nodesWithinThreshold);
      return nodesWithinThreshold.map(node => node.client);
    }
  
    // Helper method to recursively find nodes within threshold
    searchNodesWithinThreshold(node, threshold, result) {
      if (node === null) {
        return;
      }
  
      // Check if current node's distance is within threshold
      if (node.distance <= threshold) {
        result.push(node); // Add current node to the result array
  
        // Recursively search both subtrees
        this.searchNodesWithinThreshold(node.left, threshold, result);
        this.searchNodesWithinThreshold(node.right, threshold, result);
      } else if (node.distance > threshold) {
        // If current node's distance exceeds threshold, search left subtree only
        this.searchNodesWithinThreshold(node.left, threshold, result);
      }
    }
  }
  
  // Example usage:
  const bst = new DistanceBinarySearchTree();
  
  // Insert clients with their respective distances
  bst.insert({ id: 1, name: "Client A" }, 5.0);
  bst.insert({ id: 2, name: "Client B" }, 7.5);
  bst.insert({ id: 3, name: "Client C" }, 2.5);
  bst.insert({ id: 4, name: "Client D" }, 3.5);
  bst.insert({ id: 5, name: "Client E" }, 2.5);
  
  // Find nodes within a threshold distance
  const threshold = 4.0;
  const nodesWithinThreshold = bst.findNodesWithinThreshold(threshold);
  console.log(`Nodes within ${threshold} km:`, nodesWithinThreshold);
  