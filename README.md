# Sequence Polynomial Finder

Calculate the lowest-degree polynomial function that passes through a given sequence of numbers or points. Try it out [here](https://sbplat.github.io/sequence/)!

## How does it work?

The algorithm we use here is known as the [Lagrange interpolating polynomial](https://en.wikipedia.org/wiki/Lagrange_polynomial). Given a sequence of $n$ points $(x_1, y_1), (x_2, y_2), \ldots, (x_n, y_n)$, the Lagrange interpolating polynomial is the polynomial, $P(x)$, with $deg(P)\leq n-1$ that passes through all the points. $P(x)$ is given by the following formula:
$$P(x)=\sum_{i=1}^{n}y_i\prod_{j=1, j\neq i}^{n}\frac{x-x_j}{x_i-x_j}$$
You can check out the implementation [here](https://github.com/sbplat/sequence/blob/main/js/index.js).

## How do I run this from source?

1. First, clone the repository and change into the directory:
```sh
git clone https://github.com/sbplat/sequence.git
cd sequence
```
2. Open `index.html` with your browser.
