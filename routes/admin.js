const express = require('express');
const router  = express.Router();

const Admin   = require('../models/admin')
const mw      = require('../models/middleware')
const moment  = require('moment')

router.get('/', [ mw.loggedIn, mw.isAdmin ], async (req, res, next) => {
	return res.render('admin/index')
});

router.get('/generate', [ mw.loggedIn, mw.isAdmin ], async (req, res, next) => {
    return res.render('admin/generate')
});

router.post('/generate', [ mw.loggedIn, mw.isAdmin ], async (req, res, next) => {
    const type     = req.body.type
    const generate = await Admin.generateKey(type)

    if (generate.success) {
        return res.render('admin/generate', {
            key: generate.key
        })
    } else {
        return res.render('admin/generate', {
            error: generate.message
        })
    }
});

router.get('/users', [ mw.loggedIn, mw.isAdmin ], async (req, res, next) => {
    const users = await Admin.getUsers()
	return res.render('admin/users', {
        users: users
    })
});

router.post('/users', [ mw.loggedIn, mw.isAdmin ], async (req, res, next) => {
    const query = req.body.query
    const found = await Admin.findUser(query)

    if (found.success) {
        return res.redirect(found.path)
    }

	return res.render('admin/users', {
        error: found.message
    })
});

router.get('/users/:id', [ mw.loggedIn, mw.isAdmin ], async (req, res, next) => {
    const id   = req.params.id
    const user = await Admin.findUser(id)

    if (user.success) {
        return res.render('admin/users-view', {
            user: user
        })
    }

    return res.redirect('/admin/users')
	
});

router.get('/keys', [ mw.loggedIn, mw.isAdmin ], async (req, res, next) => {
    const keys = await Admin.getKeys()
	return res.render('admin/keys', {
        keys: keys
    })
});

router.get('/keys/:key', [ mw.loggedIn, mw.isAdmin ], async (req, res, next) => {
    const query = req.params.key
    const key   = await Admin.getKey(query)

    if (key) {
        return res.render('admin/keys-edit', {
            key: key
        })
    }

    return res.redirect('/admin/keys')
	
});

router.post('/keys/:key', [ mw.loggedIn, mw.isAdmin ], async (req, res, next) => {
    const query    = req.params.key
    let key        = await Admin.getKey(query)

    if (key) {
        await Admin.updateKey(query, {
            expires_at: moment(req.body.expirary).format('YYYY-MM-DD HH:mm:ss')
        })

        return res.render('admin/keys-edit', {
            key: await Admin.getKey(query)
        })
    }

    return res.redirect('/admin/keys')
	
});

module.exports = router
