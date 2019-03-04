// Variable declaration
let card = document.getElementsByClassName("card");
let cards = Array.from(card);
const deck = document.getElementById("card-deck");
let moves = 0;
let counter = document.querySelector(".moves");
let startedGame = false;
let matchedCard = document.getElementsByClassName("match");
let isInterval = 0;
let openedCards = [];
let lastMatchedNote = {};
let leaderBoardByTime = {};
let gameLevel = "Easy";
let id = 0;
let gamePlay = [];
let sizeOfBoard;

//initialize array of false values. counterOfMistakes = 0
let array = new Array(24).fill(false);
let counterOfMistakes = 0;

// Modal
let closeicon = document.querySelector(".close");
let modal = document.getElementById("popup1");

document.body.onload = startGameWithEasy();

function startGameWithEasy() {
    startGame();
    createEasyBoard();
}

function startGame() {
    // shuffle deck
    cards = shuffle(cards);
    // remove all exisiting classes from each card
    for (let i = 0; i < cards.length; i++) {
        deck.innerHTML = "";
        [].forEach.call(cards, function (item) {
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

function validateStartingForm() {
    if (!$("#name").val()) {
        alert('Please insert a Name!');
        location.reload();
    }
}

function reshowTheFormWithERR() {
    $("#popup2").addClass('show');
}

function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

let displayCard = function () {
    if (!startedGame) startTimer();
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
    gamePlay.push(this.type);
};

function cardOpen() {
    openedCards.push(this);
    let len = openedCards.length;
    if (len === 2) {
        moveCounter();
        if (openedCards[0].type.substring(0, 2) === openedCards[1].type.substring(0, 2)) {
            lastMatchedNote = openedCards[0].type;
            matched();
        } else {
            unmatched();
        }
    }
}

function matched() {
    openedCards[0].classList.add("match", "disabled");
    openedCards[1].classList.add("match", "disabled");
    openedCards[0].classList.remove("show", "open", "no-event");
    openedCards[1].classList.remove("show", "open", "no-event");

    // Added by Ron
    let num1 = (openedCards[0].type.substring(0, 2)) * 2 - 120;
    if (openedCards[0].type.substring(3, 4) !== 'a') {
        num1++;
    }
    let num2 = (openedCards[1].type.substring(0, 2)) * 2 - 120;
    if (openedCards[1].type.substring(3, 4) !== 'a') {
        num2++;
    }
    array[num1] = false;
    array[num2] = false;
    // End of addition

    openedCards = [];
    if (sizeOfBoard === "4*4") {
        if (matchedCard.length < 16) showNoteModal();
    } else {
        if (matchedCard.length < 24) showNoteModal();
    }
}

function unmatched() {
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");

    // Added by Ron
    let checkAOrB = 1;
    let num1 = (openedCards[0].type.substring(0, 2)) * 2 - 120; //first card
    if (openedCards[0].type.substring(3, 4) !== 'a') {
        checkAOrB = -1;
        num1++;
    }
    let num2 = (openedCards[1].type.substring(0, 2)) * 2 - 120; //second card
    if (openedCards[1].type.substring(3, 4) !== 'a') {
        num2++;
    }
    let i;
    let matchToFirstCard = num1 + checkAOrB;  // the match for first card
    for (i = 0; i < array.length; i = i + 2) {
        if ((array[i] === true) && (array[i + 1] === true)) { // there is possible match
            counterOfMistakes++;
            break;
        }
        if (array[matchToFirstCard] === true) { // the player could match the first card he chose
            counterOfMistakes++;
            break;
        }
    }
    array[num1] = true;
    array[num2] = true;
    // End of addition

    disable();
    if (!isInterval) {
        setTimeout(function () {
            openedCards[0].classList.remove("show", "open", "no-event", "unmatched");
            openedCards[1].classList.remove("show", "open", "no-event", "unmatched");
            enable();
            openedCards = [];
        }, 1100);
    } else {
        setTimeout(function () {
            openedCards[0].classList.remove("show", "open", "no-event", "unmatched");
            openedCards[1].classList.remove("show", "open", "no-event", "unmatched");
            enable();
            openedCards = [];
        }, 2200);
    }
}

function disable() {
    Array.prototype.filter.call(cards, function (card) {
        card.classList.add('disabled');
    });
}

function enable() {
    Array.prototype.filter.call(cards, function (card) {
        card.classList.remove('disabled');
        for (let i = 0; i < matchedCard.length; i++) {
            matchedCard[i].classList.add("disabled");
        }
    });
}

function moveCounter() {
    moves++;
    counter.innerHTML = moves;
    //start timer on first click
    if (moves === 1) {
        second = 0;
        minute = 0;
        hour = 0;
    }
}

var second = 0,
    minute = 0;
hour = 0;
var timer = document.querySelector(".timer");
var interval;

function startTimer() {
    startedGame = true;
    interval = setInterval(function () {
        timer.innerHTML = minute + " mins " + second + " secs";
        second++;
        if (second === 60) {
            minute++;
            second = 0;
        }
        if (minute === 60) {
            hour++;
            minute = 0;
        }
    }, 1000);
}

function showNoteModal() {
    $("#popup3").addClass("show");
    document.getElementById("lastNote").innerHTML = convertMidiNumberToNote(lastMatchedNote);
}

function closeNoteModal() {
    $("#popup3").removeClass("show");
}

function playLastMatchedNote() {
    play(lastMatchedNote);
}

// @description congratulations when all cards match, show modal and moves, time and rating
function congratulations() {
    let finalTime;
    if (sizeOfBoard === "2*4") {
        if (matchedCard.length === 8) {
            clearInterval(interval);
            finalTime = timer.innerHTML;
            // show congratulations modal
            modal.classList.add("show");
            // Posting to MongoDB
            postToMongo($("#name").val(), moves, finalTime, gameLevel, gamePlay, sizeOfBoard, $("#age").val(), $("#musical").val(), $("#perfect_p").val(), counterOfMistakes, isInterval);
            getCollectionFromMongo();
            //showing move, rating, time on modal
            document.getElementById("gamerName").innerHTML = $("#name").val();
            document.getElementById("finalMove").innerHTML = moves;
            document.getElementById("totalTime").innerHTML = finalTime;
            document.getElementById("level").innerHTML = gameLevel;
            startedGame = false;
            //closeicon on modal
            closeModal();
        }
    } else if (sizeOfBoard === "4*4") {
        if (matchedCard.length === 16) {
            clearInterval(interval);
            finalTime = timer.innerHTML;
            // show congratulations modal
            modal.classList.add("show");
            // Posting to MongoDB
            postToMongo($("#name").val(), moves, finalTime, gameLevel, gamePlay, sizeOfBoard, $("#age").val(), $("#musical").val(), $("#perfect_p").val(), counterOfMistakes, isInterval);
            getCollectionFromMongo();
            //showing move, rating, time on modal
            document.getElementById("gamerName").innerHTML = $("#name").val();
            document.getElementById("finalMove").innerHTML = moves;
            document.getElementById("totalTime").innerHTML = finalTime;
            document.getElementById("level").innerHTML = gameLevel;
            startedGame = false;
            //closeicon on modal
            closeModal();
        }
    } else {
        if (matchedCard.length === 24) {
            clearInterval(interval);
            finalTime = timer.innerHTML;
            // show congratulations modal
            modal.classList.add("show");
            // Posting to MongoDB
            postToMongo($("#name").val(), moves, finalTime, gameLevel, gamePlay, sizeOfBoard, $("#age").val(), $("#musical").val(), $("#perfect_p").val(), counterOfMistakes, isInterval);
            getCollectionFromMongo();
            //showing move, rating, time on modal
            document.getElementById("gamerName").innerHTML = $("#name").val();
            document.getElementById("finalMove").innerHTML = moves;
            document.getElementById("totalTime").innerHTML = finalTime;
            document.getElementById("level").innerHTML = gameLevel;
            startedGame = false;
            //closeicon on modal
            closeModal();
        }
    }
}

function closeModal() {
    closeicon.addEventListener("click", function (e) {
        modal.classList.remove("show");
        startGame();
    });
}

function playAgain() {
    modal.classList.remove("show");
    startGame();
}

function play(type) {
    let piano = Synth.createInstrument('piano');
    if (!isInterval) {
        switch (type.substring(0, 2)) {
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
    // isInterval
    else {
        switch (type.substring(0, 2)) {
            case "60":
                document.getElementById("BigSecunda").play();
                break;
            case "61":
                document.getElementById("BigSeptola").play();
                break;
            case "62":
                document.getElementById("BigSexta").play();
                break;
            case "63":
                document.getElementById("BigThird").play();
                break;
            case "64":
                document.getElementById("Octave").play();
                break;
            case "65":
                document.getElementById("Quarta").play();
                break;
            case "66":
                document.getElementById("Qvinta").play();
                break;
            case "67":
                document.getElementById("SmallSecunda").play();
                break;
            case "68":
                document.getElementById("SmallSeptola").play();
                break;
            case "69":
                document.getElementById("SmallSexta").play();
                break;
            case "70":
                document.getElementById("SmallThird").play();
                break;
            case "71":
                document.getElementById("Triton").play();
                break;
            case "72":
                document.getElementById("GospelChoir").play();
                break;
        }
    }
}

function convertMidiNumberToNote(midiNm) {
    switch (midiNm.substring(0, 2)) {
        case "60":
            if (isInterval) { return "Big Secunda" } else
                return "Do";
        case "61":
            if (isInterval) { return "Big Septola" } else
                return "Do #";
        case "62":
            if (isInterval) { return "Big Sexta" } else
                return "Re";
        case "63":
            if (isInterval) { return "Big Third" } else
                return "Re #";
        case "64":
            if (isInterval) { return "Octave" } else
                return "Mi";
        case "65":
            if (isInterval) { return "Quarta" } else
                return "Fa";
        case "66":
            if (isInterval) { return "Qvinta" } else
                return "Fa #";
        case "67":
            if (isInterval) { return "Small Secunda" } else
                return "Sol";
        case "68":
            if (isInterval) { return "Small Septola" } else
                return "Sol #";
        case "69":
            if (isInterval) { return "Small Sexta" } else
                return "La";
        case "70":
            if (isInterval) { return "Small Third" } else
                return "La #";
        case "71":
            if (isInterval) { return "Triton" } else
                return "Si";
        case "72":
            if (isInterval) { return "Gospel Choir" } else
                return "Do High";
    }
}

function playSound() {
    play(this.type);
}

// loop to add event listeners to each card
for (var i = 0; i < cards.length; i++) {
    card = cards[i];
    card.addEventListener("click", displayCard);
    card.addEventListener("click", cardOpen);
    card.addEventListener("click", congratulations);
    card.addEventListener("click", playSound);
}

// Level Button
$('#buttonLevel .btn').on('click', function () {
    if ($(this).val() === "easy") {
        $('.btn-group .btn').css("font-weight", "normal");
        $(this).css("font-weight", "bold");
        $('#buttonLevel>.btn-group>.focus').removeClass('focus');
        $(this).addClass('focus');
        $('.card .fa').show();
        gameLevel = "Easy"
    } else {
        $('.btn-group .btn').css("font-weight", "normal");
        $(this).css("font-weight", "bold");
        $('#buttonLevel>.btn-group>.focus').removeClass('focus');
        $(this).addClass('focus');
        $('.card .fa').hide();
        gameLevel = "Hard"
    }
});

// On Interval Button Click
$('#interval .btn').on('click', function () {
    if ($(this).val() === "0") {
        isInterval = 0;
    } else {
        isInterval = 1;
    }
});

// Board size button
$('#boardSize .btn').on('click', function () {
    if ($(this).val() === "8") {
        $('.btn-group .btn').css("font-weight", "normal");
        $('#boardSize>.btn-group>.focus').removeClass('focus');
        $(this).addClass('focus');
    } else {
        $('.btn-group .btn').css("font-weight", "normal");
        $(this).css("font-weight", "bold");
        $('#boardSize>.btn-group>.focus').removeClass('focus');
        $(this).addClass('focus');
    }
});


$(function () {
    $('#startGameBTN').on('click', function () {
        $('#popup2').removeClass("show")
    })
});

function postToMongo(gamerName, finalMove, totalTime, level, gamePlay, sizeOfBoard, age, musical, perfect_p, counterOfMistakes, isInterval) {
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/heroku_wnjdhw5n/collections/games_stats?apiKey=k_bMgbyw5w3iv9msEbm_H9gncX747FjQ",
        data: JSON.stringify({
            "gamerName": gamerName,
            "finalMove": finalMove,
            "totalTime": totalTime,
            "level": level,
            "gamePlay": gamePlay,
            "sizeOfBoard": sizeOfBoard,
            "age": age,
            "musical": musical,
            "perfect_p": perfect_p,
            "counterOfMistakes": counterOfMistakes,
            "isInterval": isInterval,
            "UTCTime": Date.now()
        }),
        type: "POST",
        contentType: "application/json"
    });
}

function createBabyBoard() {
    resetBoardToBlank();
    removeElementsByClass("baby");
    removeElementsByClass("harder");
    $(".deck").height("340px");
    sizeOfBoard = "2*4";
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

function removeElementsByClass(className) {
    let elements = document.getElementsByClassName(className);
    for (let element of elements) {
        element.parentNode.style.display = "none";
    }
}

function resetBoardToBlank() {
    let elements = document.getElementsByClassName("easy");
    for (let element of elements) {
        element.parentNode.style.display = "";
    }
    ;
    let elements2 = document.getElementsByClassName("harder");
    for (let element of elements2) {
        element.parentNode.style.display = "";
    }
    ;
    $("#card-deck").removeClass("hard");
}

var transform = {
    tag: 'tr',
    children: [{
        "tag": "td",
        "html": function () {
            return ++id
        }
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
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/heroku_wnjdhw5n/collections/games_stats?apiKey=k_bMgbyw5w3iv9msEbm_H9gncX747FjQ",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            let leaderBoardByBoardSize = (_.filter(data, ['sizeOfBoard', sizeOfBoard]));
            let leaderBoardByGameLevel = (_.filter(leaderBoardByBoardSize, ['level', gameLevel]));
            leaderBoardByTime = (_.sortBy(leaderBoardByGameLevel, "finalMove").slice(0, 10));
            $('#leaderboard > tbody').json2html(leaderBoardByTime, transform);
        }
    });
}
