import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },

  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1366, // ancho típico de laptop
    viewportHeight: 768, // alto típico de laptop
    setupNodeEvents(on, config) {
          // implement node event listeners here
        },
    },
    env: {
       user: '10680150-9',
    
  },
});