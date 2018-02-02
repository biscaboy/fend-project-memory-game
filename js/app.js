/**
*	app.js - Memory Card Matching Game
*   Author:  David J. Dickinson
*   Contact: djdlearn@gmail.com
*
*	Javascript engine for the Memory Game.
*/

/**
*	Class: Scoreboard
* 	@constructor
* 	@description Tracks and displays player moves, stars and game timer.
*/
const Scoreboard = function() {
	// keep references to the display Elements of the scoreboard and game over modal
	this.counterElem = document.querySelector(this.CLASS_MOVES);
	this.starsElem = document.querySelector(this.CLASS_STARS);
	this.timerElem = document.querySelector(this.CLASS_TIMER);
	this.modalRankElem = document.querySelector(this.CLASS_GAME_RANKING);
	this.modalMovesElem = document.querySelector(this.CLASS_STATS_MOVES);
	this.modalTimeElem = document.querySelector(this.CLASS_STATS_TIME);
	this.modalStarsElem = document.querySelector(this.CLASS_STATS_STARS);
	this.clockInterval = null;
	this.moves = 0;
	this.elapsedTime = 0;
	this.matches = 0;
}

// static constants for the class
Scoreboard.prototype.CLASS_MOVES = '.moves';
Scoreboard.prototype.CLASS_STARS = '.stars';
Scoreboard.prototype.CLASS_TIMER = '.timer';
Scoreboard.prototype.CLASS_GAME_RANKING = '.game-ranking';
Scoreboard.prototype.CLASS_STATS_MOVES = '.game-over-stats-moves';
Scoreboard.prototype.CLASS_STATS_TIME = '.game-over-stats-time';
Scoreboard.prototype.CLASS_STATS_STARS = '.game-over-stats-stars';
Scoreboard.prototype.CLASS_GAME_OVER = 'game-over';
Scoreboard.prototype.CLASS_MODAL_SHOW = 'modal-show';
Scoreboard.prototype.CLASS_MODAL_SHOW_BG = 'modal-bg-show';
Scoreboard.prototype.ZERO_ON_THE_CLOCK = '0:00';
Scoreboard.prototype.RANK_FOUR = 'ninja';
Scoreboard.prototype.RANK_THREE = 'master';
Scoreboard.prototype.RANK_TWO = 'guru';
Scoreboard.prototype.RANK_ONE = 'legend';

/**
* 	@description provides the elapsed time from the start of the game
* 	@returns a formatted string in minutes and seconds (mm:ss).
*/
Scoreboard.prototype.getGameDuration = function() {
	// elapsedTime is in seconds so calculate the minutes
	const mins = Math.floor(this.elapsedTime / 60);
	// get and format the seconds
	let secs = Math.floor(this.elapsedTime % 60);
	if (secs < 10) {
		secs = '0' + secs;
	}
	return mins + ':' + secs;
}

/**
* 	@description Begins an Interval that counts the game time,
*	displays it and updates it.
*/
Scoreboard.prototype.startClock = function() {
	// blank out the scoreboard and clear timer Interval one is running.
	this.elapsedTime = 0;
	this.matches = 0;
	this.timerElem.innerHTML = this.ZERO_ON_THE_CLOCK;
	clearInterval(this.clockInterval);
	// set up a timer that ticks at 1 second intervals and displays it.
	this.clockInterval = setInterval(function(sb) {
		sb.elapsedTime += 1;
		sb.timerElem.innerHTML = sb.getGameDuration();
	}, 1000, this);
}

/**
* 	@description Stops the game clock
*/
Scoreboard.prototype.stopClock = function() {
	clearInterval(this.clockInterval);
}

/**
* 	@description Updates the scoreboard with a move.
*	A move consists of turing over two cards.
*/
Scoreboard.prototype.incrementMoves = function() {
	this.moves++;
	this.counterElem.innerHTML = this.moves;
	// remove stars depending on the players performance
	// rules for removing stars
	// 1.  wait at least 6 moves before checking, then check every other move
	// 2.  if the ratio of moves to matched pairs is ever less than 25% remove a star
	// document.querySelector('.success-ratio').innerHTML = Math.floor((this.matches / this.moves) * 100) + '%';
	if (this.moves > 6 && this.moves % 2 == 0 && (this.matches / this.moves < 0.25)) {
		const starToRemove = document.querySelector(Star.prototype.CLASS_SELECTOR);
		if (starToRemove){
			// animate the star and make it disappear.
			starToRemove.classList.add('star-pop');
			setTimeout(function(star){
				star.parentElement.removeChild(star);
			}, 500, starToRemove);
			stars.pop();
		}
	}
}

/**
* 	@description Updates by one the matches count.
* 	A match is made when two cards of with the same
*	symbol are turned over and displayed.
*/
Scoreboard.prototype.incrementMatches = function() {
	this.matches++;
}

/**
* 	@description Accessor method to the current number of matched pairs of cards.
* 	@returns: the latest matches count saved in the scoreboard.
*/
Scoreboard.prototype.getMatches = function() {
	return this.matches;
}

/**
* 	@description  Begins the game by clearing the number of moves
*	and starting the clock.
*/
Scoreboard.prototype.startGame = function() {
	this.moves = 0;
	this.counterElem.innerHTML = this.moves;
	this.startClock();
}

/**
* @description provide a ranking based on the ration of moves to pairs found
* @return {string} the rank
*/
Scoreboard.prototype.getPlayerRank = function() {
	let rank = this.RANK_ONE;
	// TODO: update this to use the players success ratio.
	const successRatio = (this.matches / this.moves) * 100;
	if (successRatio >= 30) {
		rank = this.RANK_TWO;
	} else if (successRatio >= 20) {
		rank = this.RANK_THREE;
	} else if (successRatio >= 10) {
		rank = this.RANK_FOUR;
	}
	return rank;
}

/**
* 	@description  Stops the game clock, and displays a modal Congratulations message.
*/
Scoreboard.prototype.stopGame = function () {
	this.stopClock();
	// display modal with winning stats.
	// insert the game stats into the modal
	this.modalRankElem.innerHTML = this.getPlayerRank();
	this.modalMovesElem.innerHTML = this.moves;
	this.modalTimeElem.innerHTML = this.getGameDuration();
	this.modalStarsElem.innerHTML = stars.length;

	// animate the cards to show the game is over
	cards.forEach(card => {
		card.elem.classList.add(this.CLASS_GAME_OVER);
	});
	// after 1.5 sec of animation above, show the modal on a dark background.
	setTimeout(() => {
		modalBg.classList.add(this.CLASS_MODAL_SHOW_BG);
		modal.classList.add(this.CLASS_MODAL_SHOW);
	},1500);
}

/*
* 	Class: Star
*	@constructor
*	@description Represents a ranking star that indicates how well the player is doing
*/
const Star = function(parent){
	this.parentNode = parent;
	const e = document.createElement(this.SYMBOL_ELEMENT_TYPE);
	e.className = this.CLASS_FA_STAR;
	this.elem = document.createElement(this.ELEMENT_TYPE);
	this.elem.className = this.CLASS_STAR;
	this.elem.appendChild(e);
};

// static constants for the class
Star.prototype.CLASS_FA_STAR = 'fa fa-star';
Star.prototype.CLASS_STAR = 'star';
Star.prototype.SYMBOL_ELEMENT_TYPE = 'i';
Star.prototype.ELEMENT_TYPE = 'li';
Star.prototype.CLASS_SELECTOR = '.star';

/**
* 	Class: Card
*	@constructor
* 	@description Represents a playing card on the playing board.
** 	A Card has the following properties:
* 	symbol - The symbol to match
* 	state - closed (-1), open (0), matched (1)
*	elem - a DOM Element representing this card (a list item)
* 	parentNode - A reference to the card's parent node - (the game board).
*/
const Card = function (symbol, parent){
	this.parentNode = parent;
	this.symbol = symbol;
	this.state = this.STATE_HIDDEN; // init closed
	const e = document.createElement(this.SYMBOL_ELEMENT_TYPE);
	e.className = this.FA_PREFIX + symbol;
	this.elem = document.createElement(this.ELEMENT_TYPE);
	this.elem.className = this.CLASS_CARD;
	this.elem.appendChild(e);
};

// static constants for the class.
Card.prototype.CLASS_SELECTOR = '.card';
Card.prototype.CLASS_CARD = 'card';
Card.prototype.CLASS_OPEN = 'open';
Card.prototype.CLASS_SHOW = 'show';
Card.prototype.STATE_SHOWING = 0;
Card.prototype.STATE_HIDDEN = -1;
Card.prototype.STATE_MATCHED = 1;
Card.prototype.SYMBOL_ELEMENT_TYPE = 'i';
Card.prototype.ELEMENT_TYPE = 'li';
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
*	@description Indicates if the card is currently showing on the board.
* 	@returns  {boolean}  true if showing otherwise false.
*/
Card.prototype.isShowing = function () {
	return this.state === this.STATE_SHOWING;
}

/**
* 	@description Indicates if the card is currently hidden or facing down on the board
* 	@returns {boolean} true if hidden, otherwise false.
*/
Card.prototype.isHidden = function () {
	return this.state === this.STATE_HIDDEN;
}

/**
* 	@description  Indicates if the card has been matched in a pair.
* 	@returns {boolean} true if matched, otherwise false.
*/
Card.prototype.isMatched = function () {
	return this.state === this.STATE_MATCHED;
}


/**
*   @description Compares symbols on the cards and determines a match.
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
* 	@description Flip the card around to display on the game board.
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
* 	@description Flip the card over to a hidden state
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
*  	@description Create a list that holds all of your cards
*	Loops through the set of symbols and creates
* 	a pair of cards for each symbol in the stack
* 	@param {Node} the DOM Node to use as a parent to display Card in the DOM.
* 	@returns {Array} Card objects
*/
function createCards(parentNode) {
	const cards = [];
	const len = Card.prototype.symbols.length;
	for (let i = 0; i < len; i++){
		// create a pair of identical cards and save them
		let type = Card.prototype.symbols[i];
		cards.push(
			new Card(type, parentNode),
			new Card(type, parentNode)
		);
	}
	return cards;
}

/*
*  	@description Create an array of three star elements
*	@returns {Array} Elements of list items with a FA star as their class
*/
function createStars(parentNode) {
	const stars = [];
	for (let i = 0; i < 3; i++){
		stars.push(new Star(parentNode));
	}
	return stars;
}



/*
* 	@description randomly shuffles the elements of a given array
*	Shuffle function from http://stackoverflow.com/a/2450976
* 	@param the array whose contents will be shuffled.
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
*	@description: remove old pieces (cards/stars) and add new for a new game
*	@param pieces
*/
function initializeGameBoard(newObjects){
	const oldElements = document.querySelectorAll(newObjects[0].CLASS_SELECTOR);

	// remove the curently displayed star elements
	// remove existing children displayed
	oldElements.forEach(function(element){
		element.parentElement.removeChild(element);
	});

	// append the new objects (cards or stars) to the document.
	const fragment = document.createDocumentFragment();

	// Build up the new elements to display
	newObjects.forEach(function(object) {
	    fragment.appendChild(object.elem);
	});

	// Add the new objects to the page.
	newObjects[0].parentNode.appendChild(fragment);
}

/**
* 	@description Set up the game by creating cards and shuffling them.
*  	Then display the cards on the board and start the game.
*/
function initialize() {

	// Create a new deck of cards to display for the game
	cards = shuffle(createCards(deckNode));
	// Create new stars to display for the game
	stars = createStars(starList);

	// refresh the stars and cards
	initializeGameBoard(stars);
	initializeGameBoard(cards);

	// reset the card to match.
	cardToMatch = null;

	// start a new game which reset the scoreboard
	scoreboard.startGame();
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
		card1.parentNode.removeEventListener('click', respondToClick);
		// hide the cards after 1.25 (animation takes .25) sec and start listening again for next move.
		setTimeout(function (c1, c2) {
			c1.hide();
			c2.hide();
			c1.parentNode.addEventListener('click', respondToClick);
		}, 1250, card1, card2);
	}
	// we tried to match so increment the scoreboard and reset.
	scoreboard.incrementMoves();
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
* 	@description  Loops through the cards in the game, if one has been clicked handle it.
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
* 	@description  Closes the modal by removing the modal-show class name.
* 	@param {EventListener}
*/
const closeModal = function(evt) {
	if (modal.classList.contains(Scoreboard.prototype.CLASS_MODAL_SHOW)) {
		modal.classList.remove(Scoreboard.prototype.CLASS_MODAL_SHOW);
	}
	if (modalBg.classList.contains(Scoreboard.prototype.CLASS_MODAL_SHOW_BG)) {
		modalBg.classList.remove(Scoreboard.prototype.CLASS_MODAL_SHOW_BG);
	}
}

/**
* 	@description  Starts the game over clearing the scoreboard and reshuffling the deck
* 	@param {EventListener}
*/
const resetGame = function(evt) {
	closeModal();
	initialize();
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
const starList = document.querySelector('.stars');

/**
* 	The card selected by the player to compare for a match.
*/
let cardToMatch = null;

/**
*	The set of cards for this game.
*/
let cards = [];

/**
*	The set of stars for this game
*/
let stars = [];

// add a global click listener on the board.
deckNode.addEventListener('click', respondToClick);

// listens for clicks on the restart buttons to begin a new game.
document.querySelectorAll('.restart').forEach(function(btn) {
	btn.addEventListener('click', resetGame);
});

// listens for clicks on the little "x" on the modal window.
document.querySelector(".modal-dismiss-btn").addEventListener('click', closeModal);

// start the game
initialize();