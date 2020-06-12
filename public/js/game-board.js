let categoryPickModal = $('#category-pick-modal');

let loadingScreen = $('#loading-screen');
let successSign = $('#success-sign');
let failSign = $('#fail-sign');

let point = $('#point');
let questionCategory = $('#question-category');
let question = $('#question');
let timerContainer = $('#timer-container');
let timer = $('#timer');
let doublerBtn = $('#doubler-btn');
let answer = $('#answer');
let answerBtn = $('#answer-btn');

let isThinking = false;
let isDoubled = false;
let isPrimary = false;
let isWarning = false;

let counter;

$(document).ready(() => {
    socket.emit('signUpForGame', {
        playerId: myId
    });
});

socket.on('getNextQuestion', (data) => {
    isThinking = true;
    if (data.timer === '0') {
        timer.html('<i class="fas fa-infinity"></i>');
    } else {
        let untilDate = new Date();
        untilDate.setSeconds(untilDate.getSeconds() + parseInt(data.timer) + 2);
        let until = untilDate.getTime();

        counter = setInterval(() => {
            let now = new Date().getTime();
            let remaining = until - now;
            let minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            if (seconds.toString().length === 1) {
                seconds = "0" + seconds;
            }

            changeTimerColor(minutes, seconds);

            if (minutes === 0 && seconds === '00') {
                sendAnswerForEvaluation(true);
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
    isLoadingScreenOn(false);
    console.log(point.text());
    console.log(data.point);
    if (parseInt(point.text()) >= data.point) {
        toggleElement(failSign);
    } else {
        toggleElement(successSign);
    }
    point.text(data.point);
});

socket.on('forcePostAnswer', () => {
    if (isThinking) {
        sendAnswerForEvaluation(true);
        resetGameBoard();
    }
});

socket.on('doublerDisabled', () => {
    doublerBtn.prop('disabled', true);
});

socket.on('doublerClicked', (data) => {
    if (data.isClicked) {
        doublerBtn.prop('disabled', true);
        doublerBtn.text(doublerBtnClickedText);
        doublerBtn.removeClass('btn-info').addClass('btn-success');
        isDoubled = true;
    }
});

socket.on('authorize', () => {
    toggleModal(categoryPickModal);
});

doublerBtn.on('click', function () {
    socket.emit('takeChances');
});

answerBtn.on('click', function () {
    sendAnswerForEvaluation(false);
    resetGameBoard();
});

function changeTimerColor(minutes, seconds) {
    if (minutes === 0) {
        if (seconds <= 30 && !isPrimary) {
            timerContainer.removeClass('bg-success').addClass('bg-primary');
            isPrimary = true;
        }

        if (seconds <= 15 && !isWarning) {
            timerContainer.removeClass('bg-primary').addClass('bg-warning');
            isWarning = true;
        }
    }
}

function sendAnswerForEvaluation(isTimeExpired) {
    socket.emit('postAnswer', {
        player: {
            id: myId,
            name: myName,
            timeLeft: isTimeExpired? '0 : 00' : timer.text(),
            answer: answer.val(),
            isDoubled: isDoubled
        }
    });
    isDoubled = false;
    isLoadingScreenOn(true);
}

function resetGameBoard() {
    clearInterval(counter);
    questionCategory.text('');
    question.text('');
    isThinking = false;
    isDoubled = false;
    isPrimary = false;
    isWarning = false;
    timerContainer.removeClass('bg-primary bg-warning').addClass('bg-success');
    timer.text('');
    doublerBtn.prop('disabled', false);
    doublerBtn.text(doublerBtnText);
    doublerBtn.removeClass('btn-success').addClass('btn-info');
    answer.val('');
    answer.prop('disabled', true);
    doublerBtn.prop('disabled', true);
    answerBtn.prop('disabled', true);
}

function isLoadingScreenOn(isOn) {
    if (isOn) {
        loadingScreen.fadeIn();
    } else {
        loadingScreen.fadeOut();
    }
}

function toggleElement(element) {
    element.show();
    setTimeout(() => {
        element.fadeOut();
    }, 2500);
}

function toggleModal(modal) {
    modal.modal('toggle');
}
