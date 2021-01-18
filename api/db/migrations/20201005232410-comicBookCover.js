module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'ComicBooks',
    'comicBookCover',
    {
      type: Sequelize.STRING,
    },
  ),

  down: queryInterface => queryInterface.removeColumn('ComicBooks', 'comicBookCover'),
};
