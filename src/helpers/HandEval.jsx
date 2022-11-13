// hand = [cards]
// card = {number: ..., type: ... backwards: ...};
// handInfo = {rank, cards, highestCard}

// lower = better rank
let numberRanking = {
  A: 1,
  K: 2,
  Q: 3,
  J: 4,
  10: 5,
  9: 6,
  8: 7,
  7: 8,
  6: 9,
  5: 10,
  4: 11,
  3: 12,
  2: 13,
};

let numberRankingAceAsOne = {
  ...numberRanking,
  A: 14,
};

export function getRankOfHandOfFive(hand) {
  hand = sortHand(hand);
  return getHighestRank(hand);
}

export function evaluateHand(hand) {
  // make sets of 5 out the 7 element in hand (combinations (21 of them))
  // for each check from isRoyalFlush to isPair, then get the hand with highest ranking, return that ranking

  let allHands = [];
  generateCombinations(sortHand(hand), [], 5, allHands);
  let highestHandInfo = {
    rank: getHighestRank(allHands[0]),
    cards: allHands[0],
    highestCard: getHighestCard(allHands[0]),
  };

  // currentHand should be sorted automatically since the main hand is sorted before generation combinations
  for (let currentHand of allHands) {
    let currentHandInfo = {
      rank: getHighestRank(currentHand),
      cards: currentHand,
      highestCard: getHighestCard(currentHand),
    };
    if (compareHandInfos(currentHandInfo, highestHandInfo)) {
      highestHandInfo = { ...currentHandInfo };
    }
  }

  return highestHandInfo;
}

function generateCombinations(elementsLeft, currentArray, wantedArraySize, storage) {
  if (currentArray.length == wantedArraySize) {
    storage.push(currentArray);
    return;
  }
  if (elementsLeft.length == 0) {
    return;
  }

  let newElementsLeft = [...elementsLeft];
  let element = newElementsLeft.shift();

  let newCurrentArrayLeft = [...currentArray, element];
  let newCurrentArrayRight = [...currentArray];

  generateCombinations(newElementsLeft, newCurrentArrayLeft, wantedArraySize, storage);
  generateCombinations(newElementsLeft, newCurrentArrayRight, wantedArraySize, storage);
}

// returns true if a > b, false if a < b
export function compareHandInfos(handInfoA, handInfoB) {
  if (handInfoA.rank < handInfoB.rank) {
    return true;
  }
  if (handInfoA.rank == handInfoB.rank) {
    return compareRank(handInfoA.rank, handInfoA.cards, handInfoB.cards);
  }
  return false;
}

// make smaller with functions
// returns true if a > b, false if a < b
function compareRank(rank, handA, handB) {
  let setNumberA;
  let setNumberB; 
  switch (rank) {
    case 1:
      return true; // tie!
    case 2:
    case 4:
    case 5:
    case 6:
    case 10:
      return numberRanking[getHighestCard(handA).number] < numberRanking[getHighestCard(handB).number];
    case 3:
      setNumberA = numberRanking[getHighestSetNumber(handA, 4, 1)];
      setNumberB = numberRanking[getHighestSetNumber(handB, 4, 1)];
      if (setNumberA < setNumberB) {
        return true;
      }
      if (setNumberB > setNumberA) {
        return false;
      }
      return numberRanking[getHighestCard(handA).number] < numberRanking[getHighestCard(handB).number];
    case 7:
      setNumberA = numberRanking[getHighestSetNumber(handA, 3, 1)];
      setNumberB = numberRanking[getHighestSetNumber(handB, 3, 1)];
      if (setNumberA < setNumberB) {
        return true;
      }
      if (setNumberB > setNumberA) {
        return false;
      }
      return numberRanking[getHighestCard(handA).number] < numberRanking[getHighestCard(handB).number];
    case 8:
      setNumberA = numberRanking[getHighestSetNumber(handA, 2, 1)];
      setNumberB = numberRanking[getHighestSetNumber(handB, 2, 1)];
      if (setNumberA < setNumberB) {
        return true;
      }
      if (setNumberB > setNumberA) {
        return false;
      }
      setNumberA = numberRanking[getHighestSetNumber(handA, 2, 2)];
      setNumberB = numberRanking[getHighestSetNumber(handB, 2, 2)];
      if (setNumberA < setNumberB) {
        return true;
      }
      if (setNumberB > setNumberA) {
        return false;
      }
      return numberRanking[getHighestCard(handA).number] < numberRanking[getHighestCard(handB).number];
    case 9:
      setNumberA = numberRanking[getHighestSetNumber(handA, 2, 1)];
      setNumberB = numberRanking[getHighestSetNumber(handB, 2, 1)];
      if (setNumberA < setNumberB) {
        return true;
      }
      if (setNumberB > setNumberA) {
        return false;
      }
      return numberRanking[getHighestCard(handA).number] < numberRanking[getHighestCard(handB).number];
  }
}

function getHighestSetNumber(hand, number, place) {
  let handNumbers = hand.map(card => card.number);
  let numberGroup = getNumberGroup(handNumbers);

  let numberGroupWithNumber = Object.keys(numberGroup).filter(num => numberGroup[num] == number);

  let numberGroupWithNumberSorted = numberGroupWithNumber.sort((a, b) => numberRanking[a] - numberRanking[b]);

  return numberGroupWithNumberSorted[place];

  // let highest = 0;
  // for(let num of Object.keys(numberGroup)) {
  //   if(numberGroup[num] == number) {
  //     if(numberRanking[num] < (numberRanking[highest] ?? 14)) {
  //       highest = num
  //     }
  //   }
  // }
  // return highest;
}

function getHighestRank(hand) {
  let handNumbers = hand.map(card => card.number);
  let handTypes = hand.map(card => card.type);

  if (isRoyalFlush(hand, handNumbers, handTypes)) {
    return 1;
  }
  if (isStraightFlush(hand, handNumbers, handTypes)) {
    return 2;
  }
  if (isFourOfAKind(hand, handNumbers, handTypes)) {
    return 3;
  }
  if (isFullHouse(hand, handNumbers, handTypes)) {
    return 4;
  }
  if (isFlush(hand, handNumbers, handTypes)) {
    return 5;
  }
  if (isStraight(hand, handNumbers, handTypes)) {
    return 6;
  }
  if (isThreeOfAKind(hand, handNumbers, handTypes)) {
    return 7;
  }
  if (isTwoPair(hand, handNumbers, handTypes)) {
    return 8;
  }
  if (isPair(hand, handNumbers, handTypes)) {
    return 9;
  }
  return 10;
}

// must be ordered from highest to lowest
function getHighestCard(hand) {
  return hand[0];
}

function sortHand(hand, aceAsOne) {
  let sorter = aceAsOne
    ? (a, b) => numberRankingAceAsOne[a.number] - numberRankingAceAsOne[b.number]
    : (a, b) => numberRanking[a.number] - numberRanking[b.number];
  return hand.sort(sorter);
}

function isRoyalFlush(hand, handNumbers, handTypes) {
  // isFlush(hand) and is ['A', 'K', 'Q', 'J', 10]
  for (let number of ['A', 'K', 'Q', 'J', 10]) {
    if (!handNumbers.includes(number)) {
      return false;
    }
  }
  return isFlush(hand, handNumbers, handTypes);
}

// expects sorted hand based on rank small > big (A, K, Q .. )
function isStraightFlush(hand, handNumbers, handTypes) {
  // isFlush(hand) and isStraight(hand)
  return isFlush(hand, handNumbers, handTypes) && isStraight(hand, handNumbers, handTypes);
}

function isFourOfAKind(hand, handNumbers, handTypes) {
  // count for each number the occurence, if one occurence is 4 then true
  let numberGroup = getNumberGroup(handNumbers);

  return isInNumberGroup(numberGroup, 4, 1);
}

// hand.length > 0
// expects sorted hand based on rank small > big (A, K, Q .. )
function isFullHouse(hand, handNumbers, handTypes) {
  // three of kind and pair
  return (
    (isThreeOfAKind([...hand.slice(0, 3)], [...handNumbers.slice(0, 3)]) &&
      isPair([...hand.slice(3, 5)], [...handNumbers.slice(3, 5)])) ||
    (isPair([...hand.slice(0, 2)], [...handNumbers.slice(0, 2)]) &&
      isThreeOfAKind([...hand.slice(2, 5)], [...handNumbers.slice(2, 5)]))
  );
}

// hand.length > 0
function isFlush(hand, handNumbers, handTypes) {
  // check if all the types are the same as the first one
  let type = handTypes[0];
  for (let i = 1; i < hand.length; i++) {
    if (handTypes[i] != type) {
      return false;
    }
  }
  return true;
}

// hand.length > 0
function isStraight(hand, handNumbers, handTypes) {
  return checkIfStraight(hand, false) || checkIfStraight(hand, true);
}

function checkIfStraight(hand, aceAsOne) {
  hand = sortHand(hand, aceAsOne);
  let handNumbers = hand.map(card => card.number);

  if (aceAsOne) {
    for (let i = 1; i < hand.length; i++) {
      if (numberRankingAceAsOne[handNumbers[i]] != numberRankingAceAsOne[handNumbers[i - 1]] + 1) {
        return false;
      }
    }
  } else {
    for (let i = 1; i < hand.length; i++) {
      if (numberRanking[handNumbers[i]] != numberRanking[handNumbers[i - 1]] + 1) {
        return false;
      }
    }
  }

  return true;
}

function isThreeOfAKind(hand, handNumbers, handTypes) {
  let numberGroup = getNumberGroup(handNumbers);

  return isInNumberGroup(numberGroup, 3, 1);
}

// fails if there are 3 or more of the same card, but that shouldn't be tested since isThreeOfAKind is checked before isTwoPair
function isTwoPair(hand, handNumbers, handTypes) {
  let numberGroup = getNumberGroup(handNumbers);

  return isInNumberGroup(numberGroup, 2, 2);
}

function isPair(hand, handNumbers, handTypes) {
  let numberGroup = getNumberGroup(handNumbers);

  return isInNumberGroup(numberGroup, 2, 1);
}

function getNumberGroup(handNumbers) {
  let numberGroup = {};
  handNumbers.reduce((group, number) => {
    group[number] = group[number] ? group[number] + 1 : 1;
    return group;
  }, numberGroup);
  return numberGroup;
}

function isInNumberGroup(numberGroup, number, amount) {
  let currentAmount = 0;
  for (let num of Object.keys(numberGroup)) {
    if (numberGroup[num] == number) {
      currentAmount++;
    }
  }
  return currentAmount >= amount;
}


// Old methods for hand evaluation

// // lower = better rank
// let numberRanking = {
//     'A': 1,
//     'K': 2,
//     'Q': 3,
//     'J': 4,
//     10: 5,
//     9: 6,
//     8: 7,
//     7: 8,
//     6: 9,
//     5: 10,
//     4: 11,
//     3: 12,
//     2: 13,
//   }
  
//   function evaluateHand(hand) {
  
//     // make sets of 5 out the 7 element in hand (combinations (21 of them))
//     // for each check from isRoyalFlush to isPair, then get the hand with highest ranking, return that ranking
  
//     let allHands = [];
//     generateCombinations(sortHand(hand), [], 5, allHands);
//     let highestHandInfo = {rank: getHighestRank(allHands[0]), cards: allHands[0], highestCard: getHighestCard(allHands[0])}
  
//     // currentHand should be sorted automatically since the main hand is sorted before generation combinations
//     for(let currentHand of allHands) {
//       let currentHandInfo = {rank: getHighestRank(currentHand), cards: currentHand, highestCard: getHighestCard(currentHand)};
//       if(compareHandInfos(currentHandInfo, highestHandInfo)) {
//         highestHandInfo = {...currentHandInfo};
//       }
//     }
  
//     return highestHandInfo;
//   }
  
//   function generateCombinations(elementsLeft, currentArray, wantedArraySize, storage) {
//     if(currentArray.length == wantedArraySize) {
//       storage.push(currentArray)
//       return;
//     }
//     if(elementsLeft.length == 0) {
//       return;
//     }
  
//     let newElementsLeft = [...elementsLeft]
//     let element = newElementsLeft.shift();
  
//     let newCurrentArrayLeft = [...currentArray, element]
//     let newCurrentArrayRight = [...currentArray]
  
//     generateCombinations(newElementsLeft, newCurrentArrayLeft, wantedArraySize, storage)
//     generateCombinations(newElementsLeft, newCurrentArrayRight, wantedArraySize, storage)
//   }
  
//   // returns true if a > b, false if a < b
//   function compareHandInfos(handInfoA, handInfoB) {
//     if(handInfoA.rank < handInfoB.rank) {
//       return true;
//     }
//     if(handInfoA.rank == handInfoB.rank) {
//       return compareRank(handInfoA.rank, handInfoA.cards, handInfoB.cards);
//     }
//     return false;
//   }
  
//   // FIX: should also do something if both highestRanking cards are the same, then look at the second highest etc
//   // returns true if a > b, false if a < b
//   function compareRank(rank, handA, handB) {
//     switch(rank) {
//       case 1: 
//               return true // tie!
//       case 2:
//       case 4:
//       case 5:
//       case 6:
//       case 10:
//               return numberRanking[getHighestCard(handA).number] < numberRanking[getHighestCard(handB).number]
//       case 3:
//               return numberRanking[getHighestSetNumber(handA, 4)] < numberRanking[getHighestSetNumber(handB, 4)]
//       case 7:
//               return numberRanking[getHighestSetNumber(handA, 3)] < numberRanking[getHighestSetNumber(handB, 3)]
//       case 8:
//       case 9:
//               return numberRanking[getHighestSetNumber(handA, 2)] < numberRanking[getHighestSetNumber(handB, 2)]
//     }
//   }
  
//   function getHighestSetNumber(hand, number) {
//     let handNumbers = hand.map(card => card.number);
//     let numberGroup = getNumberGroup(handNumbers);
  
//     let highest = 0;
//     for(let num of Object.keys(numberGroup)) {
//       if(numberGroup[num] == number) {
//         if(numberRanking[num] < (numberRanking[highest] ?? 14)) {
//           highest = num
//         }
//       }
//     }
//     return highest;
//   }
  
//   function getHighestRank(hand) {
//     let handNumbers = hand.map(card => card.number);
//     let handTypes = hand.map(card => card.type);
  
//     if(isRoyalFlush(hand, handNumbers, handTypes)) {
//       return 1;
//     }
//     if(isStraightFlush(hand, handNumbers, handTypes)) {
//       return 2;
//     }
//     if(isFourOfAKind(hand, handNumbers, handTypes)) {
//       return 3;
//     }
//     if(isFullHouse(hand, handNumbers, handTypes)) {
//       return 4;
//     }
//     if(isFlush(hand, handNumbers, handTypes)) {
//       return 5;
//     }
//     if(isStraight(hand, handNumbers, handTypes)) {
//       return 6;
//     }
//     if(isThreeOfAKind(hand, handNumbers, handTypes)) {
//       return 7;
//     }
//     if(isTwoPair(hand, handNumbers, handTypes)) {
//       return 8;
//     }
//     if(isPair(hand, handNumbers, handTypes)) {
//       return 9;
//     }
//     return 10;
//   }
  
//   // must be ordered from highest to lowest
//   function getHighestCard(hand) {
//     return hand[0]
//   }
  
//   function sortHand(hand) {
//     return hand.sort((a, b) => numberRanking[a.number] - numberRanking[b.number]) 
//   }
  
//   function isRoyalFlush(hand,  handNumbers, handTypes) {
//     // isFlush(hand) and is ['A', 'K', 'Q', 'J', 10]
//     for(let number of ['A', 'K', 'Q', 'J', 10]) {
//       if(!handNumbers.includes(number)) {
//         return false
//       }
//     }
//     return isFlush(hand, handNumbers, handTypes);
//   }
  
//   // expects sorted hand based on rank small > big (A, K, Q .. )
//   function isStraightFlush(hand,  handNumbers, handTypes) {
//     // isFlush(hand) and isStraight(hand)
//     return isFlush(hand, handNumbers, handTypes) && isStraight(hand, handNumbers, handTypes);
//   }
  
//   function isFourOfAKind(hand, handNumbers, handTypes) {
//     // count for each number the occurence, if one occurence is 4 then true
//     let numberGroup = getNumberGroup(handNumbers);
  
//     return isInNumberGroup(numberGroup, 4, 1);
//   }
  
//   // hand.length > 0
//   // expects sorted hand based on rank small > big (A, K, Q .. )
//   function isFullHouse(hand, handNumbers, handTypes) {
//     // three of kind and pair
//     return (isThreeOfAKind([...hand.slice(0, 3)], [...handNumbers.slice(0, 3)]) && isPair([...hand.slice(3, 5)], [...handNumbers.slice(3, 5)])) || 
//            (isPair([...hand.slice(0,2)], [...handNumbers.slice(0, 2)]) && isThreeOfAKind([...hand.slice(2, 5)], [...handNumbers.slice(2, 5)]))
//   }
  
//   // hand.length > 0
//   function isFlush(hand, handNumbers, handTypes) {
//     // check if all the types are the same as the first one
//     let type = handTypes[0];
//     for(let i = 1; i < hand.length; i++) {
//       if(handTypes[i] != type) {
//         return false;
//       }
//     }
//     return true;
//   }
  
//   // FIX: Should also consider ace as 1!
//   // hand.length > 0
//   // expects sorted hand based on rank small > big (A, K, Q .. )
//   function isStraight(hand, handNumbers, handTypes) {
//     for(let i = 1; i < hand.length; i++) {
//       if(numberRanking[handNumbers[i]] != numberRanking[handNumbers[i-1]] + 1) {
//         return false
//       }
//     }
//     return true;
//   }
  
//   function isThreeOfAKind(hand, handNumbers, handTypes) {
//     let numberGroup = getNumberGroup(handNumbers);
  
//     return isInNumberGroup(numberGroup, 3, 1);
//   }
  
//     // fails if there are 3 or more of the same card, but that shouldn't be tested since isThreeOfAKind is checked before isTwoPair
//   function isTwoPair(hand, handNumbers, handTypes) {
//     let numberGroup = getNumberGroup(handNumbers);
  
//     return isInNumberGroup(numberGroup, 2, 2);
//   }
  
//   function isPair(hand, handNumbers, handTypes) {
//     let numberGroup = getNumberGroup(handNumbers);
  
//     return isInNumberGroup(numberGroup, 2, 1);
//   }
  
//   function getNumberGroup(handNumbers) {
//     let numberGroup = {}
//     handNumbers.reduce((group, number) => {
//       group[number] = group[number] ? group[number] + 1 : 1;
//       return group
//     }, numberGroup)
//     return numberGroup
//   }
  
//   function isInNumberGroup(numberGroup, number, amount) {
//     let currentAmount = 0;
//     for(let num of Object.keys(numberGroup)) {
//       if(numberGroup[num] == number) {
//         currentAmount++;
//       }
//     }
//     return currentAmount >= amount;
//   }