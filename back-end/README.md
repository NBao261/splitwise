# Splitwise Backend

Hệ thống quản lý tài chính cho nhóm - Backend API

## Yêu cầu

- Node.js (v18 trở lên)
- MongoDB (đang chạy trên localhost:27017 hoặc MongoDB Atlas)
- npm hoặc yarn

## Cài đặt

1. **Cài đặt dependencies:**
```bash
npm install
```

2. **Tạo file .env:**
```bash
# File .env đã được tạo từ env.example
# Bạn có thể chỉnh sửa các giá trị nếu cần
```

3. **Cấu hình MongoDB:**
   - Nếu dùng MongoDB local: Đảm bảo MongoDB đang chạy trên `localhost:27017`
   - Nếu dùng MongoDB Atlas: Cập nhật `MONGO_URI` trong file `.env`

## Chạy ứng dụng

### Development mode (với hot reload):
```bash
npm run dev
```

Server sẽ chạy trên: `http://localhost:3000`

### Production mode:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Đăng ký user mới
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "username": "username"
  }
  ```

- **POST** `/api/auth/login` - Đăng nhập
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Health Check

- **GET** `/health` - Kiểm tra server đang chạy

## Cấu trúc thư mục

```
src/
├── config/          # Cấu hình (env, database)
├── constants/       # Constants (messages, status codes)
├── controllers/     # Controllers xử lý HTTP requests
├── lib/             # Database connection
├── middlewares/     # Middlewares (auth, validation)
├── models/          # Models và Zod schemas
├── routes/          # Route definitions
├── services/        # Business logic
├── utils/           # Utility functions
└── index.ts         # Entry point
```

## Biến môi trường

Xem file `env.example` để biết các biến môi trường cần thiết:

- `PORT` - Port server (mặc định: 3000)
- `NODE_ENV` - Môi trường (development/production)
- `MONGO_URI` - MongoDB connection string
- `DB_NAME` - Tên database
- `JWT_SECRET` - Secret key cho JWT
- `JWT_EXPIRES_IN` - Thời gian hết hạn của JWT token
- `BCRYPT_SALT_ROUNDS` - Số vòng salt cho bcrypt

## Lưu ý

- Đảm bảo MongoDB đang chạy trước khi start server
- Trong production, nhớ thay đổi `JWT_SECRET` thành giá trị bảo mật
- File `.env` không nên commit lên git (đã có trong .gitignore)

## Git Setup

### Lần đầu tiên clone project:

1. **Clone repository:**
```bash
git clone <repository-url>
cd splitwise/back-end
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Tạo file .env:**
```bash
cp env.example .env
# Sau đó chỉnh sửa các giá trị trong .env
```

### Trước khi commit:

1. **Kiểm tra file sẽ commit:**
```bash
git status
```

2. **Đảm bảo không commit:**
   - `node_modules/`
   - `.env`
   - `dist/`
   - Các file log

3. **Commit và push:**
```bash
git add .
git commit -m "feat: your commit message"
git push
```

## File Structure

```
back-end/
├── .gitignore          # Git ignore rules
├── .gitattributes      # Git attributes (line endings)
├── .editorconfig      # Editor configuration
├── .env               # Environment variables (NOT in git)
├── env.example        # Environment variables template
├── package.json       # Dependencies
├── tsconfig.json      # TypeScript config
├── README.md          # Documentation
└── src/
    ├── config/        # Configuration files
    ├── constants/     # Constants (messages, status codes)
    ├── controllers/   # Controllers
    ├── docs/          # Swagger documentation
    ├── lib/           # Database connection
    ├── middlewares/   # Middlewares
    ├── models/        # Models & Schemas
    ├── routes/        # Routes
    ├── services/      # Business logic
    ├── utils/         # Utility functions
    └── index.ts       # Entry point
```

