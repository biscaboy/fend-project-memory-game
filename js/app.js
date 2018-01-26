/*
* Class Card
*
* Represents a memory card on the playing board.
*
* A Card has the following properties
* Symbol - The symbol to match
* DOM Element for this card (a list item)
*/
var Card = function (id, symbol){
	this.id = id;
	this.symbol = symbol;
	const e = document.createElement('i');
	e.className = `fa fa-${symbol}`;
	this.elem = document.createElement('li');
	this.elem.className = "card";
	this.elem.id = id;
	this.elem.appendChild(e);
};

/**
* The symbols to display on the front of the card.
* The symbols correspond to FontAwesome characters.
*/
Card.prototype.symbols = [
	"anchor",
	"bicycle",
	"bolt",
	"bomb",
	"cube",
	"diamond",
	"leaf",
	"paper-plane-o"
];

/**
*  Do the cards match?  Compares symbols.
*/
Card.prototype.match = function(otherCard) {
	return this.symbol === otherCard.symbol;
}

/*
 * Create a list that holds all of your cards
 * Loops through the set of symbols and creates
 * a pair of cards for each symbol in the stack
 */
function createCards() {
	const cards = [];
	const len = Card.prototype.symbols.length;
	for (let i = 1; i <= len; i++){
		// create a pair of identical cards and save them
		let type = Card.prototype.symbols[i];
		cards.push(new Card(i, type), new Card(i + len, type));
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

function initialize() {

	// get our deck of cards to work with
	const cards = createCards();
	// fragment to use to build up the game board elements
	const fragment = document.createDocumentFragment();

	// remove any children
	while (deckNode.firstChild) {
		deckNode.removeChild(deckNode.firstChild);
	}
	// shuffle
	shuffle(cards);
	// loop through the cards and display them on the screen
	cards.forEach(function(card) {
	    // save the new elements
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
function respondToClick(evt) {

	if (evt.target.nodeName === 'LI') {
		console.log ("clicked " + evt.target.id);
	}
}

// get the game board and clear it.
const deckNode = document.querySelector('.deck');
deckNode.addEventListener('click', respondToClick);

// Create and shuffle the display cards
const cards = initialize();
