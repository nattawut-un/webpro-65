-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 18, 2023 at 11:07 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webpro`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'ข้าว', 'test'),
(2, 'ก๋วยเตี๋ยว', 'test');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `category_id` int(10) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` float(8,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category_id`, `description`, `price`, `image`) VALUES
(1, 'ข้าวมันไก่', 1, 'ปูอัด มาร์คนางแบบสเกตช์ นิรันดร์เป็นไงวอลนัตคอลเล็กชั่น ควีนทัวร์นาเมนท์วอลซ์แอลมอนด์พริตตี้ ฟรังก์ซานตาคลอสน้องใหม่เยอร์บีรา ม้งแบ็กโฮสคริปต์โบว์ลิ่งสไลด์ ดีมานด์เจี๊ยว อุตสาหการก๋ากั่นเจ๊โต๊ะจีน เอนทรานซ์เฝอมัฟฟิน แพตเทิร์น เรซิ่น หมวยแอ็กชั่นงี้ ว้อดก้', 40.00, NULL),
(2, 'ข้าวหมูกรอบ', 1, 'ปูอัด มาร์คนางแบบสเกตช์ นิรันดร์เป็นไงวอลนัตคอลเล็กชั่น ควีนทัวร์นาเมนท์วอลซ์แอลมอนด์พริตตี้ ฟรังก์ซานตาคลอสน้องใหม่เยอร์บีรา ม้งแบ็กโฮสคริปต์โบว์ลิ่งสไลด์ ดีมานด์เจี๊ยว อุตสาหการก๋ากั่นเจ๊โต๊ะจีน เอนทรานซ์เฝอมัฟฟิน แพตเทิร์น เรซิ่น หมวยแอ็กชั่นงี้ ว้อดก้', 40.00, NULL),
(3, 'หมูทอดกระเทียม', 1, 'ปูอัด มาร์คนางแบบสเกตช์ นิรันดร์เป็นไงวอลนัตคอลเล็กชั่น ควีนทัวร์นาเมนท์วอลซ์แอลมอนด์พริตตี้ ฟรังก์ซานตาคลอสน้องใหม่เยอร์บีรา ม้งแบ็กโฮสคริปต์โบว์ลิ่งสไลด์ ดีมานด์เจี๊ยว อุตสาหการก๋ากั่นเจ๊โต๊ะจีน เอนทรานซ์เฝอมัฟฟิน แพตเทิร์น เรซิ่น หมวยแอ็กชั่นงี้ ว้อดก้', 30.00, NULL),
(4, 'ข้าวหมูแดง', 1, 'ปูอัด มาร์คนางแบบสเกตช์ นิรันดร์เป็นไงวอลนัตคอลเล็กชั่น ควีนทัวร์นาเมนท์วอลซ์แอลมอนด์พริตตี้ ฟรังก์ซานตาคลอสน้องใหม่เยอร์บีรา ม้งแบ็กโฮสคริปต์โบว์ลิ่งสไลด์ ดีมานด์เจี๊ยว อุตสาหการก๋ากั่นเจ๊โต๊ะจีน เอนทรานซ์เฝอมัฟฟิน แพตเทิร์น เรซิ่น หมวยแอ็กชั่นงี้ ว้อดก้', 35.00, NULL),
(5, 'ข้าวผัดกระเพราไก่', 1, 'ปูอัด มาร์คนางแบบสเกตช์ นิรันดร์เป็นไงวอลนัตคอลเล็กชั่น ควีนทัวร์นาเมนท์วอลซ์แอลมอนด์พริตตี้ ฟรังก์ซานตาคลอสน้องใหม่เยอร์บีรา ม้งแบ็กโฮสคริปต์โบว์ลิ่งสไลด์ ดีมานด์เจี๊ยว อุตสาหการก๋ากั่นเจ๊โต๊ะจีน เอนทรานซ์เฝอมัฟฟิน แพตเทิร์น เรซิ่น หมวยแอ็กชั่นงี้ ว้อดก้', 30.00, NULL),
(6, 'ผัดผักบุ้ง', 1, 'ปูอัด มาร์คนางแบบสเกตช์ นิรันดร์เป็นไงวอลนัตคอลเล็กชั่น ควีนทัวร์นาเมนท์วอลซ์แอลมอนด์พริตตี้ ฟรังก์ซานตาคลอสน้องใหม่เยอร์บีรา ม้งแบ็กโฮสคริปต์โบว์ลิ่งสไลด์ ดีมานด์เจี๊ยว อุตสาหการก๋ากั่นเจ๊โต๊ะจีน เอนทรานซ์เฝอมัฟฟิน แพตเทิร์น เรซิ่น หมวยแอ็กชั่นงี้ ว้อดก้', 30.00, NULL),
(7, 'แกงจืดเต้าหู้หมูสับ', 1, 'ปูอัด มาร์คนางแบบสเกตช์ นิรันดร์เป็นไงวอลนัตคอลเล็กชั่น ควีนทัวร์นาเมนท์วอลซ์แอลมอนด์พริตตี้ ฟรังก์ซานตาคลอสน้องใหม่เยอร์บีรา ม้งแบ็กโฮสคริปต์โบว์ลิ่งสไลด์ ดีมานด์เจี๊ยว อุตสาหการก๋ากั่นเจ๊โต๊ะจีน เอนทรานซ์เฝอมัฟฟิน แพตเทิร์น เรซิ่น หมวยแอ็กชั่นงี้ ว้อดก้', 30.00, NULL),
(8, 'ผัดไท', 2, 'ปูอัด มาร์คนางแบบสเกตช์ นิรันดร์เป็นไงวอลนัตคอลเล็กชั่น ควีนทัวร์นาเมนท์วอลซ์แอลมอนด์พริตตี้ ฟรังก์ซานตาคลอสน้องใหม่เยอร์บีรา ม้งแบ็กโฮสคริปต์โบว์ลิ่งสไลด์ ดีมานด์เจี๊ยว อุตสาหการก๋ากั่นเจ๊โต๊ะจีน เอนทรานซ์เฝอมัฟฟิน แพตเทิร์น เรซิ่น หมวยแอ็กชั่นงี้ ว้อดก้', 30.00, NULL),
(9, 'เต้าหู้ทรงเครื่อง', 1, 'ปูอัด มาร์คนางแบบสเกตช์ นิรันดร์เป็นไงวอลนัตคอลเล็กชั่น ควีนทัวร์นาเมนท์วอลซ์แอลมอนด์พริตตี้ ฟรังก์ซานตาคลอสน้องใหม่เยอร์บีรา ม้งแบ็กโฮสคริปต์โบว์ลิ่งสไลด์ ดีมานด์เจี๊ยว อุตสาหการก๋ากั่นเจ๊โต๊ะจีน เอนทรานซ์เฝอมัฟฟิน แพตเทิร์น เรซิ่น หมวยแอ็กชั่นงี้ ว้อดก้', 25.00, NULL),
(10, 'ต้มยำกุ้ง', 1, 'ปูอัด มาร์คนางแบบสเกตช์ นิรันดร์เป็นไงวอลนัตคอลเล็กชั่น ควีนทัวร์นาเมนท์วอลซ์แอลมอนด์พริตตี้ ฟรังก์ซานตาคลอสน้องใหม่เยอร์บีรา ม้งแบ็กโฮสคริปต์โบว์ลิ่งสไลด์ ดีมานด์เจี๊ยว อุตสาหการก๋ากั่นเจ๊โต๊ะจีน เอนทรานซ์เฝอมัฟฟิน แพตเทิร์น เรซิ่น หมวยแอ็กชั่นงี้ ว้อดก้', 35.00, NULL),
(11, 'ไข่พะโล้', 1, 'ปูอัด มาร์คนางแบบสเกตช์ นิรันดร์เป็นไงวอลนัตคอลเล็กชั่น ควีนทัวร์นาเมนท์วอลซ์แอลมอนด์พริตตี้ ฟรังก์ซานตาคลอสน้องใหม่เยอร์บีรา ม้งแบ็กโฮสคริปต์โบว์ลิ่งสไลด์ ดีมานด์เจี๊ยว อุตสาหการก๋ากั่นเจ๊โต๊ะจีน เอนทรานซ์เฝอมัฟฟิน แพตเทิร์น เรซิ่น หมวยแอ็กชั่นงี้ ว้อดก้', 20.00, NULL),
(12, 'ต้มยำปลากรอบ', 1, 'ปูอัด มาร์คนางแบบสเกตช์ นิรันดร์เป็นไงวอลนัตคอลเล็กชั่น ควีนทัวร์นาเมนท์วอลซ์แอลมอนด์พริตตี้ ฟรังก์ซานตาคลอสน้องใหม่เยอร์บีรา ม้งแบ็กโฮสคริปต์โบว์ลิ่งสไลด์ ดีมานด์เจี๊ยว อุตสาหการก๋ากั่นเจ๊โต๊ะจีน เอนทรานซ์เฝอมัฟฟิน แพตเทิร์น เรซิ่น หมวยแอ็กชั่นงี้ ว้อดก้', 30.00, NULL),
(13, 'แกงจืดรวมมิตรทะเล', 2, 'ปูอัด มาร์คนางแบบสเกตช์ นิรันดร์เป็นไงวอลนัตคอลเล็กชั่น ควีนทัวร์นาเมนท์วอลซ์แอลมอนด์พริตตี้ ฟรังก์ซานตาคลอสน้องใหม่เยอร์บีรา ม้งแบ็กโฮสคริปต์โบว์ลิ่งสไลด์ ดีมานด์เจี๊ยว อุตสาหการก๋ากั่นเจ๊โต๊ะจีน เอนทรานซ์เฝอมัฟฟิน แพตเทิร์น เรซิ่น หมวยแอ็กชั่นงี้ ว้อดก้', 25.00, NULL),
(14, 'ข้าวต้มปลา', 1, 'ปูอัด มาร์คนางแบบสเกตช์ นิรันดร์เป็นไงวอลนัตคอลเล็กชั่น ควีนทัวร์นาเมนท์วอลซ์แอลมอนด์พริตตี้ ฟรังก์ซานตาคลอสน้องใหม่เยอร์บีรา ม้งแบ็กโฮสคริปต์โบว์ลิ่งสไลด์ ดีมานด์เจี๊ยว อุตสาหการก๋ากั่นเจ๊โต๊ะจีน เอนทรานซ์เฝอมัฟฟิน แพตเทิร์น เรซิ่น หมวยแอ็กชั่นงี้ ว้อดก้', 25.00, NULL),
(15, 'ยำปลาดุกฟู', 1, 'ปูอัด มาร์คนางแบบสเกตช์ นิรันดร์เป็นไงวอลนัตคอลเล็กชั่น ควีนทัวร์นาเมนท์วอลซ์แอลมอนด์พริตตี้ ฟรังก์ซานตาคลอสน้องใหม่เยอร์บีรา ม้งแบ็กโฮสคริปต์โบว์ลิ่งสไลด์ ดีมานด์เจี๊ยว อุตสาหการก๋ากั่นเจ๊โต๊ะจีน เอนทรานซ์เฝอมัฟฟิน แพตเทิร์น เรซิ่น หมวยแอ็กชั่นงี้ ว้อดก้', 30.00, NULL),
(16, 'ทอดมันปลา', 1, 'ปูอัด มาร์คนางแบบสเกตช์ นิรันดร์เป็นไงวอลนัตคอลเล็กชั่น ควีนทัวร์นาเมนท์วอลซ์แอลมอนด์พริตตี้ ฟรังก์ซานตาคลอสน้องใหม่เยอร์บีรา ม้งแบ็กโฮสคริปต์โบว์ลิ่งสไลด์ ดีมานด์เจี๊ยว อุตสาหการก๋ากั่นเจ๊โต๊ะจีน เอนทรานซ์เฝอมัฟฟิน แพตเทิร์น เรซิ่น หมวยแอ็กชั่นงี้ ว้อดก้', 25.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(50) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `favorites` mediumtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `is_admin`, `last_login`, `phone`, `email`, `address`, `favorites`) VALUES
('732a8609-7f23-4550-a22f-bc6764073e2c', 'admin', '$2a$12$txIEGWyZG7zVqfD5uPe2zuiHsE9nf1u3a/RXFzfUwZEa8VrVOQco2', 1, '2023-03-18 16:45:42', '0987654321', 'email@domain.com', 'Lat Krabang, Bangkok, Thailand, Earth', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
