# Movie Diary - Backend API Server

## 📌 프로젝트 개요

이 프로젝트는 사용자가 영화를 검색하고, 자신의 감상을 기록하는 영화 다이어리 애플리케이션의 백엔드 서버입니다. **NestJS** 프레임워크를 기반으로 구축되었으며, 사용자 인증, 게시글, 댓글 등 다양한 기능을 REST API로 제공합니다. 데이터베이스는 **MySQL**을 사용하며, ORM으로 **TypeORM**을 채택했습니다.

## ⚙️ 사전 요구사항 (Prerequisites)

- Node.js (v18 이상 권장)
- npm 또는 yarn
- MySQL Server

## 🚀 설정 및 실행 방법 (How to Run)

### 1. 패키지 설치
터미널에서 아래 명령어를 실행하여 필요한 의존성을 설치합니다.
```bash
npm install
```

### 2. 데이터베이스 초기화
데이터베이스 스키마와 계정을 초기화해야 합니다. 프로젝트에 포함된 `mysql-init.txt` 스크립트를 사용하여 MySQL에서 `movie_diary_db`를 생성하세요.
```sql
CREATE DATABASE movie_diary_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 환경 변수 설정
`.env.development.example` 또는 `.env.example` 파일을 복사하여 `.env.development` (개발용) 및 `.env.production` (운영용) 환경 변수 파일을 생성합니다.
```bash
cp .env.development.example .env.development
```

`.env.development` 파일 내용 예시:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=movie_diary_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1h
```

### 4. 마이그레이션 실행 (TypeORM)
DB 스키마 동기화를 위해 마이그레이션을 실행합니다 (`synchronize: false` 상태).
```bash
npm run typeorm:run-migrations
```

### 5. 프로젝트 실행
```bash
# 개발 모드 (watch)
npm run start:dev

# 운영 모드
npm run build
npm run start:prod
```

## 🧪 테스트 실행 (Testing)
모든 주요 비즈니스 로직(Auth, Posts, Movies, Comments, Likes)에 대한 단위 테스트가 작성되어 있습니다.
```bash
npm run test
```

## 📦 주요 기능 및 모듈

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