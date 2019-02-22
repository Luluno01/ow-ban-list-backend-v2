/**
 * @description Generate a random integer from `a` to `b` (`[a, b]`).
 * @param a Lower bound.
 * @param b Upper bound.
 */
export function rand(a: number, b?: number) {
  if(b == undefined) [ a, b ] = [ 0, a ]
  return Math.floor(Math.random() * (b - a + 1) + a)
}

export default rand