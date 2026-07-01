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

export function generateAnimalSoundQuestions() {
  const animalSounds = [
    ['Cow','Moo','🐄'],['Dog','Bark','🐕'],['Cat','Meow','🐱'],
    ['Duck','Quack','🦆'],['Sheep','Baa','🐑'],['Horse','Neigh','🐴'],
    ['Pig','Oink','🐷'],['Chicken','Cluck','🐔'],['Rooster','Cock-a-doodle-doo','🐓'],
    ['Goat','Bleat','🐐'],['Donkey','Hee-haw','🫏'],['Rabbit','Thump','🐇'],
    ['Turkey','Gobble','🦃'],['Mouse','Squeak','🐭'],['Hen','Cluck','🐔'],
    ['Goose','Honk','🦆'],['Pony','Neigh','🐴'],['Bull','Bellow','🐂'],
    ['Ox','Low','🐂'],['Hamster','Squeak','🐹'],['Guinea Pig','Wheek','🐹'],
    ['Ferret','Dook','🐾'],['Parakeet','Tweet','🐦'],
    ['Lion','Roar','🦁'],['Tiger','Roar','🐯'],['Wolf','Howl','🐺'],
    ['Bear','Growl','🐻'],['Fox','Yelp','🦊'],['Elephant','Trumpet','🐘'],
    ['Monkey','Chatter','🐒'],['Gorilla','Hoot','🦍'],['Chimpanzee','Scream','🐵'],
    ['Zebra','Bray','🦓'],['Giraffe','Hum','🦒'],['Camel','Grunt','🐪'],
    ['Hippo','Honk','🦛'],['Rhinoceros','Snort','🦏'],['Leopard','Growl','🐆'],
    ['Cheetah','Chirp','🐆'],['Hyena','Laugh','🐆'],['Kangaroo','Chortle','🦘'],
    ['Koala','Snore','🐨'],['Panda','Bleat','🐼'],['Sloth','Squeak','🦥'],
    ['Raccoon','Trill','🦝'],['Squirrel','Chatter','🐿️'],['Beaver','Chatter','🦫'],
    ['Otter','Squeak','🦦'],['Hedgehog','Snuffle','🦔'],['Moose','Bellow','🫎'],
    ['Buffalo','Bellow','🐃'],['Bison','Grunt','🦬'],['Deer','Bell','🦌'],
    ['Antelope','Snort','🦌'],['Gazelle','Snort','🦌'],['Wildebeest','Grunt','🦓'],
    ['Meerkat','Chatter','🦫'],['Wombat','Grunt','🦘'],['Platypus','Growl','🦘'],
    ['Armadillo','Grunt','🦔'],['Porcupine','Chatter','🦔'],['Skunk','Hiss','🦨'],
    ['Badger','Growl','🦡'],['Mole','Squeak','🐭'],['Bat','Screech','🦇'],
    ['Owl','Hoot','🦉'],['Parrot','Squawk','🦜'],['Eagle','Screech','🦅'],
    ['Hawk','Screech','🦅'],['Falcon','Screech','🦅'],['Vulture','Hiss','🦅'],
    ['Crow','Caw','🐦‍⬛'],['Raven','Croak','🐦‍⬛'],['Magpie','Chatter','🐦'],
    ['Pigeon','Coo','🕊️'],['Dove','Coo','🕊️'],['Sparrow','Chirp','🐦'],
    ['Robin','Sing','🐦'],['Nightingale','Sing','🎵'],['Canary','Sing','🐦'],
    ['Blue Jay','Jay','🐦'],['Mockingbird','Mimic','🐦'],['Cuckoo','Cuckoo','🕊️'],
    ['Woodpecker','Tap','🪚'],['Peacock','Squall','🦚'],['Flamingo','Honk','🦩'],
    ['Penguin','Honk','🐧'],['Swan','Trumpet','🦢'],['Stork','Clatter','🦩'],
    ['Crane','Trumpet','🦩'],['Heron','Squawk','🦩'],['Pelican','Silent','🦩'],
    ['Seagull','Mew','🕊️'],['Ostrich','Boom','🦩'],['Emu','Boom','🦩'],
    ['Cockatoo','Screech','🦜'],['Macaw','Scream','🦜'],['Toucan','Croak','🦜'],
    ['Kiwi','Hiss','🦩'],
    ['Frog','Croak','🐸'],['Toad','Croak','🐸'],['Snake','Hiss','🐍'],
    ['Lizard','Hiss','🦎'],['Turtle','Hiss','🐢'],['Crocodile','Bellow','🐊'],
    ['Alligator','Roar','🐊'],['Salamander','Squeak','🦎'],['Chameleon','Hiss','🦎'],
    ['Iguana','Hiss','🦎'],['Gecko','Click','🦎'],
    ['Dolphin','Click','🐬'],['Whale','Sing','🐋'],['Seal','Arf','🦭'],
    ['Walrus','Bell','🦭'],['Sea Lion','Bark','🦭'],['Shark','Silent','🦈'],
    ['Octopus','Silent','🐙'],['Jellyfish','Silent','🪼'],['Starfish','Silent','⭐'],
    ['Crab','Click','🦀'],['Lobster','Click','🦞'],
    ['Bee','Buzz','🐝'],['Cricket','Chirp','🦗'],['Grasshopper','Chirp','🦗'],
    ['Mosquito','Buzz','🦟'],['Fly','Buzz','🪰'],['Ant','Silent','🐜'],
    ['Butterfly','Silent','🦋'],['Moth','Silent','🦋'],['Dragonfly','Buzz','🪰'],
    ['Cicada','Buzz','🪰'],['Firefly','Silent','🪲'],
    ['Dinosaur','Roar','🦕'],['T-Rex','Roar','🦖'],['Pterodactyl','Screech','🦅'],
    ['Dragon','Roar','🐉'],['Unicorn','Neigh','🦄'],['Phoenix','Sing','🪶'],
    ['Griffin','Screech','🦁'],['Fairy','Tinkle','🧚'],
  ];
  const allSounds = [...new Set(animalSounds.map(a => a[1]))];
  const shuffleArray = (a) => [...a].sort(() => Math.random() - 0.5);
  const forward = animalSounds.map(([animal, sound, emoji]) => {
    const wrong = shuffleArray(allSounds.filter(s => s !== sound)).slice(0, 3);
    const options = shuffleArray([sound, ...wrong]);
    return { question: `What sound does a ${animal} make?`, options, correctIndex: options.indexOf(sound), emoji };
  });
  const reverse = animalSounds.map(([animal, sound, emoji]) => {
    const others = shuffleArray(animalSounds.filter(a => a[1] !== sound)).slice(0, 3).map(a => a[0]);
    const options = shuffleArray([animal, ...others]);
    return { question: `Which animal makes a "${sound}" sound?`, options, correctIndex: options.indexOf(animal), emoji };
  });
  return shuffleArray([...forward, ...reverse]);
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

export function generateShapePairs() {
  const shapes = [
    { id: 'circle', item: 'Circle', match: '🔴' },
    { id: 'square', item: 'Square', match: '🟧' },
    { id: 'triangle', item: 'Triangle', match: '🟨' },
    { id: 'star', item: 'Star', match: '⭐' },
    { id: 'heart', item: 'Heart', match: '❤️' },
    { id: 'diamond', item: 'Diamond', match: '💠' },
    { id: 'pentagon', item: 'Pentagon', match: '⬠' },
    { id: 'hexagon', item: 'Hexagon', match: '⬡' },
    { id: 'octagon', item: 'Octagon', match: '🛑' },
    { id: 'oval', item: 'Oval', match: '🔵' },
    { id: 'arrow', item: 'Arrow', match: '➡️' },
    { id: 'cross', item: 'Cross', match: '➕' },
    { id: 'crescent', item: 'Crescent', match: '🌙' },
    { id: 'rectangle', item: 'Rectangle', match: '▬' },
    { id: 'parallelogram', item: 'Parallelogram', match: '▱' },
    { id: 'trapezoid', item: 'Trapezoid', match: '⏢' },
    { id: 'rhombus', item: 'Rhombus', match: '◆' },
    { id: 'ellipse', item: 'Ellipse', match: '🔘' },
    { id: 'ring', item: 'Ring', match: '⭕' },
    { id: 'spiral', item: 'Spiral', match: '🌀' },
    { id: 'wave', item: 'Wave', match: '🌊' },
    { id: 'lightning', item: 'Lightning', match: '⚡' },
    { id: 'sun', item: 'Sun', match: '☀️' },
    { id: 'moon', item: 'Moon', match: '🌙' },
    { id: 'cloud', item: 'Cloud', match: '☁️' },
    { id: 'raindrop', item: 'Raindrop', match: '💧' },
    { id: 'flame', item: 'Flame', match: '🔥' },
    { id: 'leaf', item: 'Leaf', match: '🍃' },
    { id: 'flower', item: 'Flower', match: '🌸' },
  ];
  return shapes;
}

export function generateColorQuestions() {
  const colors = [
    { name: 'Red', hex: '#ef4444', emoji: '🔴' },
    { name: 'Blue', hex: '#3b82f6', emoji: '🔵' },
    { name: 'Green', hex: '#22c55e', emoji: '🟢' },
    { name: 'Yellow', hex: '#facc15', emoji: '🟡' },
    { name: 'Orange', hex: '#f97316', emoji: '🟠' },
    { name: 'Purple', hex: '#a855f7', emoji: '🟣' },
    { name: 'Pink', hex: '#ec4899', emoji: '💗' },
    { name: 'Brown', hex: '#92400e', emoji: '🟤' },
    { name: 'Black', hex: '#000000', emoji: '⚫' },
    { name: 'White', hex: '#f1f5f9', emoji: '⚪' },
    { name: 'Cyan', hex: '#06b6d4', emoji: '🩵' },
    { name: 'Magenta', hex: '#d946ef', emoji: '🩷' },
    { name: 'Lime', hex: '#84cc16', emoji: '💚' },
    { name: 'Maroon', hex: '#881337', emoji: '🟫' },
    { name: 'Navy', hex: '#1e3a5f', emoji: '🔵' },
    { name: 'Teal', hex: '#14b8a6', emoji: '🩵' },
    { name: 'Gold', hex: '#eab308', emoji: '🥇' },
    { name: 'Silver', hex: '#c0c0c0', emoji: '🥈' },
    { name: 'Indigo', hex: '#6366f1', emoji: '💜' },
    { name: 'Violet', hex: '#8b5cf6', emoji: '💜' },
  ];
  const shuffleArray = (a) => [...a].sort(() => Math.random() - 0.5);
  const allNames = colors.map(c => c.name);
  return colors.map(c => {
    const opts = shuffleArray(allNames.filter(n => n !== c.name)).slice(0, 3);
    const options = shuffleArray([c.name, ...opts]);
    return { question: `What color is this?`, options, correctIndex: options.indexOf(c.name), emoji: '🎨', colors: [c.hex] };
  });
}

export function generateFruitVegetablePairs() {
  return [
    { id: 'apple', item: 'Apple', match: '🍎' },
    { id: 'banana', item: 'Banana', match: '🍌' },
    { id: 'orange', item: 'Orange', match: '🍊' },
    { id: 'strawberry', item: 'Strawberry', match: '🍓' },
    { id: 'grape', item: 'Grape', match: '🍇' },
    { id: 'watermelon', item: 'Watermelon', match: '🍉' },
    { id: 'mango', item: 'Mango', match: '🥭' },
    { id: 'pineapple', item: 'Pineapple', match: '🍍' },
    { id: 'peach', item: 'Peach', match: '🍑' },
    { id: 'cherry', item: 'Cherry', match: '🍒' },
    { id: 'lemon', item: 'Lemon', match: '🍋' },
    { id: 'kiwi', item: 'Kiwi', match: '🥝' },
    { id: 'coconut', item: 'Coconut', match: '🥥' },
    { id: 'blueberry', item: 'Blueberry', match: '🫐' },
    { id: 'carrot', item: 'Carrot', match: '🥕' },
    { id: 'tomato', item: 'Tomato', match: '🍅' },
    { id: 'broccoli', item: 'Broccoli', match: '🥦' },
    { id: 'corn', item: 'Corn', match: '🌽' },
    { id: 'potato', item: 'Potato', match: '🥔' },
    { id: 'onion', item: 'Onion', match: '🧅' },
    { id: 'pepper', item: 'Pepper', match: '🌶️' },
    { id: 'cucumber', item: 'Cucumber', match: '🥒' },
    { id: 'lettuce', item: 'Lettuce', match: '🥬' },
    { id: 'mushroom', item: 'Mushroom', match: '🍄' },
    { id: 'eggplant', item: 'Eggplant', match: '🍆' },
    { id: 'garlic', item: 'Garlic', match: '🧄' },
    { id: 'avocado', item: 'Avocado', match: '🥑' },
    { id: 'peas', item: 'Peas', match: '🫛' },
    { id: 'bean', item: 'Bean', match: '🫘' },
    { id: 'ginger', item: 'Ginger', match: '🫚' },
  ];
}

export function generateVehicleQuestions() {
  const vehicles = [
    ['Car', '🚗'], ['Bus', '🚌'], ['Bike', '🚲'], ['Train', '🚂'],
    ['Truck', '🚛'], ['Boat', '🚤'], ['Airplane', '✈️'], ['Helicopter', '🚁'],
    ['Motorcycle', '🏍️'], ['Scooter', '🛵'], ['Ambulance', '🚑'], ['Fire Truck', '🚒'],
    ['Police Car', '🚔'], ['Taxi', '🚕'], ['Van', '🚐'], ['Bicycle', '🚲'],
    ['Subway', '🚇'], ['Ship', '🚢'], ['Rocket', '🚀'], ['Spaceship', '🛸'],
    ['Tractor', '🚜'], ['Forklift', '🏗️'], ['Tank', '🪖'], ['Canoe', '🛶'],
    ['Yacht', '🛥️'], ['Ferry', '⛴️'], ['Jet', '🛩️'], ['Hot Air Balloon', '🎈'],
    ['Cable Car', '🚡'], ['Steam Train', '🚃'],
  ];
  const shuffleArray = (a) => [...a].sort(() => Math.random() - 0.5);
  const allNames = vehicles.map(v => v[0]);
  return vehicles.map(([name, emoji]) => {
    const opts = shuffleArray(allNames.filter(n => n !== name)).slice(0, 3);
    const options = shuffleArray([name, ...opts]);
    return { question: `What vehicle is this?`, options, correctIndex: options.indexOf(name), emoji };
  });
}

