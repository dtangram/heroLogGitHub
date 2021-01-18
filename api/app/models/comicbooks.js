module.exports = (sequelize, DataTypes) => {
  const ComicBooks = sequelize.define('ComicBooks', {
    id: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: { args: 4, msg: 'ID not valid, please try again' },
      },
    },

    title: {
      type: DataTypes.STRING,
      validate: {
        len: { args: [1, 500], msg: 'Comic Book issue title is required' },
      },
    },

    author: {
      type: DataTypes.STRING,
      validate: {
        len: { args: [3, 500], msg: 'Comic Book author is required' },
      },
    },

    penciler: {
      type: DataTypes.STRING,
      validate: {
        len: { args: [3, 500], msg: 'Comic Book penciler is required' },
      },
    },

    coverartist: {
      type: DataTypes.STRING,
      validate: {
        len: { args: [3, 500], msg: 'Comic Book cover artist is required' },
      },
    },

    inker: {
      type: DataTypes.STRING,
      validate: {
        len: { args: [3, 500], msg: 'Comic Book inker is required' },
      },
    },

    volume: {
      type: DataTypes.INTEGER,
      validate: {
        len: { args: [1, 500], msg: 'Comic Book volume is required' },
      },
    },

    year: {
      type: DataTypes.INTEGER,
      validate: {
        len: { args: [4, 500], msg: 'Comic Book year is required' },
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
  ComicBooks.associate = (models) => {
    // associations can be defined here
    ComicBooks.belongsTo(models.ComicBookTitles, { foreignKey: 'comicbooktitlerelId' });
  };
  return ComicBooks;
};
