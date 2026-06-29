# VBot Web SDK CRM Demo

Ứng dụng mẫu CRM Dashboard (React + TypeScript + Vite) tích hợp **VBot Web SDK** để thực hiện cuộc gọi trực tiếp (Click-to-Call) từ danh sách khách hàng.

## 🚀 Khởi chạy nhanh

1. **Cài đặt thư viện**:
   ```bash
   pnpm install
   ```

2. **Chạy local**:
   ```bash
   pnpm dev
   ```
   Ứng dụng mặc định chạy tại: `http://localhost:8080`.

3. **Cấu hình & Kết nối**:
   - Nhấn vào nút **Cài đặt** (góc trên bên phải) để nhập **Partner API Key** và **Member No** từ hệ thống VBot.
   - Nhấn **Kết nối** để khởi tạo SDK.

## 🛠️ Tính năng demo

*   **Click-to-Call**: Nhấp vào số điện thoại bất kỳ trong bảng CRM để thực hiện cuộc gọi ngay lập tức.
*   **Chế độ tích hợp**:
    *   `Headless (Custom UI)`: Ẩn UI mặc định của SDK; ứng dụng tự quản lý trạng thái và tự dựng giao diện đàm thoại (Mute, Hold, DTMF, cuộc gọi đến/đi).
    *   `Built-in (Native UI)`: Sử dụng widget giao diện có sẵn của VBot SDK.
*   **Tránh Race Condition**: Tự động ngắt kết nối SDK cũ trước khi đổi chế độ hoặc cập nhật cấu hình (delay 1000ms) để tránh lỗi trùng đăng ký SIP.

## 📁 Cấu trúc source code chính

*   `src/App.tsx`: Khởi tạo SDK, lắng nghe các sự kiện cuộc gọi (`onCallIncoming`, `onCallAccepted`, v.v.) và quản lý trạng thái.
*   `src/components/`: Chứa các component giao diện (Bàn phím, Hộp thoại đàm thoại, Cấu hình).
