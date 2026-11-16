// Envelope thành công nhất quán: { success, message, data }.
export function sendSuccess(
  res,
  { statusCode = 200, message = "OK", data = null } = {},
) {
  return res.status(statusCode).json({ success: true, message, data });
}
