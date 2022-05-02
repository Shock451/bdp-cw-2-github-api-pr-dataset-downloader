import "dotenv/config";
import api from "gh-api-stream";
import { Queue } from "./util.js";

const prQueue = new Queue();

function ExtractPRs(repositoryQueue) {
  return new Promise((rs) => {
    let repository = repositoryQueue
      .dequeue()
      .replace("https://api.github.com", "");

    api(repository, {
      token: process.env.TOKEN,
      rows: true,
      query: {
        state: "all",
      },
    })
      .on("data", function (pr) {
        prQueue.enqueue({
          created_at: pr.created_at,
          merged_at: pr.merged_at,
          requested_reviewers: pr.requested_reviewers,
          repository,
        });
        console.log("Collected PR count:", prQueue.size());
      })
      .on("end", function () {
        console.log("Finished streaming PRs from", repository);
        if (repositoryQueue.isempty()) {
          console.log("Finished streaming PRs from all target repositories");
          return rs(prQueue);
        }
        return rs(ExtractPRs(repositoryQueue));
      }).on('error', function() {
        // move on.
        console.log("Error")
        if (repositoryQueue.isempty()) {
          console.log("Finished streaming PRs from all target repositories");
          return rs(prQueue);
        }
        return rs(ExtractPRs(repositoryQueue));
      });
  });
}

export { ExtractPRs };
