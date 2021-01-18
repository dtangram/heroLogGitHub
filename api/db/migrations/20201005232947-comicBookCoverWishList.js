module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'WishLists',
    'comicBookCover',
    {
      type: Sequelize.STRING,
    },
  ),

  down: queryInterface => queryInterface.removeColumn('WishLists', 'comicBookCover'),
};
