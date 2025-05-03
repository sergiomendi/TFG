-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-05-2025 a las 11:24:45
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tfg`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `archivo`
--

CREATE TABLE `archivo` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `url` varchar(255) NOT NULL,
  `retos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`retos`)),
  `id_escena` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `archivo`
--

INSERT INTO `archivo` (`id`, `titulo`, `tipo`, `url`, `retos`, `id_escena`) VALUES
(3, 'TFG BD (2).jpg', 'jpg', '3d634633-669b-4cb0-a4a2-17f07897381b.jpg', NULL, 58);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `escena`
--

CREATE TABLE `escena` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `fechaAlta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `escena`
--

INSERT INTO `escena` (`id`, `titulo`, `descripcion`, `fechaAlta`) VALUES
(2, 'Cena familiar con múltiples platos', 'aaa', 1713133200),
(3, 'Comedor escolar al mediodía', NULL, 1713392400),
(4, 'Fiesta con buffet libree', NULL, 1713565200),
(5, 'Playa en verano con bañadores', NULL, 1713738000),
(6, 'Restaurante elegante con varios comensales', NULL, 1713910800),
(7, 'Gimnasio con espejos', NULL, 1714083600),
(58, 'nueva tabla21', 'a', 1745774389);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evento`
--

CREATE TABLE `evento` (
  `id` int(11) NOT NULL,
  `fecha` int(11) NOT NULL,
  `tipo` int(11) NOT NULL,
  `id_experiencia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `experiencia`
--

CREATE TABLE `experiencia` (
  `id` int(11) NOT NULL,
  `duracion` int(11) NOT NULL,
  `fechaAlta` int(120) NOT NULL,
  `fechaFin` int(120) DEFAULT NULL,
  `estresInicial` int(11) NOT NULL,
  `estresFinal` int(11) NOT NULL,
  `id_escena` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `experiencia`
--

INSERT INTO `experiencia` (`id`, `duracion`, `fechaAlta`, `fechaFin`, `estresInicial`, `estresFinal`, `id_escena`, `id_paciente`) VALUES
(9, 0, 1745509434, NULL, 0, 0, 2, 4),
(10, 0, 1745510000, NULL, 0, 0, 2, 4),
(11, 0, 1746177124, NULL, 0, 0, 2, 4),
(12, 0, 1746182187, NULL, 0, 0, 2, 4),
(13, 0, 1746182215, NULL, 0, 0, 2, 5),
(14, 0, 1746182266, NULL, 0, 0, 2, 4),
(15, 0, 1746182413, NULL, 0, 0, 2, 5),
(16, 0, 1746182471, NULL, 0, 0, 2, 5),
(17, 0, 1746182500, NULL, 0, 0, 2, 5),
(18, 0, 1746182534, NULL, 0, 0, 2, 4),
(19, 0, 1746183526, NULL, 0, 0, 2, 5),
(20, 0, 1746183613, NULL, 0, 0, 2, 5),
(21, 0, 1746183642, 2147483647, 0, 0, 2, 5),
(22, 2147483647, 1746183830, 2147483647, 0, 0, 2, 4),
(23, 2147483647, 1746183944, 2147483647, 0, 0, 2, 5),
(24, 2147483647, 1746184029, 2147483647, 0, 0, 2, 4),
(25, 2147483647, 1746184086, 2147483647, 0, 0, 2, 5),
(26, 2147483647, 1746184249, 2147483647, 0, 0, 2, 4),
(27, 0, 1746184409, 1746184425, 0, 0, 2, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente`
--

CREATE TABLE `paciente` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `comentarios` varchar(255) NOT NULL,
  `fechaAlta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `paciente`
--

INSERT INTO `paciente` (`id`, `nombre`, `comentarios`, `fechaAlta`) VALUES
(4, 'dasdas', 'asdsa', 1745332497),
(5, 'adasd', 'asdsadas', 1746177092);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `archivo`
--
ALTER TABLE `archivo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `escena_fk` (`id_escena`);

--
-- Indices de la tabla `escena`
--
ALTER TABLE `escena`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `evento`
--
ALTER TABLE `evento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evento_ibfk_1` (`id_experiencia`);

--
-- Indices de la tabla `experiencia`
--
ALTER TABLE `experiencia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `experiencia_ibfk_1` (`id_escena`),
  ADD KEY `experiencia_ibfk_2` (`id_paciente`);

--
-- Indices de la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `archivo`
--
ALTER TABLE `archivo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `escena`
--
ALTER TABLE `escena`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT de la tabla `evento`
--
ALTER TABLE `evento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `experiencia`
--
ALTER TABLE `experiencia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `paciente`
--
ALTER TABLE `paciente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `archivo`
--
ALTER TABLE `archivo`
  ADD CONSTRAINT `escena_fk` FOREIGN KEY (`id_escena`) REFERENCES `escena` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `evento`
--
ALTER TABLE `evento`
  ADD CONSTRAINT `evento_ibfk_1` FOREIGN KEY (`id_experiencia`) REFERENCES `experiencia` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `experiencia`
--
ALTER TABLE `experiencia`
  ADD CONSTRAINT `experiencia_ibfk_1` FOREIGN KEY (`id_escena`) REFERENCES `escena` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `experiencia_ibfk_2` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
