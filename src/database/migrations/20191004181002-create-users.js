"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      name: {
        allowNull: false,
        type: Sequelize.STRING
      },

      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },

      password_hash: {
        allowNull: false,
        type: Sequelize.STRING
      },

      provider: {
        allowNull: false,
        defaulValue: false,
        type: Sequelize.BOOLEAN
      },

      created_At: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updated_At: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users");
  }
};
