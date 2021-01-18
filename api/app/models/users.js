module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: { args: 4, msg: 'ID not valid, please try again.' },
      },
    },

    username: {
      type: DataTypes.STRING,
      allowNull: { args: false, msg: 'Username is required' },
    },

    firstname: {
      type: DataTypes.STRING,
      allowNull: { args: false, msg: 'First name is required' },
    },

    lastname: {
      type: DataTypes.STRING,
      allowNull: { args: false, msg: 'Last name is required' },
    },

    email: {
      type: DataTypes.STRING,
      unique: { args: true, msg: 'Email is already in use' },
      allowNull: { args: false, msg: 'Email is required' },
    },

    accesstoken: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    type: {
      type: DataTypes.ENUM('regular', 'fixer'),
      validate: {
        isIn: {
          args: [['regular', 'fixer']],
          msg: 'User type must be regular or fixer',
        },
      },
    },
  }, {});

  // UNCOMMENT WHEN READY FOR USER
  Users.associate = (models) => {
    // associations can be defined here
    Users.hasMany(models.CollectionPublishers, { foreignKey: 'collectpubUsersId' });
    Users.hasMany(models.SaleLists, { foreignKey: 'saleUsersId' });
    Users.hasMany(models.Messagings, { foreignKey: 'messageUsersId' });
    Users.hasMany(models.WishLists, { foreignKey: 'wishUsersId' });
  };

  return Users;
};
