module.exports = (sequelize, DataTypes) => {
  const WishLists = sequelize.define('WishLists', {
    id: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: { args: 4, msg: 'ID not valid, please try again' },
      },
    },

    comicBookTitle: {
      type: DataTypes.STRING,
      validate: {
        len: { args: [1, 500], msg: 'Comic book title is required' },
      },
    },

    comicBookVolume: {
      type: DataTypes.INTEGER,
      validate: {
        len: { args: [1, 500], msg: 'Comic book volume is required' },
      },
    },

    comicBookYear: {
      type: DataTypes.INTEGER,
      validate: {
        len: { args: [4, 500], msg: 'Comic book year is required' },
      },
    },

    comicBookPublisher: {
      type: DataTypes.STRING,
      validate: {
        len: { args: [2, 500], msg: 'Comic book publisher is required' },
      },
    },

    comicBookCover: {
      type: DataTypes.STRING,
    },

    type: {
      type: DataTypes.ENUM('regular', 'variant'),
      validate: {
        isIn: {
          args: [['regular', 'variant']],
          msg: 'Comic Book must be regular or variant',
        },
      },
    },
  }, {});
  // UNCOMMENT WHEN READY FOR USER
  WishLists.associate = (models) => {
    // associations can be defined here
    WishLists.belongsTo(models.Users, { foreignKey: 'wishUsersId' });
  };
  return WishLists;
};
