import { defineConfig } from "@lovable.dev/vite-tanstack-config";
const base = process.env["VITE_BASE_PATH"] ?? "/";
export default defineConfig({ vite: { base }, tanstackStart: { pages: [{ path: "/" }], prerender: { enabled: true, autoStaticPathsDiscovery: false }, router: { basepath: base === "/" ? "/" : base.replace(/\/$/, "") } } });
