import * as esbuild from "esbuild";

esbuild.build({
  bundle: true,
  entryPoints: [
    './packages/components/hostContainer/index.ts',
    './packages/dataProvider/index.ts',
  ],
  external: ['@miguelzarate/data-provider'],
  format: 'esm',
  minify: true,
  minifyWhitespace: true,
  outdir: 'dist',
  platform: 'browser',
  preserveSymlinks: true,
  resolveExtensions: [".ts"],
  treeShaking: true,
  tsconfig: "./tsconfig.json",
}).catch(() => process.exit(1))
