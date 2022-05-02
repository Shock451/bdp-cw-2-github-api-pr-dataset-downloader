import "dotenv/config";
import { Queue } from "./util.js";

function cleanPRs(prQueue) {
  const cleanPRQueue = new Queue();
  let pr;
  while ((pr = prQueue.dequeue())) {
    let end_date = pr.merged_at ? new Date(pr.merged_at) : new Date();
    const created_at = new Date(pr.created_at);
    const difference = end_date.getTime() - created_at.getTime();
    const delay_in_days = Math.ceil(difference / (1000 * 3600 * 24));

    cleanPRQueue.enqueue({
      delay_days: delay_in_days,
      created_at: created_at,
      number_of_reviewers: pr.requested_reviewers.length,
      repository: pr.repository
    });
  }
  console.log("Finished cleaning list of PRs");
  return cleanPRQueue;
}

export { cleanPRs };
