/*
* Class Card
*
* Represents a memory card on the playing board.
*
* A Card has the following properties
* Symbol - The symbol to match
*/
var Card = function (symbol){
	this.symbol = symbol;
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
	for (let i = 0; i < Card.prototype.symbols.length; i++){
		// create a pair of identical cards and save them
		let type = Card.prototype.symbols[i];
		cards.push(new Card(type), new Card(type));
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

// Create and shuffle the cards
const cards = shuffle(createCards());

// loop through the cards and display them on the screen
const fragment = document.createDocumentFragment();  // ← uses a DocumentFragment instead of a <div>

for (let i = 0; i < cards.length; i++) {
    const cardElem = document.createElement('i');
    cardElem.className = `fa fa-${cards[i].symbol}`;
	// create the wrapper and add the card element
	const parentElem = document.createElement('li');
    parentElem.className = "card";
    parentElem.appendChild(cardElem);
    // save the new elements
    fragment.appendChild(parentElem);
}

// Add the cards to the page.
const deck = document.querySelector('.deck')
deck.appendChild(fragment);

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
