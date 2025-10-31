# Movie Diary Project

## 프로젝트 개요

이 프로젝트는 사용자가 영화를 검색하고, 자신의 감상을 기록하는 영화 다이어리 애플리케이션의 백엔드 서버입니다. NestJS 프레임워크를 기반으로 구축되었으며, 사용자 인증, 게시글, 댓글 등 다양한 기능을 API로 제공합니다.

## 주요 기능 및 모듈

-   **사용자 인증 (Auth):** JWT를 사용한 회원가입, 로그인, 프로필 조회 기능을 제공합니다.
-   **사용자 (Users):** 사용자 정보 조회, 수정, 삭제 기능을 담당합니다.
-   **영화 (Movies):** 외부 API(가상)를 통해 영화 정보를 검색하는 기능을 제공합니다.
-   **게시글 (Posts):** 영화 다이어리(게시글)를 생성, 조회, 수정, 삭제합니다.
-   **댓글 (Comments):** 특정 게시글에 대한 댓글을 생성, 조회, 수정, 삭제합니다.
-   **좋아요 (PostLikes):** 게시글에 대한 좋아요 기능을 제공합니다.

## API 엔드포인트 명세

### 인증 (Auth) - `/auth`

-   `POST /register`: 회원가입
-   `POST /login`: 로그인 (JWT 토큰 발급)
-   `GET /me`: 현재 로그인된 사용자 정보 조회 (인증 필요)

### 사용자 (Users) - `/users`

-   `GET /:id`: 특정 ID의 사용자 정보 조회 (인증 필요)
-   `GET /user_id/:user_id`: 특정 `user_id`의 사용자 정보 조회
-   `PATCH /:id`: 사용자 정보 수정
-   `DELETE /:id`: 사용자 정보 삭제

### 영화 (Movies) - `/movies`

-   `GET /search?title={title}`: 영화 제목으로 검색 (인증 필요)

### 게시글 (Posts) - `/posts`

-   `POST /`: 새 게시글 작성 (인증 필요)
-   `GET /`: 모든 게시글 목록 조회 (인증 필요)
-   `GET /my`: 내 게시글 목록 조회 (인증 필요)
-   `GET /popular`: 인기 게시글 목록 조회 (좋아요 순 상위 50개)
-   `GET /movie/:movieId/popular`: 특정 영화의 인기 게시글 목록 조회 (좋아요 순 상위 10개)
-   `GET /:id`: 특정 ID의 게시글 상세 조회 (인증 필요)
-   `PATCH /:id`: 게시글 수정 (인증 및 작성자 확인 필요)
-   `DELETE /:id`: 게시글 삭제 (인증 및 작성자 확인 필요)

### 댓글 (Comments) - `/comments`

-   `POST /`: 새 댓글 작성 (인증 필요)
-   `GET /post/:postId`: 특정 게시글의 모든 댓글 조회 (인증 필요)
-   `PATCH /:commentId`: 댓글 수정 (인증 및 작성자 확인 필요)
-   `DELETE /:commentId`: 댓글 삭제 (인증 및 작성자 확인 필요)

---

## DB 구조

### users
| Field      | Type                 | Null | Key | Default              | Extra          |
|------------|----------------------|------|-----|----------------------|----------------|
| id         | int                  | NO   | PRI |                      | auto_increment |
| user_id    | varchar(255)         | NO   | UNI |                      |                |
| password   | varchar(255)         | NO   |     |                      |                |
| nickname   | varchar(50)          | NO   |     |                      |                |
| role       | enum('USER','ADMIN') | YES  |     | USER                 |                |
| created_at | datetime(6)          | NO   |     | CURRENT_TIMESTAMP(6) |                |
| updated_at | datetime(6)          | NO   |     | CURRENT_TIMESTAMP(6) | on update      |

### posts
| Field       | Type         | Null | Key | Default              | Extra          |
|-------------|--------------|------|-----|----------------------|----------------|
| id          | int          | NO   | PRI |                      | auto_increment |
| title       | varchar(255) | NO   |     |                      |                |
| content     | text         | YES  |     |                      |                |
| place       | varchar(255) | YES  |     |                      |                |
| watched_at  | date         | YES  |     |                      |                |
| rating      | decimal(2,1) | YES  |     |                      |                |
| likes_count | int          | NO   |     | 0                    |                |
| created_at  | datetime(6)  | NO   |     | CURRENT_TIMESTAMP(6) |                |
| updated_at  | datetime(6)  | NO   |     | CURRENT_TIMESTAMP(6) | on update      |
| user_id     | int          | NO   | MUL |                      |                |
| movie_id    | int          | NO   | MUL |                      |                |

### comments
| Field      | Type        | Null | Key | Default              | Extra          |
|------------|-------------|------|-----|----------------------|----------------|
| id         | int         | NO   | PRI |                      | auto_increment |
| content    | text        | NO   |     |                      |                |
| created_at | datetime(6) | NO   |     | CURRENT_TIMESTAMP(6) |                |
| updated_at | datetime(6) | NO   |     | CURRENT_TIMESTAMP(6) | on update      |
| post_id    | int         | YES  | MUL |                      |                |
| user_id    | int         | YES  | MUL |                      |                |

### movies
| Field        | Type         | Null | Key | Default              | Extra          |
|--------------|--------------|------|-----|----------------------|----------------|
| id           | int          | NO   | PRI |                      | auto_increment |
| docId        | varchar(255) | NO   | UNI |                      |                |
| title        | varchar(255) | NO   |     |                      |                |
| director     | varchar(255) | YES  |     |                      |                |
| release_date | datetime     | YES  |     |                      |                |
| poster       | varchar(255) | YES  |     |                      |                |
| stills       | json         | YES  |     |                      |                |
| plot         | text         | YES  |     |                      |                |
| created_at   | datetime(6)  | NO   |     | CURRENT_TIMESTAMP(6) |                |
| updated_at   | datetime(6)  | NO   |     | CURRENT_TIMESTAMP(6) | on update      |

### genres
| Field | Type   | Null | Key | Default | Extra          |
|-------|--------|------|-----|---------|----------------|
| id    | int    | NO   | PRI |         | auto_increment |
| name  | varchar| NO   | UNI |         |                |

### movie_genres
| Field    | Type | Null | Key | Default | Extra |
|----------|------|------|-----|---------|-------|
| movie_id | int  | NO   | PRI |         |       |
| genre_id | int  | NO   | PRI |         |       |

### post_likes
| Field      | Type        | Null | Key | Default              | Extra          |
|------------|-------------|------|-----|----------------------|----------------|
| id         | int         | NO   | PRI |                      | auto_increment |
| created_at | datetime(6) | NO   |     | CURRENT_TIMESTAMP(6) |                |
| user_id    | int         | YES  | MUL |                      |                |
| post_id    | int         | YES  | MUL |                      |                |

### post_photos
| Field      | Type         | Null | Key | Default | Extra          |
|------------|--------------|------|-----|---------|----------------|
| id         | int          | NO   | PRI |         | auto_increment |
| photo_url  | varchar(2048)| NO   |     |         |                |
| post_id    | int          | YES  | MUL |         |                |
| created_at | datetime     | NO   |     |         |                |
| updated_at | datetime     | NO   |     |         | on update      |
