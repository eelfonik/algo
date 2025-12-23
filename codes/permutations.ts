function permutation(s: string) {
    const permutations: Record<number, string[]> = {};
    for (let i=0; i< s.length; i++) {
        if (i === 0) {
            permutations[i]=[s.charAt(i)];
            continue;
        }
        const lastLevelPermutations = permutations[i-1];
        const nextPermutations = [];
        for (const p of lastLevelPermutations) {
            for (let j=0; j<=p.length; j++) {
                nextPermutations.push(p.slice(0,j)+s.charAt(i)+p.slice(j))
            }
        }
        permutations[i]=nextPermutations;
    }
    const permutation = permutations[s.length - 1];
    console.log({permutation});
}

function permutationOptimized(s: string) {
    const chars = s.split('');
    const permutations: string[] = [];

    function dfs(start: number) {
        if (start === chars.length) {
            permutations.push(chars.join(''));
            return;
        }
        const seen = new Set<string>();
        for (let i = start; i < chars.length; i++) {
            if (seen.has(chars[i])) {
                continue;
            }
            seen.add(chars[i]);
            [chars[start], chars[i]] = [chars[i], chars[start]];
            dfs(start + 1);
            [chars[start], chars[i]] = [chars[i], chars[start]];
        }
    }

    dfs(0);
    console.log({ permutationOptimized: permutations });
    return permutations;
}