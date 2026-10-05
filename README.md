# AnhPNM-WEB99-MIDTERM

REST API cho bài midterm: đăng ký người dùng, đăng nhập sinh `apiKey`, tạo bài post và cập nhật bài post.

## Công nghệ

- Node.js
- Express
- MongoDB
- Mongoose
- bcryptjs

## Cài đặt

```bash
npm install
cp .env.example .env
npm run dev
```

Mặc định server chạy ở `http://localhost:3000`.

## Biến môi trường

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/anhpnm_web99_midterm
```

## Collection

### user

| Trường | Kiểu dữ liệu | Điều kiện |
| --- | --- | --- |
| `_id` | ObjectId | Duy nhất, bắt buộc |
| `userName` | string | Bắt buộc |
| `email` | string | Duy nhất, bắt buộc |
| `password` | string | Mã hóa, bắt buộc |
| `apiKey` | string | Được tạo mới mỗi lần đăng nhập |

### post

| Trường | Kiểu dữ liệu | Điều kiện |
| --- | --- | --- |
| `_id` | ObjectId | Duy nhất, bắt buộc |
| `userId` | string | Bắt buộc |
| `content` | string | Bắt buộc |
| `createdAt` | Date | Tự động khi tạo |
| `updatedAt` | Date | Tự động khi tạo/cập nhật |

## API

### 1. Đăng ký

`POST /users/register`

```json
{
  "userName": "Nguyen A",
  "email": "nguyena@gmail.com",
  "password": "123456"
}
```

Điều kiện:

- `userName`, `email`, `password` là bắt buộc.
- `email` là duy nhất.
- `password` được mã hóa trước khi lưu.

### 2. Đăng nhập

`POST /users/login`

```json
{
  "email": "nguyena@gmail.com",
  "password": "123456"
}
```

Khi đăng nhập thành công, API trả về `apiKey` theo dạng:

```text
mern-$userId$-$email$-$randomstring$
```

Mỗi lần đăng nhập, `apiKey` sẽ được tạo mới.

### 3. Tạo bài post

`POST /posts?apiKey=<apiKey>`

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "content": "Noi dung bai post"
}
```

Điều kiện:

- Cần có `apiKey` hợp lệ.
- `userId` và `content` là bắt buộc.
- `userId` phải trùng với người dùng đang được xác thực bằng `apiKey`.

### 4. Cập nhật bài post

`PUT /posts/:id?apiKey=<apiKey>`

```json
{
  "content": "Noi dung da cap nhat"
}
```

Điều kiện:

- Cần có `apiKey` hợp lệ.
- Bài post phải tồn tại.
- Người dùng chỉ được cập nhật bài post của chính mình.

## Kiểm tra nhanh

```bash
npm run check
```
