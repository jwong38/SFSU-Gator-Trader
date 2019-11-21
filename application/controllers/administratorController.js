const passport = require('passport');
const db = require('../config/db');

// Display administrator's login page on GET
exports.login_get = (req, res, next) => {
    res.render('adminLogin');
}

// Handle administrator login authentication via Passport API on POST
exports.login_post = (req, res, next) => {
    passport.authenticate('administrator-login', {
        successRedirect: '/admin/dashboard',
        failureRedirect: '/admin/login',
        failureFlash: true,
        badRequestMessage: 'Please fill in all fields'
    })(req, res, next);
}

// Handle administrator logout on GET
exports.logout = (req, res, next) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/');
}

// Display administrator's dashboard page on GET
// Contains list of active and unapproved sales item
// Author @Osbaldo Martinez
exports.dashboard = (req, res, next) => {
    let activeSalesItem = [];
    let unapprovedSalesItem = [];
    let sql = "SELECT SI.*, RU.username AS sellerEmail FROM SalesItem SI INNER JOIN RegisteredUser RU on SI.seller = RU.sid";

    db.query(sql, (err, result) => {
        if (err) throw err;

        for (let i = 0; i < result.length; i++) {
            if (result[i].status == "Active" || result[i].status == "Ended") {
                activeSalesItem.push(result[i])
            }
            else {
                unapprovedSalesItem.push(result[i]);
            }
        }

        res.render('adminDashboard', {
            activeSalesItem: activeSalesItem,
            unapprovedSalesItem: unapprovedSalesItem
        });
    });
}

// Handle approving of sales item on GET
exports.approve = (req, res, next) => {
    let productId = req.query.pid;
    let sql = "UPDATE SalesItem SET status = 2 WHERE pid = ?";

    db.query(sql, [productId], (err, result) => {
        if (err) {
            req.flash('error', 'Error approving item');
            res.redirect('/user/dashbaord');
        }

        if (result.changedRows > 0) {
            req.flash('success', 'Sucessfully approved item');
            res.redirect('/admin/dashboard');
        }
        else {
            req.flash('error', 'Error approving item');
            res.redirect('/user/dashbaord');
        }
    });
}

// Handle disapproving of sales item on GET
exports.disapprove = (req, res, next) => {
    let productId = req.query.pid;
    let sql = "UPDATE SalesItem SET status = 3 WHERE pid = ?";

    db.query(sql, [productId], (err, result) => {
        if (err) {
            req.flash('error', 'Error disapproving item');
            res.redirect('/user/dashbaord');
        }

        if (result.changedRows > 0) {
            req.flash('success', 'Sucessfully disapproved item');
            res.redirect('/admin/dashboard');
        }
        else {
            req.flash('error', 'Error disapproving item');
            res.redirect('/user/dashbaord');
        }
    });
}

// Handle removing of sales item on GET
exports.remove = (req, res, next) => {
    let productId = req.query.pid;
    let sql = "UPDATE SalesItem SET status = 3 WHERE pid = ?";

    db.query(sql, [productId], (err, result) => {
        if (err) {
            req.flash('error', 'Error removing item');
            res.redirect('/user/dashbaord');
        }

        if (result.changedRows > 0) {
            req.flash('success', 'Sucessfully removed item');
            res.redirect('/admin/dashboard');
        }
        else {
            req.flash('error', 'Error removing item');
            res.redirect('/user/dashbaord');
        }
    });
}