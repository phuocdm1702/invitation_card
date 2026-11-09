# Chuyến bay cuối của tuổi 18
Bản nháp tương tác theo PROMPTMASTER. Chưa phát hành thư mời chính thức vì ngày tổ chức, ghim Maps và nơi nhận RSVP chưa được xác nhận. Giờ mời 09:00, lớp 12A8, niên khóa 2024–2027, lời thư và 8 mốc lịch trình đã cập nhật theo người dùng ngày 07/11/2026.

## Mở nhanh
Giải nén và mở `Thu_Moi_Thanh_Thao.html` bằng Chrome/Edge/Safari. CSS, JS và GSAP đã nhúng trong một file. Google Fonts cần mạng; nếu mất mạng sẽ dùng Arial/Georgia. Không cần cài Node để xem file này.

## Phát triển
Node 22+; chạy `npm ci`, `npm run dev`. Chạy `npm run build` để tạo `dist/`, đưa toàn bộ dist lên máy chủ tĩnh. `python scripts/standalone.py` tạo lại HTML một file sau khi sửa nguồn. `qa.html` là trang kiểm thử, chỉ có ở dev, không đưa vào bản build.

## Dữ liệu
Sửa `src/config.js`. `startsAt` phải ISO 8601 có +07:00. Cập nhật className, schoolYears, schedule, ảnh thật, mapsUrl (ghim chính xác), mapsEmbedUrl và rsvpEndpoint. Dùng tranh chân dung tốt nghiệp được tạo từ ảnh tham chiếu, không đưa ảnh chụp thật vào web. Tranh WebP nằm ở public/assets; HTML standalone nhúng sẵn tranh. Không tự suy đoán ngày 22/11/2026 trong prototype.
`confirmed` ghi trạng thái biên tập; không phải cổng xác thực triển khai. Trước khi phát hành chính thức phải kiểm tra danh sách dữ liệu thủ công, đổi nhãn BẢN XEM THỬ và metadata noindex theo quyết định của chủ trang.
Nội dung tĩnh fallback ở index.html cần đồng bộ khi chốt sự kiện để người tắt JS vẫn đọc được. Cấu hình JS là nguồn cho toàn bộ nội dung động.

## RSVP thật
POST JSON `{name,event,requestId}`; header `Idempotency-Key`. Backend phải kiểm tra dữ liệu, CORS đúng origin và chống trùng theo khóa. Chỉ `{ "success": true }` với HTTP 2xx được xem là thành công. Có timeout 12 giây, giữ dữ liệu khi lỗi. Không đặt secret trong frontend. Bản hiện tại không gửi/lưu dữ liệu.

## Tích hợp LadiPage
Phương án ổn định nhất: triển khai dist trên URL riêng, dùng nút từ LadiPage trỏ đến URL đó. Nếu cần nhúng trực tiếp: đặt nội dung bên trong #invitation vào Mã HTML, CSS và JS đã build vào phần Mã CSS/JavaScript. Tất cả selector giao diện có scope #invitation; bỏ rule body{margin:0} khi nhúng. Giữ đúng một root, một entry script và kiểm tra không mount hai lần. Fullscreen fixed cần thử trong khung thực tế; nếu bị clipping/transform của builder thì dùng URL riêng, không cố khóa cuộn của builder. Nối form thật với endpoint đã xác thực hoặc thay bằng form LadiPage. Không dùng HTML standalone nhúng toàn bộ head/body vào section.
Chưa kiểm thử trực tiếp trên LadiPage preview/published vì chưa có URL hoặc tài khoản trang đích.

## Giới hạn nghiệm thu
Xem KIEM_THU.md. Không có bảo đảm tuyệt đối cho mọi màn hình, trình duyệt hay webview. Đây là website responsive, chưa phải PWA cài đặt/offline có service worker.

## Tranh chân dung
Tạo bằng công cụ tạo ảnh tích hợp: phác họa chì màu + màu nước trên giấy kem, giữ nét mặt/mái tóc/góc mặt từ ảnh tham chiếu; áo và mũ tốt nghiệp xanh navy, tua san hô, cầm bằng cuộn; nền xanh nhạt, không chữ. File dùng trong web: public/assets/thao-graduation.webp.
