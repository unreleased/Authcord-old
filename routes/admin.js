const express = require('express');

const router = express.Router();

const moment = require('moment');
const Admin = require('../models/admin');
const Discord = require('../models/discord');
const mw = require('../models/middleware');

router.get('/', [mw.loggedIn, mw.isAdmin], async (req, res, next) => res.render('admin/index'));

router.get('/generate', [mw.loggedIn, mw.isAdmin], async (req, res, next) => res.render('admin/generate'));

router.post('/generate', [mw.loggedIn, mw.isAdmin], async (req, res, next) => {
  const { type } = req.body;
  const generate = await Admin.generateKey(type);

  if (generate.success) {
    return res.render('admin/generate', {
      key: generate.key,
    });
  }
  return res.render('admin/generate', {
    error: generate.message,
  });
});

router.get('/users', [mw.loggedIn, mw.isAdmin], async (req, res, next) => {
  const users = await Admin.getUsers();
  return res.render('admin/users', {
    users,
  });
});

router.post('/users', [mw.loggedIn, mw.isAdmin], async (req, res, next) => {
  const { query } = req.body;
  const found = await Admin.findUser(query);

  if (found.success) {
    return res.redirect(found.path);
  }

  return res.render('admin/users', {
    error: found.message,
  });
});

router.get('/users/:id', [mw.loggedIn, mw.isAdmin], async (req, res, next) => {
  const { id } = req.params;
  const user = await Admin.findUser(id);

  if (user.success) {
    return res.render('admin/users-view', {
      user,
    });
  }

  return res.redirect('/admin/users');
});

router.get('/users/:id/servers', [mw.loggedIn, mw.isAdmin], async (req, res, next) => {
  const { id } = req.params;
  const servers = await Discord.findServers(id);
  const users = await Admin.findUser(id);

  return res.status(200).render('admin/servers-view', {
    servers,
    user: users,
  });
});

router.get('/keys', [mw.loggedIn, mw.isAdmin], async (req, res, next) => {
  const keys = await Admin.getKeys();
  return res.render('admin/keys', {
    keys,
  });
});

router.get('/keys/:key', [mw.loggedIn, mw.isAdmin], async (req, res, next) => {
  const query = req.params.key;
  const key = await Admin.getKey(query);

  if (key) {
    return res.render('admin/keys-edit', {
      key,
    });
  }

  return res.redirect('/admin/keys');
});

router.post('/keys/:key', [mw.loggedIn, mw.isAdmin], async (req, res, next) => {
  const query = req.params.key;
  const key = await Admin.getKey(query);

  if (key) {
    await Admin.updateKey(query, {
      expires_at: moment(req.body.expirary).format('YYYY-MM-DD HH:mm:ss'),
    });

    return res.render('admin/keys-edit', {
      key: await Admin.getKey(query),
    });
  }

  return res.redirect('/admin/keys');
});

module.exports = router;
