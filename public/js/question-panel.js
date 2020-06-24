let categoryList = $('#category-list');
let questionList = $('#question-list');

categoryList.on('change', function () {
    $.ajax({
        url: "/getQuestions",
        method: "POST",
        dataType: "JSON",
        data: {
            id: categoryList.val()
        }
    }).done(function (response) {
        if (response.success) {
            questionList.html('');
            let questionListHtml = "";
            response.questions.forEach((question) => {
                questionListHtml += '<p>' + question.question + '</p>' +
                                    '<p>' + question.answer + '</p>';
            });
            questionList.html(questionListHtml);
        } else {
            console.log(response.msg);
        }
    });
});