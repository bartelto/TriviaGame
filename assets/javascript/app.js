// the correct answers are preceded by an '*'

let questionIntervalId = ""; // for canceling the timer once the player selects an answer
let questionIndex = 0; // for tracking which question we're on
const questionTime = 100; // time question is shown, in seconds
const answerTime = 3; // time answer is shown, in seconds
let secondsLeft = 0; // counts down to zero
let correctAnswers = 0;
let wrongAnswers = 0;
let timedOutAnswers = 0;
let audioDoor = new Audio("assets/audio/09 Delorean Time Machine Door.mp3");
let audio88mph = new Audio("assets/audio/10 Delorean-Back To the Future (Impersonation).mp3");
let audioEnd = new Audio("assets/audio/35 End Logo (Alternate).mp3");


let questionBank = [
    {
        question: "What is the name of Doc Brown's dog?",
        answers: 
            [
                "*Einstein",
                "Marley",
                "Wilby",
                "Colonel"
            ]
    }, 
    {
        question: "What date in the past does Marty accidentally travel to?",
        answers: 
            [
                "*November 12, 1955",
                "October 26, 1955",
                "December 12, 1926",
                "October 26, 1975"
            ]
    },
    {
        question: "What nationality are the terrorists from whom Doc Brown stole the plutonium needed to power the time machine?",
        answers: 
            [
                "*Libyan",
                "Lithuanian",
                "Syrian",
                "South African"
            ]
    },
    {
        question: "What is the name of the uncle who Marty finds is still a baby in a playpen back in 1955?",
        answers: 
            [
                "*Joey",
                "Jimmy",
                "Jerry",
                "Jack"
            ]
    },
    {
        question: "Who directed Back to the Future?",
        answers: 
            [
                "*Robert Zemekis",
                "Steven Spielberg",
                "Christopher Lloyd",
                "Calvin Klein"
            ]
    },
    {
        question: "What speed does the DeLorean need to achieve to travel through time?",
        answers: 
            [
                "*88 miles per hour",
                "77 miles per hour",
                "60 miles per hour",
                "1.21 miles per hour"
            ]
    },
    {
        question: "What is Marty McFly's dream set of wheels?",
        answers: 
            [
                "*Toyota SR5 Xtra Cab",
                "Chevy Corvette",
                "Chevy Camaro IROC-Z",
                "DeLorean DMC-12"
            ]
    },
    {
        question: "What are the names of Marty's parents?",
        answers: 
            [
                "*Lorraine and George",
                "Linda and John",
                "Gracie and George",
                "Yoko and John"
            ]
    },
    {
        question: "What was Doc Brown doing when he hit his head and came up with the idea for the flux capacitor?",
        answers: 
            [
                "*hanging a clock",
                "working on his car",
                "climbing a tree",
                "taking a shower"
            ]
    },
    {
        question: "What Chuck Berry song did Marty rock out to at the Enchantment Under the Sea dance?",
        answers: 
            [
                "*Johnny B. Goode",
                "Maybellene",
                "Roll Over Beethoven",
                "Sweet Little Sixteen"
            ]
    }
];

function initGame() {
    $("#answers-area").hide();
    $("#start").addClass("clickable");
    $("#start").show();
    $("#needle").addClass("hide-logo");
    //$("#needle").hide();
    //$("header").hide();
}

function startGame() {
    $("#start").hide();

    correctAnswers = 0;
    wrongAnswers = 0;
    timedOutAnswers = 0;
    questionIndex = 0;
    audioDoor.play();
    presentQuestion();
}

function presentQuestion() {
    //console.log("Q: " + q.question);  

    //hide needle and show logo
    $("body").removeClass("full-opacity");
    //$("#needle").hide();
    $("#needle").addClass("hide-logo");
    $("header").children().show();
    
    console.log("presentQuestion");
    secondsLeft = questionTime;
    let order = randomOrder();
    $("#question").text(questionBank[questionIndex].question);

    // set up answer buttons
    $(".answer").each(function(index, element) {
        let answer = questionBank[questionIndex].answers[order[index]];
        $(this).text(answer.replace("*","")); // removes * from the correct answer
        $(this).attr("data-correct", answer.includes("*")); 
    }); 
    $(".answer").click(checkAnswer);
    $(".answer").addClass("clickable"); // enable hover effects
    $("#answers-area").show();

    $("#communication").text("Time remaining: " + secondsLeft + " seconds");
    questionTimer = setInterval(updateTimer, 1000);
    


}

function randomOrder() {
    // return the digits 0 through 3 in a random order
    let regularOrder = "0123";
    let newOrder = "";
    while (regularOrder.length > 0) {
        let index = Math.floor(Math.random() * regularOrder.length);
        newOrder += regularOrder[index];
        regularOrder = regularOrder.slice(0, index) + regularOrder.slice(index+1);
    }
    return newOrder;
}

function updateTimer() {
    secondsLeft--;
    $("#communication").text("Time remaining: " + secondsLeft + " seconds");
    if (secondsLeft <= 0) {
        clearInterval(questionTimer); // stop timer countdown
        timedOutAnswers++;
        $('#communication').text("Out of time! The correct answer is " + $('.answer[data-correct="true"]').text() + ".");
  
        showAnswer();
    }
}

function checkAnswer () {
    clearTimeout(questionTimer);

    console.log("checkAnswer"); 

    if ($(this).attr("data-correct") === 'true') {
        console.log("Correct!");
        correctAnswers++;
        $("#communication").text("Correct!");
    }
    else {
        console.log("Wrong!");
        wrongAnswers++;
        $("#communication").html("Wrong! The correct answer is <strong>" + $('.answer[data-correct="true"]').text() + "</strong>.");
    }
    showAnswer();
}

function showAnswer() {
    // disable answer buttons
    $(".answer").off("click");
    $(".answer").removeClass("clickable"); // disable hover effects

    //show speedometer needle
    $("body").addClass("full-opacity");
    $("#needle").removeClass();
    $("#needle").addClass("accelerate" + correctAnswers);
    $("header").addClass("hide-logo")

    if (correctAnswers - wrongAnswers === 8) {
        // reached 88 miles per hour!
        audio88mph.play();
    }
    

    if (questionIndex === questionBank.length-1) {
        setTimeout(showTotals, answerTime*1000);
    } else {
        questionIndex++; //next question
        setTimeout(presentQuestion, answerTime*1000);
    }
}

function showTotals() {
    audioEnd.play();
    
    // clear the last question
    $("#question").empty();
    $("#answers-area").hide();
   
    //show totals from the game
    $("#communication").html("<p>All done! Let's see how you did:</p>")
    $("#communication").append("<p>Correct answers: " + correctAnswers + " </p>")
    $("#communication").append("<p>Wrong answers: " + wrongAnswers + " </p>")
    $("#communication").append("<p>Unanswered: " + timedOutAnswers + " </p>")
    $("#start").text("Play again?");
    $("#start").show();
}

window.onload = function() {
    $("#start").click(startGame);
    //$(".answer").click(checkAnswer);
}



if ($(document).ready()) {
  
    initGame();

}   