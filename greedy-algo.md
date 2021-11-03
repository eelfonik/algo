## NP-complete problems

Sometimes we have problems like, if you have `n` cities, and you need to find the shortest routes you can take to visit **ALL OF THEM**.

In theory you need to calculate **every** possible routes, then pick the shortest one.
But for those problems, the complexity would be *factorial*, that is `n!`, for `n=10`,you already have 3628800 possible routes. Which is too heavy for computation. 

For those kind of problem, we'll use **Greedy algorithm**.

It means at each step you just search for the *local optimal result*, and finally you'll get an **approximation** solution, which will not be the *correct* answer, but should be good enough to be accepted as the answer.



>  So why the largest possible radio stations problem is a NP hard ? It seems it can be break down to smaller problem no ?

