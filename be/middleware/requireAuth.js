/**
 * requireAuth - Express middleware kiểm tra xác thực.
 * Trả về HTTP 401 nếu người dùng chưa đăng nhập (không có session).
 * Sử dụng middleware này cho tất cả các route cần bảo mật.
 */
function requireAuth(request, response, next) {
  if (!request.session || !request.session.userId) {
    return response.status(401).send({ message: "Unauthorized: Vui lòng đăng nhập." });
  }
  next();
}

module.exports = requireAuth;
