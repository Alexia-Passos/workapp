'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Work extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Work.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        allowNull: false,
        required: true
      });

      Work.hasOne(models.Like, {
        foreignKey: 'workId',
        as: 'like',
        allowNull: false,
        required: true
      });

      Work.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
        allowNull: false,
        required: true
      });

      Work.hasMany(models.Photo, {
        foreignKey: 'workId',
        as: 'photo',
        allowNull: false,
        required: true
      });
    }
  };
  Work.init({
    workName: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Work',
  });
  return Work;
};