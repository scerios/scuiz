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
        let untilDate = new Date();
        untilDate.setSeconds(untilDate.getSeconds() + parseInt(data.timer));
        let until = untilDate.getTime();

        counter = setInterval(() => {
            let now = new Date().getTime();
            let remaining = until - now;
            let minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            if (seconds.toString().length === 1) {
                seconds = "0" + seconds;
            }

            changeTimerColor(parseInt((remaining / 1000).toFixed(0)));

            if (remaining <= 0) {
                sendAnswerForEvaluation();
                resetGameBoard();
            } else {
                timer.text(minutes + " : " + seconds);
            }
        }, 1000);
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

socket.on('doublerClicked', (data) => {
    if (data.isClicked) {
        console.log('Success');
    } else {
        console.log('Fail');
    }
});

doublerBtn.on('click', function () {
    socket.emit('takeChances');
});

answerBtn.on('click', function () {
    sendAnswerForEvaluation();
    resetGameBoard();
});

function changeTimerColor(time) {
    if (time <= 30 && !isPrimary) {
        timerContainer.removeClass('bg-success').addClass('bg-primary');
        isPrimary = true;
    }

    if (time <= 15 && !isWarning) {
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
