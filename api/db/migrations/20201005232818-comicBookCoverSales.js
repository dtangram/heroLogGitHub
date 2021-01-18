module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'SaleLists',
    'comicBookCover',
    {
      type: Sequelize.STRING,
    },
  ),

  down: queryInterface => queryInterface.removeColumn('SaleLists', 'comicBookCover'),
};
