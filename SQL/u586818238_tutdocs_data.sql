-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 14, 2024 at 08:44 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u586818238_tutdocs_data`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookmarks`
--

CREATE TABLE `bookmarks` (
  `bookmark_id` int(11) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `file_key` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookmarks`
--

INSERT INTO `bookmarks` (`bookmark_id`, `user_id`, `file_key`, `created_at`) VALUES
(54, 'dilipkumar@4d7fa', 't70ed2ee24d0052d1a602', '2024-08-13 09:47:17');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `course_code` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `user_id`, `course_name`, `course_code`) VALUES
(62, 'dilipkumar@4d7fa', 'Microprocessor ', 'U20ECCJ21');

-- --------------------------------------------------------

--
-- Table structure for table `daily_views`
--

CREATE TABLE `daily_views` (
  `id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `views` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `daily_views`
--

INSERT INTO `daily_views` (`id`, `date`, `views`) VALUES
(36, '2024-08-13', 1);

-- --------------------------------------------------------

--
-- Table structure for table `email_verification`
--

CREATE TABLE `email_verification` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `verification_token` varchar(255) NOT NULL,
  `verified_status` enum('verified','not_verified') DEFAULT 'not_verified',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `token_expiration` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `files_table`
--

CREATE TABLE `files_table` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `upload_by` varchar(255) NOT NULL,
  `file_key` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_title` varchar(255) NOT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `file_size` varchar(255) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `thumnail_url` varchar(255) DEFAULT NULL,
  `course_name` varchar(255) NOT NULL,
  `course_code` varchar(255) NOT NULL,
  `file_description` varchar(255) NOT NULL,
  `academic_year` varchar(255) NOT NULL,
  `institute_name` varchar(255) NOT NULL,
  `upload_date` varchar(11) NOT NULL,
  `upload_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `view_count` int(11) DEFAULT 0,
  `like_count` int(11) DEFAULT 0,
  `download_count` int(11) DEFAULT 0,
  `extension` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `files_table`
--

INSERT INTO `files_table` (`id`, `user_id`, `upload_by`, `file_key`, `file_name`, `file_title`, `file_type`, `file_size`, `file_url`, `thumnail_url`, `course_name`, `course_code`, `file_description`, `academic_year`, `institute_name`, `upload_date`, `upload_time`, `view_count`, `like_count`, `download_count`, `extension`) VALUES
(55, 'dilipkumar@4d7fa', 'Dilip Gupta', 't00cb9ac3b56006f123e5', 'BEEE_UNIT_3.pdf', 'TOOLS USED IN WIRING', 'Lecture Notes', '2.79 MB', 'http://localhost/tutdocs/users-files/uploads/dilipkumar@4d7fa-upload-documents/BEEE_UNIT_3.pdf', 'http://localhost/tutdocs/users-files/uploads/dilipkumar@4d7fa-upload-documents/files_thumbnails/BEEE_UNIT_3.png', 'ELECTRONICS ENGINEERING', 'U20EEEJ01', 'Use approved tools, equipment’s and protective devices.\r\n2. Do not work under poor light or when you are tired.\r\n3. Do not work in damp areas or in wet shoes or clothes.\r\n4. Keep tools and equipment’s clean and in good working condition.\r\n5. Read all inst', '2022/2023', 'Bharath Institute of Higher Education and Research', '03 Feb 2024', '2024-02-03 17:53:16', 1, 0, 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `follow_courses`
--

CREATE TABLE `follow_courses` (
  `course_id` int(11) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `course_name` varchar(100) NOT NULL,
  `course_code` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `likes_table`
--

CREATE TABLE `likes_table` (
  `id` int(11) NOT NULL,
  `file_key` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `likes_table`
--

INSERT INTO `likes_table` (`id`, `file_key`, `user_id`, `created_at`) VALUES
(50, 't_a383f390d206466fbb6e', 'dilipkumar@4d7fa', '2024-08-12 21:34:39');

-- --------------------------------------------------------

--
-- Table structure for table `notification_table`
--

CREATE TABLE `notification_table` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `message` text DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `file_title` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notification_table`
--

INSERT INTO `notification_table` (`id`, `user_id`, `name`, `title`, `message`, `url`, `file_title`, `profile_picture`, `status`, `time`, `created_at`) VALUES
(122, 'pawanyadav@34123', 'Dilip Gupta', 'New Post', 'Please take a moment to review and provide any necessary feedback.', '/view?document=t5e3f3f221892cd43b271', 'Relational Model Table', 'http://localhost/tutdocs/auth/users_profile/dilipkumar@4d7fa_dilip-img.jpg', 'not_viewed', '2024-02-20T12:15:43.558Z', '2024-02-20 12:17:06');

-- --------------------------------------------------------

--
-- Table structure for table `recently_viewed_table`
--

CREATE TABLE `recently_viewed_table` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `file_key` varchar(255) NOT NULL,
  `view_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `recently_viewed_table`
--

INSERT INTO `recently_viewed_table` (`id`, `user_id`, `file_key`, `view_date`) VALUES
(196, 'dilipkumar@4d7fa', 't21da09be5bd886f872fc', '2024-03-06 17:36:45');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `study_at` varchar(500) NOT NULL,
  `user_type` varchar(255) DEFAULT NULL,
  `started_on` varchar(255) NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `token_expiration` datetime DEFAULT NULL,
  `branch` varchar(255) DEFAULT NULL,
  `contact_no` varchar(255) DEFAULT NULL,
  `studying_year` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_id`, `name`, `username`, `password`, `profile_picture`, `study_at`, `user_type`, `started_on`, `reset_token`, `token_expiration`, `branch`, `contact_no`, `studying_year`, `address`) VALUES
(164, 'dilipkumar@4d7fa', 'Dilip Gupta', 'dilipg44u@gmail.com', 'ef797c8118f02dfb6496', 'http://localhost/tutdocs/auth/users_profile/dilipkumar@4d7fa_dilip-img.jpg', 'Bharath institute of higher education and research ', 'Student', '2022', NULL, NULL, 'B.Tech CSE', '+917991907185', '2nd year', 'Rohini-7, Manoharapur, Rupandehi Nepal');

-- --------------------------------------------------------

--
-- Table structure for table `user_institutions`
--

CREATE TABLE `user_institutions` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `institution_type` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `institution_name` varchar(100) NOT NULL,
  `institution_url` varchar(255) DEFAULT NULL,
  `created_at` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_institutions`
--

INSERT INTO `user_institutions` (`id`, `user_id`, `username`, `institution_type`, `country`, `institution_name`, `institution_url`, `created_at`) VALUES
(1, 'dilipgupta@86c0e', 'dg9824423052@gmail.com', 'University', 'Chennai,Tamil Nadu, India', 'Bharath Institute of Higher Education and Research', 'https://www.bharathuniv.ac.in/', '');

-- --------------------------------------------------------

--
-- Table structure for table `user_relationships`
--

CREATE TABLE `user_relationships` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `follow_by` varchar(255) NOT NULL,
  `followDate` timestamp NULL DEFAULT current_timestamp(),
  `unfollowDate` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD PRIMARY KEY (`bookmark_id`),
  ADD UNIQUE KEY `unique_bookmark` (`user_id`,`file_key`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `daily_views`
--
ALTER TABLE `daily_views`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `date` (`date`);

--
-- Indexes for table `email_verification`
--
ALTER TABLE `email_verification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `files_table`
--
ALTER TABLE `files_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `likes_table`
--
ALTER TABLE `likes_table`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_file_key` (`file_key`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `notification_table`
--
ALTER TABLE `notification_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recently_viewed_table`
--
ALTER TABLE `recently_viewed_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id_UNIQUE` (`user_id`);

--
-- Indexes for table `user_institutions`
--
ALTER TABLE `user_institutions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_relationships`
--
ALTER TABLE `user_relationships`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_relationship` (`follow_by`,`user_id`),
  ADD KEY `fk_followed_user` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookmarks`
--
ALTER TABLE `bookmarks`
  MODIFY `bookmark_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `daily_views`
--
ALTER TABLE `daily_views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `email_verification`
--
ALTER TABLE `email_verification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `files_table`
--
ALTER TABLE `files_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=183;

--
-- AUTO_INCREMENT for table `likes_table`
--
ALTER TABLE `likes_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `notification_table`
--
ALTER TABLE `notification_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=204;

--
-- AUTO_INCREMENT for table `recently_viewed_table`
--
ALTER TABLE `recently_viewed_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=198;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=180;

--
-- AUTO_INCREMENT for table `user_institutions`
--
ALTER TABLE `user_institutions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `user_relationships`
--
ALTER TABLE `user_relationships`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=181;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_relationships`
--
ALTER TABLE `user_relationships`
  ADD CONSTRAINT `fk_followed_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_follower_user` FOREIGN KEY (`follow_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
