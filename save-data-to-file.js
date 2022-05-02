import fs from "fs";
import { createStringifyStream } from "big-json";

function savePRsToJson(prQueue, i = 0) {
  if (prQueue && prQueue.size() > 0) {
    const arr = [];
    for (; !prQueue.isempty(); arr.push(prQueue.dequeue()));

    var logger = fs.createWriteStream(`./output-part-${i}.json`, {
      flags: "a", // 'a' means appending (old data will be preserved)
    });

    createStringifyStream({
      body: arr,
    }).on("data", function (strChunk) {
      // => BIG_POJO will be sent out in JSON chunks as the object is traversed
      logger.write(strChunk);
      console.log(
        `Output saved to local data lake: ./output-part-${i}.json`
      );
    });
  }
}

export { savePRsToJson };
