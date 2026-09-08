const { DataTypes } = require('sequelize');
const { createServiceDb } = require('../../../../shared/config/dbConfig');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const sequelize = createServiceDb('auth_db');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: () => crypto.randomUUID(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(
        'Admin',
        'Dealer_Manager',
        'Rental_Analyst',
        'Customer'
      ),
      defaultValue: 'Customer',
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (!user.id) {
          user.id = crypto.randomUUID();
        }
        if (user.password && !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password') && !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = { User, sequelize };
