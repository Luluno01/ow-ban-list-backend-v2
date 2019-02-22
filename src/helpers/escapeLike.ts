export function escapeLike(str: string) {
  return str.replace(/([\\_\%\[\]\^])/g, '\\$1').replace(/'/g, "''")
}

export default escapeLike