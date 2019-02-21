export function formatError(err: Error | string): string {
  if(err instanceof Error) return err.stack || err.toString()
  else return err
}

export default formatError