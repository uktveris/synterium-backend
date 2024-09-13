// import { EventEmitter } from "events";
import { format } from "date-fns";
import { randomUUID } from "crypto";
import fspromises from "fs/promises";
import path from "path";
import fs from "fs";

// class CustomEmitter extends EventEmitter {}

// const emitter = new CustomEmitter();

// emitter.on("log", (message) => {});

function logEvent(message: string, filename: string) {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const log = `${dateTime}\t${randomUUID()}\t${message}\n`;
  if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
    fspromises
      .mkdir(path.join(__dirname, "..", "logs"))
      .catch((err) => console.log((err as Error).message));
  }
  fspromises
    .appendFile(path.join(__dirname, "..", "logs", filename), log)
    .catch((err) => console.log((err as Error).message));
}

function logger(req: any, res: any, next: any) {
  const msg = `${req.method}\t${req.url}`;
  logEvent(msg, "reqlog.txt");
  next();
}

export { logger };
