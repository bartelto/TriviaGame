// the correct answers are preceded by an '*'

let questionTimer = "";


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
    $("#answers").empty();
    $("#answers").html('<div class="button" id="start">Start</div>');
}

function startGame() {
    $("#answers").empty(); // to remove Start button
    questionBank.forEach(presentQuestion);
}

function presentQuestion(q) {
    console.log("Q: " + q.question);
    $("#question").text(q.question);

    let order = randomOrder();
    for (let i=0; i<order.length; i++) {
        let answer = q.answers[order[i]];
        let $btn = $("<div>");
        $btn.addClass("button answer");
        $btn.attr("data-correct", answer.includes("*"));
        $btn.text(answer.replace("*", "")); // trim the leading * from correct answers
        $("#answers").append($btn);

        
    }
    $(".answer").click(checkAnswer);
    questionTimer = setTimeout(checkAnswer, 5000);
    

}

function randomOrder() {
    // return the digits 0 through 3 in a random order
    return ("3210");
}

function checkAnswer () {
    clearTimeout(questionTimer);

    console.log("checkAnswer");
    if (this.attr("data-correct") === true) {
        console.log("Correct!");
    }
    else {
        console.log("Wrong!");
    }


}

window.onload = function() {
    $("#start").click(startGame);
}



if ($(document).ready()) {
  
    
    initGame();

}   