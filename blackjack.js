// const getDeck = require('./createCardDeck');
const blackjackDeck = getDeck();

/**
 * Represents a card player (including dealer).
 * @constructor
 * @param {string} name - The name of the player
 */
class CardPlayer {
    constructor(name){
        this.name = name;
        this.hand = [];
    }

    drawCard(){
        this.hand.push(blackjackDeck[Math.floor(Math.random() * 52)]);
    };
};

// // CREATE TWO NEW CardPlayers
const dealer = new CardPlayer('Dealer'); // TODO
const player = new CardPlayer('Player'); // TODO

/**
 * Calculates the score of a Blackjack hand
 * @param {Array} hand - Array of card objects with val, displayVal, suit properties
 * @returns {Object} blackJackScore
 * @returns {number} blackJackScore.total
 * @returns {boolean} blackJackScore.isSoft
 */
const calcPoints = (hand) => {
    let total = 0;
    let isSoft = false;
    hand.forEach(card => {
        let newValue = total + card.val;
        if(newValue > 21 && card.displayVal === 'Ace'){
            newValue = total + 1;
        }else if(card.displayVal === 'Ace'){
            isSoft = true;
        }
        total = newValue;
    })
    return { total , isSoft }
}

/**
 * Determines whether the dealer should draw another card.
 * 
 * @param {Array} dealerHand Array of card objects with val, displayVal, suit properties
 * @returns {boolean} whether dealer should draw another card
 */
const dealerShouldDraw = (dealerHand) => {
    const hand = calcPoints(dealerHand);
    if(hand.total < 17){
        return true;
    }else if(hand.total === 17 && hand.isSoft){
        return true;
    }else{
        return false;
    }
}

/**
 * Determines the winner if both player and dealer stand
 * @param {number} playerScore 
 * @param {number} dealerScore 
 * @returns {string} Shows the player's score, the dealer's score, and who wins
 */
const determineWinner = (playerScore, dealerScore) => {
    let winner = 'Dealer';
    if (playerScore === dealerScore){
        return 'Player score: ' + playerScore + ', Dealer score: ' + dealerScore + ' Push';
    }
    if(playerScore > dealerScore){
        winner = 'Player';
    }
    return 'Player score: ' + playerScore + ', Dealer score: ' + dealerScore + ' Winner: ' + winner;
}

/**
 * Creates user prompt to ask if they'd like to draw a card
 * @param {number} count 
 * @param {string} dealerCard 
 */
const getMessage = (count, dealerCard) => {
  return `Dealer showing ${dealerCard.displayVal}, your count is ${count}.  Draw card?`
}

/**
 * Logs the player's hand to the console
 * @param {CardPlayer} player 
 */
const showHand = (player) => {
  const displayHand = player.hand.map((card) => card.displayVal);
  console.log(`${player.name}'s hand is ${displayHand.join(', ')} (${calcPoints(player.hand).total})`);
}

const visualizeHands = (player, dealer) => {
    var playerHand = document.getElementById("player-hand");
    const playerCards = player.hand.map(card => card.displayVal);
    playerHand.textContent = playerCards.join(' ');

    var dealerHand = document.getElementById("dealer-hand");
    const dealerCards = dealer.hand.map(card => card.displayVal);
    dealerHand.textContent = dealerCards.join(' ');
}

const immediateWin = (hand) => {
    if(calcPoints(hand).total === 21){
        return true;
    }else{
        return false;
    }
}

/**
 * Runs Blackjack Game
 */
const startGame = function() {
  player.drawCard();
  dealer.drawCard();
  player.drawCard();
  if(immediateWin(player.hand)){
    visualizeHands(player, dealer);
    return 'Player got blackjack!'
  };
  dealer.drawCard();
  if(immediateWin(dealer.hand)){
    visualizeHands(player, dealer);
    return 'Dealer got blackjack!'
  };
  visualizeHands(player, dealer);
  let playerScore = calcPoints(player.hand).total;
  showHand(player);
  //confirm(getMessage(playerScore, dealer.hand[0]))
  while (playerScore < 21 && confirm(getMessage(playerScore, dealer.hand[0]))) {
    player.drawCard();
    playerScore = calcPoints(player.hand).total;
    showHand(player);
    visualizeHands(player, dealer);
  }
  if (playerScore > 21) {
    return 'You went over 21 - you lose!';
  }
  console.log(`Player stands at ${playerScore}`);

  let dealerScore = calcPoints(dealer.hand).total;
  while (dealerScore < 21 && dealerShouldDraw(dealer.hand)) {
    dealer.drawCard();
    dealerScore = calcPoints(dealer.hand).total;
    showHand(dealer);
    visualizeHands(player, dealer);
  }
  if (dealerScore > 21) {
    return 'Dealer went over 21 - you win!';
  }
  console.log(`Dealer stands at ${dealerScore}`);

  return determineWinner(playerScore, dealerScore);
}

console.log(startGame());