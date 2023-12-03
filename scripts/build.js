import esbuild from "esbuild";
import { writeFile } from "fs/promises";
import { parse } from "path";

// Relative to /src
const entryPoints = [
  "oyc.js", // Main Oyc
  "plugins/class/class.js", // Class plugin
];

/**
 * @typedef {import('esbuild').BuildOptions} BuildOptions
 */

/**
 * @type {Record<string, BuildOptions>}
 */
const buildTypes = {
  "esm": {
    bundle: true,
    sourcemap: "external",
    minify: true,
    metafile: true,
    format: "esm",
    platform: "browser",
    target: ["es2022"],
  },
  // 'cjs': {
  //   bundle: true,
  //   sourcemap: 'external',
  //   minify: false,
  //   metafile: true,
  //   format: "cjs",
  //   platform: "browser",
  //   target: ["es2022"],
  // }
};

for (const [type, options] of Object.entries(buildTypes)) {
  for (let index = 0; index < entryPoints.length; index++) {
    const entryPoint = entryPoints[index];
    const fileName = parse(entryPoint).name;
    const folder = parse(entryPoint).dir;
    esbuild.build({
      ...options,
      entryPoints: [`./src/${entryPoint}`],
      external: ["oyc"],
      // outfile: `./dist/${type}/${fileName}.min.js`
      outfile: `./dist/${folder}/${fileName}.min.js`,
    }).then(result => {
      // writeFile(`./dist/${type}/${fileName}.json`, JSON.stringify(result.metafile), {
      //   flag: "w"
      // })
      writeFile(`./dist/${folder}/${fileName}.json`, JSON.stringify(result.metafile), {
        flag: "w",
      });
    });
  }
}
