let trie;

class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.senses = null;
  }
}
class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word, senses) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
    node.senses = senses;
  }
  search(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) return false;
      node = node.children[char];
    }
    return node.isEndOfWord;
  }
  searchInSenses(searchTerm) {
    const searchRecursive = (node) => {
      if (node.isEndOfWord && node.senses) {
        for (let sense of node.senses) {
          const words = sense.split(" ");
          if (words.some(word => word.length > 2 && (word === searchTerm))) { //|| word.startsWith(searchTerm)
            return true;
          }
        }
      }
      for (let child in node.children) {
        if (searchRecursive(node.children[child])) {
          return true;
        }
      }
      return false;
    };
    return searchRecursive(this.root);
  }
  getSenses(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) return null;
      node = node.children[char];
    }
    return node.isEndOfWord ? node.senses : null;
  }
}
// --------load data
self.onmessage = async function (e) {
  const { type, data, word, modifiers, chunkSize = 1000 } = e.data;
  
  if (type === "initialize") {
    trie = new Trie();
    const words = Object.keys(data);
    const totalWords = words.length;
    let currentIndex = 0;
    while (currentIndex < totalWords) {
      const chunk = words.slice(currentIndex, currentIndex + chunkSize);
      chunk.forEach((word) => {
        trie.insert(word, data[word].senses);
      });
      currentIndex += chunkSize;
      self.postMessage({
        type: "progress",
        progress: (currentIndex / totalWords) * 100,
      });
    }
    self.postMessage({ type: "insertComplete" });
  }

  if (type === "search") {
    let modifiedWord = word;
    if (modifiedWord.endsWith("े")) {
      modifiedWord = modifiedWord.slice(0, -1) + "ु";
    }
    let exists = trie.search(word) || trie.search(word + "ु") || trie.search(modifiedWord) || trie.search(removeNepaliWords(word));
    if (!exists) {
      exists = trie.searchInSenses(word) || trie.searchInSenses(word + "ु") || trie.searchInSenses(modifiedWord) || trie.searchInSenses(removeNepaliWords(word));
    }
    if (!exists) {
      exists = await generateCombinations(word, modifiers);
      exists = processWord(word, exists);
    }
    self.postMessage({ type: "searchResult", exists, word });
    self.postMessage({ type: "wordFinished", word }); 
  }
  
  if (type === "getSenses") {
    let modifiedWord = word;
    if (modifiedWord.endsWith("े")) {
      modifiedWord = modifiedWord.slice(0, -1) + "ु";
    }
    const senses = trie.getSenses(word) || trie.getSenses(word + "ु") || trie.getSenses(modifiedWord) || trie.getSenses(removeNepaliWords(word));
    self.postMessage({ type: "sensesResult", senses, word });
  }
};
// -------------make changes on word
const suffixes =  [
  'ले', 'लाई', 'मा', 'का', 'को', 'कि', 'की', 'बाट', 'होस्', 'हरू', 'सँग', 'द्वारा', 'हरूको',
  'हरूका', 'हरूमा', 'हरूलाई', 'हरूले', 'हरूबाट', 'हरूसँग', 'हरूद्वारा', 'सँगको',"सँगका","सँगकि","सँगकी"
];
function generateCombinations(word, suffixes) {
  const combinations = suffixes.map(suffix => word + suffix);
  return combinations;
}
function processWord(word, arrayData) {
  suffixes.sort((a, b) => b.length - a.length);
  let foundSuffix = null;
  for (const suffix of suffixes) {
    if (word.endsWith(suffix)) {
      foundSuffix = suffix;
      break; 
    }
  }
  if (foundSuffix) {
    arrayData = arrayData.map(sense => sense + foundSuffix);
  }
  return arrayData;
}
function removeNepaliWords(word) {
  if (word.length > 3) {
    suffixes.sort((a, b) => b.length - a.length);
    for (const suffix of suffixes) {
      if (word.endsWith(suffix)) {
        word = word.replace(new RegExp(`${suffix}$`, 'g'), '');
        break; 
      }
    }
  }
  return word;
}
async function singleModifier(word, modifiers) {
  let combinations = new Set();
  for (let mod1 of modifiers) {
    for (let i = 1; i <= word.length; i++) {
      const modifiedWord = word.slice(0, i) + mod1 + word.slice(i);
      if (trie.search(modifiedWord)) {
        combinations.add(modifiedWord);
        const swapModifierCheck = await getSwappedWord(modifiedWord);
        if (swapModifierCheck.length > 0) { 
          swapModifierCheck.forEach(item => combinations.add(item));
        }
      }
    }
  }
  return Array.from(combinations);
}
async function doubleModifier(word, modifiers) {
  let combinations = new Set();
  for (let mod1 of modifiers) {
    for (let mod2 of modifiers) {
      for (let i = 1; i <= word.length; i++) {
        for (let j = 1; j <= word.length; j++) {
          if (i === j) continue;
          let modifiedWord = word.slice(0, i) + mod1 + word.slice(i);
          modifiedWord =
            modifiedWord.slice(0, j) + mod2 + modifiedWord.slice(j);
          if (trie.search(modifiedWord)) {
            combinations.add(modifiedWord);
          }
        }
      }
    }
  }
  return Array.from(combinations);
}

async function tripleModifier(word, modifiers) {
  let combinations = [];
  for (let i = 1; i <= word.length; i++) {
    for (let j = 0; j < modifiers.length; j++) {
      for (let k = 0; k < modifiers.length; k++) {
        for (let l = 0; l < modifiers.length; l++) {
          const modifiedWord =
            word.slice(0, i) +
            modifiers[j] +
            word.slice(i, i + 1) +
            modifiers[k] +
            word.slice(i + 1) +
            modifiers[l];
          if (trie.search(modifiedWord)) {
            combinations.push(modifiedWord);
          }
        }
      }
    }
  }
  return combinations;
}
async function generateModifierSwaps(word, modifierPairs) {
  let results = new Set([word]); 
  function swapModifiers(currentWord) {
    let updated = false;
    modifierPairs.forEach(([mod1, mod2]) => {
      if (currentWord.includes(mod1)) {
        const swapped = currentWord.replace(new RegExp(mod1, "g"), mod2);
        if (!results.has(swapped)) {
          results.add(swapped);
          updated = true; 
        }
      }
      if (currentWord.includes(mod2)) {
        const swapped = currentWord.replace(new RegExp(mod2, "g"), mod1);
        if (!results.has(swapped)) {
          results.add(swapped);
          updated = true;
        }
      }
    });
    if (updated) {
      [...results].forEach(word => swapModifiers(word));
    }
  }
  swapModifiers(word);
  return Array.from(results);
}
async function getSwappedWord(word) {
  let combinations = [];
  const swapModifiers = [
    ["ि", "ी"],["ु", "ू"],["ै", "ौ"],
    ["ु", "े"],["े", "ो"],["ा","ो"],
    ["ँ", "ं"],["ृ", "ॄ"],["ङ्", "ं"],
    ["ङ्", "ँ"],["इ", "ई"],["उ", "ऊ"],
    ["ब", "व"],["ऐ", "ए"],["ए","य"],
    ["श", "स"],["श", "ष"],["ष", "स"],
    ["श्री", "श्रि"],["ण", "न"],["त", "ट"],
    ["थ", "ठ"],["द", "ड"],["ध", "ढ"],
  ];
  const swapModifiersCom = await generateModifierSwaps(word, swapModifiers);
  if (swapModifiersCom.length > 0) {
    swapModifiersCom.forEach((newWord) => {
      if (trie.search(newWord)) {
        combinations.push(newWord);
      }
    });
    return combinations;
  }
}
async function splitAndCompare(word) {
  const chars = Array.from(word);
  const result = [];
  for (let i = 1; i < chars.length; i++) {
    const part1 = chars.slice(0, i).join("");
    const part2 = chars.slice(i).join("");
    if (part1.length > 2 && part2.length > 2) {
      if (trie.search(part1) && trie.search(part2)) { 
        result.push(`${part1} ${part2}`);
      }
    }
  }
  return result; 
}
async function alterModifierAndMakeCombination(word) {
  const results = new Set();
  const modifiers = [
    "ा","ि","ी", "ु", "ू","े","ै",
    "ो","ौ","ं","ः","ृ", "ॄ","ॢ","ॣ","ँ","्","र्","्ध",
  ];
  const chars = [...word];
  const isModifier = (char) => modifiers.includes(char);
  const modifierIndexes = chars
      .map((char, index) => (isModifier(char) ? index : -1))
      .filter(index => index !== -1);
  async function generateCombinationsWithRemovedModifiers(indexesToRemove) {
    const newWord = chars
        .filter((_, index) => !indexesToRemove.includes(index))
        .join('');
    const checkWordExist = await singleModifier(newWord, modifiers); 
    if (checkWordExist.length > 0) {
      checkWordExist.forEach(item => results.add(item));
    }
  }
  const len = modifierIndexes.length;
  for (let i = 0; i < len; i++) {
    await generateCombinationsWithRemovedModifiers([modifierIndexes[i]]);
    for (let j = i + 1; j < len; j++) {
      await generateCombinationsWithRemovedModifiers([modifierIndexes[i], modifierIndexes[j]]);
      for (let k = j + 1; k < len; k++) {
        await generateCombinationsWithRemovedModifiers([modifierIndexes[i], modifierIndexes[j], modifierIndexes[k]]);
      }
    }
  }
  await generateCombinationsWithRemovedModifiers([]);
  return results;
}
// --------return all possible found word
async function generateCombinations(word, modifiers) {
  let combinations = new Set(); // Use a Set to store unique values
  const swapModifiersCom = await getSwappedWord(word);
  swapModifiersCom.forEach(combination => combinations.add(combination));
  if (combinations.size >= 5) return Array.from(combinations).slice(0, 5);  

  const singleCombinations = await singleModifier(word, modifiers);
  singleCombinations.forEach(combination => combinations.add(combination));
  if (combinations.size >= 5) return Array.from(combinations).slice(0, 5);  

  const doubleCombinations = await doubleModifier(word, modifiers);
  doubleCombinations.forEach(combination => combinations.add(combination));
  if (combinations.size >= 5) return Array.from(combinations).slice(0, 5); 

  const tripleCombinations = await tripleModifier(word, modifiers);
  tripleCombinations.forEach(combination => combinations.add(combination));
  if (combinations.size >= 5) return Array.from(combinations).slice(0, 5);  

  let filterWord = removeNepaliWords(word);
  const filterSwapModierWord = await getSwappedWord(filterWord);
  filterSwapModierWord.forEach(combination => combinations.add(combination));
  if (combinations.size >= 5) return Array.from(combinations).slice(0, 5); 

  const splitedWord = await splitAndCompare(filterWord);
  splitedWord.forEach(combination => combinations.add(combination));
  if (combinations.size >= 5) return Array.from(combinations).slice(0, 5);  

  const alteringModifier = await alterModifierAndMakeCombination(filterWord);
  alteringModifier.forEach(combination => combinations.add(combination));
  if (combinations.size >= 5) return Array.from(combinations).slice(0, 5);  

  return Array.from(combinations).slice(0, 5);
}