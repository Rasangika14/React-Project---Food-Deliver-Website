-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 15, 2025 at 12:48 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `food`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES
(1, 'Appetizers', '2025-04-28 15:40:12'),
(2, 'Pizza', '2025-04-28 15:40:12'),
(3, 'Burger', '2025-04-28 15:40:12'),
(4, 'Sushi', '2025-04-28 15:40:12'),
(5, 'Pasta', '2025-04-28 15:40:12'),
(6, 'Salad', '2025-04-28 15:40:12'),
(7, 'Asian', '2025-04-28 15:40:12'),
(8, 'Desserts', '2025-04-28 15:40:12'),
(9, 'Breakfast', '2025-04-28 15:40:12'),
(10, 'Sea Foods', '2025-04-28 15:40:12'),
(11, 'Beverages', '2025-04-28 15:40:12');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('unread','read','replied') DEFAULT 'unread',
  `reply` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `replied_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `name`, `email`, `phone`, `message`, `status`, `reply`, `created_at`, `replied_at`) VALUES
(1, 'nimal darmasiri', 'nimal@gmail.com', '0771234567', 'hi! how order foods?', 'replied', 'first you login in the delight web site. after go to the menu page and select food items and click to cart button', '2025-05-11 11:19:09', '2025-05-11 11:20:17');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `street` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `zip_code` varchar(20) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `delivery_fee` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('Pending','Preparing','On the way','Delivered','Cancelled') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_intent_id` varchar(255) DEFAULT NULL,
  `payment_method` enum('card','cash') DEFAULT 'cash',
  `payment_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payment_details`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `first_name`, `last_name`, `email`, `street`, `city`, `state`, `zip_code`, `phone`, `subtotal`, `delivery_fee`, `total`, `status`, `created_at`, `payment_intent_id`, `payment_method`, `payment_details`) VALUES
(1, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '13854', '0771234567', '250.00', '450.00', '700.00', 'Pending', '2025-05-13 11:47:12', NULL, 'cash', NULL),
(2, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo ', 'negambo', 'road1', '79365', '0111111111', '950.00', '450.00', '1400.00', 'Delivered', '2025-05-13 11:49:04', NULL, NULL, NULL),
(3, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo ', 'negambo', 'road1', '89222', '0111111111', '2500.00', '450.00', '2950.00', 'Pending', '2025-05-14 14:44:15', NULL, 'cash', NULL),
(4, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '76357', '0771234567', '1200.00', '450.00', '1650.00', 'Pending', '2025-05-14 14:45:47', NULL, 'cash', NULL),
(5, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo ', 'negambo', 'road1', '60480', '0111111111', '1200.00', '450.00', '1650.00', 'Pending', '2025-05-17 03:21:22', NULL, 'cash', NULL),
(6, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo ', 'negambo', 'road1', '83686', '0111111111', '0.00', '450.00', '450.00', 'Pending', '2025-05-18 04:38:27', NULL, 'cash', NULL),
(7, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo ', 'negambo', 'road1', '58436', '0111111111', '550.00', '450.00', '1000.00', 'Pending', '2025-05-18 04:38:46', NULL, 'cash', NULL),
(8, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '48510', '0771234567', '550.00', '450.00', '1000.00', 'On the way', '2025-05-18 06:31:27', NULL, 'cash', NULL),
(9, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '13792', '0771234567', '550.00', '450.00', '1000.00', 'Pending', '2025-05-18 06:32:47', NULL, 'cash', NULL),
(10, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '90110', '0771234567', '1200.00', '450.00', '1650.00', 'Pending', '2025-05-19 13:51:40', NULL, 'cash', NULL),
(11, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '90110', '0771234567', '1200.00', '450.00', '1650.00', 'Pending', '2025-05-19 13:51:40', NULL, 'cash', NULL),
(12, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '43657', '0771234567', '550.00', '450.00', '1000.00', 'Delivered', '2025-05-19 14:02:26', NULL, 'cash', NULL),
(13, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '90966', '0771234567', '450.00', '450.00', '900.00', 'Pending', '2025-05-19 14:14:27', NULL, 'cash', NULL),
(14, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '82398', '0771234567', '550.00', '450.00', '1000.00', 'Delivered', '2025-05-19 14:37:13', NULL, 'cash', NULL),
(15, 7, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'bogamuwa', '20747', '0111111111', '1100.00', '450.00', '1550.00', 'Delivered', '2025-05-19 14:40:11', NULL, 'cash', NULL),
(16, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'bogamuwa', '45062', '0111111111', '500.00', '450.00', '950.00', 'Delivered', '2025-05-19 14:55:22', NULL, 'cash', NULL),
(17, 3, 'Indra', 'Chandrakanthi', 'Indra@gmail.com', 'Bodhigama', 'kurunegala', 'bogamuwa', '29714', '0778827728', '1200.00', '450.00', '1650.00', 'Delivered', '2025-05-19 14:58:55', NULL, 'cash', NULL),
(18, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '41877', '0771234567', '150.00', '450.00', '600.00', 'Delivered', '2025-05-19 15:23:35', NULL, 'cash', NULL),
(19, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'road1', '31627', '0111111111', '700.00', '450.00', '1150.00', 'Delivered', '2025-05-20 14:26:53', NULL, 'cash', NULL),
(20, 6, 'user', 'wasala', 'rasangika@gmail.com', 'kurunegala', 'negambo', 'road1', '24645', '0771234567', '1200.00', '450.00', '1650.00', 'Pending', '2025-05-21 02:40:14', NULL, 'cash', NULL),
(21, 6, 'user', 'wasala', 'rasangika@gmail.com', 'kurunegala', 'negambo', 'road1', '56680', '0771234567', '1200.00', '450.00', '1650.00', 'Pending', '2025-05-21 04:37:41', NULL, 'cash', NULL),
(22, 6, 'mmmm', 'uuuuuuuuuuuu', 'abc@gmail.com', 'first ', 'kandy', 'bogamuwa', '55048', '0111111111', '1200.00', '450.00', '1650.00', 'Pending', '2025-05-21 04:41:31', NULL, 'cash', NULL),
(23, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'fgfd', '61397', '0111111111', '1200.00', '450.00', '1650.00', 'Pending', '2025-05-21 04:53:09', NULL, 'cash', NULL),
(24, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'fgfd', '21869', '0111111111', '1200.00', '450.00', '1650.00', 'Pending', '2025-05-21 05:02:00', NULL, 'cash', NULL),
(25, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'fgfd', '49623', '0111111111', '1200.00', '450.00', '1650.00', 'Delivered', '2025-05-21 05:08:29', NULL, 'cash', NULL),
(26, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'gggg', '17199', '0771234567', '1200.00', '450.00', '1650.00', 'Delivered', '2025-05-21 05:16:15', NULL, 'cash', NULL),
(27, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'gggg', '53604', '0771234567', '550.00', '450.00', '1000.00', 'Delivered', '2025-05-21 05:21:47', NULL, 'cash', NULL),
(28, 8, 'jayamini', 'ekanayaka', 'jayamini@gmail.com', 'kurunegala', 'pothuhera', 'pothuhera', '38923', '0779876578', '250.00', '450.00', '700.00', 'Delivered', '2025-05-25 07:20:26', NULL, 'cash', NULL),
(29, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'road1', '81771', '0111111111', '250.00', '450.00', '700.00', 'Pending', '2025-05-25 11:10:53', NULL, 'cash', NULL),
(30, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'road1', '91191', '0111111111', '450.00', '450.00', '900.00', 'Pending', '2025-05-25 11:50:13', NULL, 'cash', NULL),
(31, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'road1', '61894', '0111111111', '250.00', '450.00', '700.00', 'Pending', '2025-05-25 12:58:42', NULL, 'cash', NULL),
(32, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'road1', '10476', '0111111111', '0.00', '450.00', '450.00', 'Pending', '2025-05-25 13:01:18', NULL, 'cash', NULL),
(33, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'road1', '10476', '0111111111', '0.00', '450.00', '450.00', 'Pending', '2025-05-25 13:01:21', NULL, 'cash', NULL),
(34, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'road1', '84522', '0111111111', '250.00', '450.00', '700.00', 'Pending', '2025-05-25 13:02:44', NULL, 'cash', NULL),
(35, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'road1', '19247', '0111111111', '250.00', '450.00', '700.00', 'Pending', '2025-05-25 13:24:22', NULL, 'cash', NULL),
(36, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'road1', '53220', '0111111111', '250.00', '450.00', '700.00', 'Pending', '2025-05-25 13:37:34', NULL, 'cash', NULL),
(37, 1, 'John', 'Doe', 'john.doe@example.com', '123 Main St', 'Colombo', 'Western', '00100', '1234567890', '150.00', '5.00', '155.00', 'Pending', '2025-05-25 14:35:01', NULL, 'cash', NULL),
(38, 1, 'John', 'Doe', 'john.doe@example.com', '123 Main St', 'Colombo', 'Western', '00100', '1234567890', '150.00', '5.00', '155.00', 'Pending', '2025-05-25 14:36:00', NULL, 'cash', NULL),
(39, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'road1', '91137', '0111111111', '150.00', '450.00', '600.00', 'Pending', '2025-05-25 14:36:52', NULL, 'cash', NULL),
(40, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'road1', '49076', '0111111111', '250.00', '450.00', '700.00', 'Preparing', '2025-05-25 16:08:15', NULL, 'cash', NULL),
(41, 3, 'Indra', 'Chandrakanthi', 'Indra@gmail.com', 'Bodhigama', 'kurunegala', 'bogamuwa', '59637', '0778827728', '250.00', '450.00', '700.00', 'Pending', '2025-05-26 03:27:50', NULL, 'cash', NULL),
(42, 9, 'user', 'u3', 'user3@gmail.com', 'malpitiya', 'kurunegala', 'bogamuwa', '87547', '0733657846', '250.00', '450.00', '700.00', 'Pending', '2025-05-26 05:16:58', NULL, 'cash', NULL),
(43, 7, 'user', 'u3', 'user3@gmail.com', 'malpitiya', 'kurunegala', 'bogamuwa', '40718', '0733657846', '250.00', '450.00', '700.00', 'Pending', '2025-05-28 03:43:34', NULL, 'cash', NULL),
(44, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '81669', '0771234567', '250.00', '450.00', '700.00', 'Pending', '2025-06-02 13:19:31', NULL, 'cash', NULL),
(45, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '81669', '0771234567', '250.00', '450.00', '700.00', 'Delivered', '2025-06-02 13:19:32', NULL, NULL, NULL),
(46, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '97522', '0771234567', '1200.00', '450.00', '1650.00', 'Pending', '2025-06-02 13:49:01', NULL, 'cash', NULL),
(47, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '61696', '0771234567', '1200.00', '450.00', '1650.00', 'Delivered', '2025-06-02 14:06:25', NULL, NULL, NULL),
(48, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'bogamuwa', '51591', '0111111111', '1200.00', '450.00', '1650.00', 'Pending', '2025-06-04 03:48:26', NULL, 'cash', NULL),
(49, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'bogamuwa', '73370', '0111111111', '1200.00', '450.00', '1650.00', 'Pending', '2025-06-04 03:49:51', NULL, 'cash', NULL),
(50, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'bogamuwa', '96214', '0111111111', '250.00', '450.00', '700.00', '', '2025-06-04 03:53:57', NULL, 'card', '{\"payhere_payment_id\":\"50\",\"last_four_digits\":\"N/A\"}'),
(51, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '84635', '0771234567', '400.00', '450.00', '850.00', 'Delivered', '2025-06-04 05:40:39', NULL, NULL, NULL),
(52, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '98802', '0771234567', '150.00', '450.00', '600.00', 'Pending', '2025-06-04 06:04:48', NULL, 'cash', NULL),
(53, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '92385', '0771234567', '250.00', '450.00', '700.00', '', '2025-06-04 06:32:38', NULL, 'card', '{\"payhere_payment_id\":\"53\",\"last_four_digits\":\"N/A\"}'),
(54, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '24103', '0771234567', '150.00', '450.00', '600.00', 'Pending', '2025-06-06 05:46:13', NULL, 'cash', NULL),
(55, 6, 'user', 'u1', 'user1@gmail.com', 'Negombo', 'negambo', 'bogamuwa', '42532', '0111111111', '450.00', '450.00', '900.00', 'On the way', '2025-06-06 06:19:53', NULL, NULL, NULL),
(56, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '85299', '0771234567', '450.00', '450.00', '900.00', '', '2025-06-06 08:29:55', NULL, 'card', '{\"payhere_payment_id\":\"56\",\"status_code\":\"2\",\"card_details\":{\"last_four_digits\":\"N/A\",\"card_type\":\"N/A\"}}'),
(57, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '35383', '0771234567', '550.00', '450.00', '1000.00', 'Preparing', '2025-06-06 09:04:54', NULL, NULL, NULL),
(58, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '44534', '0771234567', '500.00', '450.00', '950.00', 'Pending', '2025-06-06 09:08:02', NULL, 'cash', NULL),
(59, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '24176', '0771234567', '450.00', '450.00', '900.00', 'Pending', '2025-06-06 09:09:09', NULL, 'cash', 'null'),
(60, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '50782', '0771234567', '450.00', '450.00', '900.00', 'Preparing', '2025-06-06 10:15:50', NULL, NULL, NULL),
(61, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '16524', '0771234567', '250.00', '450.00', '700.00', 'On the way', '2025-06-06 10:21:07', NULL, NULL, NULL),
(62, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '47077', '0771234567', '450.00', '450.00', '900.00', 'Delivered', '2025-06-06 10:26:06', NULL, NULL, NULL),
(63, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '23679', '0771234567', '1200.00', '450.00', '1650.00', 'Pending', '2025-06-08 04:37:22', NULL, 'cash', NULL),
(64, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '17340', '0771234567', '1200.00', '450.00', '1650.00', '', '2025-06-08 04:40:02', NULL, 'card', '{\"payhere_payment_id\":\"64\",\"status_code\":\"2\",\"card_details\":{\"last_four_digits\":\"N/A\",\"card_type\":\"N/A\"}}'),
(65, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '66321', '0771234567', '1100.00', '450.00', '1550.00', '', '2025-06-08 14:27:24', NULL, 'card', '{\"payhere_payment_id\":\"65\",\"status_code\":\"2\",\"card_details\":{\"last_four_digits\":\"N/A\",\"card_type\":\"N/A\"}}'),
(66, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '65471', '0771234567', '1100.00', '450.00', '1550.00', 'Pending', '2025-06-08 14:29:17', NULL, 'cash', 'null'),
(67, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '58724', '0771234567', '1200.00', '450.00', '1650.00', '', '2025-06-08 14:35:17', NULL, 'card', '{\"payhere_payment_id\":\"67\",\"status_code\":\"2\",\"card_details\":{\"last_four_digits\":\"N/A\",\"card_type\":\"N/A\"}}'),
(68, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '30291', '0771234567', '1100.00', '450.00', '1550.00', 'Pending', '2025-06-08 14:37:04', NULL, 'cash', 'null'),
(69, 6, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '38304', '0771234567', '1200.00', '450.00', '1650.00', 'Delivered', '2025-06-08 14:38:03', NULL, NULL, NULL),
(70, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '22345', '0771234567', '150.00', '450.00', '600.00', 'Pending', '2025-06-08 14:50:38', NULL, 'cash', 'null'),
(71, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '85419', '0771234567', '500.00', '450.00', '950.00', 'Pending', '2025-06-11 14:00:10', NULL, NULL, NULL),
(72, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '73565', '0771234567', '980.00', '450.00', '1430.00', 'Delivered', '2025-06-14 15:19:37', NULL, NULL, NULL),
(73, 7, 'nimal', 'darmasiri', 'nimal@gmail.com', 'kurunegala', 'kurunegala', 'bogamuwa', '86606', '0771234567', '550.00', '450.00', '1000.00', 'Delivered', '2025-06-15 07:35:25', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `quantity`, `price`, `image`) VALUES
(1, 1, 3, 'caesar salad', 1, '250.00', 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg'),
(2, 2, 3, 'caesar salad', 1, '250.00', 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg'),
(3, 2, 5, 'Fresh Lemonade', 1, '150.00', 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3&auto=format&fit=crop&w=150'),
(4, 2, 2, 'Rainbow Roll', 1, '550.00', 'http://localhost:8081'),
(5, 3, 6, 'Chicken Pad Thai', 5, '500.00', 'https://th.bing.com/th/id/OIP.-967WrTLC2I78hNhuFkLtwHaLH?w=122&h=183&c=7&r=0&o=7&cb=iwp1&pid=1.7&rm=3.jpg'),
(6, 4, 4, 'Chocolate lava cake', 1, '1200.00', 'https://th.bing.com/th/id/OIP.mD9uvqMGLhaAxor-MWFSiQHaKX?cb=iwp2&rs=1&pid=ImgDetMain.jpg'),
(7, 5, 4, 'Chocolate lava cake', 1, '1200.00', 'https://th.bing.com/th/id/OIP.mD9uvqMGLhaAxor-MWFSiQHaKX?cb=iwp2&rs=1&pid=ImgDetMain.jpg'),
(8, 7, 7, 'Beef noodles Soup', 1, '550.00', 'https://th.bing.com/th/id/R.55952d37ac42ff609f5d23fe6ea5a9ea?rik=GnCAsz1EIwGfiA&pid=ImgRaw&r=0.jpg'),
(9, 8, 7, 'Beef noodles Soup', 1, '550.00', 'https://th.bing.com/th/id/R.55952d37ac42ff609f5d23fe6ea5a9ea?rik=GnCAsz1EIwGfiA&pid=ImgRaw&r=0.jpg'),
(10, 9, 7, 'Beef noodles Soup', 1, '550.00', 'https://th.bing.com/th/id/R.55952d37ac42ff609f5d23fe6ea5a9ea?rik=GnCAsz1EIwGfiA&pid=ImgRaw&r=0.jpg'),
(11, 10, 4, 'Chocolate lava cake', 1, '1200.00', 'https://th.bing.com/th/id/OIP.mD9uvqMGLhaAxor-MWFSiQHaKX?cb=iwp2&rs=1&pid=ImgDetMain.jpg'),
(12, 11, 4, 'Chocolate lava cake', 1, '1200.00', 'https://th.bing.com/th/id/OIP.mD9uvqMGLhaAxor-MWFSiQHaKX?cb=iwp2&rs=1&pid=ImgDetMain.jpg'),
(13, 12, 7, 'Beef noodles Soup', 1, '550.00', 'https://th.bing.com/th/id/R.55952d37ac42ff609f5d23fe6ea5a9ea?rik=GnCAsz1EIwGfiA&pid=ImgRaw&r=0.jpg'),
(14, 13, 8, 'Vegetable Stir Fry', 1, '450.00', 'https://deliciouslittlebites.com/wp-content/uploads/2017/02/Vegetable-Stir-Fry-Recipe-Image-10.jpg'),
(15, 14, 7, 'Beef noodles Soup', 1, '550.00', 'https://th.bing.com/th/id/R.55952d37ac42ff609f5d23fe6ea5a9ea?rik=GnCAsz1EIwGfiA&pid=ImgRaw&r=0.jpg'),
(16, 15, 2, 'Rainbow Roll', 2, '550.00', 'http://localhost:8081'),
(17, 16, 6, 'Chicken Pad Thai', 1, '500.00', 'https://th.bing.com/th/id/OIP.-967WrTLC2I78hNhuFkLtwHaLH?w=122&h=183&c=7&r=0&o=7&cb=iwp1&pid=1.7&rm=3.jpg'),
(18, 17, 4, 'Chocolate lava cake', 1, '1200.00', 'https://th.bing.com/th/id/OIP.mD9uvqMGLhaAxor-MWFSiQHaKX?cb=iwp2&rs=1&pid=ImgDetMain.jpg'),
(19, 18, 5, 'Fresh Lemonade', 1, '150.00', 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3&auto=format&fit=crop&w=150'),
(20, 19, 5, 'Fresh Lemonade', 1, '150.00', 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3&auto=format&fit=crop&w=150'),
(21, 19, 7, 'Beef noodles Soup', 1, '550.00', 'https://th.bing.com/th/id/R.55952d37ac42ff609f5d23fe6ea5a9ea?rik=GnCAsz1EIwGfiA&pid=ImgRaw&r=0.jpg'),
(22, 20, 4, 'Chocolate lava cake', 1, '1200.00', 'https://th.bing.com/th/id/OIP.mD9uvqMGLhaAxor-MWFSiQHaKX?cb=iwp2&rs=1&pid=ImgDetMain.jpg'),
(23, 21, 4, 'Chocolate lava cake', 1, '1200.00', 'https://th.bing.com/th/id/OIP.mD9uvqMGLhaAxor-MWFSiQHaKX?cb=iwp2&rs=1&pid=ImgDetMain.jpg'),
(24, 22, 4, 'Chocolate lava cake', 1, '1200.00', 'https://th.bing.com/th/id/OIP.mD9uvqMGLhaAxor-MWFSiQHaKX?cb=iwp2&rs=1&pid=ImgDetMain.jpg'),
(25, 23, 4, 'Chocolate lava cake', 1, '1200.00', 'https://th.bing.com/th/id/OIP.mD9uvqMGLhaAxor-MWFSiQHaKX?cb=iwp2&rs=1&pid=ImgDetMain.jpg'),
(26, 24, 4, 'Chocolate lava cake', 1, '1200.00', 'https://th.bing.com/th/id/OIP.mD9uvqMGLhaAxor-MWFSiQHaKX?cb=iwp2&rs=1&pid=ImgDetMain.jpg'),
(27, 25, 4, 'Chocolate lava cake', 1, '1200.00', 'https://th.bing.com/th/id/OIP.mD9uvqMGLhaAxor-MWFSiQHaKX?cb=iwp2&rs=1&pid=ImgDetMain.jpg'),
(28, 26, 4, 'Chocolate lava cake', 1, '1200.00', 'https://th.bing.com/th/id/OIP.mD9uvqMGLhaAxor-MWFSiQHaKX?cb=iwp2&rs=1&pid=ImgDetMain.jpg'),
(29, 27, 7, 'Beef noodles Soup', 1, '550.00', 'https://th.bing.com/th/id/R.55952d37ac42ff609f5d23fe6ea5a9ea?rik=GnCAsz1EIwGfiA&pid=ImgRaw&r=0.jpg'),
(30, 28, 3, 'caesar salad', 1, '250.00', 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg'),
(31, 29, 3, 'caesar salad', 1, '250.00', 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg'),
(32, 30, 8, 'Vegetable Stir Fry', 1, '450.00', 'https://deliciouslittlebites.com/wp-content/uploads/2017/02/Vegetable-Stir-Fry-Recipe-Image-10.jpg'),
(33, 31, 3, 'caesar salad', 1, '250.00', 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg'),
(34, 34, 3, 'caesar salad', 1, '250.00', 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg'),
(35, 35, 3, 'caesar salad', 1, '250.00', 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg'),
(36, 36, 3, 'caesar salad', 1, '250.00', 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg'),
(37, 37, 5, 'Fresh Lemonade', 1, '150.00', 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3&auto=format&fit=crop&w=150'),
(38, 38, 5, 'Fresh Lemonade', 1, '150.00', 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3&auto=format&fit=crop&w=150'),
(39, 39, 5, 'Fresh Lemonade', 1, '150.00', 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3&auto=format&fit=crop&w=150'),
(40, 40, 3, 'caesar salad', 1, '250.00', 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg'),
(41, 41, 3, 'caesar salad', 1, '250.00', 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg'),
(42, 42, 3, 'caesar salad', 1, '250.00', 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg'),
(43, 43, 3, 'caesar salad', 1, '250.00', 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg'),
(44, 44, 3, 'caesar salad', 1, '250.00', 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg'),
(45, 45, 3, 'caesar salad', 1, '250.00', 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg'),
(46, 46, 4, 'Chocolate lava cake', 1, '1200.00', 'https://th.bing.com/th/id/OIP.mD9uvqMGLhaAxor-MWFSiQHaKX?cb=iwp2&rs=1&pid=ImgDetMain.jpg'),
(47, 47, 4, 'Chocolate lava cake', 1, '1200.00', 'https://th.bing.com/th/id/OIP.mD9uvqMGLhaAxor-MWFSiQHaKX?cb=iwp2&rs=1&pid=ImgDetMain.jpg'),
(48, 48, 4, 'Chocolate lava cake', 1, '1200.00', 'https://th.bing.com/th/id/OIP.mD9uvqMGLhaAxor-MWFSiQHaKX?cb=iwp2&rs=1&pid=ImgDetMain.jpg'),
(49, 49, 4, 'Chocolate lava cake', 1, '1200.00', 'https://th.bing.com/th/id/OIP.mD9uvqMGLhaAxor-MWFSiQHaKX?cb=iwp2&rs=1&pid=ImgDetMain.jpg'),
(50, 50, 3, 'caesar salad', 1, '250.00', 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg'),
(51, 51, 5, 'Fresh Lemonade', 1, '150.00', 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3&auto=format&fit=crop&w=150'),
(52, 51, 3, 'caesar salad', 1, '250.00', 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg'),
(53, 52, 5, 'Fresh Lemonade', 1, '150.00', 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3&auto=format&fit=crop&w=150'),
(54, 53, 3, 'caesar salad', 1, '250.00', 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg'),
(55, 54, 5, 'Fresh Lemonade', 1, '150.00', 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3&auto=format&fit=crop&w=150'),
(56, 55, 8, 'Vegetable Stir Fry', 1, '450.00', 'https://deliciouslittlebites.com/wp-content/uploads/2017/02/Vegetable-Stir-Fry-Recipe-Image-10.jpg'),
(57, 56, 8, 'Vegetable Stir Fry', 1, '450.00', 'https://deliciouslittlebites.com/wp-content/uploads/2017/02/Vegetable-Stir-Fry-Recipe-Image-10.jpg'),
(58, 57, 7, 'Beef noodles Soup', 1, '550.00', 'https://th.bing.com/th/id/R.55952d37ac42ff609f5d23fe6ea5a9ea?rik=GnCAsz1EIwGfiA&pid=ImgRaw&r=0.jpg'),
(59, 58, 6, 'Chicken Pad Thai', 1, '500.00', 'https://th.bing.com/th/id/OIP.-967WrTLC2I78hNhuFkLtwHaLH?w=122&h=183&c=7&r=0&o=7&cb=iwp1&pid=1.7&rm=3.jpg'),
(60, 59, 8, 'Vegetable Stir Fry', 1, '450.00', 'https://deliciouslittlebites.com/wp-content/uploads/2017/02/Vegetable-Stir-Fry-Recipe-Image-10.jpg'),
(61, 60, 8, 'Vegetable Stir Fry', 1, '450.00', 'https://deliciouslittlebites.com/wp-content/uploads/2017/02/Vegetable-Stir-Fry-Recipe-Image-10.jpg'),
(62, 61, 3, 'caesar salad', 1, '250.00', 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg'),
(63, 62, 8, 'Vegetable Stir Fry', 1, '450.00', 'https://deliciouslittlebites.com/wp-content/uploads/2017/02/Vegetable-Stir-Fry-Recipe-Image-10.jpg'),
(64, 63, 10, 'Truffle Mushroom Pizza', 1, '1200.00', 'https://eurorich.ph/cdn/shop/articles/APC_0088_800x.jpg?v=1665678123.jpg'),
(65, 64, 10, 'Truffle Mushroom Pizza', 1, '1200.00', 'https://eurorich.ph/cdn/shop/articles/APC_0088_800x.jpg?v=1665678123.jpg'),
(66, 65, 9, 'Margherita Pizza', 1, '1100.00', 'https://th.bing.com/th/id/OIP.oWI38yAzSDcjDvT8xVFlcwHaFb?rs=1&pid=ImgDetMain.jpg'),
(67, 66, 9, 'Margherita Pizza', 1, '1100.00', 'https://th.bing.com/th/id/OIP.oWI38yAzSDcjDvT8xVFlcwHaFb?rs=1&pid=ImgDetMain.jpg'),
(68, 67, 10, 'Truffle Mushroom Pizza', 1, '1200.00', 'https://eurorich.ph/cdn/shop/articles/APC_0088_800x.jpg?v=1665678123.jpg'),
(69, 68, 9, 'Margherita Pizza', 1, '1100.00', 'https://th.bing.com/th/id/OIP.oWI38yAzSDcjDvT8xVFlcwHaFb?rs=1&pid=ImgDetMain.jpg'),
(70, 69, 10, 'Truffle Mushroom Pizza', 1, '1200.00', 'https://eurorich.ph/cdn/shop/articles/APC_0088_800x.jpg?v=1665678123.jpg'),
(71, 70, 5, 'Fresh Lemonade', 1, '150.00', 'https://www.mashed.com/img/gallery/16-best-prosecco-cocktails-ranked-from-worst-to-best/9-elderflower-gin-fizz-1671298498.jpg'),
(72, 71, 6, 'Chicken Pad Thai', 1, '500.00', 'https://bellyfull.net/wp-content/uploads/2022/08/Chicken-Pad-Thai-blog-2.jpg'),
(73, 72, 12, 'Mushroom Swiss Burger', 1, '980.00', 'https://www.foodandhome.co.za/wp-content/uploads/2023/05/Mushroom-and-beef-mince-blended-burger.jpg'),
(74, 73, 2, 'Rainbow Roll', 1, '550.00', 'https://th.bing.com/th/id/OIP.AR8OFJyHoZHtqFO4X0qboQHaEJ?rs=1&pid=ImgDetMain.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `stripe_payment_id` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'Lkr',
  `status` enum('Pending','Completed','Failed') DEFAULT 'Pending',
  `payment_method` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `productName` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `productName`, `description`, `category`, `price`, `quantity`, `image`, `createdAt`, `updatedAt`) VALUES
(2, 'Rainbow Roll', 'California roll topped with assorted sashimi', 'Sushi', '550.00', 19, 'https://th.bing.com/th/id/OIP.AR8OFJyHoZHtqFO4X0qboQHaEJ?rs=1&pid=ImgDetMain.jpg', '2025-05-10 04:06:20', '2025-06-15 07:35:25'),
(3, 'caesar salad', 'Romaine lettuce, croutons, Parmesan, and Caesar dressing', 'Salad', '250.00', 25, 'https://th.bing.com/th/id/OIP.UTCHytuqh3OUVx0NKkjSqwHaHa?cb=iwp2&w=650&h=650&rs=1&pid=ImgDetMain.jpg', '2025-05-11 03:45:39', '2025-05-11 03:48:07'),
(4, 'Chocolate lava cake', 'Warm chocolate cake with a molten center, served with ice cream', 'Desserts', '1200.00', 30, 'https://th.bing.com/th/id/OIP.mD9uvqMGLhaAxor-MWFSiQHaKX?cb=iwp2&rs=1&pid=ImgDetMain.jpg', '2025-05-11 03:57:45', '2025-05-11 03:58:45'),
(5, 'Fresh Lemonade', '\'Homemade lemonade with fresh lemons and mint', 'Drinks', '150.00', 38, 'https://www.mashed.com/img/gallery/16-best-prosecco-cocktails-ranked-from-worst-to-best/9-elderflower-gin-fizz-1671298498.jpg', '2025-05-11 04:16:37', '2025-06-08 14:50:38'),
(6, 'Chicken Pad Thai', 'Stir-fried rice noodles with chicken, eggs, and peanuts', 'Asian', '500.00', 4, 'https://bellyfull.net/wp-content/uploads/2022/08/Chicken-Pad-Thai-blog-2.jpg', '2025-05-11 04:54:52', '2025-06-11 14:00:10'),
(7, 'Beef noodles Soup', 'Hearty soup with tender beef and noodles', 'Asian', '550.00', 15, 'https://th.bing.com/th/id/R.55952d37ac42ff609f5d23fe6ea5a9ea?rik=GnCAsz1EIwGfiA&pid=ImgRaw&r=0.jpg', '2025-05-11 09:12:28', '2025-05-11 09:15:20'),
(8, 'Vegetable Stir Fry', ' vegetables in a savory sauce with rice', 'Asian', '450.00', 10, 'https://deliciouslittlebites.com/wp-content/uploads/2017/02/Vegetable-Stir-Fry-Recipe-Image-10.jpg', '2025-05-13 11:28:04', '2025-05-13 11:29:08'),
(9, 'Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 'Pizza', '1100.00', 12, 'https://th.bing.com/th/id/OIP.oWI38yAzSDcjDvT8xVFlcwHaFb?rs=1&pid=ImgDetMain.jpg', '2025-06-07 06:13:09', '2025-06-08 14:37:04'),
(10, 'Truffle Mushroom Pizza', 'Wild mushrooms, truffle oil, and three cheeses', 'Pizza', '1200.00', 25, 'https://eurorich.ph/cdn/shop/articles/APC_0088_800x.jpg?v=1665678123.jpg', '2025-06-07 06:16:13', '2025-06-11 14:02:11'),
(11, 'Classic Cheeseburger', 'Angus beef, American cheese, lettuce, tomato, special sauce', 'Burger', '1000.00', 15, 'https://img.freepik.com/premium-photo/classic-cheeseburger-fries_670382-37161.jpg', '2025-06-14 13:37:32', '2025-06-14 13:38:48'),
(12, 'Mushroom Swiss Burger', 'Beef patty with sautéed mushrooms and Swiss cheese', 'Burger', '980.00', 12, 'https://www.foodandhome.co.za/wp-content/uploads/2023/05/Mushroom-and-beef-mince-blended-burger.jpg', '2025-06-14 13:40:40', '2025-06-14 15:19:37'),
(13, 'Avocado Toast', 'Sourdough bread with smashed avocado and poached eggs', 'Breakfast', '540.00', 20, 'https://th.bing.com/th/id/R.552cf482595bff449693402842bb32c8?rik=drCE7Aux2vTdyQ&pid=ImgRaw&r=0.jpg', '2025-06-14 13:46:33', '2025-06-14 13:47:01'),
(14, 'Pancake Stack', 'Fluffy pancakes with maple syrup and berries', 'Breakfast', '750.00', 10, 'https://www.australianeggs.org.au/assets/Pink_Ombre_Pancakes_Ha_0565__ScaleWidthWzEyMDBd.jpg', '2025-06-14 13:48:21', '2025-06-14 13:48:56');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `agreed_to_terms` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`, `updated_at`, `agreed_to_terms`, `is_active`) VALUES
(1, 'sithum dananjaya wasala', 'sithum@gmail.com', '$2b$10$D15v3VtKkeEAeYsENRI6puAJuGW73pe1gMegU26Pw1Fwdi0rKVHRa', '2025-04-27 10:33:56', '2025-04-27 10:33:56', 0, 1),
(2, 'admin1', 'admin1@gmail.com', '$2b$10$B.G2oJoopbikXlnlWUG1HeImdcmkwoOHV/fOyFTEzi5wv6rU9yFmq', '2025-04-27 16:45:16', '2025-04-27 16:45:16', 0, 1),
(3, 'indra', 'Indra@gmail.com', '$2b$10$oXOMvZYXdj75Hd5Z/HLy2egNBUp4hD8ttGjeAOz.yzDLo22zIUw0q', '2025-04-30 00:08:35', '2025-04-30 00:08:35', 0, 1),
(4, 'lakshani', 'lakshani@gmail.com', '$2b$10$fdxQtUeL4Y26DLzilZXzoulQxMy5ubSDVz21xh/.CE6CR7dU5hPQO', '2025-04-30 03:14:05', '2025-04-30 03:14:05', 0, 1),
(5, 'rasangika lakshani wasala', 'rasangika@gmail.com', '$2b$10$w4uevU0avxgyjsWRtse6duCqTCGIjxmGQSQ8EUPO6ajc9RCYn7AlK', '2025-04-30 04:18:05', '2025-04-30 04:18:05', 0, 1),
(6, 'user1', 'user1@gmail.com', '$2b$10$hukWnp1eregPMBg6/hmojuT7uxPKZdrbPGmk1hPRedjhB8t1Torou', '2025-05-08 15:37:55', '2025-05-08 15:37:55', 0, 1),
(7, 'nimal darmasiri', 'nimal@gmail.com', '$2b$10$Ch1z4i/zl4ANRj6ZHr4rQOJGqW1pOpDKLJR3GfsCSHdn.6/0yhn9K', '2025-05-11 05:35:56', '2025-05-11 05:35:56', 0, 1),
(8, 'jayamini ekanayaka', 'jayamini@gmail.com', '$2b$10$KhW8xHkZPZgDP0jQSwfHb.TU8luVQOY2AD9GrIr6mfdRdQw2Lbd8.', '2025-05-25 07:19:52', '2025-05-25 07:19:52', 0, 1),
(9, 'user03', 'user3@gmail.com', '$2b$10$uAcUhcFUz852PvLGNBPX2OHTi27xWvD2b/hOdgTMuF8cgtjutFcTm', '2025-05-26 04:59:59', '2025-05-26 04:59:59', 0, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
