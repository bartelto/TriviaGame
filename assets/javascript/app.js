// the correct answers are preceded by an '*'

let questionIntervalId = ""; // for canceling the timer once the player selects an answer
let questionIndex = 0; // for tracking which question we're on
const questionTime = 100; // time question is shown, in seconds
const answerTime = 3; // time answer is shown, in seconds
let audioDuration = 0;
let secondsLeft = 0; // counts down to zero
let correctAnswers = 0;
let stalledAnswers = 0; // a wrong answer when your speed is already 0
let wrongAnswers = 0;
let timedOutAnswers = 0;
let audioWontStart = new Audio("assets/audio/Delorean Won't Start.mp3");
let audioStarting = new Audio("assets/audio/Delorean Starting.mp3");
let audioEnd = new Audio("assets/audio/35 End Logo (Alternate).mp3");
let audioDecel = new Audio("assets/audio/Decelerating.mp3");
let audAccel = [];


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
        question: "Marty's jailbird uncle is still a baby back in 1955. What is his first name?",
        answers: 
            [
                "*Joey",
                "Jimmy",
                "Jerry",
                "Jack"
            ]
    },
    {
        question: "Who directed <em>Back to the Future</em>?",
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
        question: "What was Doc Brown doing right before he hit his head and came up with the idea for the flux capacitor?",
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
    // load acceleration sound effects
    for (let i=1; i<11; i++) {
        audAccel.push(new Audio(`assets/audio/Accelerating ${i}.mp3`))
    }
    
    $("#answers-area").hide();
    $("#start").addClass("clickable");
    $("#start").show();
    $("#needle").addClass("hide-logo");
    //$("#needle").hide();
    //$("header").hide();
    $("#communication").html("<p>Take a joyride in Doc Brown's DeLorean! Each correct answer helps you push the accelerator a bit further.</p>")
}

function startGame() {
    correctAnswers = 0;
    wrongAnswers = 0;
    timedOutAnswers = 0;
    questionIndex = 0;
    audioStarting.play();

    $("#communication, #start")
        .animate( { opacity: 0}, 1000, function() {
            $("#communication, #start").hide()
                .animate( { opacity: 1}); 
         });

    $("header")
        .delay(1200)
        .animate( { left: "-=100"}, 300) 
        .animate( { left: "+=2000"}, 1000)
        .animate( { opacity: 0} )
        .animate( { left: "-=1900"}, presentQuestion);
        
}

function presentQuestion() {
    $("header").addClass("hide-logo");
    $("#needle").removeClass("hide-logo");
    $("body").addClass("full-opacity");

    secondsLeft = questionTime;
    let order = randomOrder();
    
    $("#question").html(questionBank[questionIndex].question);

    // set up answer buttons
    $(".answer").each(function(index, element) {
        let answer = questionBank[questionIndex].answers[order[index]];
        $(this).removeClass("correct");
        $(this).text(answer.replace("*","")); // removes * from the correct answer
        $(this).attr("data-correct", answer.includes("*")); 
    }); 
    $(".answer").click(checkAnswer);
    $(".answer").addClass("clickable"); // enable hover effects
    $("#answers-area").show();

    $("#communication").show();
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

    //console.log("checkAnswer"); 

    //show speedometer needle
    $("body").addClass("full-opacity");
    $("#needle").removeClass();

    if ($(this).attr("data-correct") === 'true') {
        //console.log("Correct!");

        audAccel[correctAnswers-wrongAnswers].play();
        audioDuration = audAccel[correctAnswers-wrongAnswers].duration;

        correctAnswers++;

        if (correctAnswers-wrongAnswers === 8) { // 88mph
            console.log("in here");
            setTimeout(flash, 6500);

            function flash() {
                $(".overlay")
                    .show()
                    .delay(200)
                    .fadeOut();
            }
        }
        
        $("#communication").text("Correct!");
        $("#needle").addClass("accelerate" + (correctAnswers-wrongAnswers));
    }
    else {
        //console.log("Wrong!");
        if (wrongAnswers >= correctAnswers) { //car is "stalled" and can't go any slower
            stalledAnswers++;
            audioWontStart.play();
            audioDuration = audioWontStart.duration;
        } else {
            wrongAnswers++;
            audioDecel.play();
            audioDuration = audioDecel.duration;
        }
        $("#communication").html("Wrong! The correct answer is <strong>" + $('.answer[data-correct="true"]').text() + "</strong>.");
        if (correctAnswers >= wrongAnswers && correctAnswers > 0) {
            $("#needle").addClass("decelerate" + (correctAnswers-wrongAnswers));
        }
    }

    // disable answer buttons
    $(".answer").off("click");
    $(".answer").removeClass("clickable"); // disable hover effects
    
    showAnswer();
}

function showAnswer() {
    console.log("audioDuration:" + audioDuration );
    $('.answer[data-correct="true"]').addClass("correct");    

    if (questionIndex === questionBank.length-1) {
        setTimeout(showTotals, Math.max(answerTime,audioDuration)*1000);
    } else {
        questionIndex++; //next question
        setTimeout(presentQuestion, Math.max(answerTime,audioDuration)*1000);
    }
}

function showTotals() {
    audioEnd.play();

    // clear the last question
    $("#question").empty();
    $("#answers-area").hide();
    $("header").removeClass("hide-logo");
    $("#needle").addClass("hide-logo");
    $("body").removeClass("full-opacity");

    $("header")
        .animate( { left: "-2000"} ) 
        .animate( { opacity: 1 } )
        .animate( { left: "+=2100"}, 1000) 
        .animate( { left: "-=100"}, 300, function() {
   
        //show totals from the game
        let endMessage = "";
        if (correctAnswers - wrongAnswers >= 8) {
            endMessage = "Great Scott! You hit 88 mph and traveled back in time!";
        } else {
            endMessage = "Disappointing. You've gotta drive faster to activate the flux capacitor!";
        }

        $("#communication").html(`<p>${endMessage}</p>`);
        $("#communication").append("<p>Here's how you did:</p>");
        $("#communication").append(`<p>Correct answers: ${correctAnswers} </p>`);
        $("#communication").append(`<p>Wrong answers: ${wrongAnswers + stalledAnswers}</p>`);
        $("#communication").append(`<p>Unanswered: ${timedOutAnswers}</p>`);
        $("#start").text("Play again?");
        $("#start").show();
    });
}

window.onload = function() {
    $("#start").click(startGame);
    //$(".answer").click(checkAnswer);
}

$(".overlay").click(function () {
    console.log ("click");

    for (let i=0; i<10; i++) {
    $(".overlay")
        .animate( { backgroundColor: "white"}, 80)
        .animate( { backgroundColor: "transparent"}, 80);
    }

})

if ($(document).ready()) {
  
    initGame();

}   