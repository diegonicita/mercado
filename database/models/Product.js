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
   },
   fecha_de_creacion:
   {
     type: dataTypes.DATE,
     allowNull: false
   },
   fecha_de_modificacion:
   {
     type: dataTypes.DATE,     
   },
   descripcion:   
   {
     type: dataTypes.TEXT,
     allowNull: false
   },
   eliminable:   
   {
     type: dataTypes.TINYINT,  
     default: 1   
   },
   precio:   
   {
     type: dataTypes.INTEGER       
   },
   descuento:   
   {
     type: dataTypes.INTEGER       
   },
   imagen:   
   {
     type: dataTypes.STRING(100)
   },
   categoria:   
   {
     type: dataTypes.INTEGER,
     default: 1
   },
 };
 let config = {
   tableName: 'productos',
   timestamps: false
 };

const Product = sequelize.define(alias, cols, config);

return Product;

}

