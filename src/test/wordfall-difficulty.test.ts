import { describe, expect, it } from "vitest";
import { completeDifficulty, difficultyPool, EVERYDAY_WORDS, initialDifficulty, normalizeDifficulty, WORDFALL_POOLS, mixedGameWords } from "@/lib/wordfall-difficulty";
import { VOCAB } from "@/lib/vocab";
describe("Wordfall vocabulary difficulty", () => {
 it("starts with rich Hebrew and simple English",()=>{expect(difficultyPool(initialDifficulty()).find(w=>w.hebrew==="אמתלה")?.english).toBe("an excuse");});
 it("unlocks after one game with at least eight catches",()=>{expect(completeDifficulty(initialDifficulty(),8)).toEqual({level:1,wins:0});expect(completeDifficulty({level:1,wins:0},8)).toEqual({level:2,wins:0});});
 it("does not remove progress or promote below eight",()=>{expect(completeDifficulty({level:2,wins:1},7)).toEqual({level:2,wins:1});});
 it("caps the last tier and normalizes saved progress",()=>{expect(completeDifficulty({level:4,wins:0},10)).toEqual({level:4,wins:0});expect(normalizeDifficulty({level:99,wins:1})).toEqual(initialDifficulty());});
 it("preserves all rich labels and simple English",()=>{const words=WORDFALL_POOLS.flat();expect(words.map(w=>w.hebrew).sort()).toEqual(VOCAB.map(w=>w.hebrew).sort());expect(words.find(w=>w.hebrew==="כמיהה")?.english).toBe("a strong wish");expect(words.every(w=>w.english.trim().split(/\s+/).length<=12)).toBe(true);});
 it.each([0,1,2,3,4])("includes three everyday and seven rich words at tier %i",level=>{const words=mixedGameWords({level,wins:0},10,<T,>(a:T[])=>a);expect(words).toHaveLength(10);expect(words.filter(w=>EVERYDAY_WORDS.includes(w))).toHaveLength(3);expect(words.filter(w=>WORDFALL_POOLS.flat().includes(w))).toHaveLength(7);expect(new Set(words.map(w=>w.hebrew)).size).toBe(10);});
 it.each([[0,2],[1,3],[2,4],[3,6]])("tier %i includes %i harder words",(level,count)=>{const words=mixedGameWords({level,wins:0},10,<T,>(a:T[])=>a);const later=new Set(WORDFALL_POOLS.slice(level+1).flat());expect(words.filter(w=>later.has(w))).toHaveLength(count);});
});
