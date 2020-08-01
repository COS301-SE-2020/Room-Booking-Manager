-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 01, 2020 at 10:19 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
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
  `Rooms` varchar(100) NOT NULL,
  `Texas` varchar(100) NOT NULL,
  `Colorado` varchar(100) NOT NULL,
  `NewJersey` varchar(100) NOT NULL,
  `Mississippi` varchar(100) NOT NULL,
  `NewYork` varchar(100) NOT NULL,
  `California` varchar(100) NOT NULL,
  `Florida` varchar(100) NOT NULL,
  `Pennsylvania` varchar(100) NOT NULL,
  `Georgia` varchar(100) NOT NULL,
  `Tennessee` varchar(100) NOT NULL,
  `Washington` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `distance`
--

INSERT INTO `distance` (`Rooms`, `Texas`, `Colorado`, `NewJersey`, `Mississippi`, `NewYork`, `California`, `Florida`, `Pennsylvania`, `Georgia`, `Tennessee`, `Washington`) VALUES
('1A2', '23', '21', '22', '142', '12', '22', '12', '2', '3', '142', '9');

-- --------------------------------------------------------

--
-- Table structure for table `employeedetails`
--

CREATE TABLE `employeedetails` (
  `EmpEmail` varchar(100) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `EmpPassword` varchar(100) NOT NULL,
  `isAdmin` varchar(100) NOT NULL,
  `LocationID` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employeedetails`
--

INSERT INTO `employeedetails` (`EmpEmail`, `FirstName`, `LastName`, `EmpPassword`, `isAdmin`, `LocationID`) VALUES
('fdgfd@e.com', 'Emma', 'joburg', '142', 'false', '1A2');

-- --------------------------------------------------------

--
-- Table structure for table `floorplan`
--

CREATE TABLE `floorplan` (
  `RoomID` varchar(3) NOT NULL,
  `RoomName` varchar(100) NOT NULL,
  `FloorNumber` int(100) NOT NULL,
  `maxSeats` int(100) NOT NULL,
  `Amenity` varchar(150) NOT NULL,
  `Building` tinyint(1) NOT NULL,
  `Whiteboard` tinyint(1) NOT NULL,
  `Projector` tinyint(1) NOT NULL,
  `Monitor` tinyint(1) NOT NULL,
  `isExternal` tinyint(1) NOT NULL,
  `isAvailable` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `floorplan`
--

INSERT INTO `floorplan` (`RoomID`, `RoomName`, `FloorNumber`, `maxSeats`, `Amenity`, `Building`, `Whiteboard`, `Projector`, `Monitor`, `isExternal`, `isAvailable`) VALUES
('1D4', 'Texas', 2, 12, 'Whiteboard,Projector', 1, 0, 0, 0, 0, 0),
('1J8', 'collarado', 2, 12, 'Whiteboard,Projector', 1, 0, 0, 0, 0, 0),
('1mp', 'collarado', 2, 12, 'Whiteboard,Projector', 1, 0, 0, 0, 0, 0),
('1N8', 'collarado', 2, 12, 'Whiteboard,Projector', 1, 0, 0, 0, 0, 0),
('bjA', 'Texas', 2, 12, 'Whiteboard,Projector', 1, 0, 0, 0, 0, 0),
('und', 'undefined', 0, 0, 'undefined', 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `meetings`
--

CREATE TABLE `meetings` (
  `MeetingID` varchar(150) NOT NULL,
  `StartTime` varchar(150) NOT NULL,
  `EndTime` varchar(150) NOT NULL,
  `Organizer` varchar(150) NOT NULL,
  `Participants` varchar(150) NOT NULL,
  `OriginalAmenity` varchar(150) NOT NULL,
  `RoomID` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `meetings`
--

INSERT INTO `meetings` (`MeetingID`, `StartTime`, `EndTime`, `Organizer`, `Participants`, `OriginalAmenity`, `RoomID`) VALUES
('1Bmmb2', '1596257554', '1596264754', 'bob', '', 'projector', '2AW');

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
