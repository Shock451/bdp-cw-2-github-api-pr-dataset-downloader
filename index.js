import "dotenv/config";
import Pipeline from "pipeline-js";
import { cleanPRs } from "./clean-pull-requests.js";
import { ExtractPRs } from "./extract-pull-requests.js";
import { extractRepos } from "./extract-repositories.js";
import { savePRsToJson } from "./save-data-to-file.js";

const pipeline = new Pipeline()
  .pipe(extractRepos)
  .pipe(ExtractPRs)
  // .pipe(cleanPRs)
  .pipe(savePRsToJson);

// Github list repositories API - number of pages of results
pipeline.process(30);
