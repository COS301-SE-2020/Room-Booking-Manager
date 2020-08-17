-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 17, 2020 at 12:30 PM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cos301`
--

-- --------------------------------------------------------

--
-- Table structure for table `distance`
--

CREATE TABLE `distance` (
  `Rooms` varchar(255) NOT NULL,
  `Texas` int(3) NOT NULL,
  `Colorado` int(3) NOT NULL,
  `Mississippi` int(3) NOT NULL,
  `NewJersey` int(3) NOT NULL,
  `NewYork` int(3) NOT NULL,
  `California` int(3) NOT NULL,
  `Florida` int(3) NOT NULL,
  `Pennsylvania` int(3) NOT NULL,
  `Georgia` int(3) NOT NULL,
  `Tennessee` int(3) NOT NULL,
  `Washington` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `distance`
--

INSERT INTO `distance` (`Rooms`, `Texas`, `Colorado`, `Mississippi`, `NewJersey`, `NewYork`, `California`, `Florida`, `Pennsylvania`, `Georgia`, `Tennessee`, `Washington`) VALUES
('1A1', 20, 40, 60, 10, 250, 80, 120, 100, 300, 600, 400),
('1A2', 35, 65, 80, 120, 75, 100, 650, 350, 400, 150, 160),
('1C2', 21, 17, 21, 25, 89, 97, 103, 96, 101, 107, 110),
('1D1', 49, 54, 60, 63, 86, 94, 100, 93, 98, 104, 107),
('1F2', 27, 21, 20, 15, 101, 109, 115, 108, 113, 119, 122),
('1H2', 21, 16, 20, 24, 94, 101, 107, 101, 105, 111, 114),
('1I2', 25, 20, 20, 16, 101, 108, 114, 108, 112, 118, 121),
('1J1', 46, 50, 56, 59, 83, 90, 96, 90, 94, 100, 103),
('1K1', 54, 58, 64, 67, 91, 98, 104, 98, 102, 108, 111),
('1L1', 61, 65, 71, 74, 98, 105, 111, 105, 109, 115, 118),
('1L2', 21, 16, 16, 12, 105, 112, 118, 112, 116, 122, 125),
('1M1', 100, 20, 35, 80, 40, 120, 45, 60, 75, 20, 15),
('1M2', 9, 15, 19, 23, 94, 101, 107, 101, 105, 111, 114),
('1P1', 48, 53, 59, 62, 85, 93, 99, 92, 97, 103, 106),
('1R1', 56, 61, 67, 70, 93, 101, 107, 100, 105, 111, 114),
('1U1', 68, 73, 79, 82, 105, 113, 119, 112, 117, 123, 126);

-- --------------------------------------------------------

--
-- Table structure for table `employeedetails`
--

CREATE TABLE `employeedetails` (
  `EmpEmail` varchar(255) NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `EmpPassword` varchar(255) NOT NULL,
  `isAdmin` bit(1) NOT NULL,
  `LocationID` varchar(255) NOT NULL,
  `AverageSpeed` int(10) UNSIGNED NOT NULL COMMENT 'Avg walking speed of attendees'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employeedetails`
--

INSERT INTO `employeedetails` (`EmpEmail`, `FirstName`, `LastName`, `EmpPassword`, `isAdmin`, `LocationID`, `AverageSpeed`) VALUES
('AdeleV@teamthreshold.onmicrosoft.com', 'Adele', 'Vance', 'password', b'1', '1A1', 80),
('AlexW@teamthreshold.onmicrosoft.com', 'Alex ', 'Wilber', 'password', b'0', '1D1', 80),
('COS301@teamthreshold.onmicrosoft.com', 'Team', 'Threshold', 'Thresh#301', b'0', '1M1', 80),
('DiegoS@teamthreshold.onmicrosoft.com', 'Diego', 'Siciliani', 'password', b'0', '1P1', 80),
('GradyA@teamthreshold.onmicrosoft.com', 'Grady', 'Archie', 'password', b'0', '1U1', 80),
('HenriettaM@teamthreshold.onmicrosoft.com', 'Henrietta', 'Mueller', 'password', b'0', '1K1', 80),
('IsaiahL@teamthreshold.onmicrosoft.com', 'Isaiah', 'Langer', 'password', b'0', '1R1', 80),
('JohannaL@teamthreshold.onmicrosoft.com', 'Johanna', 'Lorenz', 'password', b'0', '1L1', 80),
('JoniS@teamthreshold.onmicrosoft.com', 'Joni', 'Sherman', 'password', b'0', '1J1', 80),
('LeeG@teamthreshold.onmicrosoft.com', 'Lee', 'Gu', 'password', b'0', '1A2', 80),
('LidiaH@teamthreshold.onmicrosoft.com', 'Lidia', 'Holloway', 'password', b'0', '1C2', 80),
('LynneR@teamthreshold.onmicrosoft.com', 'Lynne', 'Robbins', 'password', b'0', '1F2', 80),
('MeganB@teamthreshold.onmicrosoft.com', 'Megan', 'Bowen', 'password', b'0', '1I2', 80),
('MiriamG@teamthreshold.onmicrosoft.com', 'Miriam', 'Graham', 'password', b'0', '1F2', 80),
('NestorW@teamthreshold.onmicrosoft.com', 'Nestor', 'Wilke', 'password', b'0', '1M2', 80),
('PattiF@teamthreshold.onmicrosoft.com', 'Patti', 'Fernandez', 'password', b'0', '1H2', 80),
('PradeepG@teamthreshold.onmicrosoft.com', 'PradeepG', 'Gupta', 'password', b'1', '1L2', 80);

-- --------------------------------------------------------

--
-- Table structure for table `floorplan`
--

CREATE TABLE `floorplan` (
  `RoomID` varchar(255) NOT NULL,
  `RoomName` varchar(255) NOT NULL,
  `FloorNumber` int(2) NOT NULL,
  `maxSeats` int(2) NOT NULL,
  `Amenity` varchar(255) NOT NULL,
  `isExternal` bit(1) NOT NULL,
  `Building` int(2) NOT NULL,
  `Whiteboard` bit(1) NOT NULL,
  `Projector` bit(1) NOT NULL,
  `Monitor` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `floorplan`
--

INSERT INTO `floorplan` (`RoomID`, `RoomName`, `FloorNumber`, `maxSeats`, `Amenity`, `isExternal`, `Building`, `Whiteboard`, `Projector`, `Monitor`) VALUES
('1P2', 'Texas', 2, 10, 'Whiteboard,Projector', b'0', 1, b'1', b'1', b'0'),
('1Q2', 'Colorado', 2, 6, 'Whiteboard', b'0', 1, b'1', b'0', b'0'),
('1R2', 'Mississippi', 2, 6, 'Projector', b'0', 1, b'0', b'1', b'0'),
('1S2', 'NewJersey', 2, 6, 'Whiteboard,Monitor', b'0', 1, b'1', b'0', b'1'),
('2P1', 'NewYork', 1, 10, 'Whiteboard,Projector', b'0', 2, b'1', b'1', b'0'),
('2P2', 'Pennsylvania', 2, 10, 'Whiteboard,Projector', b'0', 2, b'1', b'1', b'0'),
('2Q1', 'California', 1, 10, 'Whiteboard,Monitor', b'0', 2, b'1', b'0', b'1'),
('2Q2', 'Georgia', 2, 6, 'Whiteboard', b'0', 2, b'1', b'0', b'0'),
('2R1', 'Florida', 1, 10, 'Whiteboard,Monitor', b'0', 2, b'1', b'0', b'1'),
('2R2', 'Tennessee', 2, 6, 'Monitor', b'0', 2, b'0', b'0', b'1'),
('2S2', 'Washington', 2, 6, 'Whiteboard,Projector', b'0', 2, b'1', b'1', b'0');

-- --------------------------------------------------------

--
-- Table structure for table `meetings`
--

CREATE TABLE `meetings` (
  `MeetingID` int(11) NOT NULL,
  `StartTime` datetime(6) NOT NULL,
  `EndTime` datetime(6) NOT NULL,
  `Organizer` varchar(150) NOT NULL,
  `Participants` varchar(150) NOT NULL,
  `OriginalAmenity` varchar(150) NOT NULL,
  `RoomID` varchar(3) NOT NULL,
  `BestRooms` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `distance`
--
ALTER TABLE `distance`
  ADD PRIMARY KEY (`Rooms`);

--
-- Indexes for table `employeedetails`
--
ALTER TABLE `employeedetails`
  ADD PRIMARY KEY (`EmpEmail`);

--
-- Indexes for table `floorplan`
--
ALTER TABLE `floorplan`
  ADD PRIMARY KEY (`RoomID`);

--
-- Indexes for table `meetings`
--
ALTER TABLE `meetings`
  ADD PRIMARY KEY (`MeetingID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `meetings`
--
ALTER TABLE `meetings`
  MODIFY `MeetingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
