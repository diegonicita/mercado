CREATE TABLE `usuarios` (
   `id` INT NOT NULL AUTO_INCREMENT,
   `nombre` VARCHAR(255) NOT NULL,
   `email` VARCHAR(255) NOT NULL,
   PRIMARY KEY (`id`)
);

CREATE TABLE `productos` (
   `id` INT NOT NULL AUTO_INCREMENT,
   `titulo` VARCHAR(100) NOT NULL,
   `fecha_de_creacion` DATETIME NOT NULL,
   `fecha_de_modificacion` DATETIME,
   `descripcion` TEXT,
   `eliminable` TINYINT,
   `precio` INT,
   `descuento` INT,
   `imagen` VARCHAR(100),
   `categoria` INT NOT NULL,
   PRIMARY KEY (`id`)
);

CREATE TABLE `categorias` (
   `id` INT NOT NULL AUTO_INCREMENT,
   `name` VARCHAR(255),
   PRIMARY KEY (`id`)
);

ALTER TABLE `productos` ADD CONSTRAINT `FK_8b39e278-d59c-4ea4-b605-8a3553cf8882` FOREIGN KEY (`categoria`) REFERENCES `categorias`(id);

INSERT INTO `categorias` (id, name) VALUES (1, "a");
INSERT INTO `categorias` (id, name) VALUES (2, "b");
INSERT INTO `productos` (id,titulo,`fecha_de_creacion`,`fecha_de_modificacion`,descripcion,eliminable,precio,descuento,imagen,categoria) VALUES (1,'Cafetera Moulinex','1900-01-01 00:00:00',NULL,NULL,1,NULL,NULL,'img-cafetera-moulinex.jpg',1);
INSERT INTO `productos` (titulo,`fecha_de_creacion`,`fecha_de_modificacion`,descripcion,eliminable,precio,descuento,imagen,categoria) VALUES ('MacBook Pro 2019','1900-01-01 00:00:00',NULL,NULL,1,NULL,NULL,'img-macbook-pro-2019.jpg',1);
INSERT INTO `productos` (titulo,`fecha_de_creacion`,`fecha_de_modificacion`,descripcion,eliminable,precio,descuento,imagen,categoria) VALUES ('Samsung Galaxy S10','1900-01-01 00:00:00',NULL,NULL,1,NULL,NULL,'img-samsung-galaxy-s10.jpg',1);
INSERT INTO `productos` (titulo,`fecha_de_creacion`,`fecha_de_modificacion`,descripcion,eliminable,precio,descuento,imagen,categoria) VALUES ('TV Samsung Smart','1900-01-01 00:00:00',NULL,NULL,1,NULL,NULL,'img-tv-samsung-smart.jpg',1);