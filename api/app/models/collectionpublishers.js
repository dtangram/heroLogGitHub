module.exports = (sequelize, DataTypes) => {
  const CollectionPublishers = sequelize.define('CollectionPublishers', {
    id: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: { args: 4, msg: 'ID not valid, please try again' },
      },
    },
    publisherName: {
      type: DataTypes.STRING,
      validate: {
        len: { args: [2, 500], msg: 'Publisher name is required' },
      },
    },
  }, {});
  CollectionPublishers.associate = (models) => {
    // associations can be defined here
    // UNCOMMENT WHEN READY FOR USER
    CollectionPublishers.belongsTo(models.Users, { foreignKey: 'collectpubUsersId' });
    CollectionPublishers.hasMany(models.ComicBookTitles, { foreignKey: 'collectpubId' });
  };
  return CollectionPublishers;
};
