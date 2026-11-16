// Chuyển promise bị reject từ async handler tới middleware xử lý lỗi.
export default function catchAsync(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
