const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');

router.get('/dashboard', isLoggedIn, async(req, res) => {
    const users = await pool.query('SELECT * FROM users');// It send to the list and create an array with the links
    console.log(users)
    res.render('dashboard/users/list',{users});
});

router.get('/dashboard/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    res.render('./dashboard/users/edit', { user: users[0] });
});

router.post('/dashboard/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { fullname, username, email, role, status } = req.body;
    const editUser = {
        fullname,
        username,
        email,
        role,
        status
    };
    await pool.query('UPDATE users set ? WHERE id = ?', [editUser, id]);
    req.flash('success', 'User updated successfully');
    res.redirect('/dashboard');
});

module.exports = router;