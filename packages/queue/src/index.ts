export type Task = () => Promise<void>;

interface QueueOptions {
  concurrency?: number;
  retryAttempts?: number;
  taskTimeoutMs?: number;
}

export class TaskQueue {
  private concurrency: number;
  private retryAttempts: number;
  private taskTimeoutMs: number;
  private queue: Task[] = [];
  private activeCount = 0;

  constructor(options: QueueOptions = {}) {
    this.concurrency = options.concurrency ?? 1;
    this.retryAttempts = options.retryAttempts ?? 0;
    this.taskTimeoutMs = options.taskTimeoutMs ?? 10_000;
  }

  public add(task: Task) {
    this.queue.push(task);
    this.runNext();
  }

  private async runNext() {
    if (this.activeCount >= this.concurrency || this.queue.length === 0) return;

    const task = this.queue.shift()!;
    this.activeCount++;

    let attempts = 0;

    const executeWithRetry = async () => {
      try {
        await this.withTimeout(task, this.taskTimeoutMs);
      } catch (err) {
        if (attempts < this.retryAttempts) {
          attempts++;
          return executeWithRetry();
        }
        console.error("[Queue Error] Task failed after retries:", err);
      } finally {
        this.activeCount--;
        this.runNext();
      }
    };

    executeWithRetry();
  }

  private withTimeout(task: Task, timeoutMs: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Task timed out"));
      }, timeoutMs);

      task().then(() => {
        clearTimeout(timeout);
        resolve();
      }).catch((err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }
}

export const queue = new TaskQueue({
  concurrency: 2,
  retryAttempts: 1,
  taskTimeoutMs: 8000,
});
