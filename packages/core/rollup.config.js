import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import url from "@rollup/plugin-url";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";
import { defineConfig } from "rollup";
import { terser } from "rollup-plugin-terser";
import alias from "@rollup/plugin-alias";
import tsTransformPaths from "@zerollup/ts-transform-paths";
import path from "path";

const config = defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
    },
    {
      file: pkg.module,
      format: "es",
      exports: "named",
    },
  ],
  plugins: [
    alias({
      entries: [{ find: "@", replacement: path.join(process.cwd(), "src") }],
    }),
    resolve(),
    commonjs(),
    postcss({
      plugins: [],
      minimize: true,
    }),
    external({
      includeDependencies: true,
    }),
    babel({
      babelHelpers: "bundled",
      presets: [
        [
          "@babel/preset-env",
          {
            useBuiltIns: "usage",
            corejs: 3,
          },
        ],
      ],
    }),
    url(),
    typescript({
      tsconfig: "./tsconfig.json",
      compilerOptions: {
        sourceMap: false,
      },
      transformers: {
        afterDeclarations: [
          {
            type: "program",
            factory: (program) => {
              const transformer = tsTransformPaths(program);
              return transformer.afterDeclarations;
            },
          },
        ],
      },
    }),
    terser(),
  ],
});

export default config;
