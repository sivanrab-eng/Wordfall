import base64,json,os,pathlib,urllib.request
root=pathlib.Path('.')
source='https://raw.githubusercontent.com/sivanrab-eng/hebrew-speed-master/1c6066c903f47a2809b257214b02df7de5f5422a/'
files=['src/components/Wordfall.tsx','src/components/WordRain.tsx','src/components/Confetti.tsx','src/components/ui/button.tsx','src/lib/utils.ts','src/lib/sfx.ts','src/lib/vocab.ts','src/lib/vocabulary-data.json','src/lib/word-rain-speed.ts','src/lib/wordfall-analytics.ts','src/lib/wordfall-config.ts','src/assets/wordfall-icon.jpg','src/styles.css','src/router.tsx','tsconfig.json','vitest.config.ts','src/test/setup.ts','src/test/vocab.test.ts','src/test/word-rain-speed.test.ts','src/test/wordfall.test.tsx','public/manifest.webmanifest','public/wordfall-180.png','public/wordfall-192.png','public/wordfall-512.png','public/wordfall-favicon.png']
for name in files:
 p=root/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(urllib.request.urlopen(source+name).read())
p=root/'src/lib/wordfall-config.ts';p.write_text(p.read_text().replace('https://sivanrab-eng.github.io/hebrew-speed-master/','https://sivanrab-eng.github.io/Wordfall/'))
p=root/'src/components/Confetti.tsx';p.write_text(p.read_text().replace('COLORS[i % COLORS.length]!','(COLORS[i % COLORS.length] ?? "var(--primary)")'))
pkg=json.load(urllib.request.urlopen(source+'package.json'))
runtime=['react','react-dom','@tanstack/react-query','@tanstack/react-router','@tanstack/react-start','@tanstack/router-plugin','@radix-ui/react-slot','class-variance-authority','clsx','tailwind-merge','lucide-react','tailwindcss','@tailwindcss/vite','tw-animate-css','vite-tsconfig-paths']
dev=['@lovable.dev/vite-tanstack-config','@vitejs/plugin-react','@types/node','@types/react','@types/react-dom','vite','typescript','nitro','vitest','jsdom','@testing-library/react','@testing-library/jest-dom']
(root/'package.json').write_text(json.dumps({'name':'wordfall','private':True,'type':'module','scripts':{'dev':'vite dev','build':'vite build','test':'vitest run'},'overrides':pkg.get('overrides',{}),'dependencies':{k:pkg['dependencies'][k] for k in runtime},'devDependencies':{k:pkg['devDependencies'][k] for k in dev}},indent=2)+'\n')
(root/'vite.config.ts').write_text('''import { defineConfig } from "@lovable.dev/vite-tanstack-config";
const base = process.env["VITE_BASE_PATH"] ?? "/";
export default defineConfig({ vite: { base }, tanstackStart: { pages: [{ path: "/" }], prerender: { enabled: true, autoStaticPathsDiscovery: false }, router: { basepath: base === "/" ? "/" : base.replace(/\\/$/, "") } } });
''')
(root/'src/routes').mkdir(parents=True,exist_ok=True)
(root/'src/routes/index.tsx').write_text('''import { createFileRoute } from "@tanstack/react-router";
import { Wordfall } from "@/components/Wordfall";
import { wordfallMeta } from "@/lib/wordfall-config";
export const Route = createFileRoute("/")({ head: () => ({ meta: wordfallMeta }), component: Wordfall });
''')
(root/'src/routes/__root.tsx').write_text('''import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "../styles.css?url";
const base = import.meta.env["BASE_URL"];
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
 head: () => ({ meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { name: "theme-color", content: "#210c38" }, { name: "apple-mobile-web-app-title", content: "Wordfall" }], links: [{ rel: "stylesheet", href: appCss }, { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700;900&family=Secular+One&family=Frank+Ruhl+Libre:wght@400;700&display=swap" }, { rel: "manifest", href: `${base}manifest.webmanifest` }, { rel: "icon", href: `${base}wordfall-favicon.png` }, { rel: "apple-touch-icon", href: `${base}wordfall-180.png` }] }), component: Root, shellComponent: Document });
function Root() { const { queryClient } = Route.useRouteContext(); return <QueryClientProvider client={queryClient}><Outlet /></QueryClientProvider>; }
function Document({ children }: { children: ReactNode }) { return <html lang="he" dir="rtl"><head><HeadContent /></head><body>{children}<Scripts /></body></html>; }
''')
(root/'.gitignore').write_text('node_modules/\ndist/\n.output/\n.tanstack/\n.env\n.env.*\n*.tsbuildinfo\nsrc/routeTree.gen.ts\n')
(root/'README.md').write_text('''# Wordfall
Standalone falling-word game only. No other games or backend client are included.
Play: https://sivanrab-eng.github.io/Wordfall/
Local: bun install, bun run dev. Tests: bun run test.
Sharing and manifest-only home-screen installation are included. No offline cache.
Analytics are optional: configure the repository variable WORDFALL_GA_MEASUREMENT_ID. Without it analytics remain disabled.
''')
(root/'AGENTS.md').write_text('''# Standalone Wordfall
- Keep the root route exclusively for the falling-word game; do not include other games or backend clients.
- Keep speed progression and timing in the pure helper and apply changes at round boundaries for synchronization.
- Keep installation manifest-only and scoped to the repository base path to avoid offline preview effects.
- Keep analytics browser-only, optional and aggregate without player identifiers.
- Keep vocabulary in shared data and merge duplicate visible labels for unambiguous answers.
''')
api_base='https://api.github.com/repos/'+os.environ['GITHUB_REPOSITORY']
headers={'Authorization':'Bearer '+os.environ['GH_TOKEN'],'Accept':'application/vnd.github+json','Content-Type':'application/json'}
def api(path,body=None,method=None):
 req=urllib.request.Request(api_base+path,data=json.dumps(body).encode() if body is not None else None,headers=headers,method=method or ('POST' if body is not None else 'GET'))
 with urllib.request.urlopen(req) as r:return json.load(r)
parent=api('/git/ref/heads/main')['object']['sha'];base_tree=api('/git/commits/'+parent)['tree']['sha'];tree=[]
for name in files+['package.json','vite.config.ts','src/routes/index.tsx','src/routes/__root.tsx','.gitignore','README.md','AGENTS.md']:
 p=root/name;blob=api('/git/blobs',{'content':base64.b64encode(p.read_bytes()).decode(),'encoding':'base64'});tree.append({'path':name,'mode':'100644','type':'blob','sha':blob['sha']})
new_tree=api('/git/trees',{'base_tree':base_tree,'tree':tree})
commit=api('/git/commits',{'message':'Import only the standalone falling-word game','tree':new_tree['sha'],'parents':[parent]})
api('/git/refs/heads/main',{'sha':commit['sha'],'force':False},'PATCH')
print('Standalone Wordfall source uploaded.')
