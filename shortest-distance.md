As [BFS](./search.md#breadth-first-search) can be used to find the *fewest steps* needed to go from point A to point B in a [graph]('./data-structures.md#graph')

What if we have a **weighted graph** ? 

That is, every edge has a *weight*, and you need to take the weight into account, and instead of *fewest steps*, you need to find the *shortest* or *most fast* ways to go from A to B.

## Dijkstra algorithm

So for a weighted graph, we need to find another way.

### Idea

Naively, we could do it in 4 steps:

1. find the cheapest node from start point ( this is the key point, by "cheapest", we really mean it ! There's no other cheaper way to go there )
2. check whether there's a cheaper path to the **neighbors** of that *cheapest node*, if so, update the cost
3. repeat the process for every node ( except the finish node ) in the graph
4. calculate the final path

Note this algo only works with *directed acyclic graphs*, 即中文中所谓的“有向无环图”，简称为DAG.

> 即然undirected必定有环（cyclic), 为什么不直接说acyclic graph (无环图)? 



### Implementation

```typescript
// build the initial graph
type Graph = Map<string, {id: string, w: number}[]>;

const graph: Graph = new Map();
graph.set('a', [{id: 'b', w:15 }, {id:'c', w: 20}]);
graph.set('b', [{id: 'c', w: 4}, {id: 'e', w: 5}]);
graph.set('c', [{id: 'd', w: 8}, {id: 'e', w: 10}]);
graph.set('d', [{id: 'f', w: 12}]);
graph.set('e', [{id: 'f', w: 17}]);
graph.set('f', []);

// Output should be a->b->e->f (37)

/*--------------------Helper functions--------------------*/
type ResultMap = Map<string, {cost: number, parent: string}>;

// build the init cost hash table
function buildInitCostAndParent(graph: Graph, start: string): ResultMap {
  const nodesCostAndParent = new Map<string, {cost: number, parent: string}>();
  // set the start node cost to 0
  nodesCostAndParent.set(start, {cost: 0, parent: ''});
  // set start node's direct nodes values
  graph.get(start)!.forEach(n => {
    nodesCostAndParent.set(n.id, {cost: n.w, parent: start});
  });
  // for all other nodes, set to Infinity
  graph.forEach((_edges, node) => {
    if (node !== start && !nodesCostAndParent.has(node)) {
      // those are the nodes that we have not visited yet
      nodesCostAndParent.set(node, {cost: Infinity, parent: ''});
    }
  });
  return nodesCostAndParent;
}

// get the desired result from the above result table
function getResult(resultMap: ResultMap, end: string) {
  let path:string[] = []
  const calcPath = (node: string) => {
    if (node !== '') {
      path.unshift(node);
      const parentNode = resultMap.get(node)!.parent;
      calcPath(parentNode);
    }
  }
  calcPath(end);
  return resultMap.get(end)!.cost === Infinity ? null : {
    cost: resultMap.get(end)!.cost,
    path
  }
}

function findShortestNode(resultMap: ResultMap, processed: string[]) {
  let shortestDistance = Infinity;
  let shortestNode: string = '';
  // go through the whole result map to get the shortest node !
  resultMap.forEach((value, node) => {
    if (value.cost < shortestDistance && !processed.includes(node)) {
      shortestDistance = value.cost;
      shortestNode = node;
    }
  });
  return shortestNode;
}

/*--------------------The main algo--------------------*/
function dijkstraAlgo(graph: Graph, start: string, end: string) {
  const nodesCostAndParent = buildInitCostAndParent(graph, start);
  
  // use array to keep already processed nodes
  const processed: string[] = [start];

  function process(currentNode: string) {
    // this check will guarantee either we reached all reachable nodes (because inside the result map we went through them all, or there're some nodes that are inreachable from the start node)
    if (currentNode === '') {
      return;
    }
    // get all its neighbours in an array
    const neighbours = graph.get(currentNode)!;
    // get currentNode cost (for start node it will be 0);
    const cost = nodesCostAndParent.get(currentNode)!.cost;
    neighbours.forEach(({id, w}) => {
      const newCost = cost + w;
      if (newCost < nodesCostAndParent.get(id)!.cost) {
        nodesCostAndParent.set(id, {cost: newCost, parent: currentNode})
      }
    });
    processed.push(currentNode);
    const nextNode = findShortestNode(nodesCostAndParent, processed)
    process(nextNode);
  }
  
  // launch the process from the nearest node of start node
  const startingNode = findShortestNode(nodesCostAndParent, processed);
  process(startingNode);

	// get the result
  const result = getResult(nodesCostAndParent, end);
  console.log({result});
}

dijkstraAlgo(graph, 'a', 'f') // {cost: 37, path: [ 'a', 'b', 'e', 'f' ]}

```



### breakdown

- 先根据已有的graph(可以是一个linked list, 比如这里我们使用了`Map` , 有时候我们也会使用一个*Matrix*, AKA **2 dimentional array**), 建立一个关于cost和parent的hash table, 此处输入为start node, 

  - 先用start node, 把它的cost设为0, parent设为`null`或者空`''`. 
  - 然后在graph里找到这个start node的neighbors, 根据他们的数值设置cost, parent为start node.
  - 再循环整个graph，把所有剩下的node的cost设为`Infinity`, parent为`''`.

  > 这一步有些人会直接根据题目手写出来，但这样不够generic

- 第二步是设立一个array，用来记录所有已经被check过，并且探索过所有跟它**直接** 相连的neighbors的node. 初始值加入start node, 因为在第一步建立result hash table的时候，我们已经处理过了start node的所有neighbors. 这个array非常重要，因为它会被用于在搜寻“下一个最短node"时， 过滤掉已经被check过的node. 否则整个循环就停不下来（一直卡在某个已经是最短的node上）。

- 用一个方程`findShortestNode`在result hash table里，找到cost最小的那个node (注意此处使用了第二步里的那个array, 用来过滤掉已经check过的node)

- 然后从离start node最近的一个node `A` 开始，在hash table里找到`A` 的cost, 然后在graph里找到`A` 的neighbors, 对于每一个neighbor, 找到它相对于`A` 的cost, 把它跟`A`的cost相加， 这样我们就得到了这个neighbor如果经过`A` 的话，相对于start node的距离，我们把它跟目前已经存储在hash table里的cost对比（如果这个neighbor node之前直接跟start node相连，或者已经经过过别的node有了最短距离，则我们已经有了一个具体数字，否则就是`Infinity`), 如果它更小，就更新cost和parent, 否则保持原样。这样我们处理了所有跟node `A` 相邻的nodes的最短距离。因此把`A`标记为"processed"（即在此张图上经过`A`的所有点的最短距离已经被标记过了）。

- 此时在hash table里，所有的经过`A`的最短路径都已经被标记过了（且都是**相对于start node的距离**），我们用第三步的方程再找到下一个离start node最近的node(会略过`A`因为已经被处理过了)。这个下一个node有可能是某个经过`A`的node,也有可能不是。但无论如何，在处理这下一个node的时候，我们都已经考虑过了经过`A`的路径。

- 这样循环之后，我们可以保证遍历了所有在result map里列出的nodes,也即所有在graph里的nodes（如果此时还有cost为`Infinity`的node,则证明从start node开始我们找不到任何一条路径通向它。

- 此时用辅助方程我们可以查看end node的cost(这个cost是从start node出发的)，同时可以找到这个最小cost的parent, 然后可以在result里顺着parent往上寻找，就可以找到这条具体的路径。如果cost还是Inifinty,则证明没有路



### Negative weight

Dijkstra algo also doesn't work with the *negative weight* .

Why ? Because at 1st step, you already choose the **cheapest** node, and in the algo, you'll mark this node as *processed*, and will not go back to it again, even after you find another cheaper way to there ( by applying the negative weight ).

To make it work, we have **Bellman-Ford algorithm**





