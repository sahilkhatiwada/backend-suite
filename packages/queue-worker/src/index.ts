/**
 * Job object for the queue.
 */
type Job = {
  id: string;
  data: any;
  attempts: number;
};

const queues: Record<string, Job[]> = {};

/**
 * Add a job to the queue.
 * @param queue - The queue name
 * @param job - The job data
 */
export function addJob(queue: string, job: any): void {
  if (!queues[queue]) queues[queue] = [];
  queues[queue].push({ id: `${Date.now()}-${Math.random()}`, data: job, attempts: 0 });
}

/**
 * Process jobs from a queue with a handler and concurrency.
 * @param queue - The queue name
 * @param handler - The async handler function for each job
 * @param concurrency - Number of concurrent workers (default 1)
 * @param maxRetries - Maximum number of retries per job (default 3)
 */
export function processQueue(
  queue: string,
  handler: (job: any) => Promise<void>,
  concurrency = 1,
  maxRetries = 3,
): void {
  if (!queues[queue]) queues[queue] = [];
  let active = 0;
  async function next() {
    if (active >= concurrency) return;
    const job = queues[queue].shift();
    if (!job) return;
    active++;
    try {
      await handler(job.data);
    } catch (e) {
      job.attempts = (job.attempts || 0) + 1;
      if (job.attempts < maxRetries) {
        queues[queue].push(job); // retry
      } else {
        // Optionally log or store failed job
      }
    } finally {
      active--;
      setImmediate(next);
    }
  }
  for (let i = 0; i < concurrency; i++) setImmediate(next);
} 