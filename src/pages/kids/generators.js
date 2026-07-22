export function generateAlphabetMatchPairs() {
  const wordPool = {
    A: ['Apple', 'Ant', 'Alligator', 'Airplane', 'Arrow'],
    B: ['Ball', 'Bird', 'Bear', 'Boat', 'Basket'],
    C: ['Cat', 'Car', 'Cake', 'Camel', 'Cloud'],
    D: ['Dog', 'Duck', 'Dolphin', 'Drum', 'Diamond'],
    E: ['Elephant', 'Eagle', 'Egg', 'Engine', 'Easel'],
    F: ['Fish', 'Frog', 'Flower', 'Fire', 'Fork'],
    G: ['Girl', 'Goat', 'Guitar', 'Grape', 'Globe'],
    H: ['House', 'Horse', 'Heart', 'Hat', 'Helicopter'],
    I: ['Ice', 'Igloo', 'Island', 'Iron', 'Ink'],
    J: ['Jug', 'Jelly', 'Jet', 'Jungle', 'Jacket'],
    K: ['Kite', 'Kangaroo', 'Key', 'King', 'Kitten'],
    L: ['Lion', 'Lamp', 'Leaf', 'Lemon', 'Ladder'],
    M: ['Monkey', 'Moon', 'Mountain', 'Milk', 'Mushroom'],
    N: ['Nest', 'Nose', 'Nut', 'Nurse', 'Needle'],
    O: ['Owl', 'Orange', 'Oven', 'Ocean', 'Octopus'],
    P: ['Pen', 'Pig', 'Pizza', 'Penguin', 'Piano'],
    Q: ['Queen', 'Quilt', 'Quail', 'Quill', 'Quartz'],
    R: ['Rabbit', 'Rose', 'Rocket', 'Rain', 'Rope'],
    S: ['Sun', 'Star', 'Ship', 'Snake', 'Spoon'],
    T: ['Tiger', 'Tree', 'Train', 'Turtle', 'Tent'],
    U: ['Umbrella', 'Unicorn', 'Up', 'Uniform', 'Utensil'],
    V: ['Van', 'Vase', 'Violin', 'Volcano', 'Vest'],
    W: ['Watch', 'Water', 'Wheel', 'Whale', 'Worm'],
    X: ['Xmas', 'Xylophone', 'X-ray', 'Xenops'],
    Y: ['Yak', 'Yarn', 'Yacht', 'Yogurt', 'Yolk'],
    Z: ['Zebra', 'Zipper', 'Zoo', 'Zucchini', 'Zero'],
  };
  const letters = Object.keys(wordPool);
  const rounds = 8;
  const usedWordKeys = new Set();
  const allPairs = [];
  for (let r = 0; r < rounds; r++) {
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    for (const letter of shuffled) {
      const available = wordPool[letter].filter(w => !usedWordKeys.has(`${letter}-${w}`));
      if (available.length === 0) usedWordKeys.clear();
      const word = available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : wordPool[letter][Math.floor(Math.random() * wordPool[letter].length)];
      usedWordKeys.add(`${letter}-${word}`);
      allPairs.push({ id: `${r}-${letter}`, item: letter, match: word });
    }
  }
  return allPairs.slice(0, 200);
}

export function generateCountQuestions() {
  const allEmojis = [
    '🍎','⭐','🐱','🌸','⚽','📚','🎈','🐟','🌈','🍪',
    '🍕','🚀','🐶','🌻','🎵','🍭','🐧','🦋','🎸','🍉',
    '🚗','🌺','🐰','🎨','🍇','🦄','🌟','🐸','🎪','🍩',
    '🚲','🌲','🐼','🎁','🍒','🐯','🌙','🐢','🎭','🍦',
    '✈️','🌊','🐳','🎀','🍓','🦊','☀️','🐝','🎃','🍌',
    '🚂','🌵','🦁','🎯','🍋','🐨','💎','🐌','🎲','🍬',
    '🛸','🌋','🐻','🎧','🍑','🦒','🔮','🐞','🎳','🧁',
    '🛶','🌴','🐠','🎤','🥝','🦘','💡','🐜','🎻','🍫',
    '🪐','🌿','🐊','🎩','🥑','🦩','🧩','🐛','🎪','🍿',
    '⛵','🌾','🐅','🎈','🥕','🦔','🐚','🎮','🧸','🍒',
  ];
  const seed = [
    [3,5,7,4,8,6,2,1,5,7],
    [2,6,4,8,3,7,5,1,6,4],
    [7,3,8,5,2,6,4,1,7,5],
    [4,8,6,3,7,2,5,1,4,8],
    [6,2,7,5,3,8,4,1,6,7],
    [5,3,8,4,7,2,6,1,5,3],
    [8,4,6,2,7,5,3,1,8,6],
    [3,7,5,8,4,2,6,1,7,4],
    [6,5,8,3,7,4,2,1,6,5],
    [4,8,3,6,7,5,2,1,4,8],
  ];
  const qs = [];
  for (let s = 0; s < seed.length; s++) {
    const row = seed[s];
    for (let i = 0; i < row.length; i++) {
      const n = row[i];
      const emoji = allEmojis[(s * 10 + i) % allEmojis.length];
      const opts = new Set([n]);
      while (opts.size < 4) {
        const r = Math.max(1, n + Math.floor(Math.random() * 7) - 3);
        if (r !== n) opts.add(r);
      }
      qs.push({
        question: `How many ${emoji} are there?`,
        options: [...opts].sort((a,b) => a-b).map(String),
        correctIndex: [...opts].sort((a,b) => a-b).indexOf(n),
        emoji: emoji.repeat(n)
      });
    }
  }
  return qs;
}



