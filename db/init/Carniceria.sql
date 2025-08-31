CREATE TABLE `productos` (
  `producto_id` integer PRIMARY KEY AUTO_INCREMENT,
  `categoria_id` integer NOT NULL,
  `sucursal_id` integer NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `primario` bool,
  `imagen_url` integer,
  `created_at` date NOT NULL,
  `update_at` date,
  `deleted_at` date
);

CREATE TABLE `categorias` (
  `categoria_id` integer PRIMARY KEY AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255)
);

CREATE TABLE `unidad_venta` (
  `unidad_id` integer PRIMARY KEY AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `simbolo` varchar(255)
);

CREATE TABLE `presentacion_producto` (
  `presentacion_id` integer PRIMARY KEY AUTO_INCREMENT,
  `producto_id` integer NOT NULL,
  `unidad_id` integer NOT NULL,
  `precio` float NOT NULL,
  `cantidad_equivalente` float,
  `descripcion` varchar(255)
);

CREATE TABLE `stock` (
  `stock_id` integer PRIMARY KEY AUTO_INCREMENT,
  `producto_id` integer,
  `origen_id` integer,
  `sucursal_id` integer,
  `tipo_origen` varchar(255),
  `cantidad` float,
  `costo` float,
  `stock_primario` integer,
  `created_at` date NOT NULL
);

CREATE TABLE `detalle_stock` (
  `detalle_stock_id` integer PRIMARY KEY AUTO_INCREMENT,
  `producto_id` integer,
  `cantidad` float NOT NULL,
  `created_at` date NOT NULL,
  `update_at` date
);

CREATE TABLE `proveedores` (
  `proveedor_id` integer PRIMARY KEY AUTO_INCREMENT,
  `sucursal_id` integer,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(255),
  `created_at` date NOT NULL,
  `update_at` date,
  `deleted_at` date
);

CREATE TABLE `clientes` (
  `cliente_id` integer PRIMARY KEY AUTO_INCREMENT,
  `sucursal_id` integer,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(255),
  `created_at` date NOT NULL,
  `update_at` date,
  `deleted_at` date
);

CREATE TABLE `ventas` (
  `venta_id` integer PRIMARY KEY AUTO_INCREMENT,
  `cliente_id` integer,
  `usuario_id` integer NOT NULL,
  `sucursal_id` integer,
  `subtotal` float,
  `descuento` float,
  `total` float,
  `estado` varchar(255),
  `created_at` date NOT NULL,
  `update_at` date,
  `deleted_at` date
);

CREATE TABLE `pagos` (
  `pago_id` integer PRIMARY KEY AUTO_INCREMENT,
  `venta_id` integer,
  `monto` float,
  `metodo_pago` varchar(255),
  `fecha_de_pago` date
);

CREATE TABLE `ventas_pagos` (
  `id_venta` integer,
  `id_pago` integer,
  PRIMARY KEY (`id_venta`, `id_pago`)
);

CREATE TABLE `detalle_ventas` (
  `detalle_venta_id` integer PRIMARY KEY AUTO_INCREMENT,
  `venta_id` integer NOT NULL,
  `producto_id` integer NOT NULL,
  `presentacion_id` integer NOT NULL,
  `cantidad` float NOT NULL,
  `precio_final` float NOT NULL,
  `created_at` date NOT NULL,
  `update_at` date,
  `deleted_at` date
);

CREATE TABLE `descuentos` (
  `descuento_id` integer PRIMARY KEY AUTO_INCREMENT,
  `producto_id` integer,
  `cliente_id` integer,
  `descuento` integer,
  `created_at` date NOT NULL,
  `update_at` date,
  `deleted_at` date
);

CREATE TABLE `archivo` (
  `archivo_id` integer PRIMARY KEY AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `nombre` varchar(255),
  `tamano` float,
  `tipo` varchar(255)
);

CREATE TABLE `usuarios` (
  `usuario_id` integer PRIMARY KEY AUTO_INCREMENT,
  `id_persona` integer,
  `id_tipo_usuario` integer,
  `id_archivo_perfil` integer,
  `correo` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `fecha_registro` timestamp NOT NULL,
  `fecha_sesion` timestamp,
  `activo` bool
);

CREATE TABLE `personas` (
  `persona_id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `ap_paterno` varchar(255),
  `ap_materno` varchar(255),
  `genero` bool,
  `fecha_nacimiento` date NOT NULL,
  `rfc` varchar(255),
  `ine` varchar(255),
  `telefono` varchar(255)
);

CREATE TABLE `tipo_usuario` (
  `tipo_usuario_id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL
);

CREATE TABLE `permiso` (
  `id_permiso` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255)
);

CREATE TABLE `permiso_usuario` (
  `id_usuario` integer NOT NULL,
  `id_permiso` integer NOT NULL,
  PRIMARY KEY (`id_usuario`, `id_permiso`)
);

CREATE TABLE `direccion` (
  `direccion_id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `calle` varchar(255) NOT NULL,
  `no_interior` varchar(255),
  `no_exterior` varchar(255),
  `codigo_postal` varchar(255) NOT NULL,
  `fecha_registro` timestamp NOT NULL,
  `referencia` text,
  `latitud` varchar(255),
  `longitud` varchar(255)
);

CREATE TABLE `franquicia` (
  `franquicia_id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_usuario` integer,
  `fecha_registro` timestamp,
  `activo` bool
);

CREATE TABLE `sucursal` (
  `sucursal_id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_franquicia` integer,
  `id_horario` integer,
  `id_direccion` integer,
  `fecha_de_alta` timestamp NOT NULL,
  `fecha_de_baja` timestamp,
  `telefono` varchar(255),
  `correo` varchar(255),
  `activo` bool
);

CREATE TABLE `empleado` (
  `empleado_id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_usuario` integer,
  `id_usuario_registro` integer,
  `id_sucursal` integer,
  `sueldo` float,
  `descripcion_puesto` varchar(255),
  `fecha_contratacion` timestamp NOT NULL,
  `fecha_baja` timestamp,
  `fecha_registro` timestamp,
  `telefono_emergencia` varchar(255),
  `periodo_pago` varchar(255),
  `tipo_pago` varchar(255),
  `horas_trabajo` time,
  `activo` smallint NOT NULL
);

CREATE TABLE `horario` (
  `horario_id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_dia` integer,
  `hora_apertura` time NOT NULL,
  `hora_cierre` time NOT NULL,
  `estado` smallint NOT NULL
);

CREATE TABLE `dia` (
  `dia_id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL
);

ALTER TABLE `archivo` ADD FOREIGN KEY (`archivo_id`) REFERENCES `productos` (`producto_id`);

ALTER TABLE `productos` ADD FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`categoria_id`);

ALTER TABLE `presentacion_producto` ADD FOREIGN KEY (`producto_id`) REFERENCES `productos` (`producto_id`);

ALTER TABLE `presentacion_producto` ADD FOREIGN KEY (`unidad_id`) REFERENCES `unidad_venta` (`unidad_id`);

ALTER TABLE `stock` ADD FOREIGN KEY (`producto_id`) REFERENCES `productos` (`producto_id`);

ALTER TABLE `stock` ADD FOREIGN KEY (`stock_primario`) REFERENCES `stock` (`stock_id`);

ALTER TABLE `detalle_stock` ADD FOREIGN KEY (`producto_id`) REFERENCES `productos` (`producto_id`);

ALTER TABLE `stock` ADD FOREIGN KEY (`origen_id`) REFERENCES `proveedores` (`proveedor_id`);

ALTER TABLE `stock` ADD FOREIGN KEY (`origen_id`) REFERENCES `clientes` (`cliente_id`);

ALTER TABLE `ventas` ADD FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`);

ALTER TABLE `ventas` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`);

ALTER TABLE `ventas_pagos` ADD FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`venta_id`);

ALTER TABLE `ventas_pagos` ADD FOREIGN KEY (`id_pago`) REFERENCES `pagos` (`pago_id`);

ALTER TABLE `detalle_ventas` ADD FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`venta_id`);

ALTER TABLE `detalle_ventas` ADD FOREIGN KEY (`producto_id`) REFERENCES `productos` (`producto_id`);

ALTER TABLE `detalle_ventas` ADD FOREIGN KEY (`presentacion_id`) REFERENCES `presentacion_producto` (`presentacion_id`);

ALTER TABLE `descuentos` ADD FOREIGN KEY (`producto_id`) REFERENCES `productos` (`producto_id`);

ALTER TABLE `descuentos` ADD FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`);

ALTER TABLE `usuarios` ADD FOREIGN KEY (`id_archivo_perfil`) REFERENCES `archivo` (`archivo_id`);

ALTER TABLE `usuarios` ADD FOREIGN KEY (`id_persona`) REFERENCES `personas` (`persona_id`);

ALTER TABLE `usuarios` ADD FOREIGN KEY (`id_tipo_usuario`) REFERENCES `tipo_usuario` (`tipo_usuario_id`);

ALTER TABLE `permiso_usuario` ADD FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`usuario_id`);

ALTER TABLE `permiso_usuario` ADD FOREIGN KEY (`id_permiso`) REFERENCES `permiso` (`id_permiso`);

ALTER TABLE `franquicia` ADD FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`usuario_id`);

ALTER TABLE `sucursal` ADD FOREIGN KEY (`id_franquicia`) REFERENCES `franquicia` (`franquicia_id`);

ALTER TABLE `sucursal` ADD FOREIGN KEY (`id_direccion`) REFERENCES `direccion` (`direccion_id`);

ALTER TABLE `productos` ADD FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`sucursal_id`);

ALTER TABLE `clientes` ADD FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`sucursal_id`);

ALTER TABLE `proveedores` ADD FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`sucursal_id`);

ALTER TABLE `stock` ADD FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`sucursal_id`);

ALTER TABLE `ventas` ADD FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`sucursal_id`);

ALTER TABLE `empleado` ADD FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`usuario_id`);

ALTER TABLE `empleado` ADD FOREIGN KEY (`id_usuario_registro`) REFERENCES `usuarios` (`usuario_id`);

ALTER TABLE `empleado` ADD FOREIGN KEY (`id_sucursal`) REFERENCES `sucursal` (`sucursal_id`);

ALTER TABLE `sucursal` ADD FOREIGN KEY (`id_horario`) REFERENCES `horario` (`horario_id`);

ALTER TABLE `horario` ADD FOREIGN KEY (`id_dia`) REFERENCES `dia` (`dia_id`);
