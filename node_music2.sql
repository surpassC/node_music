/*
 Navicat Premium Dump SQL

 Source Server         : docker
 Source Server Type    : MySQL
 Source Server Version : 80040 (8.0.40)
 Source Host           : localhost:3306
 Source Schema         : node_music

 Target Server Type    : MySQL
 Target Server Version : 80040 (8.0.40)
 File Encoding         : 65001

 Date: 01/01/2025 11:03:20
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admins
-- ----------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `role` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT 'admin',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 4 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of admins
-- ----------------------------
INSERT INTO `admins` VALUES (2, '111', '111', 'admin', '2024-10-23 17:49:50');
INSERT INTO `admins` VALUES (3, '123', '123', 'admin', '2024-12-29 11:16:52');

-- ----------------------------
-- Table structure for composers
-- ----------------------------
DROP TABLE IF EXISTS `composers`;
CREATE TABLE `composers`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `genre` int NOT NULL,
  `birth_date` date NULL DEFAULT NULL,
  `death_date` date NULL DEFAULT NULL,
  `bio` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `number_works` int NULL DEFAULT NULL,
  `country` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `image_path` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 148 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of composers
-- ----------------------------
INSERT INTO `composers` VALUES (110, '克里斯托夫·维利巴尔德·格鲁克', 3, NULL, NULL, NULL, 49, 'Austria', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (111, '约瑟夫·海顿', 3, NULL, NULL, NULL, 340, 'Austria', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (112, '约翰·尼波默克·胡梅尔', 3, NULL, NULL, NULL, 250, 'Germany', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (109, '约翰·菲尔德', 3, NULL, NULL, NULL, 20, 'Ireland', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (108, '卡尔·车尔尼', 3, NULL, NULL, NULL, 140, 'Austria', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (71, '威廉·伯德', 1, NULL, NULL, NULL, 470, 'United Kingdom', '2024-10-23 20:56:44', '2024-10-23 20:56:44', NULL);
INSERT INTO `composers` VALUES (72, '朱利歐·卡契尼', 1, NULL, NULL, NULL, 12, 'Italy', '2024-10-23 20:56:44', '2024-10-23 20:56:44', NULL);
INSERT INTO `composers` VALUES (73, '托马斯·坎皮恩', 1, NULL, NULL, NULL, 66, 'United Kingdom', '2024-10-23 20:56:44', '2024-10-23 20:56:44', NULL);
INSERT INTO `composers` VALUES (74, '约翰·道兰德', 1, NULL, NULL, NULL, 100, 'United Kingdom', '2024-10-23 20:56:44', '2024-10-23 20:56:44', NULL);
INSERT INTO `composers` VALUES (75, '安德烈·加布里埃利', 1, NULL, NULL, NULL, 125, 'Italy', '2024-10-23 20:56:44', '2024-10-23 20:56:44', NULL);
INSERT INTO `composers` VALUES (76, '乔万尼·加布里埃利', 1, NULL, NULL, NULL, 76, 'Italy', '2024-10-23 20:56:44', '2024-10-23 20:56:44', NULL);
INSERT INTO `composers` VALUES (77, '奧蘭多·吉本斯', 1, NULL, NULL, NULL, 141, 'United Kingdom', '2024-10-23 20:56:44', '2024-10-23 20:56:44', NULL);
INSERT INTO `composers` VALUES (78, '克莱门特·雅内坎', 1, NULL, NULL, NULL, 100, 'France', '2024-10-23 20:56:44', '2024-10-23 20:56:44', NULL);
INSERT INTO `composers` VALUES (79, '奧蘭多·德·拉絮斯', 1, NULL, NULL, NULL, 175, 'Belgium', '2024-10-23 20:56:44', '2024-10-23 20:56:44', NULL);
INSERT INTO `composers` VALUES (80, '乔瓦尼·皮耶路易吉·达·帕莱斯特里纳', 1, NULL, NULL, NULL, 95, 'Italy', '2024-10-23 20:56:44', '2024-10-23 20:56:44', NULL);
INSERT INTO `composers` VALUES (81, '托马斯·塔利斯', 1, NULL, NULL, NULL, 40, 'United Kingdom', '2024-10-23 20:56:44', '2024-10-23 20:56:44', NULL);
INSERT INTO `composers` VALUES (82, '托马索·阿尔比诺尼', 2, NULL, NULL, NULL, 48, 'Italy', '2024-10-23 22:15:12', '2024-10-23 22:15:12', NULL);
INSERT INTO `composers` VALUES (83, '威廉·弗里德曼·巴赫', 2, NULL, NULL, NULL, 100, 'Germany', '2024-10-23 22:15:12', '2024-10-23 22:15:12', NULL);
INSERT INTO `composers` VALUES (84, '迪特里克·布克斯特胡德', 2, NULL, NULL, NULL, 224, 'Germany', '2024-10-23 22:15:12', '2024-10-23 22:15:12', NULL);
INSERT INTO `composers` VALUES (85, '米歇尔·皮纽雷·德·蒙特克莱尔', 2, NULL, NULL, NULL, 50, 'France', '2024-10-23 22:15:12', '2024-10-23 22:15:12', NULL);
INSERT INTO `composers` VALUES (86, '朱利歐·卡契尼', 2, NULL, NULL, NULL, 12, 'Italy', '2024-10-23 22:15:12', '2024-10-23 22:15:12', NULL);
INSERT INTO `composers` VALUES (87, '托马斯·坎皮恩', 2, NULL, NULL, NULL, 66, 'United Kingdom', '2024-10-23 22:15:12', '2024-10-23 22:15:12', NULL);
INSERT INTO `composers` VALUES (88, '阿尔坎杰罗·科雷利', 2, NULL, NULL, NULL, 150, 'Italy', '2024-10-23 22:15:12', '2024-10-23 22:15:12', NULL);
INSERT INTO `composers` VALUES (89, '弗朗索瓦·库普兰', 2, NULL, NULL, NULL, 230, 'France', '2024-10-23 22:15:12', '2024-10-23 22:15:12', NULL);
INSERT INTO `composers` VALUES (90, '约翰·道兰德', 2, NULL, NULL, NULL, 100, 'United Kingdom', '2024-10-23 22:15:12', '2024-10-23 22:15:12', NULL);
INSERT INTO `composers` VALUES (91, '奥兰多·吉本斯', 2, NULL, NULL, NULL, 141, 'United Kingdom', '2024-10-23 22:15:12', '2024-10-23 22:15:12', NULL);
INSERT INTO `composers` VALUES (92, '格奥尔格·弗里德里希·亨德尔', 2, NULL, NULL, NULL, 610, 'Germany', '2024-10-23 22:15:12', '2024-10-23 22:15:12', NULL);
INSERT INTO `composers` VALUES (93, '让-玛丽·勒克莱尔', 2, NULL, NULL, NULL, 45, 'France', '2024-10-23 22:15:12', '2024-10-23 22:15:12', NULL);
INSERT INTO `composers` VALUES (94, '约翰·帕赫贝尔', 2, NULL, NULL, NULL, 20, 'Germany', '2024-10-23 22:15:12', '2024-10-23 22:15:12', NULL);
INSERT INTO `composers` VALUES (95, '亨利·珀塞爾', 2, NULL, NULL, NULL, 250, 'United Kingdom', '2024-10-23 22:15:12', '2024-10-23 22:15:12', NULL);
INSERT INTO `composers` VALUES (96, '让-菲利普·拉莫', 2, NULL, NULL, NULL, 100, 'France', '2024-10-23 22:15:12', '2024-10-23 22:15:12', NULL);
INSERT INTO `composers` VALUES (97, '亚历山德罗·斯卡拉蒂', 2, NULL, NULL, NULL, 555, 'Italy', '2024-10-23 22:15:12', '2024-10-23 22:15:12', NULL);
INSERT INTO `composers` VALUES (98, '多梅尼科·斯卡拉蒂', 2, NULL, NULL, NULL, 555, 'Italy', '2024-10-23 22:15:12', '2024-10-23 22:15:12', NULL);
INSERT INTO `composers` VALUES (99, '卡尔·弗里德里希·阿贝尔', 3, NULL, NULL, NULL, 225, 'Germany', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (100, '卡尔·菲利普·埃马努埃尔·巴赫', 3, NULL, NULL, NULL, 1000, 'Germany', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (101, '约翰·克里斯蒂安·巴赫', 3, NULL, NULL, NULL, 90, 'Germany', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (102, '约翰·克里斯托弗·弗里德里希·巴赫', 3, NULL, NULL, NULL, 20, 'Germany', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (103, '威廉·弗里德曼·巴赫', 3, NULL, NULL, NULL, 100, 'Germany', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (104, '路德维希·范·贝多芬', 3, NULL, NULL, NULL, 722, 'Germany', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (105, '路易吉·博凯里尼', 3, NULL, NULL, NULL, 30, 'Italy', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (106, '路易吉·凱魯比尼', 3, NULL, NULL, NULL, 200, 'Italy', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (107, '穆齐奥·克莱门蒂', 3, NULL, NULL, NULL, 110, 'Italy', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (113, '让-玛丽·勒克莱尔', 3, NULL, NULL, NULL, 45, 'France', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (114, '弗朗兹·克萨韦尔·沃尔夫冈·莫扎特', 3, NULL, NULL, NULL, 600, 'Austria', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (115, '沃尔夫冈·阿马德乌斯·莫扎特', 3, NULL, NULL, NULL, 626, 'Austria', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (116, '尼古洛·帕格尼尼', 3, NULL, NULL, NULL, 24, 'Italy', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (117, '费迪南德·里斯', 3, NULL, NULL, NULL, 138, 'Germany', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (118, '弗朗茨·舒伯特', 3, NULL, NULL, NULL, 988, 'Austria', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (119, '卡尔·马利亚·冯·韦伯', 3, NULL, NULL, NULL, 300, 'Germany', '2024-10-23 22:16:07', '2024-10-23 22:16:07', NULL);
INSERT INTO `composers` VALUES (120, '伊萨克·阿尔贝尼斯', 4, NULL, NULL, NULL, 250, 'Spain', '2024-10-23 22:17:17', '2024-10-23 22:17:17', NULL);
INSERT INTO `composers` VALUES (121, '米利·巴拉基列夫', 4, NULL, NULL, NULL, 75, 'Russia', '2024-10-23 22:17:17', '2024-10-23 22:17:17', NULL);
INSERT INTO `composers` VALUES (122, '艾米·比奇', 4, NULL, NULL, NULL, 300, 'United States of America', '2024-10-23 22:17:17', '2024-10-23 22:17:17', NULL);
INSERT INTO `composers` VALUES (123, '路德维希·范·贝多芬', 4, NULL, NULL, NULL, 722, 'Germany', '2024-10-23 22:17:17', '2024-10-23 22:17:17', NULL);
INSERT INTO `composers` VALUES (124, '埃克托·柏辽兹', 4, NULL, NULL, NULL, 50, 'France', '2024-10-23 22:17:17', '2024-10-23 22:17:17', NULL);
INSERT INTO `composers` VALUES (125, '乔治·比才', 4, NULL, NULL, NULL, 40, 'France', '2024-10-23 22:17:17', '2024-10-23 22:17:17', NULL);
INSERT INTO `composers` VALUES (126, '亞歷山大·鮑羅丁', 4, NULL, NULL, NULL, 15, 'Russia', '2024-10-23 22:17:17', '2024-10-23 22:17:17', NULL);
INSERT INTO `composers` VALUES (127, '约翰内斯·勃拉姆斯', 4, NULL, NULL, NULL, 122, 'Germany', '2024-10-23 22:17:17', '2024-10-23 22:17:17', NULL);
INSERT INTO `composers` VALUES (128, '安东·布鲁克纳', 4, NULL, NULL, NULL, 11, 'Austria', '2024-10-23 22:17:17', '2024-10-23 22:17:17', NULL);
INSERT INTO `composers` VALUES (129, '路易吉·凱魯比尼', 4, NULL, NULL, NULL, 200, 'Italy', '2024-10-23 22:17:17', '2024-10-23 22:17:17', NULL);
INSERT INTO `composers` VALUES (130, '阿隆·科普兰', 5, NULL, NULL, NULL, 100, 'United States of America', '2024-10-23 22:18:13', '2024-10-23 22:18:13', NULL);
INSERT INTO `composers` VALUES (131, '路易吉·达拉皮科拉', 5, NULL, NULL, NULL, 70, 'Italy', '2024-10-23 22:18:13', '2024-10-23 22:18:13', NULL);
INSERT INTO `composers` VALUES (132, '查理斯·艾伍士', 5, NULL, NULL, NULL, 140, 'United States of America', '2024-10-23 22:18:13', '2024-10-23 22:18:13', NULL);
INSERT INTO `composers` VALUES (133, '德米特里·卡巴列夫斯基', 5, NULL, NULL, NULL, 130, 'Russia', '2024-10-23 22:18:13', '2024-10-23 22:18:13', NULL);
INSERT INTO `composers` VALUES (134, '間宮芳生', 5, NULL, NULL, NULL, 80, 'Japan', '2024-10-23 22:18:13', '2024-10-23 22:18:13', NULL);
INSERT INTO `composers` VALUES (135, '奥利维埃·梅西安', 5, NULL, NULL, NULL, 50, 'France', '2024-10-23 22:18:13', '2024-10-23 22:18:13', NULL);
INSERT INTO `composers` VALUES (136, '达律斯·米约', 5, NULL, NULL, NULL, 443, 'France', '2024-10-23 22:18:13', '2024-10-23 22:18:13', NULL);
INSERT INTO `composers` VALUES (137, '谢尔盖·普罗科菲耶夫', 5, NULL, NULL, NULL, 130, 'Russia', '2024-10-23 22:18:13', '2024-10-23 22:18:13', NULL);
INSERT INTO `composers` VALUES (138, '卡尔·拉格尔斯', 5, NULL, NULL, NULL, 11, 'United States of America', '2024-10-23 22:18:13', '2024-10-23 22:18:13', NULL);
INSERT INTO `composers` VALUES (139, '亞歷山大·史克里亞賓', 5, NULL, NULL, NULL, 74, 'Russia', '2024-10-23 22:18:13', '2024-10-23 22:18:13', NULL);
INSERT INTO `composers` VALUES (140, '德米特里·肖斯塔科维奇', 5, NULL, NULL, NULL, 147, 'Russia', '2024-10-23 22:18:13', '2024-10-23 22:18:13', NULL);
INSERT INTO `composers` VALUES (141, '尼科斯·斯卡尔科塔斯', 5, NULL, NULL, NULL, 170, 'Greece', '2024-10-23 22:18:13', '2024-10-23 22:18:13', NULL);
INSERT INTO `composers` VALUES (142, '伊戈尔·斯特拉文斯基', 5, NULL, NULL, NULL, 128, 'Russia', '2024-10-23 22:18:13', '2024-10-23 22:18:13', NULL);
INSERT INTO `composers` VALUES (143, '埃德加·瓦雷兹', 5, NULL, NULL, NULL, 13, 'France', '2024-10-23 22:18:13', '2024-10-23 22:18:13', NULL);
INSERT INTO `composers` VALUES (144, '克劳德·维维尔', 5, NULL, NULL, NULL, 49, 'Canada', '2024-10-23 22:18:13', '2024-10-23 22:18:13', NULL);

-- ----------------------------
-- Table structure for favorites
-- ----------------------------
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `music_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `music_id`(`music_id`) USING BTREE,
  UNIQUE INDEX `unique_favorite`(`user_id`, `music_id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 8 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = FIXED;

-- ----------------------------
-- Records of favorites
-- ----------------------------
INSERT INTO `favorites` VALUES (1, 11, 12, '2025-01-01 10:22:16');
INSERT INTO `favorites` VALUES (2, 11, 13, '2025-01-01 10:37:21');
INSERT INTO `favorites` VALUES (3, 11, 24, '2025-01-01 10:40:29');
INSERT INTO `favorites` VALUES (4, 11, 27, '2025-01-01 10:41:58');
INSERT INTO `favorites` VALUES (5, 11, 28, '2025-01-01 11:01:50');
INSERT INTO `favorites` VALUES (6, 11, 30, '2025-01-01 11:01:57');
INSERT INTO `favorites` VALUES (7, 11, 43, '2025-01-01 11:02:03');

-- ----------------------------
-- Table structure for genres
-- ----------------------------
DROP TABLE IF EXISTS `genres`;
CREATE TABLE `genres`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `image_path` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 20 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of genres
-- ----------------------------
INSERT INTO `genres` VALUES (5, '现代主义', '现代主义作曲家（约1900-现今）：现代主义音乐打破传统规则，探索新的音响和形式，调性、节奏、和声等方面都出现了创新，代表作曲家有斯特拉文斯基和勋伯格。', NULL);
INSERT INTO `genres` VALUES (4, '浪漫主义', '浪漫主义作曲家（约1820-1900）：浪漫主义音乐注重个人情感和自由表达，音乐风格更加丰富多样，交响诗和艺术歌曲等新形式兴起，代表作曲家有肖邦和瓦格纳。', NULL);
INSERT INTO `genres` VALUES (3, '古典主义', '古典主义作曲家（约1750-1820）：古典主义音乐追求结构的严谨和形式的均衡，交响曲、奏鸣曲、室内乐等形式在这一时期成熟，代表作曲家有莫扎特和贝多芬。', NULL);
INSERT INTO `genres` VALUES (2, '巴洛克', '巴洛克作曲家（约1600-1750）：巴洛克时期音乐充满戏剧性和情感表现，复杂的对位法和装饰音技巧广泛应用，产生了歌剧、协奏曲等形式，代表作曲家有巴赫和亨德尔。', NULL);
INSERT INTO `genres` VALUES (1, '文艺复兴', '文艺复兴作曲家（约1400-1600）：这个时期音乐强调和谐与均衡，多声部音乐蓬勃发展，宗教音乐如弥撒曲和经文歌盛行，同时世俗音乐也开始流行。', NULL);

-- ----------------------------
-- Table structure for music
-- ----------------------------
DROP TABLE IF EXISTS `music`;
CREATE TABLE `music`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `composers_id` int NOT NULL,
  `genre_id` int NOT NULL,
  `information` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `photo_path` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `file_path` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `artist_id`(`composers_id`) USING BTREE,
  INDEX `fk_genre`(`genre_id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 57 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of music
-- ----------------------------
INSERT INTO `music` VALUES (12, 'A大调钢琴五重奏', 118, 3, '', '', 'http://localhost:3000/uploads/1729693449247-644562152.mp3', '2024-10-23 22:24:10');
INSERT INTO `music` VALUES (13, 'A大调钢琴奏鸣曲', 118, 3, '', '', 'http://localhost:3000/uploads/1729693479443-366517994.mp3', '2024-10-23 22:24:32');
INSERT INTO `music` VALUES (25, '小提琴奏鸣曲', 122, 4, '', '', 'http://localhost:3000/uploads/1729694133557-132721207.mp3', '2024-10-23 22:35:35');
INSERT INTO `music` VALUES (24, 'A小调第15号弦乐四重奏', 104, 3, '', '', 'http://localhost:3000/uploads/1729694033818-321904858.mp3', '2024-10-23 22:33:56');
INSERT INTO `music` VALUES (43, 'Billy the Kid', 130, 5, '', '', 'http://localhost:3000/uploads/1729727100514-641018459.mp3', '2024-10-24 07:41:08');
INSERT INTO `music` VALUES (27, '艾米·比奇', 122, 4, '', '', 'http://localhost:3000/uploads/1729694925529-345842354.mp3', '2024-10-23 22:48:46');
INSERT INTO `music` VALUES (28, '‌第45交响曲', 111, 2, '', '', 'http://localhost:3000/uploads/1729694953424-48096640.mp3', '2024-10-23 22:49:14');
INSERT INTO `music` VALUES (29, '最坚毅地面对', 71, 1, '', '', 'http://localhost:3000/uploads/1729694998268-604343510.mp3', '2024-10-23 22:49:59');
INSERT INTO `music` VALUES (30, '威尔士王子哀歌', 71, 1, '', '', 'http://localhost:3000/uploads/1729695810450-17013499.mp3', '2024-10-23 22:50:07');
INSERT INTO `music` VALUES (33, '帕凡与加亚尔德舞曲', 71, 1, '', '', 'http://localhost:3000/uploads/1729695815686-673276686.mp3', '2024-10-23 22:50:24');
INSERT INTO `music` VALUES (34, '洁白的百合', 71, 1, '', '', 'http://localhost:3000/uploads/1729695836393-326816676.mp3', '2024-10-23 22:50:42');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 12 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (4, '111', '$2a$10$EddiEZPA6pi1mweIR8POSumomx6x1u9teHPLthGG3GBRrfc0th.Fy', '2024-10-23 17:54:27');
INSERT INTO `users` VALUES (5, '1111', '$2a$10$691llsmZNEOm7e.encS/M.jE8bbf9ClQwTCbd45rM/bqUeoMV4eOu', '2024-10-24 13:09:24');
INSERT INTO `users` VALUES (6, '123', '$2a$10$PE/St55ygojvyyMJxYqBA.puQ9BEluLSIU1g/rKKE3NMMn2AxAfv2', '2024-10-24 13:31:56');
INSERT INTO `users` VALUES (7, '11111', '$2a$10$NgblCN2w7Eqj8cSch/3WWeoSx0qfO9u0b7jbKXTvRhlolNd2onJ9y', '2024-10-24 13:35:01');
INSERT INTO `users` VALUES (8, '1234', '$2a$10$98EiTXTCGxxHwIhsgw8OwunRhd25DhKCYGnlbc46GZcG98hWFh7Uq', '2024-10-24 13:41:41');
INSERT INTO `users` VALUES (9, '1234567', '$2a$10$yn8K2Nr0FDkoV8QsGZHzLuAXwEtYRk9oabnZs9Tl2T0mMylQFWMYG', '2024-10-24 13:45:19');
INSERT INTO `users` VALUES (10, '12345678', '$2a$10$waGDr8bFFQZaieivAVuBEuC8DRs10rspmmo/eFQBPekA3.7MfljJa', '2024-10-24 14:02:50');
INSERT INTO `users` VALUES (11, '11', '$2a$10$dQnelr4ZWXhz0GqznX1YeuNOGoY69pp4H3epUSVNVbKq6z2F0Sa9e', '2024-12-29 12:14:14');

SET FOREIGN_KEY_CHECKS = 1;
