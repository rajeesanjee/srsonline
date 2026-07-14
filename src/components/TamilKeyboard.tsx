"use client";

import { useState } from "react";

type TamilKeyboardProps = {
  onCharacter: (character: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onClear: () => void;
  onClose: () => void;
};

type LetterGroup = {
  base: string;
  letters: string[];
};

const consonants = [
  "க",
  "ங",
  "ச",
  "ஞ",
  "ட",
  "ண",
  "த",
  "ந",
  "ப",
  "ம",
  "ய",
  "ர",
  "ல",
  "வ",
  "ழ",
  "ள",
  "ற",
  "ன",
];

const vowelForms = [
  "",
  "ா",
  "ி",
  "ீ",
  "ு",
  "ூ",
  "ெ",
  "ே",
  "ை",
  "ொ",
  "ோ",
  "ௌ",
  "்",
];

const vowels = [
  "அ",
  "ஆ",
  "இ",
  "ஈ",
  "உ",
  "ஊ",
  "எ",
  "ஏ",
  "ஐ",
  "ஒ",
  "ஓ",
  "ஔ",
  "ஃ",
];

const groups: LetterGroup[] = consonants.map(
  (base) => ({
    base,
    letters: vowelForms.map(
      (vowel) => `${base}${vowel}`
    ),
  })
);

export default function TamilKeyboard({
  onCharacter,
  onBackspace,
  onSpace,
  onClear,
  onClose,
}: TamilKeyboardProps) {
  const [selected, setSelected] = useState(groups[0]);

  return (
    <div className="absolute left-0 top-full z-[100] mt-2 w-[390px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-amber-300 bg-amber-50 shadow-2xl">
      <div className="flex items-center justify-between border-b border-amber-300 bg-amber-100 px-3 py-2">
        <h3
          lang="ta"
          className="font-bold text-stone-900"
        >
          தமிழ் எழுத்துக்கள்
        </h3>

        <button
          type="button"
          onClick={onClose}
          className="h-7 w-7 rounded border bg-white font-bold"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-[130px_minmax(0,1fr)]">
        <div className="max-h-[330px] overflow-y-auto border-r border-amber-300 p-2">
          <div className="grid grid-cols-2 gap-1">
            {groups.map((group) => (
              <button
                key={group.base}
                type="button"
                lang="ta"
                onClick={() => setSelected(group)}
                className={`h-38px h-10 rounded border text-lg font-bold ${
                  selected.base === group.base
                    ? "border-red-800 bg-red-800 text-white"
                    : "bg-white"
                }`}
              >
                {group.base}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3">
          <p
            lang="ta"
            className="mb-2 text-sm font-bold text-stone-600"
          >
            {selected.base} எழுத்து வகைகள்
          </p>

          <div className="grid grid-cols-4 gap-2">
            {selected.letters.map((letter) => (
              <button
                key={letter}
                type="button"
                lang="ta"
                onClick={() => onCharacter(letter)}
                className="h-11 rounded-md border bg-white text-lg font-bold shadow-sm hover:border-red-800 hover:bg-red-50"
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="mt-4 border-t border-amber-300 pt-3">
            <p
              lang="ta"
              className="mb-2 text-sm font-bold text-stone-600"
            >
              உயிர் எழுத்துக்கள்
            </p>

            <div className="grid grid-cols-5 gap-1.5">
              {vowels.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  lang="ta"
                  onClick={() => onCharacter(letter)}
                  className="h-9 rounded border bg-white font-bold"
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 border-t border-amber-300 bg-amber-100 p-2">
        <button
          type="button"
          onClick={onClear}
          className="rounded border bg-white py-2 text-sm font-bold text-red-700"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={onSpace}
          className="col-span-3 rounded border bg-white py-2 text-sm font-bold"
        >
          Space
        </button>

        <button
          type="button"
          onClick={onBackspace}
          className="rounded border bg-white py-2 font-bold"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}