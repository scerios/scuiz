const SqlQueries = require('../services/SqlQueries');

let Queries = new SqlQueries();

class CategoryService {
    getCategoryAvailabilities(categories, limit) {
        for (let i = 0; i < categories.length; i++) {
            categories[i].isAvailable = categories[i].question_index < limit;
        }
        return categories;
    }

    async matchNextQuestionToCategories(categories) {
        for (let i = 0; i < categories.length; i++) {
            let question = await Queries.getNextQuestionByCategoryIdAndQuestionIndexAsync(categories[i].id, categories[i].question_index);
            categories[i].question = question[0].question;
        }
        return categories;
    }
}

module.exports = CategoryService