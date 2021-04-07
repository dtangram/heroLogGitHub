module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Messagings',
    'userSent',
    {
      type: Sequelize.STRING,
    },
  ),

  down: queryInterface => queryInterface.removeColumn('Messagings', 'userSent'),
};
