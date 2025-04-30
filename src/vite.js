import fs from "fs";

let manifest;

export default function vite(sourceFiles = []) {
  const output = [];
  const hmrUrl =
    process.env.ENVIRONMENT == "dev" &&
    fs.statSync("dist/vite.hot", { throwIfNoEntry: false })
      ? fs.readFileSync("dist/vite.hot")
      : null;
  if (hmrUrl)
    output.push(`<script type="module" src="${hmrUrl}/@vite/client"></script>`);
  else
    manifest =
      manifest || JSON.parse(fs.readFileSync("dist/vite.manifest.json"));
  for (const sourceFile of sourceFiles) {
    if (sourceFile.endsWith(".js")) {
      const url = hmrUrl
        ? `${hmrUrl}/${sourceFile}`
        : `/${manifest[sourceFile].file}`;
      output.push(`<script type="module" src="${url}"></script>`);
    }
    if (sourceFile.endsWith(".scss") || sourceFile.endsWith(".css")) {
      const url = hmrUrl
        ? `${hmrUrl}/${sourceFile}`
        : `/${manifest[sourceFile].file}`;
      output.push(`<link rel="stylesheet" href="${url}">`);
    }
  }

  return output.join("\n");
}
