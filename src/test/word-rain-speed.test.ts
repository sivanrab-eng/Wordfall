import { describe, expect, it } from "vitest";
import { advanceRainProgress, ARCADE_PACE, ARCADE_RULES, initialRainProgress, rainTiming, STANDALONE_PACE, STANDALONE_RULES } from "@/lib/word-rain-speed";
describe("Word rain speed", () => {
  it("increases speed by 10% only at each three consecutive catches", () => {
    let p = initialRainProgress(); for (let i=0;i<2;i++) p=advanceRainProgress(p,true,ARCADE_RULES);
    expect(p.speed).toBe(1); p=advanceRainProgress(p,true,ARCADE_RULES); expect(p.speed).toBeCloseTo(1.1);
    for (let i=0;i<3;i++) p=advanceRainProgress(p,true,ARCADE_RULES);
    expect(p.speed).toBeCloseTo(1.21); expect(rainTiming(1.1,ARCADE_PACE).fallSeconds).toBeCloseTo(5/1.1);
  });
  it("resets only the streak on misses", () => { expect(advanceRainProgress({streak:7,speed:1.1},false)).toEqual({streak:0,speed:1.1}); });
  it("starts a new game normally", () => { expect(initialRainProgress()).toEqual({streak:0,speed:1}); });
  it("keeps standalone words at seven seconds without acceleration", () => {
    expect(rainTiming(1,STANDALONE_PACE)).toEqual({fallSeconds:7,delaySeconds:1.2,roundMs:10000});
    let p=initialRainProgress(); for(let i=0;i<10;i++) p=advanceRainProgress(p,true,STANDALONE_RULES);
    expect(p.speed).toBe(1); expect(rainTiming(p.speed,STANDALONE_PACE).fallSeconds).toBe(7);
  });
});
