// Variable declaration
let card = document.getElementsByClassName("card");
let cards = Array.from(card);
const deck = document.getElementById("card-deck");
let moves = 0;
let counter = document.querySelector(".moves");
let startedGame = false;
let matchedCard = document.getElementsByClassName("match");
let openedCards = [];
let lastMatchedNote = {};
let leaderBoardByTime = {};
let gameLevel;
let id = 0;
let gamePlay = [];
let sizeOfBoard;

// Modal
let closeicon = document.querySelector(".close");
let modal = document.getElementById("popup1");

document.body.onload = startGameWithEasy();

function startGameWithEasy(){
    startGame();
    createEasyBoard();
}

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
    gamePlay.push(this.type);
};

function cardOpen() {
    openedCards.push(this);
    let len = openedCards.length;
    if (len === 2){
        moveCounter();
        if(openedCards[0].type === openedCards[1].type){
            lastMatchedNote = openedCards[0].type;
            matched();
        } else {
            unmatched();
        }
    }
}
function matched(){
    openedCards[0].classList.add("match", "disabled");
    openedCards[1].classList.add("match", "disabled");
    openedCards[0].classList.remove("show", "open", "no-event");
    openedCards[1].classList.remove("show", "open", "no-event");
    openedCards = [];
    if (matchedCard.length < 16) showNoteModal();
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
        if(second === 60){
            minute++;
            second=0;
        }
        if(minute === 60){
            hour++;
            minute = 0;
        }
    },1000);
}

function showNoteModal() {
    $("#popup3").addClass("show");
    document.getElementById("lastNote").innerHTML = convertMidiNumberToNote(lastMatchedNote);
}

function closeNoteModal() {
    $("#popup3").removeClass("show");
}

function playLastMatchedNote() {
    console.log(lastMatchedNote);
    play(lastMatchedNote);
}

// @description congratulations when all cards match, show modal and moves, time and rating
function congratulations(){
    let finalTime;
    if (matchedCard.length === 16) {
        clearInterval(interval);
        finalTime = timer.innerHTML;
        // show congratulations modal
        modal.classList.add("show");
        // Posting to MongoDB
        postToMongo($("#name").val(), moves, finalTime, gameLevel, gamePlay, sizeOfBoard);
        getCollectionFromMongo();
        //showing move, rating, time on modal
        document.getElementById("gamerName").innerHTML = $("#name").val();
        document.getElementById("finalMove").innerHTML = moves;
        document.getElementById("totalTime").innerHTML = finalTime;
        document.getElementById("level").innerHTML = gameLevel;
        //closeicon on modal
        closeModal();
    }
}

function closeModal(){
    closeicon.addEventListener("click", function(e){
        modal.classList.remove("show");
        startGame();
    });
}

function playAgain(){
    modal.classList.remove("show");
    startGame();
}

function play(type) {
    let piano = Synth.createInstrument('piano');
    switch (type) {
        case "60":
            piano.play('C', 4, 2);
            break;
        case "61":
            piano.play('C#', 4, 2);
            break;
        case "62":
            piano.play('D', 4, 2);
            break;
        case "63":
            piano.play('D#', 4, 2);
            break;
        case "64":
            piano.play('E', 4, 2);
            break;
        case "65":
            piano.play('F', 4, 2);
            break;
        case "66":
            piano.play('F#', 4, 2);
            break;
        case "67":
            piano.play('G', 4, 2);
            break;
        case "68":
            piano.play('G#', 4, 2);
            break;
        case "69":
            piano.play('A', 4, 2);
            break;
        case "70":
            piano.play('A#', 4, 2);
            break;
        case "71":
            piano.play('B', 4, 2);
            break;
        case "72":
            piano.play('C', 5, 2);
            break;
    }
}

function convertMidiNumberToNote(midiNm) {
    switch (midiNm) {
        case "60":
            return "Do";
        case "61":
            return "Do #";
        case "62":
            return "Re";
        case "63":
            return "Re #";
        case "64":
            return "Mi";
        case "65":
            return "Fa";
        case "66":
            return "Fa #";
        case "67":
            return "Sol";
        case "68":
            return "Sol #";
        case "69":
            return "La";
        case "70":
            return "La #";
        case "71":
            return "Si";
        case "72":
            return "Do High";
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

$('.btn-group .btn').on('click', function() {
    if ($(this).val() === "easy") {
        $('.btn-group .btn').css("font-weight", "normal");
        $(this).css("font-weight","bold");
        $('.card .fa').show();
        gameLevel = "Easy"
    }
    else {
        $('.btn-group .btn').css("font-weight", "normal");
        $(this).css("font-weight","bold");
        $('.card .fa').hide();
        gameLevel = "Hard"
    }
});


$(function() {
    $('#startGameBTN').on('click', function () {
        $('#popup2').removeClass("show")
    })
});

function postToMongo(gamerName, finalMove, totalTime, level, gamePlay, sizeOfBoard) {
    $.ajax( { url: "https://api.mlab.com/api/1/databases/heroku_wnjdhw5n/collections/games_stats?apiKey=k_bMgbyw5w3iv9msEbm_H9gncX747FjQ",
        data: JSON.stringify( { "gamerName" : gamerName, "finalMove": finalMove, "totalTime": totalTime, "level": level, "gamePlay": gamePlay, "sizeOfBoard": sizeOfBoard, "UTCTime": Date.now()} ),
        type: "POST",
        contentType: "application/json" } );
}

function createEasyBoard() {
    resetBoardToBlank();
    removeElementsByClass("harder");
    sizeOfBoard = "4*4";
}

function createHardBoard() {
    resetBoardToBlank();
    removeElementsByClass("easy");
    $("#card-deck").addClass("hard");
    sizeOfBoard = "6*4";
}

function removeElementsByClass(className){
    let elements = document.getElementsByClassName(className);
    for (let element of elements) {
        element.parentNode.style.display = "none";
    }
}

function resetBoardToBlank() {
    let elements = document.getElementsByClassName("easy");
    console.log(elements);
    for (let element of elements) {
        element.parentNode.style.display = "";
    };
    let elements2 = document.getElementsByClassName("harder");
    for (let element of elements2) {
        element.parentNode.style.display = "";
    };
    $("#card-deck").removeClass("hard");
}

var transform = {
    tag: 'tr',
    children: [{
        "tag": "td",
        "html": function() {return ++id}
    }, {
        "tag": "td",
        "html": "${gamerName}"
    }, {
        "tag": "td",
        "html": "${finalMove}"
    }, {
        "tag": "td",
        "html": "${totalTime}"
    }, {
        "tag": "td",
        "html": "${level}"
    }]
};

function getCollectionFromMongo() {
    $.ajax( { url: "https://api.mlab.com/api/1/databases/heroku_wnjdhw5n/collections/games_stats?apiKey=k_bMgbyw5w3iv9msEbm_H9gncX747FjQ",
        type: "GET",
        contentType: "application/json",
        success: function(data){
            leaderBoardByTime = (_.sortBy(data, "finalMove").slice(0, 10));
            $('#leaderboard > tbody').json2html(leaderBoardByTime,transform);
        }
    });
}




