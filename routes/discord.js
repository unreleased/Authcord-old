const express = require('express');

const router = express.Router();

const Discord = require('../models/discord');
const User = require('../models/user');

router.get('/', async (req, res, next) => {
  let uri = 'https://discordapp.com/api/oauth2/authorize';
  uri += `?client_id=${process.env.DISCORD_CLIENT_ID}`;
  uri += `&redirect_uri=${process.env.DISCORD_REDIRECT_URI}`;
  uri += '&response_type=code';
  uri += `&scope=${process.env.DISCORD_SCOPES}`;

  return res.redirect(uri);
});

router.get('/callback', async (req, res, next) => {
  if (req.query.code) {
    const { code } = req.query;
    const tokens = await Discord.exchangeCode(code);

    if (tokens.error == 'invalid_request') {
      return res.redirect('/discord');
    }

    const user = await Discord.getUser(tokens.access_token);
    if (await Discord.saveUser(tokens, user)) {
      req.session.user = await User.getSelf(user.id);
      return res.redirect('/dashboard');
    }
    return res.status(400).json({
      success: false,
      message: 'Failed to register an account',
    });
  }
  return res.status(400).json({
    success: false,
    message: 'There was an error authorizing your account.',
  });
});

module.exports = router;
