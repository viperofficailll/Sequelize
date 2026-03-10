"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable("TodosfromMigration", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      Title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      Description: { type: Sequelize.STRING, allowNull: true },
      IsCompleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        validate: {
          isIn: [[true, false]],
        },
      },
      CreatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      UpdatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable("TodosfromMigration");
  },
};
