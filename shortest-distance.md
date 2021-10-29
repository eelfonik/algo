As [BFS](./search.md#breadth-first-search) can be used to find the *fewest steps* needed to go from point A to point B in a [graph]('./data-structures.md#graph')

What if we have a **weighted graph** ? 

That is, every edge has a *weight*, and you need to take the weight into account, and instead of *fewest steps*, you need to find the *shortest* or *most fast* ways to go from A to B.

## Dijkstra algorithm

So for a weighted graph, we need to find another way.

Naively, we could do it in 4 steps:

1. find the cheapest node from start point ( this is the key point, by "cheapest", we really mean it ! There's no other cheaper way to go there )
2. check whether there's a cheaper path to the **neighbors** of that *cheapest node*, if so, update the cost
3. repeat the process for every node ( except the finish node ) in the graph
4. calculate the final path

Note this algo only works with *directed acyclic graphs*, 即中文中所谓的“有向无环图”，简称为DAG.

> 即然undirected必定有环（cyclic), 为什么不直接说acyclic graph (无环图)? 

And Dijkstra algo also doesn't work with the *negative weight* .
Why ? Because at 1st step, you already choose the **cheapest** node, and in the algo, you'll mark this node as *processed*, and will not go back to it again, even after you find another cheaper way to there ( by applying the negative weight ).



