interface E { err: (Error | string) }

/**
 * @description Format the error instance into a string.
 * @param err Error instance or string to be formatted.
 */
export function formatError(err: Error | string): string {
  return err instanceof Error ? (err.stack || err.toString()) : err
}

/**
 * @description Format the error instance in `err` object into a string.
 * @param err Error record to be formatted.
 */
export function formatErrorRecord<T extends E>(err: T): T {
  if(err.err instanceof Error) {
    err.err = formatError(err.err)
  }
  return err
}

/**
 * @description Format error instances in `errs` array into strings.
 * @param errs Error records to be formatted.
 */
export function formatErrorRecords<T extends E>(errs: T[]): T[] {
  return errs.map(formatErrorRecord)
}

export default formatErrorRecords