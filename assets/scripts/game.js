let game = {    // This creates a new game object with a score property/attribute of zero
    score: 0,
    currentGame: [],
    playerMoves: [],
    turnNumber: 0,  // this is a default value
    lastButton: "",  // this is a default value
    turnInProgress: false,  // this is a default value
    choices: ["button1", "button2", "button3", "button4"],
}

/********************************************************************************************************************************/
/*                                                     REMINDER:                                                               */
/*      EVERYTIME WE ADD A NEW FUNCTION, WE NEED TO EXPORT IT FROM "game.js" FILE & IMPORT IT INTO "game.test.js" FILE.       */
/*                                                                                                                           */
/************************************************************************************************************************** */

/* What the newGame() function does is that it clears out our data from the currentGame array. */
function newGame() {
    game.score = 0;     // This resets the score back to zero
    game.playerMoves = [];   // This clears the playerMoves array
    /* Using for-loop, we'll get all of the elements with a class of 'circle' & check the attribute of 
    each circle. If the attribute is set to false, then we'll add our event listener by writing 
    'circle.addEventListener'. */
    for (let circle of document.getElementsByClassName("circle")) {
        if (circle.getAttribute("data-listener") != "true") {
            /* The code on line 25 will be a click event listener, we'll pass in the event object & the 
            click object as 'e' since we'll use it to get our click targets ID so depending on the circle 
            we clicked on, the ID will either be button1, button2, button3 or button4 & we'll store that 
            ID in the 'move' variable. */
            circle.addEventListener("click", (e) => {
                /* This code on line 31 will accept a click only if the length of the currentGame array is 
                greater than zero i.e we have a game in progress & no turn is in progress   */
                if (game.currentGame.length > 0 && !game.turnInProgress) { 
                    let move = e.target.getAttribute("id"); 
                    /* After getting the move on line 30 above, we'll store the move in game.lastButton on line 32 to depict the last button clicked */
                    game.lastButton = move;
                    lightsOn(move); // Here, we'll call our lightsOn() function using 'move' as the parameter & this will illuminate the correct circle.
                    game.playerMoves.push(move);    // This will push that 'move' into our game.playerMoves
                    playerTurn();   
                }
            });
            circle.setAttribute("data-listener", "true");   // sets the data-listener attribute on our circle to true.
        }
    }
    game.currentGame = [];   // This clears the currentGame array 
    showScore();    // This will be called at the end of newGame 
    addTurn();  // This will be called in our newGame() function straight after the showScore() function is called.   
}

/* What the addTurn() function does is that it pushes a random choice out. */
function addTurn() {
    game.playerMoves = [];   // This clears the playerMoves array bcos this is the start of a new turn
    /* On the code on line 54 below, we'll use the Math.random() library to generate a random number 
    between 0 & 3, that number will then be used as the index of our choices array, then the resulting 
    choice is pushed onto the current game array. */
    game.currentGame.push(game.choices[(Math.floor(Math.random() * 4))]);  
    showTurns()
}

function showScore() {  // We'll export this function in 'game.js' file & import it into the 'game.test.js' file 
    document.getElementById("score").innerText = game.score;
}

/* The lightsOn() function will take one parameter which is the ID of one of our circles 
& inside this function, we'll refer to it as 'circ'. */ 
function lightsOn(circ) {
    /* On line 68, the class of light will be added to our appropriate circle by gettig 
    the element with an ID of 'circle' that was passed into the function & then add the 
    light class. */
    document.getElementById(circ).classList.add("light");
    /* We'll use the javaScript's setTimeout() function to remove this 'light' class 
    from our 'classList' element after 400 millisecs. This is just a reversal of the 
    code we wrote on line 68. */
    setTimeout(() => {
        document.getElementById(circ).classList.remove("light");
    }, 400);
}

/* The showTurns() function sets the interval, calls the lightsOn() function to turn on the light, 
increments the game turnNumber & then turn them off again i.e it will step through the currentGame 
array & turn on the appropriate light then turn it off again. That is the computer sequence that the 
player will try to follow. We are starting our global state in the game object so that's why we are 
using it as a counter. */
function showTurns() {
    game.turnInProgress = true; // This is set to true bcos our turns have started.
    game.turnNumber = 0;
    let turns = setInterval(() => {
        /* Here, we call the lightsOn() function inside a JavaScript set interval. 
        This is to ensure that we have a little pause between the lights been shown 
        & the next step in the sequence. */
        lightsOn(game.currentGame[game.turnNumber]);
        game.turnNumber++;
        /* Here, the sequence is finished & the interval is cleared if turnNumber is 
        equal or over the length of our current game array. */
        if (game.turnNumber >= game.currentGame.length) {
            clearInterval(turns);
            game.turnInProgress = false; // Our turns is now finished just after we cleared the intervals on line 92 so we set turnInProgress back to false.
        }
    }, 800);
}

/*               */
function playerTurn() {
    let i = game.playerMoves.length - 1;    // This gets the index of the last element in playerMoves array.
    /* What the code on line 105 does is that it compares the element at index i of currentGame array with that 
    in the playerMoves array & if our player gets the answers correct, both should match.   */
    if (game.currentGame[i] === game.playerMoves[i]) {
        if (game.currentGame.length === game.playerMoves.length) {  // If both lengths are equal, it means we are at the end of the sequence & the player got them all correct.
            game.score++;   // It increments the score
            showScore();    // It displays the score
            addTurn();  // calls the addTurn() function to add a new turn.
        }
    } else {  //If both lengths aren't equal, then display an alert that says "Wrong move!" as written on line 112
        alert("Wrong move!");
        newGame();
    }
}

/* It is neccessary to put our game in curly braces bcos we'll be exporting more than one 
object & function from this file. We must add any object & function created into this module.exports
& also go back to our game.test.js file & import them into it or else our test won't work. */
module.exports = { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn };    