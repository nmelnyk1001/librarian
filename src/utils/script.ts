import { CharacterNameSchema, characterRegistry } from "@/data/characters/registry";
import type { Script } from "@/types/script";
import type { HomebrewCharacter } from "@/data/characters/homebrew";
import type { CollectionEntry } from "astro:content";
import { match } from "ts-pattern";

export const parseScriptData = (script: CollectionEntry<"scripts">): Script => {
  const [meta, ...characters] = script.data;

  return {
    id: script.id,
    name: meta.name,
    author: meta.author,
    characterBreakdown: meta.almanac
      ? homebrewCharacterBreakdown(characters as HomebrewCharacter[])
      : standardCharacterBreakdown(characters as string[]),
    characters: meta.almanac
      ? (characters as HomebrewCharacter[])
      : characters.map((character) => CharacterNameSchema.parse(character as string)),
    scriptJsonString: JSON.stringify(script.data),
  };
};

const standardCharacterBreakdown = (characters: string[]): Script["characterBreakdown"] => {
  return characters.reduce(
    (acc, character) => {
      const parsedCharacter = CharacterNameSchema.parse(character as string);
      const entry = characterRegistry[parsedCharacter];

      match(entry.type)
        .with("townsfolk", () => {
          acc.townsfolkCount++;
        })
        .with("outsider", () => {
          acc.outsiderCount++;
        })
        .with("minion", () => {
          acc.minionCount++;
        })
        .with("demon", () => {
          acc.demonCount++;
        });

      return acc;
    },
    {
      demonCount: 0,
      minionCount: 0,
      outsiderCount: 0,
      townsfolkCount: 0,
    } as Script["characterBreakdown"],
  );
};

const homebrewCharacterBreakdown = (
  characters: HomebrewCharacter[],
): Script["characterBreakdown"] => {
  return characters.reduce(
    (acc, character) => {
      match(character.team)
        .with("townsfolk", () => {
          acc.townsfolkCount++;
        })
        .with("outsider", () => {
          acc.outsiderCount++;
        })
        .with("minion", () => {
          acc.minionCount++;
        })
        .with("demon", () => {
          acc.demonCount++;
        });

      return acc;
    },
    {
      demonCount: 0,
      minionCount: 0,
      outsiderCount: 0,
      townsfolkCount: 0,
    } as Script["characterBreakdown"],
  );
};
