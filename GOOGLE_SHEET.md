# Kết nối Google Sheet — bước còn lại
Đã tạo và xác minh tab “Lời chúc thanh xuân” trong bảng người dùng cung cấp. Tab gốc được giữ nguyên. Chưa có lời chúc thử/người thật nào được ghi.

## Triển khai bằng tài khoản sở hữu Sheet
1. Mở Sheet → Tiện ích mở rộng (Extensions) → Apps Script.
2. Dán toàn bộ `backend/Code.gs` vào Code.gs rồi lưu.
3. Deploy → New deployment → Web app.
4. Execute as: Me; Who has access: Anyone. Lựa chọn này cho khách gửi lời chúc mà không cần đăng nhập Google; mã chỉ ghi vào tab đã chỉ định và không trả dữ liệu Sheet cho khách. Sheet không cần chia sẻ công khai.
5. Hoàn tất cấp quyền của Google cho tài khoản sở hữu và triển khai. Nếu Google chặn hoặc báo ứng dụng chưa xác minh, kiểm tra chính sách tài khoản; không bỏ qua cảnh báo bảo mật một cách mù quáng.
6. Gửi URL Web app kết thúc bằng `/exec` cho trợ lý để nối web và kiểm tra thực tế. Không gửi mật khẩu/token.

Frontend gửi POST text/plain chứa JSON, không dùng no-cors và không báo thành công trước khi đọc được JSON success:true. Nếu chính sách trình duyệt hoặc tài khoản gây CORS, cần proxy cùng origin; không chuyển sang no-cors để giả lập thành công.
Mã có kiểm tra đầu vào, khóa ghi đồng thời, chống lặp requestId và bảo vệ công thức trong ô. Đây là endpoint gửi lời chúc công khai, chưa có CAPTCHA chống spam. Chưa triển khai/chưa nghiệm thu end-to-end. Chỉ kiểm tra cú pháp cục bộ.
Nguồn hướng dẫn: https://developers.google.com/apps-script/guides/web
