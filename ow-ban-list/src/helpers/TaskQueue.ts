import * as assert from 'assert'
import range from './range'


export type Task<T> = () => Promise<T>

export class TaskQueue<T> {

  private _queueing: Task<T>[]
  get queueing(): number {
    return this._queueing.length - this._pendingNum - this._finished
  }
  get queue(): Task<T>[] {
    return this._queueing.slice(this.ptr)
  }

  private ptr: number = 0

  private _pending: { task: Promise<T>, id: number }[]
  private _pendingNum: number = 0
  get pending(): number {
    return this._pendingNum
  }

  private results: T[]
  errs: { [index: number]: (Error | string) } = {}
  private _finished: number = 0
  get finished(): number {
    return this._finished
  }

  readonly maxConcurrency: number

  private resolve: (value?: {} | PromiseLike<{}>) => void

  constructor(tasks: Task<T>[], maxConcurrency: number = 5) {
    this._queueing = tasks
    assert(maxConcurrency > 0)
    maxConcurrency = Math.min(tasks.length, maxConcurrency)
    this.maxConcurrency = maxConcurrency
    this._pending = new Array(maxConcurrency)
    this.results = new Array(tasks.length)
  }

  start(): Promise<T[]> {
    for(let _ of range(this.ptr, Math.min(this._queueing.length, this.maxConcurrency))) {
      process.nextTick(() => TaskQueue.nextTask(this))
    }
    return new Promise(resolve => this.resolve = resolve)
  }

  private static nextTask<T>(queue: TaskQueue<T>) {
    const taskIndex = queue.ptr
    const task = queue._queueing[queue.ptr]
    if(task) {
      queue.ptr++
      let pendingIndex = 0
      for(let pendingTask of queue._pending) {
        if(!pendingTask) {  // An empty position found
          const p = task()  // Start a new task
          queue._pending[pendingIndex] = { task: p, id: taskIndex } // Put it into pending list
          queue._pendingNum++
          p.then(result => {
            queue.results[taskIndex] = result
            queue._pending[pendingIndex] = null  // Remove from pending list
            queue._pendingNum--
            queue._finished++
            TaskQueue.nextTask(queue)
          }).catch(err => {
            queue.errs[taskIndex] = err
            queue._pending[pendingIndex] = null  // Remove from pending list
            queue._pendingNum--
            queue._finished++
            TaskQueue.nextTask(queue)
          })
          break
        }
        pendingIndex++
      }
    }
    if(queue._finished == queue._queueing.length) {  // All tasks finished
      queue.resolve(queue.results)
    }
  }
}

export default TaskQueue