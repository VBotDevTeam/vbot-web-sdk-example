---
outline: deep
---

# VBot Web SDK

VBot Web SDK cung cấp Web Component `<vbot-widget>` giúp khách hàng tích hợp chức năng tổng đài VBot vào website của mình chỉ với vài dòng code.

## 1. Tích hợp

Thêm script bundle từ CDN:

::: code-group

```html [ESM - Cố định phiên bản (Khuyến nghị cho Production)]
<!-- Phiên bản cố định giúp ổn định tuyệt đối và tối ưu tốc độ (CDN cache 1 năm) -->
<script
  type="module"
  src="https://cdn.vbot.vn/vbot-sdk/1.0.11/vbot-sdk.es.js"
></script>

<vbot-widget token="YOUR_ACCESS_TOKEN"></vbot-widget>
```

```html [UMD - Cố định phiên bản]
<script
  src="https://cdn.vbot.vn/vbot-sdk/1.0.11/vbot-sdk.umd.js"
  defer
></script>

<vbot-widget token="YOUR_ACCESS_TOKEN"></vbot-widget>
```

```html [ESM - Bản mới nhất]
<!-- Tự động nhận các bản cập nhật mới nhất từ CDN -->
<script
  type="module"
  src="https://cdn.vbot.vn/vbot-sdk/vbot-sdk.es.js"
></script>

<vbot-widget token="YOUR_ACCESS_TOKEN"></vbot-widget>
```

```html [UMD - Bản mới nhất]
<script src="https://cdn.vbot.vn/vbot-sdk/vbot-sdk.umd.js" defer></script>

<vbot-widget token="YOUR_ACCESS_TOKEN"></vbot-widget>
```

:::

> **Lưu ý:**
>
> - Khi triển khai môi trường **Production**, nên chỉ định số phiên bản cố định (ví dụ `/1.0.11/`) để đảm bảo hệ thống luôn hoạt động ổn định.
> - UMD build sẽ tự động đăng ký Custom Element `vbot-widget` ngay khi tải xong.
> - Hãy thay `YOUR_ACCESS_TOKEN` bằng Access Token tài khoản của bạn để SDK tự kết nối và lấy thông tin SIP cấu hình tự động. Token này được sinh ra từ Backend của bạn bằng cách gọi API của VBot, chi tiết xem tại [Tạo tài khoản & lấy Token SDK](/open-api/v3/member-sdk#tao-tai-khoan-lay-token-sdk-one-step-provisioning).

---

## 2. Cấu hình Widget (VBotWidgetConfig)

Lập trình viên có thể cấu hình widget thông qua thuộc tính `config` (dưới dạng JSON string) hoặc gọi phương thức `updateWidgetConfig(...)` tại runtime.

Ví dụ:

```html
<vbot-widget
  token="YOUR_ACCESS_TOKEN"
  config='{"autoShowDialpad": false, "themeMode": "auto"}'
></vbot-widget>
```

### Các thuộc tính cấu hình hỗ trợ:

| Thuộc tính             | Kiểu dữ liệu                  | Mặc định    | Mô tả                                                                                                        |
| :--------------------- | :---------------------------- | :---------- | :----------------------------------------------------------------------------------------------------------- |
| `autoShowDialpad`      | `boolean`                     | `false`     | Tự động mở bàn phím số (dialpad) khi widget khởi tạo thành công.                                             |
| `headless`             | `boolean`                     | `false`     | Bật chế độ không giao diện (Headless). Chỉ giữ kết nối và xử lý sự kiện âm thanh ngầm.                       |
| `ringtoneUrl`          | `string`                      | _Sẵn có_    | URL nhạc chuông khi có cuộc gọi đến. Mặc định dùng nhạc chuông của VBot.                                     |
| `holdMusicUrl`         | `string`                      | _Sẵn có_    | URL nhạc chờ khi thực hiện cuộc gọi đi.                                                                      |
| `ringtoneVolume`       | `number`                      | `0.8`       | Âm lượng nhạc chuông (từ `0` đến `1`).                                                                       |
| `holdMusicVolume`      | `number`                      | `0.8`       | Âm lượng nhạc chờ (từ `0` đến `1`).                                                                          |
| `themeMode`            | `'auto' \| 'light' \| 'dark'` | `'auto'`    | Chế độ hiển thị giao diện sáng/tối. `'auto'` sẽ tự động đồng bộ theo class `.dark` của thẻ `<html>`.         |
| `themeOverrides`       | `Record<string, string>`      | `null`      | Ghi đè các token màu sắc hoặc thiết kế của hệ thống.                                                         |
| `disconnectSoundUrl`   | `string`                      | _Sẵn có_    | URL âm thanh phát ra khi cuộc gọi kết thúc/gác máy (mặc định sử dụng âm thanh `disconnected.webm` của VBot). |
| `overlayPositions`     | `object`                      | _Xem dưới_  | Cấu hình vị trí hiển thị của các khung popup UI (`dialpad`, `incoming`, `calling`).                          |
| `overlayMargins`       | `object`                      | _Xem dưới_  | Cấu hình khoảng cách (margin) theo pixel cho từng khung UI.                                                  |
| `enableFloatingBubble` | `boolean`                     | `true`      | Cho phép hiển thị bong bóng cuộc gọi thu nhỏ kéo thả khi ẩn màn hình gọi chính (hỗ trợ cả chế độ headless).  |
| `externalCallId`       | `string`                      | `undefined` | ID cuộc gọi từ hệ thống CRM bên ngoài để gán sẵn định danh cho cuộc gọi đi tiếp theo (khi gọi từ bàn phím).  |
| `debug`                | `boolean`                     | `false`     | Bật/tắt chế độ debug và in log chi tiết của SDK ra Console trình duyệt.                                      |
| `enableLog`            | `boolean`                     | `false`     | Tùy chọn tương đương với `debug`.                                                                            |
| `zIndex`               | `number \| string`            | `2147483000`| Tùy chỉnh z-index hiển thị của widget để đảm bảo không bị các modal/header của website đè lên.               |

---

### Khai báo trực tiếp qua Attribute

Ngoài việc cấu hình trong đối tượng `config` JSON, bạn cũng có thể khai báo ghi đè trực tiếp dưới dạng các HTML Attribute trên thẻ `<vbot-widget>`:

```html
<vbot-widget
  token="YOUR_ACCESS_TOKEN"
  debug
  z-index="100000"
  external-call-id="CRM_CALL_12345"
  disconnect-sound-url="https://your-domain.com/assets/my-disconnect-sound.webm"
></vbot-widget>
```

### Tùy chỉnh Z-Index & Tầng hiển thị (Stacking Layer)

Từ phiên bản `1.0.11`, SDK nâng base `z-index` mặc định lên **`2147483000`** (giới hạn an toàn cao nhất của int32 trên trình duyệt) và hỗ trợ tùy biến linh hoạt z-index. Giá trị này giúp giao diện tổng đài (bàn phím số, màn hình cuộc gọi, thông báo cuộc gọi đến) luôn nổi lên trên các modal, drawer hoặc sticky header của hệ thống khách hàng. Toast thông báo và bong bóng nổi (Floating bubble) sẽ tự động cộng thêm offset `+10` để luôn nằm trên cùng.

Có 3 cách để tùy biến `z-index`:

1. **Qua thuộc tính HTML (Attribute):**
   ```html
   <vbot-widget token="YOUR_ACCESS_TOKEN" z-index="100000"></vbot-widget>
   ```

2. **Qua đối tượng cấu hình (`config`):**
   ```html
   <vbot-widget
     token="YOUR_ACCESS_TOKEN"
     config='{"zIndex": 100000}'
   ></vbot-widget>
   ```

3. **Qua CSS Custom Property:**
   ```css
   vbot-widget {
     --vbot-z-index: 100000;
   }
   ```

### Chế độ Gỡ lỗi (Debug Logging)

Từ phiên bản `1.0.10`, SDK hỗ trợ chế độ log debug chuyên dụng giúp lập trình viên và quản trị viên dễ dàng theo dõi luồng cuộc gọi và bắt sự kiện.

Khi bật debug:

- Toàn bộ sự kiện phát ra (`Event Emitted`), thông tin cuộc gọi đến/đi, phiên làm việc sẽ được in ra console với tiền tố chuẩn `[VBot-SDK]`.

Có 3 cách để kích hoạt chế độ Debug:

1. **Qua đối tượng cấu hình:**

   ```html
   <vbot-widget
     token="YOUR_ACCESS_TOKEN"
     config='{"debug": true}'
   ></vbot-widget>
   ```

2. **Qua thuộc tính HTML (Attribute):**

   ```html
   <vbot-widget token="YOUR_ACCESS_TOKEN" debug></vbot-widget>
   <!-- hoặc enable-log -->
   <vbot-widget token="YOUR_ACCESS_TOKEN" enable-log></vbot-widget>
   ```

3. **Bật trực tiếp tại Console DevTools (Không cần sửa code):**
   Rất thuận tiện khi cần kiểm tra sự cố trên môi trường thực tế của khách hàng:

   ```javascript
   // Cách A: Bật tạm thời trong phiên duyệt web hiện tại
   window.__VBOT_DEBUG__ = true;

   // Cách B: Lưu vào localStorage để duy trì debug cả khi tải lại (F5) trang
   localStorage.setItem("vbot_debug", "true");

   // Tắt debug trong localStorage khi kiểm tra xong
   localStorage.removeItem("vbot_debug");
   ```

### Cấu hình Vị trí & Margin hiển thị

Các giá trị vị trí (`overlayPositions`) được hỗ trợ:

- `center`, `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`.

Ví dụ cấu hình vị trí và khoảng cách tùy biến (thường dùng để đặt bàn phím bên trên hoặc bên dưới các nút có sẵn trên web):

```json
{
  "overlayPositions": {
    "dialpad": "bottom-right",
    "calling": "bottom-right",
    "incoming": "bottom-right"
  },
  "overlayMargins": {
    "dialpad": { "bottom": 88, "right": 24 },
    "calling": { "bottom": 88, "right": 24 },
    "incoming": { "bottom": 88, "right": 24 }
  }
}
```

---

## 3. Các Phương thức Public (Runtime API)

Bạn có thể gọi trực tiếp các phương thức này từ DOM element của `<vbot-widget>`.

```javascript
const widget = document.querySelector("vbot-widget");
```

| Tên phương thức                              | Tham số                    | Kiểu trả về          | Mô tả                                                                                                                                                                                                                                                  |
| :------------------------------------------- | :------------------------- | :------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `updateWidgetConfig(config)`                 | `VBotWidgetConfig`         | `void`               | Cập nhật cấu hình của widget tại thời điểm runtime.                                                                                                                                                                                                    |
| `makeCall(phone, hotline?, externalCallId?)` | `string, string?, string?` | `Promise<void>`      | Thực hiện cuộc gọi đi tới số `phone`. `hotline` và `externalCallId` là các tùy chọn. Khi truyền `externalCallId` (ID định danh cuộc gọi từ hệ thống bên ngoài), giá trị này sẽ được dùng để đối chiếu và định danh cuộc gọi trên hệ thống CRM của bạn. |
| `answerCall()`                               | -                          | `Promise<void>`      | Chấp nhận và kết nối cuộc gọi đến.                                                                                                                                                                                                                     |
| `hangupCall()`                               | -                          | `Promise<void>`      | Kết thúc cuộc gọi hiện tại hoặc từ chối cuộc gọi đến.                                                                                                                                                                                                  |
| `sendDTMF(tone)`                             | `string`                   | `void`               | Gửi tín hiệu DTMF (bấm phím số khi đang đàm thoại).                                                                                                                                                                                                    |
| `getHotlines()`                              | -                          | `Promise<Hotline[]>` | Trả về danh sách hotline được cấu hình cho tài khoản.                                                                                                                                                                                                  |
| `showCallUI()`                               | -                          | `void`               | Mở giao diện bàn phím số/cuộc gọi (chỉ hoạt động ở chế độ builtin UI).                                                                                                                                                                                 |
| `dismissCallUI()`                            | -                          | `void`               | Ẩn toàn bộ giao diện overlay của widget.                                                                                                                                                                                                               |
| `setAudioInputDevice(deviceId)`              | `string`                   | `Promise<boolean>`   | Thay đổi thiết bị đầu vào microphone bằng Device ID.                                                                                                                                                                                                   |
| `setAudioOutputDevice(deviceId)`             | `string`                   | `Promise<boolean>`   | Thay đổi thiết bị đầu ra (loa/tai nghe) bằng Device ID.                                                                                                                                                                                                |
| `toggleMuteMicrophone()`                     | -                          | `void`               | Bật/tắt chế độ câm (Mute/Unmute) cho microphone của cuộc gọi hiện tại.                                                                                                                                                                                 |
| `isMicrophoneMuted()`                        | -                          | `boolean`            | Kiểm tra microphone của cuộc gọi hiện tại có đang bị tắt tiếng hay không.                                                                                                                                                                              |
| `setDialHotline(hotline)`                    | `string \| null`           | `void`               | Thay đổi hotline đang được chọn trên bàn phím quay số.                                                                                                                                                                                                 |
| `getCallState()`                             | -                          | `string`             | Lấy trạng thái cuộc gọi hiện tại (`idle`, `dialing`, `ringing`, `in-call`, `ended`).                                                                                                                                                                   |
| `getCallData()`                              | -                          | `CallData \| null`   | Lấy toàn bộ thông tin chi tiết của cuộc gọi hiện tại (số điện thoại, hướng gọi, ID cuộc gọi, ID cuộc gọi bên ngoài...).                                                                                                                                |

<div class="note">
<strong>Lưu ý về giá trị <code>externalCallId</code>:</strong><br/>
Để đảm bảo định danh chính xác và đồng bộ trên hệ thống VBot, giá trị <code>externalCallId</code> được truyền vào cần thỏa mãn các điều kiện sau:
<ul>
  <li>Độ dài tối đa: <strong>32 ký tự</strong>.</li>
  <li>Chỉ sử dụng các ký tự chữ thường (<code>a</code>–<code>z</code>) và chữ số (<code>0</code>–<code>9</code>).</li>
  <li><strong>Không</strong> chứa các ký tự đặc biệt, chữ in hoa hoặc khoảng trắng.</li>
</ul>
</div>

---

## 4. Lắng nghe Sự kiện (Custom Events)

Thẻ `<vbot-widget>` phát ra các sự kiện Custom Event giúp tích hợp chặt chẽ với hệ thống CRM của bạn.

```javascript
widget.addEventListener("vbot:onCallIncoming", (event) => {
  console.log("Thông tin cuộc gọi đến:", event.detail);
});
```

### Danh sách các sự kiện:

| Tên sự kiện                   | Dữ liệu kèm theo (`event.detail`) | Mô tả sự kiện                                                                        |
| :---------------------------- | :-------------------------------- | :----------------------------------------------------------------------------------- |
| `vbot:onDial`                 | `{ phoneNumber: string }`         | Kích hoạt khi người dùng bấm nút Gọi trên bàn phím số mặc định của SDK (có thể hủy). |
| `vbot:onConnecting`           | -                                 | Bắt đầu khởi tạo kết nối tới tổng đài.                                               |
| `vbot:onConnected`            | -                                 | Kết nối cơ sở dữ liệu thành công.                                                    |
| `vbot:onDisconnected`         | -                                 | Ngắt kết nối khỏi máy chủ tổng đài.                                                  |
| `vbot:onUserConnected`        | -                                 | Tài khoản đã đăng ký online thành công.                                              |
| `vbot:onUserDisconnected`     | -                                 | Tài khoản đã ngắt đăng ký (offline).                                                 |
| `vbot:onUserConnectionFailed` | `{ error: string }`               | Đăng ký tài khoản thất bại.                                                          |
| `vbot:onCallIncoming`         | `{ callData: CallData }`          | Có cuộc gọi đến từ khách hàng.                                                       |
| `vbot:onCallProgress`         | `{ callData: CallData }`          | Đang đổ chuông cuộc gọi đi.                                                          |
| `vbot:onCallAccepted`         | `{ callData: CallData }`          | Cuộc gọi đã được kết nối (nghe máy).                                                 |
| `vbot:onCallEnded`            | `{ callData: CallData }`          | Cuộc gọi kết thúc thành công.                                                        |
| `vbot:onCallFailed`           | `{ error: string }`               | Cuộc gọi thất bại (bận, sai số, lỗi thiết bị...).                                    |
| `vbot:onCallStateChange`      | `{ state: CallState }`            | Trạng thái cuộc gọi thay đổi (`idle`, `dialing`, `ringing`, `in-call`, `ended`).     |
| `vbot:onCallDuration`         | `{ duration: number }`            | Cập nhật thời gian gọi theo giây.                                                    |
| `vbot:onHotlinesUpdated`      | `{ hotlines: Hotline[] }`         | Danh sách hotline khả dụng đã được tải xong.                                         |
| `vbot:onError`                | `{ message: string }`             | Có lỗi hệ thống phát sinh từ SDK.                                                    |
| `vbot:onWarning`              | `{ message: string }`             | Cảnh báo hệ thống phát sinh từ SDK.                                                  |
| `vbot:onInfo`                 | `{ message: string }`             | Thông báo trạng thái hoặc thông tin nghiệp vụ (ví dụ: thông báo cuộc gọi nhỡ).       |

### Cách can thiệp (Intercept) cuộc gọi thủ công từ Bàn phím số

Sự kiện `vbot:onDial` là sự kiện **có thể hủy bỏ (cancelable)**. Khi người dùng bấm nút Gọi trên bàn phím số mặc định của SDK, bạn có thể lắng nghe sự kiện này, gọi `event.preventDefault()` để chặn hành vi gọi ngay lập tức, từ đó tiến hành gọi API của CRM để tạo lịch sử cuộc gọi trước và lấy `externalCallId` rồi mới kích hoạt cuộc gọi thực sự:

```javascript
widget.addEventListener("vbot:onDial", async (event) => {
  // 1. Ngăn chặn SDK thực hiện cuộc gọi ngay lập tức
  event.preventDefault();

  const phoneNumber = event.detail.phoneNumber;

  try {
    // 2. Gọi API của CRM để tạo lịch sử cuộc gọi trước và lấy ExternalCallId
    const res = await VbotService.createCallHistory({
      phoneNumber,
      ContextType: currentContextType,
      EntityId: currentEntityId,
    });

    // 3. Thực hiện cuộc gọi thực tế qua SDK kèm theo ExternalCallId vừa lấy được
    widget.makeCall(phoneNumber, undefined, res.ExternalCallId);
  } catch (error) {
    console.error("Lỗi khi khởi tạo lịch sử cuộc gọi:", error);
  }
});
```

### Cấu trúc đối tượng `CallData`:

| Trường           | Kiểu dữ liệu               | Mô tả                                                                                           |
| :--------------- | :------------------------- | :---------------------------------------------------------------------------------------------- |
| `id`             | `string`                   | ID định danh duy nhất của cuộc gọi trong phiên chạy SDK.                                        |
| `phoneNumber`    | `string`                   | Số điện thoại đối tác (số khách hàng gọi đến hoặc số đang gọi đi).                              |
| `displayName`    | `string \| undefined`      | Tên hiển thị của đối tác (nếu có).                                                              |
| `direction`      | `'incoming' \| 'outgoing'` | Hướng cuộc gọi (`incoming` là cuộc gọi đến, `outgoing` là cuộc gọi đi).                         |
| `startTime`      | `Date`                     | Thời điểm bắt đầu phiên kết nối cuộc gọi.                                                       |
| `endTime`        | `Date \| undefined`        | Thời điểm cuộc gọi kết thúc.                                                                    |
| `externalCallId` | `string \| undefined`      | ID cuộc gọi từ hệ thống CRM bên ngoài truyền vào khi gọi đi, hoặc trong thông tin cuộc gọi đến. |

### Xử lý thông báo Cuộc gọi nhỡ (Missed Call)

Từ phiên bản `1.0.9`, SDK được chuẩn hóa cơ chế nhận diện cuộc gọi nhỡ thông minh:

- **Điều kiện tính là cuộc gọi nhỡ**: Cuộc gọi đến (`direction: 'incoming'`), chưa được nghe máy (ở trạng thái `ringing` hoặc `dialing`), và kết thúc do:
  1. Người gọi tắt máy trước khi nhân viên tiếp nhận (`remote Canceled`).
  2. Cuộc gọi đổ chuông hết thời gian chờ mà không có ai nghe (`local No Answer` hoặc `system Expires`).
     _(Lưu ý: Nếu người dùng SDK chủ động bấm nút **Từ chối** thì không tính là cuộc gọi nhỡ)._
- **Luồng sự kiện từ SDK**:
  - SDK **không** phát sự kiện `vbot:onCallFailed` (để tránh CRM hiểu nhầm là lỗi kết nối mạng hay lỗi SIP).
  - SDK phát sự kiện `vbot:onInfo` với nội dung: `"Cuộc gọi nhỡ từ thuê bao {số điện thoại}"` (hoặc `"Cuộc gọi nhỡ"` nếu số điện thoại không xác định).
  - Ngay sau đó phát sự kiện `vbot:onCallEnded` khi trạng thái quay về `idle`.
  - Ở chế độ giao diện Built-in UI, SDK tự động hiển thị popup Toast thông báo cuộc gọi nhỡ và tự ẩn sau 3 giây. Ở chế độ Headless Mode, SDK không tự render Toast UI, ứng dụng cần lắng nghe sự kiện `vbot:onInfo` để hiển thị qua hệ thống Toast riêng của website.

---

## 5. Chế độ không giao diện (Headless Mode)

Nếu muốn tự thiết kế toàn bộ giao diện cuộc gọi riêng phù hợp với thương hiệu, bạn chỉ cần bật cấu hình `headless` trên widget.

Khi bật `headless`:

- Thẻ `<vbot-widget>` hoàn toàn ẩn đi và không render bất kỳ popover, màn hình cuộc gọi, bàn phím số hay popup Toast mặc định nào.
- SDK chỉ xử lý kết nối SIP, luồng cuộc gọi và tự động phát nhạc chuông/âm thanh đàm thoại ngầm.
- Bạn hoàn toàn điều khiển cuộc gọi thông qua các phương thức public (ví dụ: `makeCall`, `answerCall`, `hangupCall`) và cập nhật trạng thái UI từ các sự kiện của SDK.

Cú pháp:

```html
<vbot-widget token="YOUR_ACCESS_TOKEN" headless="true"></vbot-widget>
```

::: warning Lưu ý quan trọng về thông báo (Toast / Notification)
Ở chế độ **Headless Mode**, SDK **không tự động hiển thị bất kỳ Toast UI nào** (như thông báo cuộc gọi nhỡ, cảnh báo lỗi micro hay lỗi kết nối) nhằm tránh xung đột với hệ thống giao diện hoặc Design System của riêng bạn.

Thay vào đó, SDK phát các Custom Events ra thẻ `<vbot-widget>`. Ứng dụng của bạn cần chủ động lắng nghe các sự kiện này để kích hoạt thông báo (Toast/Alert) tương ứng:

```javascript
const widget = document.querySelector("vbot-widget");

// 1. Nhận thông tin & thông báo cuộc gọi nhỡ
widget.addEventListener("vbot:onInfo", (event) => {
  // Thay thế bằng hàm toast của website bạn (ví dụ: Ant Design, Sonner, React-Toastify...)
  myNotification.info(event.detail.message);
});

// 2. Nhận cảnh báo (ví dụ: lỗi micro, mất quyền truy cập thiết bị)
widget.addEventListener("vbot:onWarning", (event) => {
  myNotification.warning(event.detail.message);
});

// 3. Nhận lỗi hệ thống hoặc cuộc gọi thất bại
widget.addEventListener("vbot:onError", (event) => {
  myNotification.error(event.detail.message);
});

widget.addEventListener("vbot:onCallFailed", (event) => {
  if (event.detail.error) {
    myNotification.error(event.detail.error);
  }
});
```
:::

---

## 6. Giao diện & CSS Tokens

Giao diện mặc định của SDK được thiết kế hiện đại, responsive và hỗ trợ chuyển đổi giao diện sáng/tối tự động. Bạn có thể thay đổi màu sắc chủ đạo để đồng bộ với website thông qua các CSS Variables truyền vào style của widget hoặc khai báo trong CSS toàn cục:

```html
<vbot-widget
  token="YOUR_ACCESS_TOKEN"
  style="--vbot-primary: #10b981; --vbot-call-primary: #22c55e;"
></vbot-widget>
```

### Các CSS Variables chính được hỗ trợ:

- `--vbot-primary`: Màu sắc chủ đạo (Nút bấm chính, viền tiêu điểm).
- `--vbot-primary-foreground`: Màu chữ hiển thị trên nền màu chủ đạo.
- `--vbot-background`: Màu nền của bàn phím số/màn hình gọi.
- `--vbot-foreground`: Màu chữ mặc định.
- `--vbot-border`: Màu viền phân cách các phần tử.
- `--vbot-ring`: Màu vòng phát sáng tiêu điểm khi focus.
- `--vbot-call-primary`: Màu xanh lá cho nút bắt đầu cuộc gọi/nút nghe máy.
- `--vbot-call-danger`: Màu đỏ cho nút dừng cuộc gọi/nút từ chối.
- `--vbot-z-index`: Tùy chỉnh z-index hiển thị của widget (mặc định: `2147483000`).

---

## 7. Hướng dẫn tích hợp React / Next.js / Vue

Do `<vbot-widget>` là một Web Component, khi tích hợp vào các framework như **React**, **Next.js** hoặc **Vue**, bạn nên áp dụng các quy chuẩn sau:

### 1. Đảm bảo Custom Element đã được đăng ký trước khi gọi API

Tránh gọi các phương thức công khai (`makeCall`, `answerCall`...) trước khi script SDK hoàn tất việc định nghĩa thẻ trên trình duyệt:

```javascript
// Đợi Web Component sẵn sàng trong CustomElementRegistry
await customElements.whenDefined("vbot-widget");
const widget = document.querySelector("vbot-widget");
```

### 2. Tích hợp với Next.js (App Router / Pages Router)

Khi sử dụng Next.js, component `<Script>` chỉ nạp bundle một lần duy nhất. Nếu component của bạn bị unmount và mount lại (ví dụ khi chuyển trang), sự kiện `onLoad` của `<Script>` sẽ không kích hoạt lại. Bạn nên kiểm tra `customElements.get('vbot-widget')` kết hợp với `whenDefined`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

export default function VBotPhoneIntegration() {
  const widgetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let widgetElement = widgetRef.current;

    const handleCallIncoming = (event: any) => {
      console.log("Có cuộc gọi đến:", event.detail.callData);
    };

    const handleCallEnded = (event: any) => {
      console.log("Cuộc gọi kết thúc:", event.detail.callData);
    };

    if (widgetElement) {
      widgetElement.addEventListener("vbot:onCallIncoming", handleCallIncoming);
      widgetElement.addEventListener("vbot:onCallEnded", handleCallEnded);
    }

    // Cleanup: gỡ bỏ listener khi unmount để tránh rò rỉ bộ nhớ
    return () => {
      if (widgetElement) {
        widgetElement.removeEventListener(
          "vbot:onCallIncoming",
          handleCallIncoming,
        );
        widgetElement.removeEventListener("vbot:onCallEnded", handleCallEnded);
      }
    };
  }, []);

  return (
    <>
      {/* Nạp SDK qua Next.js Script */}
      <Script
        src="https://cdn.vbot.vn/vbot-sdk/1.0.11/vbot-sdk.umd.js"
        strategy="afterInteractive"
      />

      {/* Thẻ Widget VBot */}
      <vbot-widget
        ref={widgetRef}
        token="YOUR_ACCESS_TOKEN"
        debug
      ></vbot-widget>
    </>
  );
}
```

### 3. Tích hợp theo Route trong SPA (Tránh bẫy Stacking Context)

Khi bạn chỉ muốn nạp widget tại một trang/route cụ thể (ví dụ trang `/crm/calls` hoặc `/tickets`), bạn cần lưu ý:

- **Không tự ý chuyển DOM node ra `document.body` thủ công** (`document.body.appendChild(...)`), vì khi chuyển route, Virtual DOM reconciler của React/Vue sẽ tìm kiếm component con để gỡ bỏ và gây lỗi runtime `removeChild`.
- Nếu layout của route chứa các thuộc tính như `transform`, `filter`, hoặc `backdrop-filter`, trình duyệt sẽ tạo ra một **Stacking Context cục bộ**, khiến `position: fixed` của widget bị co cụm theo thẻ cha.
- **Giải pháp chuẩn**: Sử dụng cơ chế Portal/Teleport native của framework để giữ nguyên lifecycle của route component nhưng mount DOM trực tiếp ra `document.body`:

::: code-group

```tsx [React / Next.js (createPortal)]
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function CallCenterPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="crm-page-container">
      <h1>Tổng Đài Chăm Sóc Khách Hàng</h1>
      <p>Nội dung trang CRM...</p>

      {/* Giữ lifecycle trong trang nhưng render DOM ở document.body */}
      {mounted &&
        createPortal(
          <vbot-widget token="YOUR_ACCESS_TOKEN" debug />,
          document.body,
        )}
    </div>
  );
}
```

```vue [Vue 3 (Teleport)]
<template>
  <div class="crm-page-container">
    <h1>Tổng Đài Chăm Sóc Khách Hàng</h1>
    <p>Nội dung trang CRM...</p>

    <!-- Giữ lifecycle trong trang nhưng render DOM ở document.body -->
    <Teleport to="body">
      <vbot-widget token="YOUR_ACCESS_TOKEN" debug />
    </Teleport>
  </div>
</template>
```

:::

::: tip Khai báo TypeScript cho thẻ `<vbot-widget>`
Khi sử dụng TypeScript trong React/Next.js, bạn có thể tạo file `custom-elements.d.ts` trong thư mục `src/` (hoặc `types/`) để trình biên dịch không cảnh báo lỗi thẻ lạ:

```typescript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "vbot-widget": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          token?: string;
          config?: string | Record<string, any>;
          headless?: boolean | string;
          debug?: boolean | string;
          "external-call-id"?: string;
          "z-index"?: number | string;
          zIndex?: number | string;
        },
        HTMLElement
      >;
    }
  }
}
```

:::
