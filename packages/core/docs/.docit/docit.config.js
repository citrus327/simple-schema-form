export default {
  vite: {
    resolve: {
      // pnpm cannot find @mdx-js/react in the top level of node_modules
      dedupe: ["@mdx-js/react"],
    },
  },
};
