// Libs
import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

// DB
import db from '../libs/db.js';

const User = db.sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      },
    },
  },
);

User.associate = (models) => {
  User.hasMany(models.Cards);
};

User.isPassword = (encodedPassword, password) =>
  bcrypt.compareSync(password, encodedPassword);

export default User;
