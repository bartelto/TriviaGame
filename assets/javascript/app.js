// the correct answers are preceded by an '*'

let questionIntervalId = ""; // for canceling the timer once the player selects an answer
let questionIndex = 0; // for tracking which question we're on
const questionTime = 5; // time question is shown, in seconds
const answerTime = 3; // time answer is shown, in seconds
let secondsLeft = 0; // counts down to zero
let correctAnswers = 0;
let wrongAnswers = 0;
let timedOutAnswers = 0;


let questionBank = [
    {
        question: "What is your name?",
        answers: 
            [
                "*Todd Bartelt",
                "Jim Carrey",
                "Frank Miller",
                "Bob Hoskins"
            ]
    }, 
    {
        question: "What is your age?",
        answers: 
            [
                "*44",
                "55",
                "33",
                "53"
            ]
    },
    {
        question: "What is your dog's name?",
        answers: 
            [
                "*Tango",
                "Rango",
                "Cash",
                "Johnny"
            ]
    }
];

function initGame() {
    $("#answers-area").hide();
    $("#start").show();
}

function startGame() {
    $("#start").hide();
    $("#answers-area").show();
    correctAnswers = 0;
    wrongAnswers = 0;
    timedOutAnswers = 0;
    questionIndex = 0;

    presentQuestion();
}

function presentQuestion() {
    //console.log("Q: " + q.question);
    console.log("presentQuestion");
    secondsLeft = questionTime;
    let order = randomOrder();
    $("#question").text(questionBank[questionIndex].question);

    $(".answer").each(function(index, element) {
        //console.log(element);
        //console.log(index);
        let answer = questionBank[questionIndex].answers[order[index]];
        $(this).text(answer.replace("*","")); // removes * from the correct answer
        $(this).attr("data-correct", answer.includes("*"));
    }); 

    $("#communication").text("Time remaining: " + secondsLeft + " seconds");
    questionTimer = setInterval(updateTimer, 1000);
    


}

function randomOrder() {
    // return the digits 0 through 3 in a random order
    return ("3210");
}

function updateTimer() {
    secondsLeft--;
    $("#communication").text("Time remaining: " + secondsLeft + " seconds");
    if (secondsLeft <= 0) {
        clearInterval(questionTimer); // stop timer countdown
        $('#communication').text("Out of time! The correct answer is " + $('.answer[data-correct="true"]').text() + ".");
    
        showAnswer();
    }
}

function checkAnswer () {
    clearTimeout(questionTimer);

    console.log("checkAnswer"); 
  
    if ($(this).attr("data-correct") === 'true') {
        console.log("Correct!");
        $("#communication").text("Correct!");
    }
    else {
        console.log("Wrong!");
        $("#communication").text("Wrong! The correct answer is " + $('.answer[data-correct="true"]').text() + ".");
    }
    showAnswer();
}

function showAnswer() {
    
    if (questionIndex === questionBank.length-1) {
        showScore();
    } else {
        questionIndex++; //next question
        setTimeout(presentQuestion, answerTime*1000);
    }
}

function showScore() {
    //show totals from the game

    $("#start").text("Play again?");
    $("#start").show();
}

window.onload = function() {
    $("#start").click(startGame);
    $(".answer").click(checkAnswer);
}



if ($(document).ready()) {
  
    
    initGame();

}   