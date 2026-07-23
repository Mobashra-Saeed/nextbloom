const fs = require('fs');

const missing = [
  '2chains_name_baby_pink_beaded.jpg',
  '2chains_name_black.jpg',
  '2chains_name_black_beaded.jpg',
  '2chains_name_mehroon_beaded.jpg',
  '2chains_name_pink.jpg',
  '2chains_name_pink_beaded.jpg',
  '2chains_name_purple_beaded.jpg',
  '2chains_name_white_beaded.jpg',
  '2chains_purple_butterfly_name.jpg',
  '3chains_black_name_bracelet.jpg',
  '3chains_mehroon_name_bracelet.jpg',
  '3chain_bubblegum_name_bracelet.jpg',
  '4chains_purple_name.jpg',
  'black_name_bracelet_forMen.jpg',
  'black_name_bracelet_Men.jpg',
  'black_pair_name_bracelet.jpg',
  'black_white_gajra.jpg',
  'butterfly_pendants.jpg',
  'chained_name_bracelet.jpg',
  'chained_name_bracelet2.jpg',
  'Chained_Pair_Bracelets.jpg',
  'charm_independnce_day_name_bracelet.jpg',
  'charm_name_bracelet_allcolors.jpg',
  'charm_name_bracelet_black.jpg',
  'crysal_Bracelets_Golden.jpg',
  'crystal_black.jpg',
  'fancy_independnce_day_name_bracelet.jpg',
  'flower_earrings.jpg',
  'flower_earrings_golden.jpg',
  'four_chain_name_bracelet_black.jpg',
  'Gajra_Set.jpg',
  'golden_sahary.jpg',
  'golden_stack.jpg',
  'letter_name_pendant.jpg',
  'mehroon_simple.jpg',
  'name_bracelet_pink.jpg',
  'name_initial_pendant.jpg',
  'pair_mehroon_name_bracelets.jpg',
  'phone_charm_yellow.jpg',
  'pink_phone_charm.jpg',
  'purlple_tulip_earrings.jpg',
  'purple_pair_name_bracelet.jpg',
  'rainbow_simple_name_bracelet.jpg',
  'simple_name_blue.jpg',
  'simple_name_golden.jpg',
  'simple_name_orange.jpg',
  'simple_name_purple.jpg',
  'simple_name_purple_with_silver_rings.jpg',
  'simple_name_purple_with_small_beads.jpg',
  'simple_name_white.jpg',
  'simple_name_white_crystal.jpg',
  'simple_pair_bracelets.jpg',
  'simple_pair_bracelets_silver_rings.jpg',
  'stack_black.jpg',
  'stack_white.jpg',
  'tasbih_pink.jpg',
  'tom_and__jerry_pendant.jpg',
  'Tulip_Black.jpg',
  'tulip_orange.jpg',
  'tulip_purple.jpg',
  'tulip_sky.jpg',
  'white_gajra.jpg',
  '_pinterest_independnce_day_name_bracelet.jpg'
];

const colorsList = [
  'baby pink', 'baby_pink', 'black white', 'black_white', 
  'black', 'white', 'pink', 'purple', 'purlple', 'mehroon', 
  'golden', 'yellow', 'orange', 'sky', 'blue', 'silver'
];

function titleCase(str) {
  // Replace underscores/spaces with spaces and make title case
  return str.split(' ').map(word => {
    if (/^[a-zA-Z]/.test(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    // Handle cases like 2chains -> 2-Chain or 2chains? Or 2-Chains?
    // Let's replace '2chains' -> '2-Chains' or '2 Chains' or '2-Chain'
    return word.replace(/^[a-z]/, c => c.toUpperCase()).replace(/([0-9])([a-z])/, (m, p1, p2) => p1 + '-' + p2.toUpperCase());
  }).join(' ');
}

// Ensure the rule is exactly followed:
// name: readable title from filename; underscores/spaces to spaces; title case.
// Move color token to trailing '(Color)' when present.
// Note: Let's make sure strings like "2chains" are title cased properly, e.g. "2-Chains" or "2-Chain".
// Let's implement titleCase to be robust:
function toReadableTitle(file) {
  let nameNoExt = file.substring(0, file.lastIndexOf('.'));
  if (nameNoExt.startsWith('_')) {
    nameNoExt = nameNoExt.slice(1);
  }
  
  // Replace underscores with spaces
  let normalized = nameNoExt.replace(/_+/g, ' ').trim();
  
  // Find color token
  let foundColor = null;
  const sortedColors = [...colorsList].sort((a,b) => b.length - a.length);
  for (let c of sortedColors) {
    let cSpace = c.replace(/_/g, ' ');
    let regex = new RegExp('\\b' + cSpace + '\\b', 'i');
    if (regex.test(normalized)) {
      foundColor = cSpace;
      normalized = normalized.replace(regex, '').replace(/\s+/g, ' ').trim();
      break;
    }
  }
  
  // clean up extra spaces
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  // Convert word to Title Case
  let words = normalized.split(' ');
  let titleWords = words.map(word => {
    // If the word starts with number followed by letters like '2chains'
    let m = word.match(/^([0-9]+)([a-zA-Z]+)(.*)$/);
    if (m) {
      // e.g. '2chains' -> '2-Chain'
      let num = m[1];
      let rest = m[2];
      let suffix = m[3] || '';
      let capRest = rest.charAt(0).toUpperCase() + rest.slice(1);
      // Strip 's' if chains? No, let's keep it mostly as is, just capitalized: e.g. 2-Chains or 2-Chain
      // Looking at original seeds: 2chain_butterfly_name_bracelet_black.jpg -> 2-Chain Butterfly Name Bracelet (Black)
      // 3chain_black.jpg -> 3-Chain Crystal Drop (Black)
      if (capRest.toLowerCase() === 'chains') {
        capRest = 'Chain';
      } else if (capRest.toLowerCase() === 'chain') {
        capRest = 'Chain';
      }
      return num + '-' + capRest + suffix;
    }
    
    // Normal capitalization of word
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  
  let baseName = titleWords.join(' ');
  if (foundColor) {
    let displayColor = foundColor;
    if (displayColor === 'purlple') displayColor = 'purple';
    // Title Case the display color
    let capColor = displayColor.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    baseName += ' (' + capColor + ')';
  }
  
  return baseName;
}

function getCategory(file) {
  let lowerName = file.toLowerCase();
  if (lowerName.includes('chain')) {
    return 'pinterest Name Bracelets';
  } else if (lowerName.includes('stack')) {
    return 'Stack Bracelets';
  } else if (lowerName.includes('pair')) {
    return 'Pair Bracelets';
  } else if (lowerName.includes('phone')) {
    return 'Phone Charms';
  } else if (lowerName.includes('earring') || lowerName.includes('jumka')) {
    return 'Earrings';
  } else if (lowerName.includes('gajra') || lowerName.includes('gajry')) {
    return 'Gajry';
  } else if (lowerName.includes('anklet')) {
    return 'Anklets';
  } else if (lowerName.includes('pendant')) {
    return 'pinterest Name Bracelets';
  } else {
    return 'Simple Bracelets';
  }
}

const objects = missing.map((file, idx) => {
  const idStr = String(31 + idx);
  const name = toReadableTitle(file);
  const category = getCategory(file);
  return {
    id: idStr,
    name: name,
    price: 500,
    imageURL: 'assets/images/products/' + file,
    category: category,
    inStock: true
  };
});

objects.forEach(obj => {
  console.log(`    { id: '${obj.id}', name: '${obj.name}', price: ${obj.price}, imageURL: '${obj.imageURL}', category: '${obj.category}', inStock: ${obj.inStock} },`);
});
