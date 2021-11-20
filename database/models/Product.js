module.exports = (sequelize, dataTypes) => {

let alias = "Product";
let cols = {
   id: {
     type: dataTypes.INTEGER,
     allowNull: false,
     primaryKey: true
   },
   titulo: {
    type: dataTypes.STRING(100),
    allowNull: false
   }
 };
 let config = {
   tableName: 'productos',
   timestamps: false
 };

const Product = sequelize.define(alias, cols, config);

return Product;

}

