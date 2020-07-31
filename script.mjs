import { fileURLToPath } from "url";
import { networkInterfaces } from "os";
import { argv } from "process";

import express from "express";
import morgan from "morgan";
import serveIndex from "serve-index";


// Call with an express app or router object.
export default function addMiddleware(app, path, verbose=true) {
  const options = {
    "icons": true,
    "view": "details",
  }
  
  if (verbose) {
    // log HTTP requests
    app.use(morgan("tiny"));
  }
  // show directory content
  app.get("*", serveIndex(path, options));
  // resolve to files themselfs
  app.get("*", express.static(path));
  return app;
}

export function serve(path, port=8080) {
  // callback notifying us
  let address;
  try {
    address = networkInterfaces()["eth0"][0].address
  } catch {
    address = "localhost"
  }

  function isRunning() {
    console.log(`Serving static files from ${path} on ${address}:${port}.`);
  }
  
  // add middleware functions
  const app = addMiddleware(express(), path);
  // listen on given port
  app.listen(port, isRunning);
}

function main() {
  // this is CWD
  let path = ".";
  // Or take the first passed argument
  const firstCLIArg = argv[2];
  if (firstCLIArg) { path = firstCLIArg }
  
  serve(path);
}

// Usually made by a daemon inside a Linux screen Session like this:
// $ screen -S file_server_8080 node ~/hermanns-web-server/mounts/file-server.mjs
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
