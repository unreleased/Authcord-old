const Middleware = {}

Middleware.loggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        return next()
    } else {
        return res.redirect('/discord')
    }
}

Middleware.isAdmin = (req, res, next) => {
    if (req.session.user.id == process.env.DEFAULT_ADMIN) {
        return next()
    } else {
        return res.redirect('/dashboard')
    }
}

module.exports = Middleware