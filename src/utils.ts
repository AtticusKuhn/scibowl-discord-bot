const glob = require("glob");

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function get_directories(
  src: string,
  callback: (error: Error, files: string[]) => void | Promise<void>
) {
  glob(src + "/**/*.ts", callback);
}
