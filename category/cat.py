from typing import TypeVar, Callable
T = TypeVar('T')
A = TypeVar('A')
B = TypeVar('B')
C = TypeVar('C')

# implement identity of A
def identity(x: T) -> T:
    return x

# implement composition of 2 functions
def compose(f: Callable[[B], C], g: Callable[[A], B]) -> Callable[[A], C]:
    return lambda x: f(g(x))

# test composition function respects identity

# For any function f:
# compose(f, identity) ≡ f    # Right identity: f ∘ id = f
# compose(identity, f) ≡ f    # Left identity:  id ∘ f = f



# identity and composition are keys of a category
# 3. Composition Laws
# Associativity: (h ∘ g) ∘ f = h ∘ (g ∘ f)
# Identity: f ∘ id_A = f and id_B ∘ f = f

# A directed graph is a category when every node has a self-loop (identity) and paths can be composed associatively.
