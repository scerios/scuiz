let point = $('#point');
let questionCategory = $('#question-category');
let question = $('#question');
let timerContainer = $('#timer-container');
let timer = $('#timer');
let answer = $('#answer');
let doublerBtn = $('#doubler-btn');
let answerBtn = $('#answer-btn');

let isPrimary = false;
let isWarning = false;

let counter;

$(document).ready(() => {
    socket.emit('signUpForGame', {
        playerId: myId
    });
});

socket.on('getNextQuestion', (data) => {
    if (data.timer === '0') {
        timer.html('<i class="fas fa-infinity"></i>');
    } else {
        timer.text(data.timer);

        counter = setInterval(() => {
            time = parseFloat(timer.text());

            changeTimerColor(time);

            if (time === 0) {
                sendAnswerForEvaluation();
                resetGameBoard();
            } else {
                timer.text((time - 0.1).toFixed(1));
            }
        }, 100);
    }
    answer.prop('disabled', false);
    doublerBtn.prop('disabled', false);
    answerBtn.prop('disabled', false);
    questionCategory.text(data.category);
    question.text(data.question);
});

socket.on('updatePoint', (data) => {
    point.text(data.point);
});

socket.on('forcePostAnswer', () => {
    sendAnswerForEvaluation();
    resetGameBoard();
});

answerBtn.on('click', function () {
    sendAnswerForEvaluation();
    resetGameBoard();
});

function changeTimerColor(time) {
    if (time < 15 && !isPrimary) {
        timerContainer.removeClass('bg-success').addClass('bg-primary');
        isPrimary = true;
    }

    if (time < 5 && !isWarning) {
        timerContainer.removeClass('bg-primary').addClass('bg-warning');
        isWarning = true;
    }
}

function sendAnswerForEvaluation() {
    socket.emit('postAnswer', {
        player: {
            id: myId,
            name: myName,
            timeLeft: !isNaN(parseFloat(timer.text()))? parseFloat(timer.text()) : 0,
            answer: answer.val()
        }
    });
}

function resetGameBoard() {
    clearInterval(counter);
    questionCategory.text('');
    question.text('');
    isPrimary = false;
    isWarning = false;
    timerContainer.removeClass('bg-primary bg-warning').addClass('bg-success');
    timer.text('');
    answer.val('');
    answer.prop('disabled', true);
    doublerBtn.prop('disabled', true);
    answerBtn.prop('disabled', true);
}
