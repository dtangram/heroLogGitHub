module.exports = (sequelize, DataTypes) => {
  const Messagings = sequelize.define('Messagings', {
    id: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: { args: 4, msg: 'ID not valid, please try again' },
      },
    },

    name: {
      type: DataTypes.STRING,
      validate: {
        len: { args: [3, 500], msg: 'Name is required' },
      },
    },

    email: {
      type: DataTypes.STRING,
      validate: {
        len: { args: [3, 500], msg: 'Email is required' },
      },
    },

    subject: {
      type: DataTypes.STRING,
    },

    userSent: {
      type: DataTypes.INTEGER,
    },

    message: {
      type: DataTypes.STRING,
      validate: {
        len: { args: [10, 500], msg: 'Message is required' },
      },
    },
  }, {});
  // UNCOMMENT WHEN READY FOR USER
  Messagings.associate = (models) => {
    // associations can be defined here
    Messagings.belongsTo(models.Users, { foreignKey: 'messageUsersId' });
  };
  return Messagings;
};
