function getCategoryAvailabilities(categories, limit) {
    for (let i = 0; i < categories.length; i++) {
        categories[i].isAvailable = categories[i].question_index < limit;
    }
    return categories;
}

exports.getCategoryAvailabilities = getCategoryAvailabilities;