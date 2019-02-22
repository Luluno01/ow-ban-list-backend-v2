export function retry<T>(func: (...args) => Promise<T>, num: number = 5): typeof func {
  return async function(...args) {
    for(let i = 0; i < num; i++) {
      try {
        return await func(...args)
      } catch(err) {
        if(i == num - 1) throw err
      }
    }
  }
}

export default retry