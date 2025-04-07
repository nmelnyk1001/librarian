import type { CharacterName } from "@/data/characters/registry";
import type { HomebrewCharacter } from "@/data/characters/homebrew";

export type Script = {
  id: string;
  name: string;
  author: string;
  characterBreakdown: {
    townsfolkCount: number;
    outsiderCount: number;
    minionCount: number;
    demonCount: number;
  };
  scriptJsonString: string;
  characters: CharacterName[] | HomebrewCharacter[];
};
