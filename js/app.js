// Variable declaration

let card = document.getElementsByClassName("card");
let cards = Array.from(card);
const deck = document.getElementById("card-deck");
let moves = 0;
let counter = document.querySelector(".moves");
let startedGame = false;
let matchedCard = document.getElementsByClassName("match");
let openedCards = [];

// Modal
let closeicon = document.querySelector(".close");
let modal = document.getElementById("popup1");


document.body.onload = startGame();

function startGame(){
    // shuffle deck
    cards = shuffle(cards);
    // remove all exisiting classes from each card
    for (let i = 0; i < cards.length; i++){
        deck.innerHTML = "";
        [].forEach.call(cards, function(item) {
            deck.appendChild(item);
        });
        cards[i].classList.remove("show", "open", "match", "disabled");
    }
    // reset moves
    moves = 0;
    counter.innerHTML = moves;
    //reset timer
    second = 0;
    minute = 0;
    hour = 0;
    let timer = document.querySelector(".timer");
    timer.innerHTML = "0 mins 0 secs";
    clearInterval(interval);
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

let displayCard = function (){
    if (!startedGame) startTimer();
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
};

function cardOpen() {
    openedCards.push(this);
    let len = openedCards.length;
    if (len === 2){
        moveCounter();
        if(openedCards[0].type === openedCards[1].type){
            matched();
        } else {
            unmatched();
        }
    }
};

function matched(){
    openedCards[0].classList.add("match", "disabled");
    openedCards[1].classList.add("match", "disabled");
    openedCards[0].classList.remove("show", "open", "no-event");
    openedCards[1].classList.remove("show", "open", "no-event");
    openedCards = [];
}

function unmatched(){
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable();
    setTimeout(function(){
        openedCards[0].classList.remove("show", "open", "no-event","unmatched");
        openedCards[1].classList.remove("show", "open", "no-event","unmatched");
        enable();
        openedCards = [];
    },1100);
}

function disable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.add('disabled');
    });
}

function enable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.remove('disabled');
        for(let i = 0; i < matchedCard.length; i++){
            matchedCard[i].classList.add("disabled");
        }
    });
}

function moveCounter(){
    moves++;
    counter.innerHTML = moves;
    //start timer on first click
    if(moves === 1){
        second = 0;
        minute = 0;
        hour = 0;
    }
}

var second = 0, minute = 0; hour = 0;
var timer = document.querySelector(".timer");
var interval;
function startTimer(){
    startedGame = true;
    interval = setInterval(function(){
        timer.innerHTML = minute + " mins " + second + " secs";
        second++;
        if(second == 60){
            minute++;
            second=0;
        }
        if(minute == 60){
            hour++;
            minute = 0;
        }
    },1000);
}


// @description congratulations when all cards match, show modal and moves, time and rating
function congratulations(){
    let finalTime;
    if (matchedCard.length === 16) {
        clearInterval(interval);
        finalTime = timer.innerHTML;
        // show congratulations modal
        modal.classList.add("show");
        //showing move, rating, time on modal
        document.getElementById("finalMove").innerHTML = moves;
        document.getElementById("totalTime").innerHTML = finalTime;
        //closeicon on modal
        closeModal();
    }
}


// @description close icon on modal
function closeModal(){
    closeicon.addEventListener("click", function(e){
        modal.classList.remove("show");
        startGame();
    });
}


// @desciption for user to play Again 
function playAgain(){
    modal.classList.remove("show");
    startGame();
}


function play(type) {
    let piano = Synth.createInstrument('piano');
    switch (type) {
        case "do":
            piano.play('C', 4, 2);
            break;
        case "re":
            piano.play('D', 4, 2);
            break;
        case "mi":
            piano.play('E', 4, 2);
            break;
        case "fa":
            piano.play('F', 4, 2);
            break;
        case "sol":
            piano.play('G', 4, 2);
            break;
        case "la":
            piano.play('A', 4, 2);
            break;
        case "si":
            piano.play('B', 4, 2);
            break;
        case "do_high":
            piano.play('C', 5, 2);
            break;
    }
}

function playSound() {
    play(this.type);
}

// loop to add event listeners to each card
for (var i = 0; i < cards.length; i++){
    card = cards[i];
    card.addEventListener("click", displayCard);
    card.addEventListener("click", cardOpen);
    card.addEventListener("click", congratulations);
    card.addEventListener("click", playSound);
}

$(function() {
    let button1 = $('#button1');
    button1.on('click', function() {
        if (button1.hasClass("btn-success")) {
            button1.removeClass("btn-success").addClass("btn-danger");
            button1.val("Hard");
            $('.card .fa').hide()
        }
        else {
            button1.removeClass("btn-danger").addClass("btn-success");
            button1.val("Easy");
            $('.card .fa').show()
        }
    });
});