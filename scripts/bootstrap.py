import base64,json,os,urllib.request
h={'Authorization':'Bearer '+os.environ['GH_TOKEN'],'Accept':'application/vnd.github+json'}
r=urllib.request.Request('https://api.github.com/repos/'+os.environ['GITHUB_REPOSITORY']+'/git/blobs/04b82f6c323873461b356fac79bebe70d389e2e3',headers=h)
s=base64.b64decode(json.load(urllib.request.urlopen(r))['content']).decode()
s=s.replace('1c6066c903f47a2809b257214b02df7de5f5422a','1e12d0a9f36094fb2f2ad747ed9bcb62a369b7d7')
x=['src/components/WordfallCatch.tsx','src/components/WordfallRewards.tsx','src/components/WordfallSentence.tsx']+['src/lib/wordfall-'+n for n in ['difficulty.ts','modes.ts','pronunciation.ts','pronunciation.json','score.ts','sentences.ts','sentences.json','vocabulary.json']]+['src/test/'+n+'.test.ts' for n in ['speech','wordfall-difficulty','wordfall-modes','wordfall-pronunciation','wordfall-score']]
s=s.replace("'public/wordfall-favicon.png']","'public/wordfall-favicon.png']+"+repr(x),1)
s=s.replace("'Import only the standalone falling-word game'","'Update standalone Wordfall: regular and practice modes, phone fit, pronunciation'")
exec(s)
