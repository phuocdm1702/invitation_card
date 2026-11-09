# Cập nhật 07/11/2026
Đã thay nội dung theo 3 ảnh và chỉ dẫn người dùng: giờ mời 09:00; lớp 12A8 niên khóa 2024–2027; lời thư nguyên văn; 8 mốc giờ/hoạt động, không thêm trang phục/nội dung/note từ bảng. Tranh chân dung tốt nghiệp được tạo mới từ ảnh tham chiếu, không dùng ảnh thật trong bản bàn giao. Ngày cụ thể vẫn chưa xác nhận.
Đã build lại thành công và kiểm tra bằng mắt thư/portrait desktop. Các kiểm thử bản đầu phía dưới chỉ là lịch sử; xem kết quả kiểm tra lại ở phần bổ sung cuối.

# Kế hoạch và kết quả kiểm thử
Ngày kiểm thử: 06/11/2026 (Việt Nam). Môi trường: cloud Chrome sandbox trên Linux, viewport cửa sổ quan sát 1363×936; kích thước nhỏ/lớn mô phỏng bằng iframe cùng origin, không phải máy thật. Trình điều khiển không cung cấp phiên bản Chrome trong thông tin phiên; chưa ghi được số phiên bản. URL QA nội bộ: http://127.0.0.1:4173/qa.html.

## Kế hoạch đã thực hiện
1. Đọc hướng dẫn và trích nội dung HTML gốc; ghi nhận mâu thuẫn lớp/ngày giờ. Không đưa thông tin chưa chốt thành lịch chính thức.
2. Xây dựng vé cobalt–kem–san hô, thư, khung ảnh có nhãn, lịch dự kiến, Maps tìm địa chỉ và RSVP demo.
3. Dùng Vite, GSAP 3.13 timeline, matchMedia, SVG gấp giấy, trạng thái closed/opening/open và fallback.
4. Quan sát ảnh chụp trực tiếp desktop, mobile 390px, tablet 768px; chạy ma trận DOM, thử tương tác và axe-core.
5. Sửa lỗi, chạy lại, build và xuất HTML một file + mã nguồn.

## Ma trận bố cục
Tất cả các viewport sau đạt kiểm tra không tràn ngang tài liệu ở trạng thái đóng/mở; các vùng ticket-body, ticket-stub, letter-copy, section, rsvp không có scrollWidth vượt clientWidth quá 2px.
320×568, 360×640, 390×844, 430×932, 639×900, 640×900, 641×900, 768×1024, 1023×900, 1024×900, 1025×900, 1280×720, 1440×900, 1920×1080, 2560×1440, 844×390, 1024×768.
Đây là đo bố cục, không có nghĩa đã kiểm tra bằng mắt mọi phần của mọi kích thước. Quan sát bằng mắt trực tiếp: vé desktop, thư desktop, vé/thư mobile 390px và vé tablet 768px.

## Tương tác đã quan sát/chạy
- Mở vé: thư xuất hiện, lớp phủ được dọn, focus chuyển tới tiêu đề thư.
- Bấm nhanh hai lần: đạt; không để lại lớp phủ ở mốc kiểm tra 2406ms sau bấm. Đây là thời điểm kiểm tra, không phải số đo thời lượng animation chính xác.
- Escape khi mở: đạt.
- Skip khi mở: đạt.
- Resize iframe khi mở: đạt sau thời gian ổn định 800ms. Lần đầu kiểm tra quá sớm 200ms chưa đạt; không coi đây là phép đo hiệu năng đổi hướng thiết bị.
- RSVP demo: nhập tên, mở dialog có thông báo chưa gửi/lưu; đóng dialog trả focus về CTA.
- Xem lại vé: có dọn timeline, timer và overlay.
- HTML standalone: mở qua server sandbox và mở vé thành công. Chưa thử file:// trên máy người dùng.
- axe-core 4.10.3 WCAG2A/AA + WCAG21AA trên nội dung iframe trạng thái mở: 0 violations sau sửa. Chưa phải chứng nhận toàn bộ WCAG; chưa kiểm tra screen reader thật.
- Build Vite thành công; node --check main.js/config.js đạt; HTML standalone không còn import/module assets ngoài. Fonts vẫn là tài nguyên mạng, có fallback.

## Lỗi phát hiện và kế hoạch sửa đã hoàn tất
1. Ngôi sao xuất thành emoji xanh: thay bằng hình vector CSS màu san hô; quan sát lại mobile/tablet.
2. Khoảng trống trên mobile lớn: trừ chiều cao header khỏi min-height; quan sát lại.
3. Xem lại trong lúc đang mở để sót overlay: hủy timer/timeline và xóa scene khi replay. Chạy lại bấm lặp/Escape/skip/resize đạt.
4. Chuyển cảnh có thể chờ quá lâu trong iframe: timeout hoàn tất 2300ms, timeline mục tiêu vẫn 2200ms. Chưa benchmark thiết bị yếu.
5. Số 18 placeholder tương phản thấp (axe 1.17:1): tăng màu đậm #65739d, chạy lại axe không còn vi phạm.
6. CSS được import qua JS và nội dung fallback thiếu địa chỉ/lịch: đưa link CSS vào HTML và thêm nội dung tĩnh. Đã rà nguồn; chưa mô phỏng tắt JS thực tế.

## Chưa kiểm tra / việc còn cần trước phát hành
- Firefox, WebKit, Edge riêng, Safari macOS/iOS, Chrome Android máy thật, Messenger webview.
- Zoom trình duyệt 200%, screen reader, font bị chặn, mạng chậm, tab nền, reduced motion, GSAP bị chặn: có nhánh xử lý trong code nhưng chưa chạy đủ mô phỏng.
- RSVP backend thật, lỗi HTTP/retry/idempotency chưa thử do chưa có endpoint; demo không lưu dữ liệu.
- Ghim Maps chính xác, iframe bản đồ, ảnh thật và ảnh lỗi chưa thử do chưa có dữ liệu.
- LCP/CLS/INP, CPU yếu, video/trace chuyển cảnh, kiểm tra từng khung hình nếp gấp: chưa đo; không tuyên bố đạt các ngưỡng hiệu năng.
- Hiệu ứng dùng SVG gấp hình cùng màu giấy và tên người mời; chưa phải mô phỏng vật lý giấy. Chưa có ảnh thật để kiểm tra sự liên tục họa tiết/ảnh trên nếp gấp.
- LadiPage preview/published chưa thử. Website responsive chưa là PWA cài đặt.

## Điều kiện chốt
Chủ trang cung cấp lớp/niên khóa, ngày giờ, lịch chụp, ảnh thật, ghim Maps và nơi nhận RSVP. Sau đó đồng bộ cấu hình/fallback, thử backend và máy thật, kiểm tra trên hosting cuối cùng rồi mới phát hành thư mời chính thức. Không công bố bản nháp như lịch mời đã xác nhận.

## Kết quả kiểm tra lại 07/11/2026
- Rà lại 17 viewport của bản đầu: lần đầu vùng thư tràn ở 320px. Đã sửa min-width của grid item, minmax(0,1fr), giảm tiêu đề ở màn dưới 359px. Chạy lại: toàn bộ 17 viewport không tràn ngang tài liệu hoặc các section được kiểm tra.
- axe-core trên thư mở trả về 0 violations trong bộ quy tắc hiện có.
- Quan sát trực tiếp thư và tranh desktop, thư mobile 390px, timeline mobile; nội dung khớp ảnh tham chiếu.
- HTML standalone đã nhúng tranh dạng data URL, không phụ thuộc đường dẫn ảnh riêng; đã mở qua server sandbox và xác minh thư/ảnh/lịch trình.
- npm run build và node --check đạt. Các giới hạn về máy thật, backend và ngày tổ chức vẫn giữ nguyên.

## Bản bổ sung ngày hẹn và lời chúc
Chốt 22/11/2026 09:00 +07:00. Thêm họ tên, lời chúc, trạng thái tham dự, 12 lựa chọn hoa số và không tặng hoa. Build và kiểm tra cú pháp JS đạt. Chưa kiểm tra trình duyệt lại cho phần cửa hàng mới; các kết quả viewport phía trên thuộc phiên bản trước. Chưa kết nối Google Sheet, chưa thử gửi thật; UI chặn báo thành công khi chưa cấu hình endpoint.
