const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');

router.get('/dashboard/users', isLoggedIn, async(req, res) => {
    const users = await pool.query('SELECT * FROM users');
    console.log(users)// It send to the list and create an array with the links
    res.render('dashboard/users/list',{ users: users});
});

router.get('/dashboard/users/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    res.render('./dashboard/users/edit', { user: users[0] });
});

router.post('/dashboard/users/edit/:id', isLoggedIn, async (req, res) => {
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

router.get('/delete/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE ID = ?', [id]);
    req.flash('success', 'User deleted successfully');
    res.redirect('/dashboard');
});

module.exports = router;