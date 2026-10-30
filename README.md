# My Goals - Ứng Dụng Theo Dõi Mục Tiêu Cá Nhân

Ứng dụng web giúp người dùng xây dựng, quản lý mục tiêu cá nhân và theo dõi mức độ hoàn thành theo từng ngày với giao diện lịch độc lập cho từng mục tiêu.

---

## 1. Giới Thiệu Dự Án

**My Goals** được thiết kế theo triết lý tập trung vào sự kiên trì hàng ngày. Mỗi mục tiêu sở hữu một không gian theo dõi và dữ liệu hoàn thành riêng biệt, không gộp chung vào một bảng, giúp người dùng theo dõi tiến độ một cách rõ ràng và trực quan.

### Điểm nổi bật:
- **Độc lập dữ liệu tuyệt đối**: Mỗi mục tiêu có lịch theo dõi và dữ liệu tick riêng biệt theo Goal ID.
- **Quy tắc ngày tháng chặt chẽ**: Không cho phép tick ngày trong tương lai hoặc ngoài khoảng thời gian thực hiện.
- **Thống kê thực tế 100%**: Tất cả các chỉ số (tỷ lệ, chuỗi ngày liên tiếp - streak, số ngày bỏ lỡ) được tính toán trực tiếp từ dữ liệu người dùng tick, không sử dụng dữ liệu giả lập.
- **Phong cách tối giản (Minimalist)**: Màu chủ đạo Teal (`#0F766E`), nền `#F9FAFB`, phông chữ Be Vietnam Pro, trải nghiệm mượt mà trên cả Mobile và Desktop.

---

## 2. Công Nghệ Sử Dụng

- **Frontend Core**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v7)
- **Icons**: Lucide React
- **Storage**: LocalStorage (Lưu trữ cục bộ trên trình duyệt, không cần backend)

---

## 3. Tổng Quan Kiến Trúc & Cấu Trúc Mã Nguồn

Dự án được cấu trúc theo dạng module rõ ràng, tách biệt giữa logic lưu trữ, thuật toán tính toán ngày tháng và các thành phần giao diện:

```
d:/Work-Future/
├── index.html                           # Cấu hình Google Fonts (Be Vietnam Pro), Meta, Title
├── src/
│   ├── types/
│   │   └── goal.ts                      # Định nghĩa kiểu dữ liệu (Goal, GoalStats, GoalFormData, DayStatus)
│   ├── services/
│   │   └── storage.ts                   # Module quản lý LocalStorage riêng biệt theo Goal ID
│   ├── utils/
│   │   ├── dateUtils.ts                 # Tiện ích chuẩn hóa ngày (YYYY-MM-DD), sinh lưới lịch tháng, tiếng Việt
│   │   └── statsCalculator.ts           # Thuật toán tính toán số liệu thống kê thực tế (Streak, Rate, Elapsed)
│   ├── hooks/
│   │   ├── useGoals.ts                  # Hook quản lý danh sách mục tiêu
│   │   └── useGoalTracking.ts           # Hook quản lý tương tác và trạng thái của từng mục tiêu
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx               # Header điều hướng, logo và nút hành động nhanh
│   │   │   ├── Badge.tsx                # Huy hiệu trạng thái (Đang thực hiện, Sắp diễn ra, Đã kết thúc)
│   │   │   └── ConfirmModal.tsx         # Modal xác nhận xóa an toàn
│   │   ├── goal/
│   │   │   ├── GoalCard.tsx             # Thẻ mục tiêu tại trang chủ (hiển thị tiến độ, menu sửa/xóa)
│   │   │   └── GoalForm.tsx             # Biểu mẫu tạo mới / chỉnh sửa mục tiêu có kiểm tra hợp lệ
│   │   └── tracking/
│   │       ├── MonthYearPicker.tsx      # Bộ chọn tháng, năm, điều hướng lùi/tiến và nút về tháng này
│   │       ├── CalendarGrid.tsx         # Lưới lịch tháng (ô ngày, trạng thái tick Teal, icon check, khóa an toàn)
│   │       └── StatsOverview.tsx        # 4 thẻ thống kê + Thanh tiến độ tổng quan
│   ├── pages/
│   │   ├── GoalListPage.tsx             # Trang danh sách mục tiêu (Trang chủ)
│   │   ├── GoalDetailPage.tsx           # Trang theo dõi riêng của từng mục tiêu
│   │   └── GoalFormPage.tsx             # Trang tạo mới / chỉnh sửa mục tiêu
│   ├── App.tsx                          # Cấu hình định tuyến (React Router)
│   ├── main.tsx                         # Điểm khởi chạy ứng dụng
│   └── index.css                        # Cấu hình Tailwind CSS và phông chữ
```

---

## 4. Chi Tiết Các Chức Năng

### 4.1. Trang danh sách mục tiêu (`/`)
- Hiển thị danh sách toàn bộ các mục tiêu đã tạo dưới dạng thẻ card hiện đại.
- Mỗi thẻ hiển thị:
  - Tên mục tiêu, mô tả ngắn gọn.
  - Màu nhận diện mục tiêu.
  - Trạng thái: *Đang thực hiện*, *Sắp diễn ra*, hoặc *Đã kết thúc*.
  - Khoảng thời gian thực hiện (Ngày bắt đầu $\rightarrow$ Ngày kết thúc).
  - Tiến độ hoàn thành thực tế (% và số ngày đã tick) kèm thanh tiến độ (Progress bar).
  - Chuỗi ngày hoàn thành liên tiếp (Streak).
  - Nút chỉnh sửa và nút xóa mục tiêu (có modal xác nhận).
- Thanh công cụ hỗ trợ tìm kiếm mục tiêu theo từ khóa và lọc theo điều kiện (Tất cả / Có hạn chót).
- Khi nhấn vào một mục tiêu bất kỳ, chuyển ngay đến trang theo dõi riêng của mục tiêu đó.

### 4.2. Tạo và chỉnh sửa mục tiêu (`/goals/new`, `/goals/:id/edit`)
- Biểu mẫu trực quan bao gồm:
  - **Tên mục tiêu** *(bắt buộc)*: Nhập tiêu đề rõ ràng cho mục tiêu.
  - **Mô tả mục tiêu**: Chi tiết kế hoạch, lý do thực hiện.
  - **Ngày bắt đầu** *(bắt buộc)*: Mặc định là ngày hiện tại.
  - **Ngày kết thúc** *(tùy chọn)*: Hỗ trợ tick chọn "Đặt thời hạn" hoặc để trống nếu là thói quen duy trì liên tục. Có cơ chế kiểm tra tự động (`Ngày kết thúc >= Ngày bắt đầu`).
  - **Màu sắc nhận diện**: Lựa chọn màu sắc đại diện (Teal, Blue, Green, Indigo, Amber, Rose).
- Tự động lưu và cập nhật danh sách ngay sau khi lưu.

### 4.3. Trang theo dõi mục tiêu riêng (`/goals/:id`)
Đây là tính năng cốt lõi của ứng dụng:
- **Lưu trữ dữ liệu độc lập**: Dữ liệu ngày hoàn thành được lưu theo khóa riêng `my_goals_records_<ID>`. Đánh dấu ngày ở mục tiêu này hoàn toàn không ảnh hưởng tới các mục tiêu khác.
- **Bộ chọn tháng và năm**:
  - Cho phép chuyển đổi tháng qua lại nhanh chóng (`<` và `>`).
  - Dropdown chọn trực tiếp tháng (Tháng 1 - Tháng 12) và năm.
  - Nút "Về tháng này" giúp quay về tháng hiện tại ngay lập tức.
- **Lưới lịch tháng**:
  - Thiết kế 7 cột tương ứng với các ngày trong tuần từ Thứ 2 đến Chủ Nhật.
  - Mỗi ngày là một ô riêng biệt hiển thị số ngày, viền nổi bật cho ngày hôm nay.
  - **Thao tác đơn giản**: Nhấn vào ô để đánh dấu hoàn thành (ô chuyển sang màu Teal `#0F766E` và hiển thị dấu check trắng). Nhấn lần nữa để bỏ đánh dấu.
  - **Kiểm soát tính hợp lệ**:
    - **Không cho phép** đánh dấu các ngày trong tương lai (sau ngày hiện tại).
    - **Không cho phép** đánh dấu các ngày nằm ngoài khoảng thời gian mục tiêu (trước ngày bắt đầu hoặc sau ngày kết thúc).
    - Các ô không hợp lệ sẽ bị khóa mờ (`opacity`, `cursor-not-allowed`) và có tooltip thông báo lý do rõ ràng.
- **Thông báo phản hồi (Toast notification)**: Hiển thị thông báo nhỏ gọn mỗi khi đánh dấu hoặc bỏ đánh dấu ngày thành công.

### 4.4. Thống kê mục tiêu (Dữ liệu thực tế 100%)
Tính toán tự động và chính xác dựa trên danh sách ngày đã tick:
1. **Tổng số ngày đã hoàn thành**: Đếm số ngày thực tế đã tick hợp lệ.
2. **Tổng số ngày chưa hoàn thành**: Số ngày bị bỏ lỡ trong khoảng thời gian đã trôi qua kể từ ngày bắt đầu mục tiêu (`Tổng số ngày đã qua - Số ngày đã hoàn thành`).
3. **Tỷ lệ hoàn thành (%)**: Hiệu suất đạt được trong khoảng thời gian đã qua.
4. **Số ngày hoàn thành liên tiếp (Streak)**: Tính toán số ngày liên tiếp hoàn thành tính đến hôm nay hoặc hôm qua, kèm theo chỉ số kỷ lục chuỗi dài nhất trong lịch sử.
5. **Tổng quan tiến độ**: Thanh tiến độ trực quan hiển thị % chặng đường của toàn bộ mục tiêu (nếu có ngày kết thúc).

### 4.5. Cơ chế lưu trữ LocalStorage
- **Danh sách mục tiêu**: Lưu tại khóa `my_goals_list`.
- **Lịch sử hoàn thành của từng mục tiêu**: Lưu tại khóa `my_goals_records_<goalId>`.
- **Toàn vẹn dữ liệu**: Khi xóa một mục tiêu, hệ thống tự động xóa sạch cả thông tin mục tiêu lẫn khóa dữ liệu theo dõi liên quan.
- Khi truy cập lần đầu, ứng dụng tự động khởi tạo dữ liệu mẫu thực tế để người dùng dễ dàng trải nghiệm.

---

## 5. Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu cầu môi trường:
- Node.js (khuyến nghị phiên bản 18+ hoặc 20+)
- Trình quản lý gói `npm`

### Các bước thực hiện:

1. **Cài đặt các gói phụ thuộc (Dependencies)**:
   ```bash
   npm install
   ```

2. **Khởi chạy môi trường phát triển (Development)**:
   ```bash
   npm run dev
   ```
   Sau đó mở trình duyệt theo đường dẫn hiển thị trên terminal (mặc định là `http://localhost:5173/`).

3. **Kiểm tra và đóng gói sản phẩm (Production Build)**:
   ```bash
   npm run build
   ```
