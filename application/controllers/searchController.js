const db = require('../config/db');

// Handle search redirection on POST
exports.post = (req, res, next) => {
    let keyword = req.body.keyword;
    let category = req.body.categories;

    if (keyword) {
        if (category) {
            res.redirect('/search?k=' + keyword + '&c=' + category);
        }
        else {
            res.redirect('/search?k=' + keyword);
        }
    }
    else if (category) {
        res.redirect('/search?c=' + category);
    }
}

// Handle rendering of search results on GET
exports.get = (req, res, next) => {
    let keyword = req.query.k;
    let category = req.query.c;
    let selectedCategoryName = "";
    let product = [];

    if (res.locals.totalPages > 0) {
        if (res.locals.currentPage > res.locals.totalPages || res.locals.currentPage < 1) {
            return res.redirect('/');
        }
    }

    let offset = (res.locals.pageLimit * res.locals.currentPage) - res.locals.pageLimit;

    if (offset < 0) {
        limit += offset;
        offset = 0;
    }

    res.locals.sql += " LIMIT ? OFFSET ?";
    res.locals.placeholders.push(res.locals.pageLimit, offset);

    db.query('SELECT name FROM Category WHERE cid = ?', category, (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            selectedCategoryName = result[0].name;
        }
    });

    db.query(res.locals.sql, res.locals.placeholders, (err, result) => {
        if (err) throw err;

        for (let i = 0; i < result.length; i++) {
            product.push(result[i]);
        }

        res.render('results', {
            selectedCategoryVal: category,
            selectedCategoryName: selectedCategoryName,
            keyword: keyword,
            product: product,
            sortF: res.locals.sortF,
            priceFilter: res.locals.pf,
            conditionFilter: res.locals.cond,  
            pageLimit: res.locals.pageLimit,
            offset: offset,
            totalProducts: res.locals.totalProducts,
            pageCount: res.locals.totalPages,
            currentPage: res.locals.currentPage
        });
    });
}

// Handle rendering of search suggestions on GET
//Author @Osbaldo Martinez
exports.suggestions = (req, res, next) => {
    let sql = "SELECT * FROM SalesItem WHERE name LIKE ? OR description LIKE ?";
    let keyword = req.query.key;
    let product = [];

    db.query(sql, ['%' + keyword + '%', '%' + keyword + '%'], (err, result) => {
        if (err) throw err;

        for (let i = 0; i < result.length; i++) {
            product.push(result[i].name);
        }

        res.send(JSON.stringify(product));
    });
}