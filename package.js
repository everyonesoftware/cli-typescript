// Copied from https://janessagarrow.com/blog/typescript-and-esbuild/

const { build } = require("esbuild");
const { dependencies, engines, peerDependencies } = require("./package.json")
const { Generator } = require('npm-dts');

const entryPointFileName = "main";
const entryPoint = `sources/${entryPointFileName}.ts`;
const outputsPackageFolder = "outputs/package";

new Generator({
  entry: entryPoint,
  output: `${outputsPackageFolder}/${entryPointFileName}.d.ts`,
}).generate();

const external = [];
if (dependencies)
{
  external.push(...Object.keys(dependencies));
}
if (engines)
{
  external.push(...Object.keys(engines));
}
if (peerDependencies)
{
  external.push(...Object.keys(peerDependencies));
}

const sharedConfig = {
  entryPoints: [entryPoint],
  bundle: true,
  minify: true,
  external: external,
};

build({
  ...sharedConfig,
  platform: "node", // for CommonJS
  outfile: `${outputsPackageFolder}/${entryPointFileName}.js`,
});

// build({
//   ...sharedConfig,
//   outfile: `${outputsPackageFolder}/${entryPointFileName}.esm.js`,
//   platform: "neutral", // for ESM
//   format: "esm",
// });