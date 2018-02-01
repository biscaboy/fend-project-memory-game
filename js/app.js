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
	// display modal with winning stats.
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
	document.querySelector('.game-over-stats-moves').innerHTML = this.moves;
	document.querySelector('.game-over-stats-time').innerHTML = this.getGameDuration();
	const starsMsg = (stars.length > 0) ? stars.length : `No stars earned this round`;
	document.querySelector('.game-over-stats-stars').innerHTML = starsMsg;
	cards.forEach(function(card){
		card.elem.classList.add('game-over');
	});
	setTimeout(function(){
		modalBg.classList.add('modal-bg-show');
		modal.classList.add('modal-show');
	},1500);
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
	this.elem.className = this.CLASS_CARD + ' ' + this.CLASS_SHOW;
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
		setTimeout(function(c1, c2){
			c1.elem.classList.add('match');
			c2.elem.classList.add('match');
		}, 250, this, otherCard);
	}
	return match;
};

/**
* 	@description: Flip the card around to display on the game board.
*/
Card.prototype.show = function (){
	if (this.isHidden()){
		// open starts the CSS animation
		this.elem.classList.add(this.CLASS_OPEN);
		// delay the show for animations
		setTimeout(function(c) {
			c.elem.classList.add(c.CLASS_SHOW);
		}, 250, this);
		this.state = this.STATE_SHOWING;
	}
};

/**
* 	@description: Flip the card over to a hidden state
*/
Card.prototype.hide = function (){
	// TODO: animate the cards
	this.elem.classList.add('hide');
	setTimeout(function(c){
		c.elem.className = c.CLASS_CARD;
	}, 250, this);
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
*  	@description: Create an array of star elements
*	@returns {Array} Elements of list items with a FA star as their class
*/
function createStars() {
	const stars = [];
	for (let i = 0; i < 3; i++){
		// create the star element with the FA star image
		let className = "fa fa-star";
		let starElem = document.createElement('i');
		starElem.className = className;
		let listElem = document.createElement('li');
		listElem.appendChild(starElem);
		stars.push(listElem);
	}
	return stars;
}

/*
* 	@description: randomly shuffles the elements of a given array
*	Shuffle function from http://stackoverflow.com/a/2450976
* 	@param: the array whose contents will be shuffled.
* 	@returns {Array} the shuffled array
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
* 	@description: Set up the game by creating cards and shuffling them.
*  	Then display the cards on the board and start the game.
	@return {Array} an array of Card objects
*/
function initialize() {

	const deckFragment = document.createDocumentFragment();
	const listFragment = document.createDocumentFragment();

	// remove existing cards
	while (deckNode.firstChild) {
		deckNode.removeChild(deckNode.firstChild);
	}
	deckNode.addEventListener('click', respondToClick);

	// remove existing stars
	const starsToRemove = document.querySelectorAll('.stars li');
	starsToRemove.forEach(function(star) {
		star.parentElement.removeChild(star);
	});

	// Create a new deck of cards to display for the game
	const cards = createCards(deckNode);
	shuffle(cards);

	// Build up the card elements
	cards.forEach(function(card) {
	    deckFragment.appendChild(card.elem);
	});

	// Add the cards to the page.
	deckNode.appendChild(deckFragment);

	// create a new set of stars
	const stars = createStars();

	stars.forEach(function(star) {
		listFragment.appendChild(star);
	});

	// append the stars to the document.
	cardList.appendChild(listFragment);

	// reset the card to match.
	cardToMatch = null;

	// start a new game which reset the scoreboard
	scoreboard.startGame();

	return cards;
}

/**
* @description Compare two cards and update the game board and scoreboard with the result
*/
function attemptMatch(card1, card2) {
	// check for a match
	if (card1.matches(card2)){
		// a match!
		scoreboard.incrementMatches();
	} else {
		// no match.
		// don't let the player click on anything else while we display cards
		deckNode.removeEventListener('click', respondToClick);
		// hide the cards after 1.25 (animation takes .25) sec and start listening again for next move.
		setTimeout(function (c1, c2) {
			c1.hide();
			c2.hide();
			deckNode.addEventListener('click', respondToClick);
		}, 1250, card1, card2);
	}
	// we tried to match so increment the scoreboard and reset.
	scoreboard.incrememntMoves();
}

/*
*	@description If a card has already been selected for comparison, compare the cards.
*	If there is no card for comparison, save this card and wait.
*/
const handleCardClick = function(card) {
	// show the card
	card.show();
	//  is there a card to match?
	if (cardToMatch) {
		attemptMatch(card, cardToMatch);
		cardToMatch = null;
		// if all the cards are matched stop the game!
		if (scoreboard.getMatches() == Card.prototype.symbols.length){
			scoreboard.stopGame();
		}
	} else {
		// saving the card for matching on next click
		cardToMatch = card;
	}
}

/**
* 	@description:  Loops through the cards in the game, if one has been clicked handle it.
* 	@param {EventListener}
*/
const respondToClick = function(evt) {
	if (evt.target.nodeName === 'LI') {
		for (let i = 0; i < cards.length; i++){
			// find the card that was clicked  (make sure it's not the same card again)
			if (evt.target === cards[i].elem && !cards[i].isMatched() && (cards[i] !== cardToMatch)){
				handleCardClick(cards[i]);
				break;
			}
		}
	}
}

/**
* 	@description:  Starts the game over clearing the scoreboard and reshuffling the deck
* 	@param {EventListener}
*/
const resetGame = function(evt) {
	closeModal();
	cards = initialize();
}

/**
* 	@description:  Closes the modal by removing the modal-show class name.
* 	@param {EventListener}
*/
const closeModal = function(evt) {
	if (modal.classList.contains('modal-show')) {
		modal.classList.remove('modal-show');
	}
	if (modalBg.classList.contains('modal-bg-show')) {
		modalBg.classList.remove('modal-bg-show');
	}
}

/**
*	The scoreboard for the game
*/
const scoreboard = new Scoreboard();

/**
* 	Deck of cards - all cards hang off this node
*/
const deckNode = document.querySelector('.deck');

/**
*	Popup modal for congratualations message
*/
const modal = document.querySelector('#game-over-modal');

/**
* 	Translucent background for the modal.
*/
const modalBg = document.querySelector('.modal-bg');

/**
* 	The List of stars on the scoreboard
*/
const cardList = document.querySelector('.stars');

/**
* 	The card selected by the player to compare for a match.
*/
let cardToMatch = null;

/**
*	The set of cards for this game.
*/
let cards = initialize();

// listens for clicks on the restart buttons to begin a new game.
document.querySelectorAll('.restart').forEach(function(btn) {
	btn.addEventListener('click', resetGame);
});

document.querySelector(".modal-dismiss-btn").addEventListener('click', closeModal);

