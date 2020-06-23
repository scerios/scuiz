let categoryBtns = $('.btn-category');
let authorizeBtns = $('.btn-authorize');
let collectAnswersBtn = $('#collect-answers-btn');
let evaluateBtn = $('#evaluate-btn');
let logoutEveryoneBtn = $('#logout-everyone-btn');
let question = $('#question');
let answer = $('#answer');

socket.on('showPlayer', (data) => {
    addUserToList(data.user);
});

socket.on('userLeft', (data) => {
    userTable.row($('#' + data.userSocketId)).remove().draw();
});

socket.on('getAnswer', (data) => {
    addAnswerToEvaluationTable(data.user);
});

socket.on('getQuestion', (data) => {
    let categoryBtn = $('#category-' + data.question.id);
    toggleEvaluationModal();
    question.text(data.question.question);
    answer.text(data.question.answer);
    categoryBtn.tooltip('hide');
    categoryBtn.attr('data-original-title', data.nextQuestion.question);
});

socket.on('chosenCategory', (data) => {
    $(`#category-${data.categoryId}`).removeClass('btn-success').addClass('btn-orange');
});

$(document).on('click', '.btn-authorize', function () {
    socket.emit('authorizeUser', { userSocketId: $(this).attr('data-socket-id') });
});

categoryBtns.on('click', function () {
    socket.emit('pickQuestion', { categoryId: $(this).attr('data-category-id'), index: getCategoryIndexAndUpdateElement($(this)), timer: timer.val() });

    if (getHowManyCategoryLeft(categoryBtns) === 0) {
        let index = getCategoryIndexAndEnableAllCategories(categoryBtns);
        socket.emit('raiseCategoryLimit', { index: index });
    }

    disableCategoryButtons();
});

timer.on('blur', function() {
    if (timer.val() === '' || !Number.isInteger(parseInt(timer.val()))) {
        timer.val(0);
    }
});

pointValue.on('blur', function() {
    if (pointValue.val() === '' || pointValue.val() < 2 || !Number.isInteger(parseInt(pointValue.val()))) {
        pointValue.val(2);
    }
});

collectAnswersBtn.on('click', function () {
    socket.emit('collectAnswers');
});

evaluateBtn.on('click', function() {
    let evaluationBox = $(document).find('.evaluate');
    let correct = [];
    let incorrect = [];

    for (let i = 0; i < evaluationBox.length; i++) {
        let element = $(evaluationBox[i]);
        let changeValue = parseInt($('#' + element.attr('data-id') + '-answer-value').val());
        let pointElement = $(document).find('#' + element.attr('data-socket-id') + '-point');
        let pointElementValue = parseInt(pointElement.text());
        if (element.prop('checked')) {
            correct.push({
                id: element.attr('data-id'),
                socketId: element.attr('data-socket-id'),
                point: pointElementValue,
                changeValue: changeValue
            });
            answerCorrect(pointElement, changeValue);
        } else {
            incorrect.push({
                id: element.attr('data-id'),
                socketId: element.attr('data-socket-id'),
                point: pointElementValue,
                changeValue: changeValue
            });
            answerIncorrect(pointElement, changeValue);
        }
    }
    socket.emit('finishQuestion', { correct: correct, incorrect: incorrect });
    evaluationTable.clear().draw();
    toggleEvaluationModal();
    question.text('');
    answer.text('');
    enableCategoryButtons();
});

logoutEveryoneBtn.on('click', function () {
    userTable.clear().draw();
    socket.emit('logoutEveryone');
});

function getCategoryIndexAndUpdateElement(element) {
    let index = element.attr('data-category-index');
    index++;
    if (index % 3 === 0) {
        element.prop('disabled', true);
        element.removeClass('btn-success').addClass('btn-danger');
    } else {
        element.removeClass('btn-orange').addClass('btn-success');
    }
    element.attr('data-category-index', index);
    return index;
}

function getHowManyCategoryLeft(categories) {
    let counter = 0;
    for (let i = 0; i < categories.length; i++) {
        if (!$(categories[i]).prop('disabled')) {
            counter++;
        }
    }
    return counter;
}

function getCategoryIndexAndEnableAllCategories(categories) {
    let index = 0;
    for (let i = 0; i < categories.length; i++) {
        $(categories[i]).prop('disabled', false);
        $(categories[i]).removeClass('btn-danger');
        $(categories[i]).addClass('btn-success');
        if (i === 0) {
            index = $(categories[i]).attr('data-category-index');
        }
    }
    return index;
}

function addAnswerToEvaluationTable(user) {
    let value = user.isDoubled? 4 : user.answer.length === 0? 0 : 2;
    evaluationTable.row.add([
        user.name,
        user.timeLeft,
        user.answer,
        '<div class="form-group">' +
        '    <div class="custom-control custom-switch">' +
        '        <input type="checkbox" class="custom-control-input evaluate" id="' + user.id + '-evaluate"' +
        '               data-id="' + user.id + '" data-socket-id="' + user.socketId + '">' +
        '        <label class="custom-control-label" for="' + user.id + '-evaluate"></label>' +
        '    </div>' +
        '</div>',
        '<div class="form-group">' +
        '    <input type="text" class="form-control form-control-sm short-input text-center" id="' + user.id + '-answer-value"' +
        '           data-id="' + user.id + '" data-socket-id="' + user.socketId + '"' +
        '           value="' + value + '">' +
        '</div>'
    ]).draw();
}

function removeRedundantElements() {
    let tableInfos = $(document).find('.dataTables_info');
    for (let i = 0; i < tableInfos.length; i++) {
        $(tableInfos[i]).remove();
    }
}

function toggleEvaluationModal() {
    $('#evaluation-modal').modal('toggle');
}

function answerCorrect(pointElement, value) {
    pointElement.text(parseInt(pointElement.text()) + parseInt(value));
}

function answerIncorrect(pointElement, value) {
    pointElement.text(parseInt(pointElement.text()) - parseInt(value));
}

function enableCategoryButtons() {
    for (let i in categoryBtns) {
        if (categoryBtns.hasOwnProperty(i)) {
            if ($(categoryBtns[i]).hasClass('btn-success')) {
                $(categoryBtns[i]).prop('disabled', false);
            }
        }
    }
}

function disableCategoryButtons() {
    for (let i in categoryBtns) {
        if (categoryBtns.hasOwnProperty(i)) {
            if ($(categoryBtns[i]).hasClass('btn-success')) {
                $(categoryBtns[i]).prop('disabled', true);
            }
        }
    }
}
