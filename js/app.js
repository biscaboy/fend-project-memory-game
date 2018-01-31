/**
*	app.js - Memory Card Matching Game
*   Author:  David J. Dickinson
*   Contact: djdlearn@gmail.com
*
*	Javascript engine for the Memory Game.
*/

/**
*	Class: Scoreboard
* 	@constructor:
* 	@description: Tracks and displays player moves, stars and game timer.
*/
const Scoreboard = function() {
	this.counterElem = document.querySelector('.moves');
	this.starsElem = document.querySelector('.stars');
	this.timerElem = document.querySelector('.timer');
	this.clockInterval = null;
	this.moves = 0;
	this.elapsedTime = 0;
	this.matches = 0;
}

/**
* 	@description: provides the elapsed time from the start of the game
* 	@returns: a formatted string in minutes and seconds (mm:ss).
*/
Scoreboard.prototype.getGameDuration = function() {
	const mins = Math.floor(this.elapsedTime / 60);
	let secs = Math.floor(this.elapsedTime % 60);
	if (secs < 10) {
		secs = '0' + secs;
	}
	return mins + ':' + secs;
}

/**
* 	@description: Begins an Interval that counts the game time,
*	displays it and updates it.
*/
Scoreboard.prototype.startClock = function() {
	this.elapsedTime = 0;
	this.matches = 0;
	this.timerElem.innerHTML = '0:00';
	clearInterval(this.clockInterval);
	this.clockInterval = setInterval(function(sb) {
		// get the current duration time and display it
		sb.elapsedTime += 1;
		sb.timerElem.innerHTML = sb.getGameDuration();
	}, 1000, this);
}

/**
* 	@description: Stops the game clock
*/
Scoreboard.prototype.stopClock = function() {
	clearInterval(this.clockInterval);
}

/**
* 	@description: Updates the scoreboard with a move.
*	A move consists of turing over two cards.
*/
Scoreboard.prototype.incrememntMoves = function() {
	this.moves++;
	this.counterElem.innerHTML = this.moves;
	// remove stars depending on the players performance
	// rules for removing stars
	// 1.  wait at least 6 moves before checking, then check other move
	// 2.  if the ratio of moves to matched cards is ever less than 25% remove a star
	// document.querySelector('.success-ratio').innerHTML = Math.floor((this.matches / this.moves) * 100) + '%';
	if (this.moves > 6 && this.moves % 2 == 0 && (this.matches / this.moves < 0.25)) {
		const starToRemove = document.querySelector('.stars li');
		if (starToRemove){
			starToRemove.parentElement.removeChild(starToRemove);
		}
	}
}

/**
* 	@description: Updates by one the matches count.
* 	A match is made when two cards of with the same
*	symbol are turned over and displayed.
*/
Scoreboard.prototype.incrementMatches = function() {
	this.matches++;
}

/**
* 	@description: Accessor method to the current number of matched pairs of cards.
* 	@returns: the latest matches count saved in the scoreboard.
*/
Scoreboard.prototype.getMatches = function() {
	return this.matches;
}

/**
* 	@description:  Begins the game by clearing the number of moves
*	and starting the clock.
*/
Scoreboard.prototype.startGame = function() {
	this.moves = 0;
	this.counterElem.innerHTML = this.moves;
	this.startClock();
}

/**
* 	@description:  Stops the game clock, and displays a modal Congratulations message.
* 	@param:
* 	@returns:
*/
Scoreboard.prototype.stopGame = function () {
	this.stopClock();
	let rank = 'seeker';
	const stars = document.querySelectorAll('.stars li');
	switch (stars.length) {
		case 3:
			rank = 'guru';
			break;
		case 2:
			rank = 'master'
			break;
		case 1:
			rank = 'ninja';
	}
	document.querySelector('.game-ranking').innerHTML = rank;
	// display modal with winning stats.
	document.querySelector('.game-over-stats-moves').innerHTML = this.moves;
	document.querySelector('.game-over-stats-time').innerHTML = this.getGameDuration();
	const starsMsg = (stars.length > 0) ? stars.length : `No stars earned this round`;
	document.querySelector('.game-over-stats-stars').innerHTML = starsMsg;
	$('#game-over-modal').modal();
}

/**
* 	Class: Card
*	@constructor
* 	@description: Represents a memory card on the playing board.
** 	A Card has the following properties:
* 	symbol - The symbol to match
* 	state - closed (-1), open (0), matched (1)
*	elem - a DOM Element representing this card (a list item)
* 	parentNode - A reference to the card's parent node - (the game board).
*/
const Card = function (id, symbol, parent){
	this.parentNode = parent;
	this.symbol = symbol;
	this.state = this.STATE_HIDDEN; // init closed
	const e = document.createElement(this.SYMBOL_ELEMENT_TYPE);
	e.className = this.FA_PREFIX + symbol;
	this.elem = document.createElement(this.CARD_ELEMENT_TYPE);
	this.elem.className = this.CLASS_CARD;
	this.elem.appendChild(e);
};

// static constants for the class.
Card.prototype.CLASS_CARD = 'card';
Card.prototype.CLASS_OPEN = 'open';
Card.prototype.CLASS_SHOW = 'show';
Card.prototype.STATE_SHOWING = 0;
Card.prototype.STATE_HIDDEN = -1;
Card.prototype.STATE_MATCHED = 1;
Card.prototype.SYMBOL_ELEMENT_TYPE = 'i';
Card.prototype.CARD_ELEMENT_TYPE = 'li';
Card.prototype.FA_PREFIX = 'fa fa-';


/**
* @description The symbols to display on the front of the card.
* The symbols correspond to FontAwesome characters.
* The number of symbols in this list will also
* determine how many cards will be displayed on the board
*/
Card.prototype.symbols = [
	'anchor',
	'bicycle',
	'bolt',
	'bomb',
	'cube',
	'diamond',
	'leaf',
	'paper-plane-o'
];

/**
*	@description: Indicates if the card is currently showing on the board.
* 	@returns  {boolean}  true if showing otherwise false.
*/
Card.prototype.isShowing = function () {
	return this.state === this.STATE_SHOWING;
}

/**
* 	@description: Indicates if the card is currently hidden or facing down on the board
* 	@returns {boolean} true if hidden, otherwise false.
*/
Card.prototype.isHidden = function () {
	return this.state === this.STATE_HIDDEN;
}

/**
* 	@description:  Indicates if the card has been matched in a pair.
* 	@returns {boolean} true if matched, otherwise false.
*/
Card.prototype.isMatched = function () {
	return this.state === this.STATE_MATCHED;
}


/**
*   @description: Compares symbols on the cards and determines a match.
*  	If the cards match, update both cards state to "matched";
* 	@param {Card} the card to compare to this Card.
* 	@returns {boolean} true if the cards match, false if not.
*/
Card.prototype.matches = function(otherCard) {
	let match = false;
	if (this.symbol === otherCard.symbol) {
		match = true;
		this.state = this.STATE_MATCHED;
		otherCard.state = otherCard.STATE_MATCHED;
	}
	return match;
};

/*
* 	@description: Appends the given class name to the end of the existing class list.
* 	@param {string} the class to add to the class list for of the Card.
* 	@returns:
*/
Card.prototype.addClass = function(classNameToAdd) {
	const arr = this.elem.className.split(" ");
    if (arr.indexOf(classNameToAdd) == -1) {
        this.elem.className += " " + classNameToAdd;
    }
};

/**
* 	@description: Flip the card around to display on the game board.
*/
Card.prototype.show = function (){
	if (this.isHidden()){
		this.addClass(this.CLASS_OPEN);
		this.addClass(this.CLASS_SHOW);
		this.state = this.STATE_SHOWING;
	}
};

/**
* 	@description: Flip the card over to a hidden state
*/
Card.prototype.hide = function (){
	// TODO: animate the cards
	this.elem.className = this.CLASS_CARD;
	this.state = this.STATE_HIDDEN;

}

/*
*  	@description: Create a list that holds all of your cards
*	Loops through the set of symbols and creates
* 	a pair of cards for each symbol in the stack
* 	@param {Node} the DOM Node to use as a parent to display Card in the DOM.
* 	@returns:
*/
function createCards(parentNode) {
	const cards = [];
	const len = Card.prototype.symbols.length;
	for (let i = 0; i < len; i++){
		// create a pair of identical cards and save them
		let type = Card.prototype.symbols[i];
		cards.push(
			new Card(i, type, parentNode),
			new Card(i + len, type, parentNode)
		);
	}
	return cards;
}

/*
* 	@description: randomly shuffles the elements of a given array
*	Shuffle function from http://stackoverflow.com/a/2450976
* 	@param: the array whose contents will be shuffled.
* 	@returns: the shuffled array
*/
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
* 	Set up the game by creating cards and shuffling them.
*   Then display the cards on the board and start the game.
* 	@constructor:
* 	@description:
* 	@param:
* 	@returns:
*/
function initialize() {

	const fragment = document.createDocumentFragment();

	// remove existing cards
	while (deckNode.firstChild) {
		deckNode.removeChild(deckNode.firstChild);
	}
	deckNode.addEventListener('click', respondToClick);

	// Create a new deck of cards to display for the game
	const cards = createCards(deckNode);
	shuffle(cards);

	// Build up the card elements
	cards.forEach(function(card) {
	    fragment.appendChild(card.elem);
	});

	// Add the cards to the page.
	deckNode.appendChild(fragment);

	// reset the matched card list.
	matchedCards.length = 0;

	// reset the card to match.
	cardToMatch = null;

	// start a new game which reset the scoreboard
	scoreboard.startGame();

	return cards;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/**
* 	@constructor:
* 	@description:
* 	@param:
* 	@returns:
*/
const respondToClick = function(evt) {
	if (evt.target.nodeName === 'LI') {
		for (let i = 0; i < cards.length; i++){
			// find the card that was clicked
			if (evt.target === cards[i].elem && !cards[i].isMatched()){
				// show the card
				cards[i].show();
				//  is there a card to match? (make sure it's not the same card)
				if (cardToMatch && (cardToMatch !== cards[i])) {
					// check for a match
					if (cards[i].matches(cardToMatch)){
						// TODO: animate the matched cards
						matchedCards.push(cards[i]);
						scoreboard.incrementMatches();
					} else {
						// don't let the player click on anything else while we display cards
						deckNode.removeEventListener('click', respondToClick);
						// hide the cards after 1 sec and start listening again.
						setTimeout(function (c1, c2) {
							c1.hide();
							c2.hide();
							deckNode.addEventListener('click', respondToClick);
						}, 1000, cards[i], cardToMatch);
					}
					// we tried to match so increment the scoreboard and reset.
					scoreboard.incrememntMoves();
					cardToMatch = null;
					// if all the cards are matched stop the game!
					if (scoreboard.getMatches() == Card.prototype.symbols.length){
						scoreboard.stopGame();
					}
				} else {
					// saving the card for matching
 					cardToMatch = cards[i];
				}
				// our work is done here
				break;
			}
		}
	}
}

/**
* 	@constructor:
* 	@description:
* 	@param:
* 	@reMoves:
*/
const resetGame = function(evt) {
	cards = initialize();
}

/**
*	The scoreboard for the game
*/
const scoreboard = new Scoreboard();

/**
* 	Deck of cards - all cards hang off this node
*/
const deckNode = document.querySelector('.deck');

/*
* 	A list of cards that the player has matched during the game
*/
const matchedCards = [];

/**
* 	The card selected by the player to compare for a match.
*/
let cardToMatch = null;

/**
*	The set of cards for this game.
*/
let cards = initialize();

// listens for clicks on the restart button to begin a new game.
document.querySelector('.restart').addEventListener('click', resetGame);
