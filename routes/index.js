const express = require('express');

const router = express.Router();

const User = require('../models/user');
const mw = require('../models/middleware');

router.get('/', (req, res, next) => {
  req.session.test = 'hello';
  return res.render('index', {
    title: 'Authcord',
  });
});

router.get('/dashboard', mw.loggedIn, (req, res, next) => {
  console.log(req.session.user);
  return res.render('pages/dashboard', {
    user: req.session.user,
    admin: process.env.DEFAULT_ADMIN == req.session.user.id,
  });
});

router.get('/activate', mw.loggedIn, (req, res, next) => {
  res.render('pages/activate', {
    user: req.session.user,
    error: req.session.error,
  });
  req.session.error = undefined;
});

router.post('/activate', mw.loggedIn, async (req, res, next) => {
  const { key } = req.body;

  // Activate key
  const activated = await User.activate(req.session.user.id, key);
  if (activated === true) {
    req.session.user = await User.getSelf(req.session.user.id);
    return res.redirect('/dashboard');
  }
  req.session.error = activated;
  return res.redirect('/activate');
});

router.get('/logout', (req, res, next) => {
  req.session.user = undefined;
  return res.redirect('/');
});

module.exports = router;
