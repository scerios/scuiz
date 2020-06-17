let categoryPickModal = $('#category-pick-modal');
let categoryBtns = $('.btn-category');

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
let isWarning = false;
let isDanger = false;

let counter;

$(document).ready(() => {
    $('#link-game-board').addClass('active');
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
    questionCategory.text(data.category.name);
    question.text(data.question);

    updateElement($(`#category-${data.category.id}`));
    if (getHowManyCategoryLeft() === 0) {
        enableAllCategories();
    }
});

socket.on('updatePoint', (data) => {
    isLoadingScreenOn(false);
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
        doublerBtn.removeClass('btn-success').addClass('btn-orange');
        isDoubled = true;
    }
});

socket.on('authorizeCategoryPick', () => {
    toggleModal(categoryPickModal);
});

doublerBtn.on('click', function () {
    socket.emit('takeChances');
});

answerBtn.on('click', function () {
    sendAnswerForEvaluation(false);
    resetGameBoard();
});

categoryBtns.on('click', function () {
    socket.emit('chooseCategory', { categoryId: $(this).attr('data-category-id') });
    toggleModal(categoryPickModal);
});

function changeTimerColor(minutes, seconds) {
    if (minutes === 0) {
        if (seconds <= 30 && !isWarning) {
            timer.removeClass('text-dirty').addClass('text-warning');
            isWarning = true;
        }

        if (seconds <= 15 && !isDanger) {
            timer.removeClass('text-warning').addClass('text-danger');
            isDanger = true;
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
    isWarning = false;
    isDanger = false;
    timer.removeClass('text-warning text-danger').addClass('text-dirty');
    timer.text('');
    doublerBtn.prop('disabled', false);
    doublerBtn.text(doublerBtnText);
    doublerBtn.removeClass('btn-orange').addClass('btn-success');
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

function updateElement(element) {
    let index = element.attr('data-category-index');
    index++;
    if (index % 3 === 0) {
        element.prop('disabled', true);
        element.removeClass('btn-success');
        element.addClass('btn-danger');
    }
    element.attr('data-category-index', index);
}

function getHowManyCategoryLeft() {
    let counter = 0;
    for (let i = 0; i < categoryBtns.length; i++) {
        if (!$(categoryBtns[i]).prop('disabled')) {
            counter++;
        }
    }
    return counter;
}

function enableAllCategories() {
    for (let i = 0; i < categoryBtns.length; i++) {
        $(categoryBtns[i]).prop('disabled', false);
        $(categoryBtns[i]).removeClass('btn-danger');
        $(categoryBtns[i]).addClass('btn-success');
    }
}
