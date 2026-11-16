# Quản Lý Chi Tiêu Cá Nhân (Expense Tracker Backend API)

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Express Version](https://img.shields.io/badge/express-%5E4.19.2-blue.svg)](https://expressjs.com/)
[![MongoDB Mongoose](https://img.shields.io/badge/mongoose-%5E8.5.1-emerald.svg)](https://mongoosejs.com/)
[![Validation](https://img.shields.io/badge/validation-celebrate%20%26%20joi-orange.svg)](https://github.com/arb/celebrate)
[![Testing: Vitest](https://img.shields.io/badge/tested_with-vitest%203.2-729B1B.svg)](https://vitest.dev/)
[![Code Style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](./LICENSE)

API Backend cho ứng dụng **Quản lý chi tiêu cá nhân**, phục vụ các ứng dụng Web/Mobile và tích hợp trợ lý trích xuất hóa đơn thông minh. Hệ thống được thiết kế theo tiêu chuẩn công nghiệp (Production-ready / Clean Service Layer), đảm bảo tính module hóa, an toàn bảo mật và khả năng mở rộng cao.

---

## Mục Lục

- [1. Tổng Quan Dự Án](#1-tổng-quan-dự-án)
- [2. Kiến Trúc & Sơ Đồ Luồng Dữ Liệu](#2-kiến-trúc--sơ-đồ-luồng-dữ-liệu)
- [3. Tính Năng Cốt Lõi](#3-tính-năng-cốt-lõi)
- [4. Cấu Trúc Thư Mục](#4-cấu-trúc-thư-mục)
- [5. Hướng Dẫn Cài Đặt & Chạy Local](#5-hướng-dẫn-cài-đặt--chạy-local)
- [6. Tài Liệu API & Chuẩn Dữ Liệu](#6-tài-liệu-api--chuẩn-dữ-liệu)
- [7. Testing & Quy Chuẩn Phát Triển](#7-testing--quy-chuẩn-phát-triển)

---

## 1. Tổng Quan Dự Án

### 1.1 Bài toán giải quyết

Quản lý tài chính cá nhân thường gặp trở ngại do việc nhập liệu thủ công tốn thời gian, dễ bỏ sót và thiếu các công cụ phân tích trực quan. Dự án này cung cấp nền tảng API mạnh mẽ, giải quyết trọn vẹn vòng đời tài chính cá nhân:

- **Tối ưu hóa ghi chép thu/chi:** Hỗ trợ nhập liệu có cấu trúc, lưu trữ tiền tệ chính xác bằng số nguyên VND (tránh sai số số thực thập phân).
- **Hỗ trợ xử lý thông minh (AI / OCR Agent):** Chuẩn bị sẵn module tiếp nhận và trích xuất dữ liệu hóa đơn (tổng tiền, danh mục, thời gian, cửa hàng) tạo bản nháp (draft), người dùng duyệt trước khi ghi sổ chính thức.
- **Kiểm soát ngân sách chủ động:** Giám sát hạn mức theo từng danh mục, ngăn ngừa chi tiêu vượt ngưỡng.
- **Thống kê chuyên sâu:** Cung cấp báo cáo theo thời gian, tỷ trọng các nhóm chi tiêu giúp người dùng nắm bắt dòng tiền.

### 1.2 Công nghệ cốt lõi (Tech Stack)

| Thành phần          | Công nghệ lựa chọn                                                       | Mục đích sử dụng                                                             |
| :------------------ | :----------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| **Runtime**         | Node.js (>= 18 LTS)                                                      | Môi trường thực thi JavaScript phía server                                   |
| **Module System**   | ECMAScript Modules (ESM)                                                 | Tiêu chuẩn module hiện đại (`import` / `export`)                             |
| **Framework**       | Express.js 4 (`^4.19.2`)                                                 | Xây dựng RESTful API router và middleware pipeline                           |
| **Database**        | MongoDB & Mongoose (`^8.5.1`)                                            | CSDL NoSQL định hướng tài liệu, quản lý schema chặt chẽ                      |
| **Data Validation** | Celebrate & Joi                                                          | Middleware kiểm thực dữ liệu đầu vào (Header, Body, Query, Params)           |
| **Security & Auth** | JWT (`jsonwebtoken`), `bcryptjs`, `helmet`, `cors`, `express-rate-limit` | Xác thực stateless, mã hóa mật khẩu, bảo mật HTTP headers, chống brute-force |
| **Testing**         | Vitest (`^3.2.7`)                                                        | Unit test và integration test với hiệu năng cao                              |
| **Code Quality**    | ESLint (Flat Config), Prettier, Husky, Commitlint                        | Tự động hóa kiểm tra chuẩn code và định dạng commit message                  |

---

## 2. Kiến Trúc & Sơ Đồ Luồng Dữ Liệu

Dự án áp dụng mô hình **Layered Architecture (Kiến trúc phân tầng)** kết hợp **Service Layer Pattern**:

- **Router Layer:** Tiếp nhận HTTP request, ánh xạ URL và ủy thác qua các middleware bảo mật, kiểm thực.
- **Validation Layer:** Kiểm tra kiểu dữ liệu, các trường bắt buộc, ràng buộc giá trị trước khi dữ liệu chạm tới controller.
- **Controller Layer:** Tiếp nhận `req`, giải nén input, gọi tầng Service tương ứng và định dạng kết quả trả về qua `res` theo format chuẩn envelope. Controller không chứa business logic hay query database.
- **Service Layer:** Nơi tập trung toàn bộ Business Logic, tính toán số dư, kiểm tra hạn mức ngân sách, thực hiện giao tác (transaction) nếu cần. Service độc lập hoàn toàn với đối tượng `req` / `res`.
- **Model / Data Access Layer:** Mongoose Schema định nghĩa ràng buộc dữ liệu, index hiệu năng cao và giao tiếp trực tiếp với MongoDB.

### Sơ đồ luồng xử lý Request:

```text
[ Client (Web App / Mobile / Postman) ]
                  │
                  ▼  (HTTPS / REST)
       [ Reverse Proxy / CORS / Helmet ]
                  │
                  ▼
          [ Rate Limiter ] ──(Exceeded)──► [ 429 Too Many Requests ]
                  │
                  ▼
     [ Auth Middleware (JWT Bearer) ] ──(Invalid)──► [ 401 Unauthorized ]
                  │
                  ▼
   [ Validation Middleware (Celebrate / Joi) ] ──(Invalid)──► [ 400 Bad Request ]
                  │
                  ▼
           [ Controller ]
                  │
                  ▼
            [ Service ] ◄──► [ External Services / AI Agent (Optional) ]
                  │
                  ▼
         [ Mongoose Model ]
                  │
                  ▼
         [ MongoDB Database ]
```

---

## 3. Tính Năng Cốt Lõi

1. **Xác thực & Bảo mật (Authentication & Authorization):**
   - Đăng ký, đăng nhập cấp phát **JSON Web Token (JWT)**.
   - Cơ chế xác thực qua Header `Authorization: Bearer <token>`.
   - Mã hóa mật khẩu bảo mật bằng `bcryptjs`.
   - Phân quyền người dùng (`role: 'user'` / `role: 'admin'`).

2. **Quản lý Danh mục (Category Management):**
   - Phân loại danh mục: **Thu nhập (Income)** và **Chi tiêu (Expense)**.
   - Hỗ trợ bộ danh mục hệ thống mặc định (Ăn uống, Đi lại, Mua sắm, Lương, Thưởng...) và cho phép người dùng tự tạo danh mục cá nhân hóa.

3. **Quản lý Giao dịch Thu/Chi (Transaction Management):**
   - Thêm, sửa, xóa, tìm kiếm giao dịch với đầy đủ metadata: số tiền (VND), danh mục, thời gian, ghi chú.
   - Lọc giao dịch nâng cao theo khoảng ngày, danh mục, loại thu/chi kèm phân trang chuẩn (`page`, `limit`).

4. **Kế hoạch & Ngân sách (Budgeting):**
   - Thiết lập hạn mức chi tiêu theo tháng cho từng danh mục hoặc ngân sách tổng thể.
   - Tính toán tỷ lệ tiêu dùng hiện tại, phát hiện sớm nguy cơ vượt ngưỡng ngân sách.

5. **Thống kê & Báo cáo Tài chính (Stats & Analytics):**
   - Thống kê tổng thu, tổng chi và số dư dòng tiền thuần theo tháng/năm.
   - Báo cáo cơ cấu chi tiêu theo tỷ lệ phần trăm danh mục.

6. **Tiếp nhận & Trích xuất Hóa đơn (Capture / OCR Draft Workflow):**
   - Luồng tiếp nhận hình ảnh hóa đơn hoặc nội dung chi tiêu text nhanh.
   - Tạo bản ghi nháp trạng thái `pending`, chờ người dùng đối soát xác nhận trước khi biến đổi thành giao dịch thật.

7. **Tác vụ nền (Background Jobs):**
   - Lên lịch tự động dọn dẹp các bản ghi nháp hết hạn hoặc mã liên kết quá hạn (`expireCaptures`, `cleanupLinkCodes`).

---

## 4. Cấu Trúc Thư Mục

```
.
├── .github/                 # Cấu hình GitHub Actions CI pipeline, PR template
├── .husky/                  # Git hooks (pre-commit, commit-msg linting)
├── src/
│   ├── config/              # Quản lý biến môi trường, kết nối Database, CORS
│   │   ├── database.js      # Kết nối và xử lý sự kiện lifecycle MongoDB
│   │   └── env.js           # Kiểm thực biến môi trường với Joi lúc bootstrap
│   ├── controllers/         # Tầng tiếp nhận HTTP Request & trả lời HTTP Response
│   │   ├── auth.controller.js
│   │   ├── budget.controller.js
│   │   ├── category.controller.js
│   │   ├── stats.controller.js
│   │   └── transaction.controller.js
│   ├── jobs/                # Tác vụ định kỳ chạy ngầm (cron/interval tasks)
│   │   └── index.js
│   ├── middlewares/         # Middleware tái sử dụng (Auth, Validate, RateLimit, Error)
│   │   ├── authenticate.js  # Giải mã và xác minh JWT token
│   │   ├── authorize.js     # Kiểm tra quyền truy cập theo role
│   │   ├── error.js         # Xử lý lỗi tập trung (Error Handler 4 tham số)
│   │   ├── rateLimiter.js   # Giới hạn tần suất gọi API
│   │   ├── upload.js        # Cấu hình multer nhận file/ảnh an toàn
│   │   └── validate.js      # Middleware validate Celebrate
│   ├── models/              # Mongoose Schema & Model
│   │   ├── budget.model.js
│   │   ├── category.model.js
│   │   ├── transaction.model.js
│   │   └── user.model.js
│   ├── routes/              # Khai báo endpoint & gắn kết middleware
│   │   ├── index.js         # Router gốc gom toàn bộ route con dưới /api/v1
│   │   ├── auth.routes.js
│   │   ├── budget.routes.js
│   │   ├── category.routes.js
│   │   ├── stats.routes.js
│   │   └── transaction.routes.js
│   ├── services/            # Tầng Business Logic nghiệp vụ & tương tác Model
│   │   ├── auth.service.js
│   │   ├── budget.service.js
│   │   ├── category.service.js
│   │   ├── stats.service.js
│   │   └── transaction.service.js
│   ├── utils/               # Các hàm tiện ích, hằng số, Custom Error class
│   │   ├── ApiError.js      # Custom error hỗ trợ status code
│   │   ├── apiResponse.js   # Chuẩn hóa Envelope format trả về
│   │   ├── catchAsync.js    # Bọc controller bắt exception bất đồng bộ
│   │   ├── dates.js         # Tiện ích ngày tháng, đầu/cuối tháng
│   │   └── money.js         # Tiện ích định dạng số nguyên VND
│   ├── validations/         # Schema validate request (Joi)
│   │   ├── auth.validation.js
│   │   ├── common.validation.js
│   │   └── transaction.validation.js
│   └── app.js               # Khởi tạo Express app, đăng ký middleware toàn cục
├── tests/                   # Thư mục kiểm thử tự động (Unit & Integration tests)
├── .env.example             # File mẫu các biến môi trường
├── docker-compose.yml       # Cấu hình container chạy dự án
├── Dockerfile               # Multi-stage Dockerfile tối ưu image
├── package.json             # Danh sách dependencies & npm scripts
├── server.js                # Entry point kết nối DB và lắng nghe cổng HTTP
└── README.md                # Tài liệu tổng quan dự án
```

---

## 5. Hướng Dẫn Cài Đặt & Chạy Local

### 5.1 Yêu cầu hệ thống

- **Node.js:** Phiên bản `>= 18.0.0` (Khuyến nghị bản LTS v20 hoặc v22).
- **MongoDB:** MongoDB Server đang chạy cục bộ tại port `27017` hoặc URI kết nối tới MongoDB Atlas.
- **Package Manager:** `npm` (mặc định) hoặc `yarn`.

### 5.2 Các bước khởi chạy

1. **Clone repository:**

   ```bash
   git clone <URL_REPO_CUA_BAN>
   cd Project_BE-main
   ```

2. **Cài đặt các thư viện phụ thuộc:**

   ```bash
   npm install
   ```

3. **Thiết lập biến môi trường:**
   Tạo file `.env` từ file mẫu `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Cấu hình tối thiểu các giá trị trong `.env`:

   ```env
   NODE_ENV=development
   PORT=3000
   CLIENT_URL=http://localhost:5173
   MONGODB_URI=mongodb://127.0.0.1:27017/expense_tracker
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   ```

4. **Khởi động server ở chế độ phát triển (Auto-reload với nodemon):**

   ```bash
   npm run dev
   ```

5. **Kiểm tra trạng thái server:**
   Mở trình duyệt hoặc dùng `curl`:
   ```bash
   curl http://localhost:3000/api/v1/health
   ```
   Kết quả trả về HTTP 200:
   ```json
   {
     "success": true,
     "data": {
       "status": "ok",
       "uptime": 2.54,
       "db": 1
     }
   }
   ```

---

## 6. Tài Liệu API & Chuẩn Dữ Liệu

### 6.1 Chuẩn Response Envelope

Mọi endpoint đều trả về theo định dạng chuẩn duy nhất:

**Thành công (Success Response):**

```json
{
  "success": true,
  "message": "Thao tác thành công",
  "data": { ... }
}
```

**Thất bại (Error Response):**

```json
{
  "success": false,
  "message": "Thông tin lỗi mô tả rõ ràng",
  "errors": { ... }
}
```

### 6.2 Cơ chế xác thực (Authentication)

- API sử dụng cơ chế **Stateless JWT**.
- Sau khi đăng nhập qua endpoint `/api/v1/auth/login`, client lưu `accessToken`.
- Với các request tới tài nguyên được bảo vệ, client gửi kèm token trong header:
  ```http
  Authorization: Bearer <accessToken>
  ```

### 6.3 Danh mục các nhóm API chính (`/api/v1`)

| Prefix Route           | Quyền truy cập   | Chức năng chính                                                            |
| :--------------------- | :--------------- | :------------------------------------------------------------------------- |
| `GET /api/v1/health`   | Public           | Kiểm tra trạng thái hoạt động của server & kết nối Database                |
| `/api/v1/auth`         | Public / Private | Đăng ký (`/register`), đăng nhập (`/login`), lấy thông tin cá nhân (`/me`) |
| `/api/v1/categories`   | Authenticated    | Danh sách danh mục thu/chi, tạo danh mục tùy chỉnh cá nhân                 |
| `/api/v1/transactions` | Authenticated    | Thêm, xem danh sách, lọc ngày, cập nhật, xóa bản ghi giao dịch             |
| `/api/v1/budgets`      | Authenticated    | Quản lý ngân sách tháng, cảnh báo vượt ngưỡng tiêu dùng                    |
| `/api/v1/stats`        | Authenticated    | Báo cáo dòng tiền, tổng thu chi, phân tích tỷ trọng theo danh mục          |
| `/api/v1/captures`     | Authenticated    | Tiếp nhận và quản lý bản ghi trích xuất hóa đơn dạng nháp (Draft)          |

---

## 7. Testing & Quy Chuẩn Phát Triển

### 7.1 Lệnh thực thi kiểm thử & chất lượng mã nguồn

```bash
# Chạy bộ test tự động với Vitest
npm test

# Chạy test ở chế độ watch (tự chạy lại khi file thay đổi)
npm run test:watch

# Quét lỗi cú pháp và quy chuẩn mã nguồn với ESLint
npm run lint

# Tự động sửa các lỗi lint có thể sửa được
npm run lint:fix

# Kiểm tra định dạng code với Prettier
npm run format:check

# Tự động định dạng toàn bộ code theo chuẩn Prettier
npm run format
```

### 7.2 Quy chuẩn Git & Commit (Conventional Commits)

Dự án áp dụng hook kiểm soát tự động thông qua **Husky** và **Commitlint**. Mọi commit bắt buộc tuân theo quy ước:

```text
<type>(<scope-tùy-chọn>): <nội-dung-mệnh-lệnh>
```

- **Các Type hợp lệ:**
  - `feat`: Thêm tính năng mới (ví dụ: `feat(transaction): tích hợp bộ lọc theo khoảng ngày`).
  - `fix`: Sửa lỗi (ví dụ: `fix(auth): sửa lỗi giải mã token JWT hết hạn`).
  - `docs`: Cập nhật tài liệu kỹ thuật, README.
  - `refactor`: Tái cấu trúc code nhưng không làm thay đổi hành vi nghiệp vụ.
  - `test`: Thêm hoặc cập nhật kịch bản kiểm thử.
  - `chore`: Cập nhật cấu hình, dependencies, script bảo trì.
- **Quy tắc phân nhánh:** Tạo nhánh tính năng theo định dạng `<type>/<mô-tả-ngắn>` (ví dụ: `feat/budget-alert`, `fix/transaction-sort`). Không commit trực tiếp vào nhánh `main`.

---

## Giấy Phép (License)

Dự án được phân phối dưới giấy phép **MIT License**. Chi tiết xem tại [LICENSE](./LICENSE).
