/**
 * @jest-environment jsdom   // It is a must to include this piece of code at the top of our test file or else it will fail.
 */

//const { beforeAll, test, expect } = require("@jest/globals");

/* We must export from the 'module.exports = { game, ... }' section of our 'game.js' file & import into 
the 'const { game, ... } = require("../game")' section of our 'game.test.js' file before our test can work. */
//const { test, expect } = require("@jest/globals");
const { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn } = require("../game");  

/* We want to display an alert to the player when he makes a wrong move. To do that, we'll use jest to check 
if an alert has been called by using Jest spy. This spy will wait & only report when it sees some interesting 
activity. We'll set the spy up on line 15, the 1st argument to spy on is the 'window' & the 2nd is the name of 
a method which in our case is "alert". Why we are doing this is bcos alert is a method of the window object 
so when it happens, we'll catch & divert it harmlessly into an empty function. */
jest.spyOn(window, "alert").mockImplementation(() => { });

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
});

describe("game object contains correct keys", () => {
    /* TEST 1: This tests if the game object in our 'game.js' file contains a key called score */
    test("score key exists", () => {  
        expect("score" in game).toBe(true); // this expects score to be a property in the game object in game.js file
    });
    /* TEST 2: This tests if the currentGame key (it's an array) which holds the sequence of computer moves exists 
    in the game object in our 'game.js' file. */ 
    test("currentGame key exists", () => {   
        expect("currentGame" in game).toBe(true); // this expects currentGame to be a property in the game object in game.js file
    });
    /* TEST 3: This tests if the playerMoves key (it's an array) which holds the sequence of player moves exists 
    in the game object in our 'game.js' file. */ 
    test("playerMoves key exists", () => {   
        expect("playerMoves" in game).toBe(true); // this expects playerMoves to be a property in the game object in game.js file
    });
    /* TEST 4: This tests if the choices key (it's an array) which holds the sequence of choices selected by a 
    player exists in the game object in our 'game.js' file. */ 
    test("choices key exists", () => {   
        expect("choices" in game).toBe(true); // this expects choices to be a property in the game object in game.js file
    });
    /* TEST 5: This tests if the choices key (it's an array) contains the correct IDs i.e we are expecting our 
    choices array to contain button1, button2, button3 & button4 IDs. */ 
    test("choices contain correct ids", () => {   
        expect(game.choices).toEqual(["button1", "button2", "button3", "button4"]); // this expects choices to be a property in the game object in game.js file
    });
    /* TEST 6: This tests if the turnNumber key exists in the game object in our 'game.js' file. */ 
    test("turnNumber key exists", () => {
        expect("turnNumber" in game).toBe(true);  // this expects turnNumber to be a property in the game object in game.js file
    });
}); // end of 1st describe test

describe("newGame works correctly", () => {
    /* We'll use another 'beforeAll()' function bcos we want to set up the game state with some fake values to see 
    if the newGame function resets them. */
    beforeAll(() => {   //This runs before all of the tests are run.
        game.score = 42;    // We set game.score equals to 42
        game.playerMoves = ["button1", "button2"];  // We set game.playerMoves value equals to ["button1", "button2"] array     
        game.currentGame = ["button1", "button2"]; // We set game.currentGame value i.e computer moves equals to ["button1", "button2"] array
        /* The code on line 54 below will set the score on the DOM to 42 so we can see if it gets reset to 0 by newGame. */
        document.getElementById("score").innerText = "42";  // The 42 should be in quotes as it's a string.
        newGame();  // We call the newGame() function & when it's working, it will reset the score
    });
    /* TEST 1: Sets the game score to zero  */
    test("should set game score to zero", () => {
        expect(game.score).toEqual(0);
    });
    /* TEST 2a: Clears the currentGame i.e computer sequence array. Since a new function named addTurn() will be called 
    at the end of the newGame() function, then this test 2a has to change from testing to see if the currentGame sequence 
    is empty to testing if it contains one element which is the new turn that we've just added so we create a new test below 
    named TEST 2b. */
    /* test("should clear the computer sequence array", () => {
        expect(game.currentGame.length).toEqual(0);     // We can use .toBe() here too
        //expect(game.currentGame).toEqual([]);  // This code should work exactly as the one above it
    }); */
    /* TEST 2b:  Checks if the currentGame sequence i.e computer's game array contains one move.   */
    test("should be one move in the computer's game array", () => {
        expect(game.currentGame.length).toBe(1);
    });
    /* TEST 3: Clears the playerMoves array  */
    test("should clear the player moves array", () => {
        expect(game.playerMoves.length).toEqual(0);     // We can use .toBe() here too
        //expect(game.playerMoves).toEqual([]); // This code should work exactly as the one above it
    });
    /* TEST 4: Resets the score  */
    test("should display 0 for the element with an id of score", () => {
        expect(document.getElementById("score").innerText).toEqual(0);     
    });
    /* TEST 5: Checks if data-listener attribute is set to true on each circle. */
    test("expect data-listener to be true", () => {
        /* What's happening on line 92 is that we'll get all the elements with a class of 'circle' 
        & store them in a variable called 'elements' which is an array & is declared as a constant
        to prevent any change to it.  */
        const elements = document.getElementsByClassName("circle");
        for (let element of elements) {
            /* On line 95, we expect that the "data-listener" attribute of the selected element is set to true.  */
            expect(element.getAttribute("data-listener")).toEqual("true");
        }   
    });
});

/* This describe block is testing the gameplay */
describe("gameplay works correctly", () => {
    beforeEach(() => {  // This runs before each test is run. This means that we will reset the state each time
        game.score = 0; // score reset
        game.currentGame = [];  // currentGame reset
        game.playerMoves = [];  //playerMoves reset
        addTurn();  // This will add a new turn to our currentGame() array so there should be +1 element(s) in the array now.
    });
    afterEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
    });
    test("addTurn adds a new turn to the game", () => {
        addTurn();
        expect(game.currentGame.length).toBe(2);
    });
    test("should add correct class to light up the buttons", () => {
        /* The code on line 121 below will get one of the IDs from currentGame array & assign it to a
        variable called 'button'. We'll go for the 1st element in the currentGame array since we know 
        that there will always be at least one element in it. */
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);  // this calls the lightsOn() function with the same ID used on line 106 as its parameter
        /* On line 124 below, we expect that our buttons class list should contain the light class. We used a new matcher 'toContain'. */ 
        expect(button.classList).toContain("light");
    });
    /* This test changes/updates the value of turnNumber from 42 to 0  */
    test("showTurns should update game.turnNumber", () => {
        game.turnNumber = 42;
        showTurns();    // When we call this function, it should reset the turnNumber
        expect(game.turnNumber).toBe(0);
    });
    /* This test checks if the score increments if the turn/move is correct    */
    test("should increment the score if the turn/move is correct", () => {
        /* Here, we'll take the turn we added in our beforeEach() function of our gameplay & push it 
        into the playerMoves array & then call the playerTurn() function on line 137. That is how we'll 
        kno that we have a correct answer because the playerTurn & the computersTurn match each other */
        game.playerMoves.push(game.currentGame[0]);
        playerTurn();
        expect(game.score).toBe(1);  //After calling the playerTurn() function on line 138, we expect the score to have increased.
    });
    test("should call an alert if the move is wrong", () => {
        game.playerMoves.push("wrong"); // It'll push a string that says "wrong" into our playerMoves array instead of pushing the correct move.
        playerTurn();
        /* From the code on line 153 below, We are expecting an alert box to be called/displayed with the text "Wrong move!" */
        expect(window.alert).toBeCalledWith("Wrong move!");  // Since we are spying on our alert function, we'll see when it's called & what parameters it's called with. 
    });
    /* This test should set turnInProgress to true when the computer is showing/taking its turn. */
    test("should toggle turnInProgress to true", () => {
        showTurns();    // We call this function so we know that the computer's game is in progress.
        expect(game.turnInProgress).toEqual(true); // or we can use .toBe(true) in place of .toEqual()
    });
    test("clicking during computer sequence should fail", () => {
        showTurns(); // calling this function starts the computer sequence 
        game.lastButton = ""; // it resets the game.lastButton key to empty
        /* What line 165 does is that it should not set a value of game.lastButton when the click function 
        is called on any of our buttons, in this case, the ID chosen is button2. There should be no ID in 
        there if my clicks are disabled. */
        document.getElementById("button2").click();
        expect(game.lastButton).toEqual(""); // Here, the content of lastButton shouldn't change after we clear it if clicks are disabled.
    });
});