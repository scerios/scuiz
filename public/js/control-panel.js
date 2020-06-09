let playerTableBody = $('#player-table-body');
let categoryBtn = $('.btn-category');
let collectAnswersBtn = $('#collect-answers-btn');
let evaluateBtn = $('#evaluate-btn');
let logoutEveryoneBtn = $('#logout-everyone-btn');
let question = $('#question');
let answer = $('#answer');

socket.on('showPlayer', (data) => {
    addPlayerToList(data.player);
});

socket.on('playerLeft', (data) => {
    playerTable.row($('#' + data.playerSocketId)).remove().draw();
});

socket.on('getAnswer', (data) => {
    addAnswerToEvaluationTable(data.player);
});

socket.on('getQuestion', (data) => {
    toggleEvaluationModal();
    question.text(data.question.question);
    answer.text(data.question.answer);
});

categoryBtn.on('click', function () {
    socket.emit('pickQuestion', { categoryId: $(this).attr('data-category-id'), index: getCategoryIndexAndUpdateElement($(this)), timer: timer.val() });

    if (getHowManyCategoryLeft(categoryBtn) === 0) {
        let index = getCategoryIndexAndEnableAllCategories(categoryBtn);
        socket.emit('raiseCategoryLimit', { index: index });
    }
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
        if ($(evaluationBox[i]).prop('checked')) {
            correct.push({
                id: $(evaluationBox[i]).attr('data-id'),
                socketId: $(evaluationBox[i]).attr('data-socket-id'),
                point: parseInt($('#' + $(evaluationBox[i]).attr('data-socket-id') + '-point').text()),
                changeValue: parseInt(pointValue.val())
            });
            let point = $(document).find('#' + $(evaluationBox[i]).attr('data-socket-id') + '-point');
            point.text(parseInt(point.text()) + parseInt(pointValue.val()));
        } else {
            incorrect.push($(evaluationBox[i]).attr('data-id'));
        }
    }
    socket.emit('finishQuestion', { correct: correct, incorrect: incorrect });
    evaluationTable.clear().draw();
    toggleEvaluationModal();
    question.text('');
    answer.text('');
});

logoutEveryoneBtn.on('click', function () {
    playerTableBody.html('');
    socket.emit('logoutEveryone');
});

function getCategoryIndexAndUpdateElement(element) {
    let index = element.attr('data-category-index');
    index++;
    if (index % 3 === 0) {
        element.prop('disabled', true);
        element.removeClass('btn-success');
        element.addClass('btn-warning');
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
        $(categories[i]).removeClass('btn-warning');
        $(categories[i]).addClass('btn-success');
        if (i === 0) {
            index = $(categories[i]).attr('data-category-index');
        }
    }
    return index;
}

function addAnswerToEvaluationTable(player) {
    evaluationTable.row.add([
        player.name,
        player.timeLeft,
        player.answer,
        '<div class="form-group">' +
        '    <div class="custom-control custom-switch">' +
        '        <input type="checkbox" class="custom-control-input evaluate" id="' + player.id + '-evaluate"' +
        '               data-id="' + player.id + '" data-socket-id="' + player.socketId + '">' +
        '        <label class="custom-control-label" for="' + player.id + '-evaluate"></label>' +
        '    </div>' +
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
