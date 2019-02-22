export function *range(a: number, b?: number) {
  if(b == undefined) [ a, b ] = [ 0, a ]
  for(let i = a; i < b; i++) yield i
}

export default range