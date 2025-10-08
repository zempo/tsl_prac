import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    glsl({
      transform: (code, id) => {
        // Check if this is a shader file (e.g., .frag or .vert)
        if (
          id.endsWith(".frag") ||
          id.endsWith(".vert") ||
          id.endsWith(".glsl")
        ) {
          return `#version 460\n${code}`;
        }
        return code;
      },
    }),
  ],
});
