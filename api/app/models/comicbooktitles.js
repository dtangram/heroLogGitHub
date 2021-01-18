module.exports = (sequelize, DataTypes) => {
  const ComicBookTitles = sequelize.define('ComicBookTitles', {
    id: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: { args: 4, msg: 'ID not valid, please try again' },
      },
    },
    cbTitle: {
      type: DataTypes.STRING,
      validate: {
        len: { args: [1, 500], msg: 'Comic Book title is required' },
      },
    },
  }, {});
  ComicBookTitles.associate = (models) => {
    // associations can be defined here
    ComicBookTitles.belongsTo(models.CollectionPublishers, { foreignKey: 'collectpubId' });
    ComicBookTitles.hasMany(models.ComicBooks, { foreignKey: 'comicbooktitlerelId' });
  };
  return ComicBookTitles;
};
