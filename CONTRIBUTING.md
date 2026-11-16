# Hướng dẫn Đóng góp

Repo này áp dụng một số quy ước Git nhỏ. Hai trong số đó được kiểm tra tự động
bởi Husky hooks; hãy tuân thủ từ đầu.

## 1. Quy tắc đặt tên nhánh

Không được commit thẳng vào `main` (hoặc `development`). Hãy tạo nhánh theo định dạng:

```
<type>/<mô-tả-ngắn-kebab>
```

- `<type>` là một trong các loại commit bên dưới (`feat`, `fix`, `docs`, …) cộng thêm `release` và `hotfix`.
- `<mô-tả-ngắn-kebab>` viết thường, các từ cách nhau bằng dấu `-`.

**Ví dụ**

```
feat/transaction-management
fix/auth-token-validation
docs/api-readme
chore/eslint-config
```

Pre-commit hook sẽ từ chối commit trên nhánh `main`/`development` hoặc nhánh không đúng định dạng.

### Quy trình thông thường

```bash
git checkout main && git pull
git checkout -b feat/tinh-nang-cua-ban
# ... làm việc, commit ...
git push -u origin feat/tinh-nang-cua-ban
# mở Pull Request vào main
```

## 2. Quy tắc commit message (Conventional Commits)

Mỗi commit message phải theo định dạng:

```
<type>(<scope-tuỳ-chọn>): <nội-dung>
```

Được kiểm tra bởi `commitlint` qua hook `commit-msg`.

**Các type được phép**

| Type       | Dùng khi                                          |
| ---------- | ------------------------------------------------- |
| `feat`     | thêm tính năng mới                                |
| `fix`      | sửa bug                                           |
| `docs`     | chỉ thay đổi tài liệu                             |
| `style`    | định dạng, không thay đổi code                    |
| `refactor` | thay đổi code không phải fix cũng không phải feat |
| `perf`     | cải thiện hiệu năng                               |
| `test`     | thêm / cập nhật test                              |
| `build`    | hệ thống build hoặc dependencies                  |
| `ci`       | cấu hình CI                                       |
| `chore`    | bảo trì khác                                      |
| `revert`   | hoàn tác commit trước                             |

**Ví dụ**

```
feat(transaction): thêm API tạo giao dịch chi tiêu
fix(auth): sửa lỗi xác thực JWT
docs: ghi lại endpoint health trong README
chore(deps): nâng mongoose lên 8.5
```

Lưu ý: nội dung viết ở thể mệnh lệnh, không dấu chấm cuối, giữ header dưới ~100 ký tự.

## 3. Pull Requests

- Giữ PR tập trung vào một tính năng / slice.
- Đảm bảo `npm run lint` và `npm run format:check` pass trước khi yêu cầu review.
- Điền đầy đủ PR template.

## Kiểm tra local

| Lệnh                   | Mục đích                          |
| ---------------------- | --------------------------------- |
| `npm run lint`         | ESLint (cũng chạy khi pre-commit) |
| `npm run format`       | Tự định dạng bằng Prettier        |
| `npm run format:check` | Kiểm tra định dạng                |
