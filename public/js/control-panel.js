let isEvaluationTableShown = false;
let playerTableBody = $('#player-table-body');
let evaluationTableContainer = $('#evaluation-table-container');
let evaluationTableBody = $('#evaluation-table-body');
let categoryBtn = $('.btn-category');
let evaluateBtn = $('#evaluate-btn');

socket.on('showPlayer', (data) => {
    addPlayerToList(data.player);
});

socket.on('playerLeft', (data) => {
    $(document).find('#' + data.playerSocketId).remove();
});

socket.on('getAnswer', (data) => {
    addAnswerToEvaluationTable(data.player);
});

categoryBtn.on('click', function () {
    socket.emit('pickQuestion', { categoryId: $(this).attr('data-category-id'), index: getCategoryIndexAndUpdateElement($(this)), timer: timer.val() });

    if (getHowManyCategoryLeft(categoryBtn) === 0) {
        let index = getCategoryIndexAndEnableAllCategories(categoryBtn);
        socket.emit('raiseCategoryLimit', { index: index });
    }
});

timer.on('blur', function() {
    if (timer.val() === '') {
        timer.val(0);
    }
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
                point: parseInt($('#' + $(evaluationBox[i]).attr('data-socket-id') + '-point').text())
            });
            let point = $(document).find('#' + $(evaluationBox[i]).attr('data-socket-id') + '-point');
            point.text(parseInt(point.text()) + 2);
        } else {
            incorrect.push($(evaluationBox[i]).attr('data-id'));
        }
    }
    socket.emit('finishQuestion', { correct: correct, incorrect: incorrect });
    evaluationTableBody.html('');
    evaluationTableContainer.fadeOut();
    isEvaluationTableShown = false;
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
    if (!isEvaluationTableShown) {
        evaluationTableContainer.fadeIn();
        isEvaluationTableShown = true;
    }
    let evaluationTableBodyHtml = evaluationTableBody.html();
    evaluationTableBodyHtml += '<tr>' +
        '                    <td>' + player.name + '</td>' +
        '                    <td>' + player.timeLeft + '</td>' +
        '                    <td>' + player.answer + '</td>' +
        '                    <td>' +
        '                        <div class="form-group">' +
        '                            <div class="custom-control custom-switch">' +
        '                                <input type="checkbox" class="custom-control-input evaluate" id="' + player.id + '-evaluate"' +
        '                                       data-id="' + player.id + '" data-socket-id="' + player.socketId + '">' +
        '                                <label class="custom-control-label" for="' + player.id + '-evaluate"></label>' +
        '                            </div>' +
        '                        </div>' +
        '                    </td>' +
        '                </tr>';

    evaluationTableBody.html(evaluationTableBodyHtml);
}

function removeEmptyRows() {
    let emptyRows = $(document).find('.dataTables_empty').parents('tr');
    for (let i = 0; i < emptyRows.length; i++) {
        $(emptyRows[i]).remove();
    }
}
