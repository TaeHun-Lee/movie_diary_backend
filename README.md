comments
+------------+----------+------+-----+-------------------+-----------------------------------------------+
| Field      | Type     | Null | Key | Default           | Extra                                         |
+------------+----------+------+-----+-------------------+-----------------------------------------------+
| id         | int      | NO   | PRI | NULL              | auto_increment                                |
| content    | text     | NO   |     | NULL              |                                               |
| created_at | datetime | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED                             |
| updated_at | datetime | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
| post_id    | int      | YES  | MUL | NULL              |                                               |
| user_id    | int      | YES  | MUL | NULL              |                                               |
+------------+----------+------+-----+-------------------+-----------------------------------------------+

diary_entries
+------------+--------------+------+-----+-------------------+-----------------------------------------------+
| Field      | Type         | Null | Key | Default           | Extra                                         |
+------------+--------------+------+-----+-------------------+-----------------------------------------------+
| id         | int          | NO   | PRI | NULL              |                                               |
| user_id    | int          | YES  | MUL | NULL              |                                               |
| movie_id   | int          | YES  | MUL | NULL              |                                               |
| post_id    | int          | YES  |     | NULL              |                                               |
| watched_at | date         | YES  |     | NULL              |                                               |
| rating     | decimal(2,1) | YES  |     | NULL              |                                               |
| review     | text         | YES  |     | NULL              |                                               |
| created_at | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED                             |
| updated_at | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
+------------+--------------+------+-----+-------------------+-----------------------------------------------+

genres
+------------+--------------+------+-----+-------------------+-------------------+
| Field      | Type         | Null | Key | Default           | Extra             |
+------------+--------------+------+-----+-------------------+-------------------+
| id         | bigint       | NO   | PRI | NULL              | auto_increment    |
| name       | varchar(100) | NO   | UNI | NULL              |                   |
| created_at | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+------------+--------------+------+-----+-------------------+-------------------+

movie_genres
+----------+--------+------+-----+---------+-------+
| Field    | Type   | Null | Key | Default | Extra |
+----------+--------+------+-----+---------+-------+
| movie_id | bigint | NO   | PRI | NULL    |       |
| genre_id | bigint | NO   | PRI | NULL    |       |
+----------+--------+------+-----+---------+-------+

movies
+--------------+--------------+------+-----+-------------------+-----------------------------------------------+
| Field        | Type         | Null | Key | Default           | Extra                                         |
+--------------+--------------+------+-----+-------------------+-----------------------------------------------+
| id           | int          | NO   | PRI | NULL              | auto_increment                                |
| title        | varchar(255) | NO   |     | NULL              |                                               |
| director     | varchar(255) | YES  |     | NULL              |                                               |
| release_year | int          | YES  |     | NULL              |                                               |
| poster_url   | varchar(500) | YES  |     | NULL              |                                               |
| created_at   | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED                             |
| updated_at   | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
+--------------+--------------+------+-----+-------------------+-----------------------------------------------+

posts
+------------+--------------+------+-----+-------------------+-----------------------------------------------+
| Field      | Type         | Null | Key | Default           | Extra                                         |
+------------+--------------+------+-----+-------------------+-----------------------------------------------+
| id         | int          | NO   | PRI | NULL              | auto_increment                                |
| title      | varchar(255) | NO   |     | NULL              |                                               |
| content    | text         | YES  |     | NULL              |                                               |
| place      | varchar(255) | YES  |     | NULL              |                                               |
| user_id    | int          | YES  | MUL | NULL              |                                               |
| created_at | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED                             |
| updated_at | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
+------------+--------------+------+-----+-------------------+-----------------------------------------------+

users
+---------------+----------------------+------+-----+-------------------+-----------------------------------------------+
| Field         | Type                 | Null | Key | Default           | Extra                                         |
+---------------+----------------------+------+-----+-------------------+-----------------------------------------------+
| id            | int                  | NO   | PRI | NULL              |                                               |
| email         | varchar(255)         | NO   | UNI | NULL              |                                               |
| password_hash | varchar(255)         | NO   |     | NULL              |                                               |
| nickname      | varchar(50)          | NO   |     | NULL              |                                               |
| role          | enum('USER','ADMIN') | YES  |     | USER              |                                               |
| created_at    | datetime             | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED                             |
| updated_at    | datetime             | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
+---------------+----------------------+------+-----+-------------------+-----------------------------------------------+