const independentVowels: Record<string, string> = {
  aa: "ஆ",
  ai: "ஐ",
  au: "ஔ",
  ee: "ஈ",
  ii: "ஈ",
  oo: "ஊ",
  uu: "ஊ",
  a: "அ",
  i: "இ",
  u: "உ",
  e: "எ",
  o: "ஒ",
};

const vowelSigns: Record<string, string> = {
  aa: "ா",
  ai: "ை",
  au: "ௌ",
  ee: "ீ",
  ii: "ீ",
  oo: "ூ",
  uu: "ூ",
  a: "",
  i: "ி",
  u: "ு",
  e: "ெ",
  o: "ொ",
};

const consonants: Record<string, string> = {
  ng: "ங",
  nj: "ஞ",
  gn: "ஞ",
  zh: "ழ",
  sh: "ஷ",
  ch: "ச",
  th: "த",
  dh: "த",
  ph: "ப",
  bh: "ப",
  kh: "க",
  gh: "க",
  rr: "ற",
  ll: "ள",
  nn: "ண",

  k: "க",
  g: "க",
  c: "ச",
  s: "ச",
  j: "ஜ",
  t: "ட",
  d: "ட",
  n: "ந",
  p: "ப",
  b: "ப",
  m: "ம",
  y: "ய",
  r: "ர",
  l: "ல",
  v: "வ",
  w: "வ",
  q: "க",
  x: "க்ஸ",
  h: "ஹ",
  f: "ஃப",
  z: "ஜ",
};

const vowels = [
  "aa",
  "ai",
  "au",
  "ee",
  "ii",
  "oo",
  "uu",
  "a",
  "i",
  "u",
  "e",
  "o",
];

const consonantKeys = Object.keys(consonants).sort(
  (a, b) => b.length - a.length
);

function findMatch(
  value: string,
  index: number,
  choices: string[]
) {
  return choices.find((choice) =>
    value.startsWith(choice, index)
  );
}

function transliterateWord(input: string) {
  const word = input.toLowerCase();

  let output = "";
  let index = 0;

  while (index < word.length) {
    const character = word[index];

    if (!/[a-z]/.test(character)) {
      output += character;
      index += 1;
      continue;
    }

    const vowel = findMatch(word, index, vowels);

    if (vowel) {
      output += independentVowels[vowel];
      index += vowel.length;
      continue;
    }

    const consonant = findMatch(
      word,
      index,
      consonantKeys
    );

    if (!consonant) {
      output += character;
      index += 1;
      continue;
    }

    const tamilConsonant = consonants[consonant];

    index += consonant.length;

    const followingVowel = findMatch(
      word,
      index,
      vowels
    );

    if (followingVowel) {
      output +=
        tamilConsonant +
        vowelSigns[followingVowel];

      index += followingVowel.length;
    } else {
      output += tamilConsonant + "்";
    }
  }

  return output;
}

export function transliterateTamil(input: string) {
  if (!input.trim()) {
    return "";
  }

  return input
    .split(/(\s+)/)
    .map((part) => {
      if (/^\s+$/.test(part)) {
        return part;
      }

      return transliterateWord(part);
    })
    .join("");
}
