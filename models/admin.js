/**
 * Imports
 */

const { v4: uuid } = require('uuid');
const moment = require('moment');
const knex = require('./database');

const Admin = {
  key_types: {
    monthly: '31',
    semiannually: '183',
    yearly: '365',
    lifetime: '3650',
  },
};

Admin.generateKey = async type => {
  try {
    // Check type is valid
    if (!Admin.key_types[type]) {
      return {
        success: false,
        message: "Invalid type when trying to generate an activation key. You shouldn't be seeing this page.",
      };
    }

    const key = uuid()
      .split('-')
      .join('')
      .slice(0, 20)
      .toUpperCase()
      .match(/.{1,5}/g)
      .join('-');

    await knex('keys').insert({
      discord_id: null,
      activation_key: key,
      expires_at: moment()
        .add(Admin.key_types[type], 'days')
        .format('YYYY-MM-DD HH:mm:ss'),
    });

    return {
      success: true,
      key,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: `There was an error trying to generate an activation key - ${err.message}`,
    };
  }
};

Admin.findUser = async query => {
  try {
    const discord = await knex('discords')
      .leftOuterJoin('keys', 'discords.id', '=', 'keys.discord_id')
      .where('discords.id', query)
      .orWhere('keys.activation_key', query)
      .column([
        'discords.id',
        'discords.username',
        'discords.discriminator',
        'discords.email',
        'discords.avatar',
        'discords.refresh_token',
        'discords.access_token',
        'discords.joined_at',
        'keys.activation_key',
        'keys.expires_at',
        'keys.created_at',
      ])
      .first();

    console.log(discord);

    if (discord) {
      discord.expires_at_formatted = moment(discord.expires_at).format('Do MMMM, YYYY');
      discord.created_at_formatted = moment(discord.created_at).format('Do MMMM, YYYY');
      discord.joined_at_formatted = moment(discord.joined_at).format('Do MMMM, YYYY');
      return {
        success: true,
        path: `/admin/users/${query}`,
        data: discord,
      };
    }

    return {
      success: false,
      message: 'Unable to find a user for this search query.',
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: 'There was an error trying to find a user for this search query',
    };
  }
};

Admin.getUsers = async () => {
  try {
    const users = await knex('discords')
      .leftOuterJoin('keys', 'keys.discord_id', '=', 'discords.id')
      .columns([
        'discords.id',
        'discords.username',
        'discords.discriminator',
        'discords.joined_at',
        'keys.activation_key',
        'keys.expires_at',
      ]);

    users.map(user => {
      const newUser = user;
      if (newUser.activation_key) {
        newUser.expires_at_formatted = moment(user.expires_at).format('Do MMMM, YYYY');
        newUser.created_at_formatted = moment(user.created_at).format('Do MMMM, YYYY');
      }

      newUser.joined_at_formatted = moment(user.joined_at).format('Do MMMM, YYYY');
      return newUser;
    });

    console.log(users);

    return users;
  } catch (err) {
    console.log(err);
    return false;
  }
};

Admin.getKeys = async () => {
  try {
    const keys = await knex('keys').leftOuterJoin('discords', 'discords.id', '=', 'keys.discord_id');

    keys.map(key => {
      const newKey = key;
      newKey.expires_at_formatted = moment(key.expires_at).format('Do MMMM, YYYY');
      newKey.created_at_formatted = moment(key.created_at).format('Do MMMM, YYYY');

      return newKey;
    });

    return keys;
  } catch (err) {
    console.log(err);
    return false;
  }
};

Admin.getKey = async activationKey => {
  try {
    const key = await knex('keys')
      .where('activation_key', activationKey)
      .first();

    if (key) {
      key.expires_at_formatted = moment(key.expires_at).format('Do MMMM, YYYY');
      key.created_at_formatted = moment(key.created_at).format('Do MMMM, YYYY');

      return key;
    }

    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

Admin.updateKey = async (activationKey, values) => {
  try {
    await knex('keys')
      .update(values)
      .where('activation_key', activationKey);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = Admin;
