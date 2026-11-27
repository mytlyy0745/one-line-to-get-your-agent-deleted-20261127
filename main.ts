// One Line to Get Your Agent Deleted — make.fun entry.
// Writes the single line from entry.txt to $MAKEFUN_OUTPUT_DIR/entry.txt
// (default /output). Validates the competition gate before writing:
// the text must be UTF-8, 1-140 characters, a single line, not only
// whitespace. After writing, reads the file back and verifies it is
// byte-identical to the embedded text. Node 22, standard library only;
// deterministic output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const line = readFileSync(join(here, "entry.txt"), "utf8");

// Gate: 1-140 characters, one line, not only whitespace.
// Count length in Unicode code points (Array.from), so an astral
// character counts as one character, not two UTF-16 code units.
const charCount = Array.from(line).length;
if (charCount < 1 || charCount > 140) {
  throw new Error(
    `gate length: entry.txt must be 1-140 characters, got ${charCount}`,
  );
}
if (line.includes("\n") || line.includes("\r")) {
  throw new Error(
    "gate single-line: entry.txt must be a single line (no newline characters)",
  );
}
if (line.trim().length === 0) {
  throw new Error(
    "gate non-whitespace: entry.txt must not be only white space",
  );
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");
try {
  mkdirSync(outDir, { recursive: true });
} catch (err) {
  throw new Error(
    `cannot create output dir ${outDir}: ${err instanceof Error ? err.message : String(err)}`,
  );
}
try {
  writeFileSync(outPath, line, "utf8");
} catch (err) {
  throw new Error(
    `cannot write ${outPath}: ${err instanceof Error ? err.message : String(err)}`,
  );
}

// Read back and verify byte-identical to the embedded text.
const writtenBytes = readFileSync(outPath);
if (!writtenBytes.equals(Buffer.from(line, "utf8"))) {
  throw new Error(
    `verification failed: ${outPath} is not byte-identical to entry.txt`,
  );
}
console.log(`Wrote ${charCount}-character entry to ${outPath} (verified byte-identical)`);
