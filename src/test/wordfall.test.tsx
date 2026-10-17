import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WordRain } from "@/components/WordRain";
import { VOCAB } from "@/lib/vocab";
import { DIFFICULTY_STORAGE_KEY, WORDFALL_WORDS } from "@/lib/wordfall-difficulty";
import { STANDALONE_PACE } from "@/lib/word-rain-speed";
vi.mock("@/lib/sfx",()=>({sfx:{correct:vi.fn(),tick:vi.fn(),end:vi.fn(),speedUp:vi.fn()}}));
vi.mock("@/components/Confetti",()=>({Confetti:()=>null}));
const target=()=>WORDFALL_WORDS.find(w=>screen.queryByText(w.english)&&screen.queryByRole("button",{name:w.hebrew}));
afterEach(()=>{vi.useRealTimers();localStorage.removeItem(DIFFICULTY_STORAGE_KEY);});
describe("Wordfall",()=>{
 it("unlocks and persists a tier after exactly eight catches in one game",()=>{
  vi.useFakeTimers();const complete=vi.fn();const v=render(<WordRain standalone muted onExit={()=>{}} onGameComplete={complete}/>);
  for(let i=0;i<10;i++){if(i<8){const w=target();if(!w)throw new Error("Missing target");fireEvent.click(screen.getByRole("button",{name:w.hebrew}));act(()=>vi.advanceTimersByTime(650));}else act(()=>vi.advanceTimersByTime(STANDALONE_PACE.roundMs+100));}
  expect(complete).toHaveBeenCalledExactlyOnceWith(8);expect(JSON.parse(localStorage.getItem(DIFFICULTY_STORAGE_KEY)??"null")).toEqual({level:1,wins:0});v.unmount();
  const restored=render(<WordRain standalone muted onExit={()=>{}}/>);expect(screen.queryByText(/שלב 2 · סיבוב 1\/10/)).not.toBeNull();restored.unmount();
 });
 it("finishes ten missed rounds without penalty",()=>{vi.useFakeTimers();const complete=vi.fn();const v=render(<WordRain standalone muted onExit={()=>{}} onGameComplete={complete}/>);for(let i=0;i<10;i++)act(()=>vi.advanceTimersByTime(STANDALONE_PACE.roundMs+100));expect(complete).toHaveBeenCalledExactlyOnceWith(0);v.unmount();});
 it("keeps seven-second falls without a speed banner",()=>{vi.useFakeTimers();const v=render(<WordRain standalone muted onExit={()=>{}}/>);for(let i=0;i<3;i++){const w=target();if(!w)throw new Error("Missing target");fireEvent.click(screen.getByRole("button",{name:w.hebrew}));act(()=>vi.advanceTimersByTime(650));}expect(screen.queryByText("מגבירים קצב!")).toBeNull();expect(screen.getAllByRole("button").filter(b=>b.getAttribute("aria-label")).every(b=>b.style.animationDuration==="7s")).toBe(true);v.unmount();});
 it("keeps arcade words on the source vocabulary",()=>{vi.useFakeTimers();const v=render(<WordRain muted onExit={()=>{}}/>);const answers=screen.getAllByRole("button").map(b=>b.getAttribute("aria-label")).filter(Boolean);expect(answers).toHaveLength(3);expect(answers.every(a=>VOCAB.some(w=>w.hebrew===a))).toBe(true);v.unmount();});
});
