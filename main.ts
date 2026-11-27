// One Line to Get Your Agent Deleted — make.fun entry.
// Writes the single line from entry.txt to $MAKEFUN_OUTPUT_DIR/entry.txt
// (default /output). Validates the competition gate before writing:
// the text must be UTF-8, 1-140 characters, a single line, not only
// whitespace. Node 22, standard library only; deterministic output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const line = readFileSync(join(here, "entry.txt"), "utf8");

// Gate: 1-140 characters, one line, not only whitespace.
if (line.length < 1 || line.length > 140) {
  throw new Error(`entry.txt must be 1-140 characters, got ${line.length}`);
}
if (line.includes("\n") || line.includes("\r")) {
  throw new Error("entry.txt must be a single line");
}
if (line.trim().length === 0) {
  throw new Error("entry.txt must not be only white space");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), line, "utf8");
console.log(`Wrote ${line.length}-character entry to ${join(outDir, "entry.txt")}`);
