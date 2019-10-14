"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("appointments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      date: {
        allowNull: false,
        type: Sequelize.DATE
      },

      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', //p/ alterar em users também
        onDelete: 'SET NULL',
        allowNull: true,
      },

      provider_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', //p/ alterar em users também
        onDelete: 'SET NULL',
        allowNull: true,
      },

      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true,
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
    return queryInterface.dropTable("appointments");
  }
};
