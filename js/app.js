/**
*	app.js - Memory Card Matching Game
*   Author:  David J. Dickinson
*   Contact: djdlearn@gmail.com
*
*	Javascript engine for the Memory Game.
*/

/**
* 	Class: Card
*
* 	Represents a memory card on the playing board.
*
* 	A Card has the following properties:
* 	symbol - The symbol to match
* 	state - closed (-1), open (0), matched (1)
*	elem - a DOM Element representing this card (a list item)
* 	parentNode - A reference to the card's parent node - (the game board).
*/
var Card = function (id, symbol, parent){
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
* The symbols to display on the front of the card.
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
*	State functions to hide the state flags.
*/
Card.prototype.isShowing = function () {
	return this.state === this.STATE_SHOWING;
}

Card.prototype.isHidden = function () {
	return this.state === this.STATE_HIDDEN;
}

Card.prototype.isMatched = function () {
	return this.state === this.STATE_MATCHED;
}


/**
*  Do the cards match?  Compares symbols on the cards.
*  If the cards match, update both cards state to "matched";
*  Returns a boolean answer.
*/
Card.prototype.matches = function(otherCard) {
	let match = false;
	if (this.symbol === otherCard.symbol) {
		match = true;
		this.state = this.STATE_MATCHED;
		otherCard.state = otherCard.STATE_MATCHED;
		// TODO: update class name to matched ??
	}
	return match;
};

/*
*  Appends the given class name to the end of the existing
*  class list.
*/
Card.prototype.addClass = function(classNameToAdd) {
	const arr = this.elem.className.split(" ");
    if (arr.indexOf(classNameToAdd) == -1) {
        this.elem.className += " " + classNameToAdd;
    }
};

/**
*	Flip the card around to display on the game board.
*/
Card.prototype.show = function (){
	if (this.isHidden()){
		this.addClass(this.CLASS_OPEN);
		this.addClass(this.CLASS_SHOW);
		this.state = this.STATE_SHOWING;
	}
};

/**
* 	Flip the card over but delay a second so
*   the card can be viewed before being hidden.
*/
Card.prototype.hide = function (){

	// stop listening for clicks while cards are displayed.
	this.parentNode.removeEventListener('click', respondToClick);
	// TODO: animate the cards
	// hide the cards after 2sec and start listening again.
	setTimeout(function (c, node) {
		c.elem.className = Card.prototype.CLASS_CARD;
		c.state = c.STATE_HIDDEN;
		node.addEventListener('click', respondToClick);
	}, 1000, this, this.parentNode);
}


/*
 * Create a list that holds all of your cards
 * Loops through the set of symbols and creates
 * a pair of cards for each symbol in the stack
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
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
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
*/
function initialize() {

	const fragment = document.createDocumentFragment();

	// Get the game board "deck", remove existing cards and add a global listener
	const deckNode = document.querySelector('.deck');
	// remove existing cards
	while (deckNode.firstChild) {
		deckNode.removeChild(deckNode.firstChild);
	}
	deckNode.addEventListener('click', respondToClick);

	// Create a deck of cards to display for the game
	const cards = createCards(deckNode);
	shuffle(cards);

	// Build up the card elements
	cards.forEach(function(card) {
	    fragment.appendChild(card.elem);
	});

	// Add the cards to the page.
	deckNode.appendChild(fragment);

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
const respondToClick = function(evt) {
	if (evt.target.nodeName === 'LI') {
		for (let i = 0; i < cards.length; i++){
			// find the card that was clicked
			if (evt.target === cards[i].elem){
				// show the card
				cards[i].show();
				//  is there a card to match?
				if (cardToMatch) {
					// check for a match
					if (!cards[i].matches(cardToMatch)){
						// TODO: animate the cards
						// hide the cards after 2sec and start listening again.
						matchedCards.push(cards[i], cardToMatch);
						cards[i].hide();
						cardToMatch.hide();
					}
					cardToMatch = null;
				} else {
					// saving the card for matching
 					cardToMatch = cards[i];
				}
				// our work is done here: don't bubble up or loop again.
				evt.stopPropagation();
				break;
			}
		}
	}
}

/**
*	The set of cards for this game.
*/
const cards = initialize();

/*
* 	A list of cards that the player has matched during the game
*/
const matchedCards = [];

/**
* 	The card selected by the player to compare for a match.
*/
let cardToMatch = null;