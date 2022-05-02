import "dotenv/config";
import api from "gh-api-stream";
import { Queue } from "./util.js";

function extractRepos(n = 2) {
  const repositoryQueue = new Queue();
  return new Promise((rs) => {
    api("/repositories", {
      rows: true,
      pages: n,
    })
      .on("data", function (repo) {
        const pulls_url = repo.pulls_url.replace("{/number}", "");
        repositoryQueue.enqueue(pulls_url);
        console.log("Collected repo count:", repositoryQueue.size());
      })
      .on("end", function () {
        console.log("Finished streaming Github API list of repositories");
        rs(repositoryQueue);
      });
  });
}

export { extractRepos };
