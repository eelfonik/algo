type Graph = Map<string, {id: string, w: number}[]>;

const graph1: Graph = new Map();
graph1.set('a', [{id: 'b', w:15 }, {id:'c', w: 20}]);
graph1.set('b', [{id: 'c', w: 4}, {id: 'e', w: 5}]);
graph1.set('c', [{id: 'd', w: 8}, {id: 'e', w: 10}]);
graph1.set('d', [{id: 'f', w: 12}]);
graph1.set('e', [{id: 'f', w: 17}]);
graph1.set('f', []);

// Output should be a->b->e->f (37)

// All test cases
const graph2: Graph = new Map();
graph2.set('start', [{id: 'b', w:5 }, {id:'c', w: 2}]);
graph2.set('b', [{id: 'd', w: 4}, {id: 'e', w: 2}]);
graph2.set('c', [{id: 'b', w: 8}, {id: 'e', w: 7}]);
graph2.set('d', [{id: 'e', w: 6}, {id: 'finish', w: 3}]);
graph2.set('e', [{id: 'finish', w: 1}]);
graph2.set('finish', []);

// Output1 should be start->b->e->finish (8)

const graph3: Graph = new Map();
graph3.set('start', [{id: 'b', w:10 }]);
graph3.set('b', [{id: 'c', w: 20}]);
graph3.set('c', [{id: 'd', w: 1}, {id: 'finish', w:30}]);
graph3.set('d', [{id: 'b', w: 1}]);
graph3.set('finish', []);

// 此处有环，为什么还是可以

type ResultMap = Map<string, {cost: number, parent: string}>;

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
    if (!nodesCostAndParent.has(node)) {
      // those are the nodes that we have not visited yet
      nodesCostAndParent.set(node, {cost: Infinity, parent: ''});
    }
  });
  return nodesCostAndParent;
}

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
  resultMap.forEach((value, node) => {
    // here the processed array is important
    // as it will knows how to termininat the loop
    if (value.cost < shortestDistance && !processed.includes(node)) {
      shortestDistance = value.cost;
      shortestNode = node;
    }
  });
  return shortestNode;
}

function dijkstraAlgo(graph: Graph, start: string, end: string) {
  const nodesCostAndParent = buildInitCostAndParent(graph, start);
  // because we already processed the start node in the above init
  const processed: string[] = [start];

  function process(currentNode: string) {
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
    const nextNode = findShortestNode(nodesCostAndParent, processed);
    console.log({nodesCostAndParent, processed, nextNode});
    process(nextNode);
  }

  const startingNode = findShortestNode(nodesCostAndParent, processed);
  process(startingNode);

  const result = getResult(nodesCostAndParent, end);
  console.log({result});
}

dijkstraAlgo(graph3, 'start', 'finish')
