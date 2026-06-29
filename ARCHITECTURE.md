🏛️ TÀI LIỆU KIẾN TRÚC HỆ THỐNG TOÀN DIỆN (SYSTEM ARCHITECTURE SPECIFICATION)

ASCII MULTIPLAYER GAME UNIVERSE (AoE / StarCraft & Board Games Clone)

⚠️ CHỈ THỊ BẮT BUỘC CHO AI AGENTS & DEVELOPERS (MANDATORY DIRECTIVE)

Nếu bạn là một AI Code Assistant (Cursor, Copilot, Gemini, Claude...) hoặc một Lập trình viên mới tham gia dự án, bạn BẮT BUỘC ĐỌC VÀ TUÂN THỦ 100% các quy tắc dưới đây trước khi viết hoặc sửa đổi bất kỳ dòng code nào:

No Float Policy (Chính sách Không Số Thực): Cấm tuyệt đối sử dụng số thực (float/double), cấm các hàm toán học ngẫu nhiên hoặc lượng giác mặc định như Math.random(), Math.sin(), Math.cos(). Mọi logic game phải sử dụng Fixed-Point Math (Số nguyên định phẩy) và Deterministic PRNG (Bộ sinh số ngẫu nhiên xác định) để đảm bảo đồng bộ tuyệt đối trên mọi môi trường.

No DOM Gaming (Không Render bằng DOM): Cấm sử dụng các thẻ HTML thông thường (<div>, <span>, <pre>) để render các đối tượng game. Chỉ sử dụng duy nhất HTML5 <canvas> 2D API để kết xuất đồ họa bằng GPU.

Single Source of Truth (Nguồn Chân lý Duy nhất): Mọi Interface, Type và Dữ liệu truyền tải qua mạng (WebSocket payloads) phải được đặt duy nhất tại thư mục chia sẻ packages/shared-types. Nghiêm cấm khai báo lặp lại cấu trúc dữ liệu ở cả hai đầu Client và Server.

Trình tự làm việc cục bộ: Trước khi can thiệp vào bất kỳ thư mục con nào (app hoặc package), bắt buộc phải đọc kỹ file README.md nằm riêng trong thư mục con đó để nắm bắt các tham số nghiệp vụ đặc thù.

Cập nhật Đồng bộ Tài liệu (Document-Code Synchronicity): Bất kỳ thay đổi nào liên quan đến logic cốt lõi (chỉ số lính, sát thương, tốc độ, định dạng gói tin mạng) đều BẮT BUỘC phải đi kèm với việc cập nhật tài liệu tương ứng (system_architecture.md hoặc các file README.md cục bộ) trong cùng một Commit/Pull Request. Mã nguồn và tài liệu không được phép lệch pha.

Unified ASCII UI/UX Mandate (Trải nghiệm ASCII Art Toàn diện): Tuyệt đối không sử dụng các phong cách UI hiện đại, bóng bẩy hay các bo góc mịn màng. Toàn bộ giao diện người dùng trên mọi trang (Trang chủ, Lobby, Cài đặt, Game Screen) bắt buộc phải là một trải nghiệm ASCII Art đồng nhất, mô phỏng các thiết bị Terminal cổ điển.

THÔNG TIN DỰ ÁN TỔNG QUAN

Dự án: ASCII MULTIPLAYER GAME UNIVERSE (AoE / StarCraft & Board Games Clone như Uno, Zombie Invasion)

Mục tiêu: Zero-Cost Infrastructure (Không mất phí hạ tầng), Zero-Database (Không cơ sở dữ liệu vật lý), Anti-DDoS chủ động, Đáp ứng $30,000+\text{ CCU}$, Đạt tốc độ kết xuất $60\text{Hz}$ (60FPS) ASCII Art Style, Tối ưu hóa SEO (Core Web Vitals đạt điểm tuyệt đối $100/100$).

Hạ tầng triển khai: $1\text{x}$ Oracle Cloud Instance ($4\text{ vCPUs}$ ARM Ampere, $24\text{GB}$ RAM, Ubuntu OS) + Cloudflare Free Tier.

1. TỔNG QUAN KIẾN TRÚC & LUỒNG DỮ LIỆU (DATA FLOW)

Hệ thống được thiết kế theo mô hình Stateless Edge-to-Core để tối ưu hóa hiệu năng và bảo mật tối đa. Toàn bộ các cổng kết nối đi vào (Inbound Ports) trên máy chủ Oracle đều bị khóa chặn (Block) $100\%$ bằng hạ tầng Security List của Cloud Provider. Dữ liệu giao tiếp độc quyền thông qua kết nối mã hóa ngược (Reverse Outbound Tunnel) của Cloudflare, ẩn giấu hoàn toàn địa chỉ IP gốc của VPS trước các nguy cơ tấn công mạng.

Sơ đồ luồng mạng (Edge-to-Core Flow)

[ Client / Trình duyệt ]
          │ (HTTPS / WSS qua Port 443 của Cloudflare Edge)
          ▼
[ Cloudflare Anycast Edge Network ] ─── (Tự động lọc rửa tấn công DDoS Lớp 3/4/7)
          │
          ▼ (Luồng mã hóa TLS qua Cloudflare Tunnel Daemon - Outbound Connection)
[ vps-oracle-ampere: Mạng nội bộ Docker Bridge ]
          │
          ├──> [ Container: cloudflared_1, cloudflared_2 ] (Đón nhận & giải mã Header traffic / Load Balanced Tunnels)
          │          │
          │          ▼ (HTTP nội bộ qua Docker Network Inter-connect)
          └──> [ Container: Nginx Reverse Proxy ]
                     ├─ (HTTP - Base Routes) ──> [ Container: Next.js Home App ] (Port 3000, Core 1)
                     └─ (WSS - Socket Routes) ──> [ Container: Bun Game Cluster ] (Port 8080)
                                                        ├─ Core 2: Worker 1 (Rooms 1 - 2500)
                                                        ├─ Core 3: Worker 2 (Rooms 2501 - 5000)
                                                        └─ Core 0: Redis Engine (RAM State Cache)


2. CHI TIẾT TECH STACK & PHÂN BỔ TÀI NGUYÊN (RESOURCES)

A. Core Technology Stack

Hạ tầng mạng & Bảo mật: Cloudflare Tunnel (cloudflared) + Nginx (Reverse Proxy, Compression & Static Asset Caching).

Monorepo Engine: Turborepo + pnpm workspaces (Giảm dung lượng lưu trữ đĩa vật lý tối đa qua cơ chế liên kết cứng - hard-link cực kỳ tối ưu trên kiến trúc chip ARM).

Ứng dụng Trang chủ & Lobby (Web Portal): Next.js (Cấu hình Static Site Generation - SSG nhằm tối đa tốc độ tải trang ban đầu).

Ứng dụng Lõi Game (Backend Engine): Bun JavaScript Runtime (Tốc độ I/O nhanh gấp $3$ times Node.js thông thường) sử dụng giao tiếp WebSocket thuần (Native WebSockets) không thông qua các thư viện bọc để tránh hao tổn tài nguyên và giảm độ trễ mạng.

Tầng Lưu trữ Trạng thái Tạm thời: Redis (Hoạt động hoàn toàn trên RAM - Ephemeral Storage Mode).

Công cụ Kết xuất Đồ họa (Frontend Client): HTML5 Canvas API (Vẽ các ký tự ASCII trực tiếp bằng hiệu năng GPU, nói không với việc tạo/xóa các phần tử DOM liên tục).

B. Định vị Tài nguyên trên 24GB RAM (CPU Pinning Strategy)

Để triệt tiêu hiện tượng thắt nút cổ chai do CPU phải chuyển đổi ngữ cảnh (Context Switching) khi gánh hàng chục nghìn kết nối đồng thời, hệ thống ghim chặt các tác vụ vào từng Core vật lý của bộ xử lý ARM Ampere:

Nhân CPU

Dịch vụ được chỉ định

Dung lượng RAM tối đa

Phương thức hoạt động tối ưu

Core 0

OS + Cloudflare Tunnel + Redis Engine

$8\text{ GB}$ RAM

Khóa hoàn toàn tính năng ghi đĩa cứng của Redis (--save "" và --appendonly no). Biến Redis thành một kho chứa In-Memory lưu trữ thông tin phòng động (Public Rooms list, Room Metadata, Command Logs) và State tạm thời, độ trễ đọc/ghi $< 1\text{ms}$. Các Tunnel Cloudflare chia sẻ nhân này để giải mã TLS ở biên.

Core 1

Next.js Home Portal + Lobby API + Nginx

$4\text{ GB}$ RAM

Toàn bộ trang chủ được xuất ra các file HTML tĩnh và nạp thẳng lên cache RAM của Nginx. CPU không tốn tài nguyên render động khi có hàng vạn người truy cập đồng thời.

Core 2

Bun Game Worker 1

$6\text{ GB}$ RAM

Đảm nhiệm xử lý Game Looping, gom nhận Inputs và quản lý toàn bộ kết nối WebSocket hoạt động trong các phòng chơi từ 1 - 2500.

Core 3

Bun Game Worker 2

$6\text{ GB}$ RAM

Đảm nhiệm xử lý Game Looping, gom nhận Inputs và quản lý toàn bộ kết nối WebSocket hoạt động trong các phòng chơi từ 2501 - 5000.

3. GIAO THỨC ĐỒNG BỘ GAME & RENDER CLIENT

A. Giao thức Deterministic Lockstep linh hoạt (Logic 15Hz / 30Hz)

Hệ thống hỗ trợ cấu hình tần số tick phù hợp với từng thể loại game để tối ưu hóa hiệu năng mạng và trải nghiệm người dùng:

Với các Game RTS lớn (AoE / StarCraft): Kế thừa chuẩn thiết kế huyền thoại, hệ thống chạy Tick Rate ở mức $15\text{Hz}$ ($66.6\text{ms}$ mỗi chu kỳ) để đảm bảo đồng bộ mượt mà cho hàng vạn đơn vị lính mà không gây nghẽn băng thông.

Với các Board Games hoặc Game phản xạ nhanh (Uno, Zombie Invasion): Hệ thống tự động tăng tốc lên $30\text{Hz}$ ($\approx 33.3\text{ms}$ mỗi chu kỳ) nhằm giảm thiểu tối đa độ trễ thao tác của người chơi.

Cơ chế truyền tin: Server KHÔNG tính toán vật lý, không chạy AI hay tự động xử lý va chạm của lính. Trách nhiệm duy nhất của Bun.js Server là: Gom tất cả các Lệnh (Inputs) của người chơi gửi lên trong khoảng chu kỳ tương ứng ($33.3\text{ms}$ hoặc $66.6\text{ms}$) -> Đóng gói thành một chuỗi văn bản ASCII tối giản -> Phát tán (Broadcast) gói dữ liệu chung này tới toàn bộ Client đang ở trong phòng.

Định dạng chuỗi dữ liệu (Mẫu mã lệnh mạng): Khi người chơi di chuyển hoặc ra lệnh, Client gửi một chuỗi văn bản thuần tối giản về Server thay vì các định dạng cồng kềnh như JSON:
CMD_MOVE|PLAYER_1|UNIT_ID_12|TARGET_X_25|TARGET_Y_40

Nhờ cơ chế này, băng thông mạng được duy trì ở mức cực thấp, loại bỏ hoàn toàn giới hạn I/O của máy chủ.

B. Client-Side Interpolation (Render 60Hz)

Do Client chỉ nhận dữ liệu mạng ở tần số thấp ($15\text{Hz}$ hoặc $30\text{Hz}$), hệ thống bắt buộc phải áp dụng Vòng lặp kép (Dual Loop) ở phía Client để duy trì đồ họa mượt mà:

Logic Loop (15Hz/30Hz): Nhận gói tin từ mạng, cập nhật đích đến cuối cùng và trạng thái của các đơn vị lính dựa trên chỉ thị của Server.

Render Loop (60Hz bằng requestAnimationFrame): Client sử dụng thuật toán Linear Interpolation (Lerp - Nội suy tuyến tính) để tự động nội suy vị trí mượt mà, vẽ sự dịch chuyển của lính giữa $2$ tọa độ cách nhau một tick mạng qua các khung hình kết xuất nội bộ của Client.

Công thức tính toán nội suy tuyến tính (Lerp) được định nghĩa như sau:

$$P(t) = (1 - t) \times P_{\text{start}} + t \times P_{\text{end}}$$

Trong đó $t \in [0, 1]$ là tỉ lệ thời gian đã trôi qua kể từ tick mạng cuối cùng cho đến tick kế tiếp ($t = \frac{\text{ElapsedTime}}{\text{TickInterval}}$).

C. Triệt tiêu hiện tượng Desync bằng Fixed-Point Math

JavaScript sử dụng số thực dấu phẩy động $64$-bit theo chuẩn IEEE 754, điều này dễ gây ra các sai số nhỏ khác nhau tùy thuộc vào trình duyệt, công cụ JS engine (V8, SpiderMonkey, JSC) hoặc hệ điều hành của người chơi, dẫn đến mất đồng bộ trạng thái (Desync) trong cơ chế Lockstep.

Quy tắc Vàng: Cấm dùng số thực (Float/Double), cấm Math.random(), cấm các hàm lượng giác nguyên bản Math.sin() và Math.cos().

Giải pháp: Sử dụng Toán học Số nguyên định phẩy (Fixed-Point Math). Ví dụ: Tọa độ thực 1.56 phải được nhân lên và lưu trữ dưới dạng số nguyên là 15600. Tọa độ này sẽ khớp $100\%$ logic tính toán trên mọi trình duyệt của mọi người chơi.

Math.random() được thay thế bằng thuật toán Deterministic PRNG (Sử dụng một Seed - Hạt giống chung duy nhất do Server cấp lúc khởi tạo game), đảm bảo mọi máy tính của người chơi đều sinh ra chuỗi số ngẫu nhiên giống hệt nhau tại cùng một tick.

D. Cơ chế Giữ Kết Nối qua Cloudflare Tunnel (Heartbeat)

Cloudflare sẽ tự động hủy các kết nối WebSocket nếu không có dữ liệu truyền tải qua lại trong vòng $100$ giây (timeout biên).

Giải pháp: Bun Game Server được cấu hình cơ chế tự động phát gói tin rỗng (Ping Frame) tới Client định kỳ mỗi $20$ giây/lần. Client phản hồi lại ngay lập tức (Pong Frame) để duy trì kết nối luôn ở trạng thái kích hoạt (Keep-Alive).

E. Giao thức Tái kết nối & Đuổi kịp Tick (Catch-up & Reconnect Protocol)

Để xử lý trường hợp một người chơi bị rớt mạng tạm thời hoặc tải lại trang (F5) khi trận đấu đang diễn ra ở tick cao (Ví dụ: Tick 3000), hệ thống triển khai cơ chế Snapshot Kết hợp Command-Log lưu trữ tại bộ nhớ đệm Redis:

Lưu Command-Log tại Server: Tại mỗi tick mạng, Bun Server ghi lại danh sách Inputs gom được của tick đó vào cấu hình Redis List theo Key dạng: room:[roomCode]:tick_history.

Cơ chế Snapshot tuần kỳ: Định kỳ mỗi $300$ Ticks ($20$ giây một lần với game $15\text{Hz}$), Client làm Host đáng tin cậy (hoặc mọi Client tự chạy đồng thuận chéo) sẽ đóng gói trạng thái toàn bộ game dạng nén cực tiểu (State Snapshot) gửi lên Server để lưu vào Redis Key: room:[roomCode]:latest_snapshot.

Quy trình Reconnect & Catch-Up:

Khi Client kết nối lại, gửi gói tin yêu cầu REQ_RECONNECT|PLAYER_ID.

Bun Server phản hồi bằng cách gửi State Snapshot mới nhất (latest_snapshot) kèm số thứ tự Tick tương ứng của Snapshot đó (Ví dụ: Tick 2700).

Ngay sau đó, Server liên tục đẩy nhanh toàn bộ các gói dữ liệu từ list tick_history từ Tick 2701 đến Tick hiện tại (Ví dụ: Tick 3000) về cho Client.

Client nhận Snapshot -> Khởi tạo trạng thái game ở Tick 2700 -> Chạy vòng lặp giả lập tốc độ cao (Fast-Forward Simulation - không kết xuất đồ họa) qua $300$ tick dữ liệu bổ sung trong vài mili giây -> Đuổi kịp hoàn toàn trạng thái thực tại ở Tick 3000 -> Mở lại Render Loop $60\text{Hz}$. Người chơi tiếp tục trải nghiệm không tì vết.

F. Bộ Kiểm dịch Lệnh đầu vào (Input Sanity Validation & Anti-Cheat)

Vì Server không tính toán vật lý để tối ưu hóa CPU, Client hoàn toàn có thể gửi các lệnh phá hoại nếu bị can thiệp bộ nhớ. Bun Server bắt buộc phải thực hiện các bước kiểm dịch sau tại mỗi tick để đảm bảo tính an toàn cơ bản:

Xác thực quyền sở hữu (Ownership Check): Server chỉ chấp nhận lệnh điều khiển đối tượng từ Client khi định danh của Client (PLAYER_ID) khớp chính xác với định danh người sở hữu đối tượng đó lưu trong phòng tại RAM của Worker. (Ví dụ: Player 1 không thể gửi lệnh di chuyển lính của Player 2).

Kiểm soát tần suất lệnh (Rate Limiting per Player): Giới hạn tối đa số lượng lệnh một Player được phép gửi lên trong một chu kỳ Tick (Ví dụ: Không quá $5$ lệnh/tick). Toàn bộ lệnh vượt ngưỡng sẽ bị từ chối thẳng để chống spam DDoS payload.

Kiểm định cấu trúc (Syntax & Range Validation): Mọi tọa độ đích hay số lượng đơn vị mua phải nằm trong giới hạn cho phép tối đa của bản đồ (Ví dụ: Tọa độ không âm, không vượt kích thước lưới tối đa $1000 \times 1000$).

4. CÔNG NGHỆ KẾT XUẤT ĐỒ HỌA (CANVAS ASCII RENDERER)

Tuyệt đối không dùng các thẻ HTML DOM (<div>, <span>, <pre>) để kết xuất Game. Toàn bộ màn hình hiển thị phải được vẽ qua HTML5 <canvas> 2D API bằng GPU.

Font chữ bắt buộc: Các font chữ dạng Monospace (Độ rộng ký tự bằng nhau tuyệt đối) như JetBrains Mono hoặc Courier New.

Layering (Tách Lớp): Sử dụng hai lớp Canvas chồng khít lên nhau:

Canvas 1 (Background): Chỉ vẽ các địa hình tĩnh (đất đá, tài nguyên cố định). Lớp này chỉ vẽ lại khi có biến động lớn về tài nguyên bản đồ.

Canvas 2 (Foreground): Vẽ các vật thể động như lính, đạn bay, hiệu ứng cháy nổ.

Sprite Caching: Các ký tự hoặc khối nhà ASCII phức tạp được vẽ nháp ra một Offscreen Canvas một lần duy nhất khi khởi tạo. Khi render thực tế, hệ thống chỉ dùng hàm ctx.drawImage() để copy-paste vùng ảnh đã cache lên Canvas chính nhằm tối ưu hóa hiệu năng render.

Dirty Rectangles: Ở lớp Foreground, hệ thống không tiến hành xóa toàn màn hình ở mỗi khung hình. Thuật toán sẽ khoanh vùng (Bounding Box) các pixel của các unit vừa di chuyển khỏi và chỉ xóa (clear) đúng vùng pixel nhỏ đó ở frame trước, giữ nguyên các vùng khác.

Ma trận tọa độ hiển thị Isometric (Game 2.5D Giả lập Không gian):
Server quản lý lưới ô cờ phẳng $(X, Y)$. Client tiến hành chuyển đổi sang tọa độ chéo hiển thị trên màn hình thông qua hệ thống công thức toán học sau:

$$\text{ScreenX} = (X - Y) \times \left(\frac{\text{TileWidth}}{2}\right)$$

$$\text{ScreenY} = (X + Y) \times \left(\frac{\text{TileHeight}}{2}\right)$$

E. Nghệ thuật Hoạt ảnh Thực thể bằng Kỹ thuật Tráo Khung ASCII (Character Frame-Swapping Animation Engine)

Để mang lại sự sống động cho thế giới game mà không phá vỡ phong cách Retro terminal, mọi thực thể động (quân lính, tiều phu, quái vật zombie, đạn bay, hiệu ứng nổ) không được vẽ bằng một ký tự tĩnh mà phải được xử lý qua hệ thống hoạt ảnh tráo khung ký tự (ASCII Art Frames):

Cấu trúc dữ liệu khung ASCII (ASCII Sprite Schema):
Mỗi thực thể sở hữu một bộ thư viện khung ảnh gồm các ma trận văn bản monospace đại diện cho các trạng thái: IDLE (Đứng yên), WALK (Di chuyển), ATTACK (Tấn công), HURT (Bị thương), và DIE (Băng hà).
Ví dụ, hoạt ảnh di chuyển của Zombie gồm $2$ khung hoán đổi để tạo chuyển động tay chân:

Frame 0 (Bước chân trái):

 [o_o] 
 /| |  
 / \   


Frame 1 (Bước chân phải):

 [o_o] 
  | | \
  / \  


Cơ chế đếm khung dựa trên thời gian thực định phẩy (Fixed-Point Frame Timer):
Để loại bỏ sự phụ thuộc vào hiệu năng máy client, tốc độ hoạt ảnh được đồng bộ với thời gian thực của game.

Mỗi thực thể có một biến animationTick dạng fixed-point tăng tiến theo thời gian.

Chỉ số khung hình hiển thị hiện tại ($FrameIdx$) được xác định bằng công thức:


$$FrameIdx = \left( \frac{animationTick}{frameDelay} \right) \pmod{totalFrames}$$


Trong đó $frameDelay$ quy định độ trễ chuyển đổi khung (ví dụ: chuyển khung sau mỗi $100\text{ms}$ tương đương với $1000$ đơn vị fixed-point).

Vẽ Hoạt ảnh ASCII mượt mà bằng Canvas API:

Khi render, công cụ sẽ lấy ma trận chuỗi ký tự của khung hình hiện tại.

Để đạt hiệu năng tối ưu, mỗi khung ký tự của các loại thực thể được kết xuất thử nghiệm (pre-render) ra một Offscreen Canvas (Sprite Sheet dạng ảnh bitmap thô của ký tự).

Trình duyệt client chỉ cần dùng hàm ctx.drawImage để vẽ, tránh hoàn toàn chi phí sử dụng ctx.fillText liên tục cho hàng chục nghìn ký tự đơn lẻ trên màn hình, đảm bảo duy trì độ mượt mà tuyệt đối ở tần số $60\text{Hz}$ ngay cả trên các thiết bị cấu hình yếu.

5. XỬ LÝ SỐ LƯỢNG LỚN: ZOMBIE INVASION & ĐÁM ĐÔNG

Vấn đề: Khi có tới 10,000 Zombie tự tìm đường bằng thuật toán thông thường như $A^*$ (A-Star) sẽ làm treo hoàn toàn CPU của Client ngay lập tức do độ phức tạp tính toán quá cao.

Giải pháp: Áp dụng thuật toán Flow Field Pathfinding (Trường Vector hướng).

Client/Server chia bản đồ thành một lưới ô vuông. Từ vị trí mục tiêu hiện tại (ví dụ: Player), thuật toán loang (Flood-fill) tạo ra một mạng lưới các mũi tên chỉ hướng trên toàn bản đồ hướng về Player.

10,000 Zombie không cần tự tính toán đường đi phức tạp. Mỗi con Zombie chỉ việc kiểm tra ô lưới nó đang đứng có mũi tên trỏ hướng nào và bước theo hướng đó.

Độ phức tạp tính toán giảm xuống mức tối ưu $O(1)$ cho mỗi Zombie.

6. LUỒNG NGƯỜI DÙNG (USER FLOW)

Hệ thống được thiết kế để tối ưu hóa thời gian từ lúc truy cập web đến lúc chơi game thực tế (Time-to-Play dưới 10 giây), cung cấp cơ chế linh hoạt giữa phòng Công khai (Public) và phòng Riêng tư (Private):

Khám phá (Discovery): Người chơi truy cập Trang chủ (/) -> Xem danh sách game nổi bật (AoE, StarCraft, Zombie, Uno) -> Nhấn nút INIT_GAME.

Cấu hình & Danh sách Phòng (Lobby UI): Hệ thống định hướng người chơi tới trang Lobby của game cụ thể (/lobby/[gameId]). Giao diện lobby được dựng hoàn toàn bằng phong cách bảng vẽ ký tự ASCII chuyên nghiệp:

Bộ Duyệt Phòng Công Khai (Public Room Browser): Hiển thị bảng danh sách tất cả các phòng chơi công khai (PUBLIC) hiện đang hoạt động và đang ở trạng thái chờ người của game này (lấy trực tiếp từ Redis qua cơ chế SSE hoặc WebSocket subscription của game-lobby). Mỗi dòng hiển thị rõ: Tên Chủ Phòng, Số người/Tối đa, Trạng thái (Waiting), Mã Phòng. Người chơi chỉ cần nhấn JOIN để vào thẳng phòng mà không cần link mời.

Khu Vực Tạo Phòng Mới: Người chơi nhập PLAYER_ID (Tên hiển thị mong muốn) -> Lựa chọn Chế độ Phòng (Room Visibility):

PUBLIC: Phòng công khai, sẽ hiển thị công khai trên danh sách duyệt phòng cho tất cả người dùng khác ở Lobby thấy và kết nối.

PRIVATE: Phòng riêng tư ẩn danh, hoàn toàn không xuất hiện trên bảng danh sách phòng.

Nhấn nút CREATE_ROOM để khởi tạo.

Chờ & Mời (Room Matchmaking):

Đối với Phòng Riêng Tư (Private): Hệ thống sinh ngẫu nhiên mã phòng gồm $5$ ký tự (Ví dụ: X7A9B) và cung cấp Link mời dạng https://domain.com/join/X7A9B. Chủ phòng copy link gửi bạn bè. Khách chỉ có thể tham gia thông qua link mời này.

Đối với Phòng Công Khai (Public): Hệ thống cũng sinh mã phòng và link mời tương tự, nhưng đồng thời cập nhật Room Metadata của phòng lên Redis. Server game-lobby lập tức phát tín hiệu (broadcast) cập nhật danh sách tới toàn bộ người chơi đang túc trực tại trang /lobby/[gameId]. Người chơi bất kỳ có thể truy cập qua link mời trực tiếp hoặc nhấn vào phòng trên danh sách Lobby Browser.

Khởi chạy Game (Initialization):

Khi phòng chơi đã đủ số lượng thành viên, nút START tại giao diện máy Host (Chủ phòng) sẽ sáng lên.

Host nhấn START -> Next.js tháo dỡ hoàn toàn giao diện HTML DOM -> Tải Canvas Render Engine -> Khởi tạo kết nối WebSocket trực tiếp tới Bun Server -> Chuyển trạng thái phòng thành PLAYING trên Redis (tự động xóa phòng khỏi danh sách công khai ở Lobby Browser) -> Game bắt đầu vòng lặp Lockstep đồng bộ.

Kết thúc (Post-Match): Trận đấu kết thúc -> Giải phóng kết nối -> Đóng Canvas -> Hiển thị Bảng xếp hạng -> Cho phép người chơi quay lại Room để chuẩn bị cho ván mới hoặc thoát ra ngoài giao diện Lobby Browser để tìm kiếm phòng công khai khác.

7. CẤU TRÚC TRANG WEB & CHIẾN LƯỢC SEO (PAGES & SEO)

Dự án sử dụng Next.js với chiến lược kết xuất tĩnh Static Site Generation (SSG), mang lại lợi thế tuyệt đối về tốc độ phản hồi máy chủ (TTFB $< 50\text{ms}$) và tối ưu hóa công cụ tìm kiếm (SEO).

A. Phân bổ Cấu trúc Trang (Routing Strategy)

Toàn bộ các trang web từ trang chủ cho tới game bắt buộc phải áp dụng phong cách thiết kế giao diện Terminal/ASCII Art đồng nhất.

/ (Trang chủ): Tiêu đề trang được thể hiện bằng một khối ASCII Text khổng lồ (ASCII Word Art "ASCII UNIVERSE" được render thông qua Figlet generator). Toàn bộ nội dung trang trí, danh sách trò chơi, bảng xếp hạng kỷ lục được vẽ bao quanh bởi các khung kẻ viền dạng ký tự nét đơn (┌, ─, ┐, │, └, ┘) hoặc nét kép (╔, ═, ╗, ║, ╚, ╝).

/about (Về chúng tôi): Thiết kế chuẩn giao diện một ứng dụng Terminal CLI cổ điển (mô phỏng npx commands). Trình bày cấu trúc công nghệ dưới dạng cây thư mục ASCII (├──, └──). SEO tập trung thu hút Backlink tự nhiên từ giới lập trình.

/game/[gameId] (Landing Page riêng biệt cho SEO): Trang SEO mũi nhọn, tích hợp các hình ảnh mô phỏng gameplay dưới dạng các tệp ảnh động GIF được render từ canvas ASCII thực tế. Layout trang giữ nguyên bộ font chữ JetBrains Mono và tông nền xanh lá/đen phong cách hacker cổ điển.

/lobby/[gameId] & /join/[roomCode] (Các trang Chức năng): Sẽ được cấu hình thẻ <meta name="robots" content="noindex, nofollow"> để tránh Google Bot lập chỉ mục. Giao diện trang trí các nút nhấn bằng các khối viền ký tự ASCII đổi màu khi rê chuột (Hover effects bằng CSS đổi màu text/nền thay vì bo tròn).

B. Kỹ thuật Tối ưu SEO Kèm Theo

Hoàn hảo Core Web Vitals: Giao diện triệt tiêu hoàn toàn hình ảnh và video nặng (chỉ dùng CSS và ký tự ASCII), điểm LCP (Largest Contentful Paint) và CLS (Cumulative Layout Shift) luôn đạt mức tuyệt đối $100/100$.

Dynamic Open Graph (OG Images): Tự động sinh ảnh cover động khi người chơi chia sẻ liên kết mời lên các mạng xã hội (ví dụ: tự động in tên Room Host và mã phòng lên ảnh Thumbnail bằng code Canvas động phía server).

8. CẤU TRÚC REPOSITORY (TURBOREPO WORKSPACES)

Dự án sử dụng Turborepo và pnpm workspaces để quản lý Monorepo một cách tối ưu và gọn gàng nhất. Cấu trúc được chia tách minh bạch giữa các ứng dụng và các gói thư viện dùng chung độc lập nhằm triệt tiêu tối đa sự phụ thuộc vòng chéo (circular dependencies).

my-ascii-game-universe/
├── .github/
│   └── workflows/
│       ├── ci-cd.yml            # CI/CD Pipeline chính của Monorepo (Kiểm thử, Linting, Build)
│       └── deploy.yml           # Tự động hóa CI/CD đóng gói Docker và đẩy lên VPS Oracle
│
├── apps/
│   ├── web-portal/              # (Next.js) Ứng dụng chính chứa Client Game (Canvas Wrapper) và Room UI
│   │                            # Xem chi tiết: ./apps/web-portal/README.md
│   ├── home-page/               # (Next.js SSG) Trang Landing Page giới thiệu game và SEO marketing thuần túy
│   │                            # Xem chi tiết: ./apps/home-page/README.md
│   ├── game-lobby/              # (Bun.js) Cổng điều hướng, WebSocket Room Gateway, danh sách phòng công khai
│   │                            # (Public Rooms List), hàng đợi ghép phòng tự động
│   │                            # Xem chi tiết: ./apps/game-lobby/README.md
│   └── game-servers/            # Các máy chủ chạy logic lockstep phòng chơi riêng lẻ
│       ├── core-socket/         # Thư viện core xử lý bắt tay (handshake) và quản lý Connection Lifecycle của Bun
│       ├── game-rts-aoe/        # Engine điều phối phòng chơi AoE/StarCraft ASCII (Gom inputs và Broadcast)
│       └── game-uno/            # Engine điều phối phòng chơi game bài Uno ASCII (Xử lý lượt theo Turn-based)
│
├── packages/
│   ├── shared-types/            # [QUAN TRỌNG] Single Source of Truth cho các Interface API & WebSockets.
│   │                            # Định nghĩa rõ kiểu RoomMetadata { id, host, visibility: 'PUBLIC' | 'PRIVATE', players, maxPlayers, status, workerPort }
│   │                            # Cấm tạo thêm packages/types trùng lặp. Mọi Type đều ở đây.
│   ├── game-configs/            # [MỚI] Trung tâm chứa cấu hình khai báo động (TS/JSON) cho mọi trò chơi
│   ├── core-math/               # Thư viện Fixed-Point Math, Deterministic PRNG, và các hàm Isometric.
│   ├── lockstep-engine/         # Khung logic chạy tick 15Hz/30Hz (Dùng chung cho cả Client và Server)
│   ├── game-logic-aoe/          # Luật game AoE/StarCraft (Máu lính, Damage, Tốc độ, chỉ số Unit) -> XEM README.md
│   ├── game-logic-zombie/       # Luật game Zombie + Thuật toán loang Flow Field Pathfinding -> XEM README.md
│   ├── game-logic-uno/          # Luật chơi bài Uno (Xáo bài, Kiểm tra lượt, Hợp lệ bài, Rút bài) -> XEM README.md
│   ├── ascii-renderer/          # Engine thao tác và vẽ trực tiếp lên HTML5 Canvas (Thuần TypeScript, không phụ thuộc React)
│   ├── ui-ascii/                # Các thành phần giao diện React dùng chung (Hộp thoại ASCII, Nút bấm cổ điển)
│   ├── eslint-config/           # Cấu hình Linting đồng bộ cho toàn bộ hệ thống
│   └── typescript-config/       # Cấu hình tsconfig.base.json chuẩn hóa cho mọi package
│
├── infra/                       # Quản lý cấu hình hạ tầng vận hành
│   ├── nginx/                   # Thư mục cấu hình định tuyến Nginx Gateway (nginx.conf)
│   └── scripts/                 # Các tập lệnh shell script tự động thiết lệnh Tunnel/Redis
│
├── .env.example                 # Mẫu khai báo biến môi trường chuẩn của hệ thống
├── docker-compose.yml           # File định nghĩa điều phối toàn bộ vòng đời container
├── package.json                 # Khai báo cấu hình Workspace của pnpm
└── turbo.json                   # Cấu hình cache build và phân phối bộ nhớ đệm của Turborepo


9. QUY TRÌNH PHÁT TRIỂN TIÊU CHUẨN (STANDARD WORKFLOW)

Bất kỳ AI Agent hoặc Developer nào khi nhận task tạo tính năng mới / game mới, BẮT BUỘC thực hiện theo đúng trình tự 5 bước dưới đây:

Bước 1 - Định nghĩa Kiểu (Types First): Truy cập vào thư mục packages/shared-types. Khai báo cấu trúc dữ liệu chính xác cho các Gói tin (Packet) truyền qua mạng (Ví dụ: MoveCommandPayload, GameStateSync). Nghiêm cấm việc khai báo kiểu dữ liệu đơn lẻ, rải rác trong các app con.

Bước 2 - Viết Logic Core (Pure Functions): Truy cập vào thư mục game tương ứng (Ví dụ: packages/game-logic-aoe hoặc packages/core-math). Viết các hàm logic cập nhật trạng thái game. Hàm phải là một pure function, nhận đầu vào là trạng thái cũ + danh sách lệnh (commands) => trả về trạng thái mới. Sử dụng $100\%$ các hàm toán học an toàn từ core-math không chứa số thực hoặc các hàm ngẫu nhiên của hệ thống.

Bước 3 - Cập nhật Server: Truy cập vào thư mục apps/game-servers (hoặc apps/game-server). Thêm logic xử lý tương ứng để gom gói tin cho game đó tại vòng lặp tick rate đã thiết lập và tiến hành phát (broadcast) cho phòng chơi.

Bước 4 - Cập nhật UI & Client Rendering: Truy cập vào thư mục ứng dụng web (apps/web-portal hoặc apps/home-page). Gắn Canvas Renderer của game vào giao diện. Viết logic Interpolation (Nội suy) để nhận gói tin đồng bộ từ server và render mượt mà ở tần số $60\text{Hz}$. Tiến hành kiểm thử kỹ lượng bằng cách tự mở ít nhất $2$ tab trình duyệt để test tương tác đa người chơi.

Bước 5 - Cập nhật README cục bộ: Ghi chép chi tiết lại các thông số mới bổ sung (Ví dụ: thông số loại lính mới, giá trị máu/damage, luật tính lượt, phím tắt...) vào file README.md của thư mục game-logic-* hoặc server tương ứng để lưu trữ tài liệu phục vụ các đợt tích hợp sau.

10. MÔI TRƯỜNG VẬN HÀNH & DOCKER CPU PINNING (DEPLOYMENT)

Hệ thống được thiết kế để chạy 100% trên nền tảng Docker Container (thông qua docker-compose). Không cài đặt trực tiếp các Runtime (Bun, Node, Redis) lên hệ điều hành Host để đảm bảo tính cô lập và bảo mật tuyệt đối (giao tiếp duy nhất qua Docker Bridge Network khép kín).

A. Vai trò của systemd

Trách nhiệm duy nhất của OS (Ubuntu) và systemd là giám sát để đảm bảo Docker Daemon luôn trong trạng thái hoạt động:

# Lệnh thiết lập khởi động cùng hệ thống trên VPS Ubuntu mới (Chỉ làm 1 lần)
sudo systemctl enable docker
sudo systemctl start docker


Toàn bộ container được ép chạy trên các lõi vật lý độc lập qua cấu hình cpuset trong Docker Compose nhằm giảm tối đa độ trễ do chuyển đổi ngữ cảnh CPU (Context Switching) khi gánh hàng chục nghìn kết nối đồng thời.

B. Cơ chế định tuyến phòng động (Dynamic Room Routing)

Để điều hướng chính xác người chơi tham gia phòng từ Lobby về các Worker máy chủ phù hợp (Worker 1 hoặc Worker 2), hệ thống áp dụng chiến lược định tuyến động dựa vào Redis Room Registry:

Ghi nhận phòng (Room Registration): Khi Host tạo phòng, server game-lobby sẽ tính toán tải của các Worker và chọn một Worker rảnh rỗi (Ví dụ: game-worker-1 chạy port 8081). Lobby ghi thông tin này vào Redis Hash: room:[roomCode]:metadata với trường workerPort: 8081.

Lấy thông tin định tuyến: Khi Client nhận được tín hiệu bắt đầu hoặc bấm tham gia kết nối phòng, Client sẽ truy vấn thông tin phòng từ Lobby API để lấy trường workerPort.

Bắt tay WebSocket trực tiếp qua Nginx: Client tiến hành kết nối WebSocket đến địa chỉ:
wss://domain.com/ws-connect/[workerPort]?room=[roomCode]&player=[playerId]
Nginx Gateway được cấu hình nhận diện tham số cổng và tự động ủy quyền (Reverse Proxy) thẳng về container của Worker tương ứng trong mạng nội bộ Docker. (Chi tiết cấu hình xem tại file nginx.conf).

C. Bản phân phối docker-compose.yml hoàn chỉnh

version: '3.8'

networks:
  game-internal-net:
    driver: bridge # Mạng nội bộ khép kín hoàn toàn, không publish port ra ngoài máy chủ Host để tránh quét cổng

services:
  # Cloudflare Tunnel 1 - Trực tiếp định tuyến dữ liệu & ẩn giấu IP của VPS (Chạy trên Core 0, 1)
  cf-tunnel-1:
    image: cloudflare/cloudflared:latest
    container_name: cf-tunnel-1
    cpuset: "0,1"
    restart: always
    environment:
      - TUNNEL_TOKEN=${CF_TUNNEL_TOKEN_1}
    command: tunnel --no-autoupdate run
    networks:
      - game-internal-net
    depends_on:
      - nginx-gateway

  # Cloudflare Tunnel 2 - Load Balancing tăng tốc truy cập (Chạy trên Core 2, 3)
  cf-tunnel-2:
    image: cloudflare/cloudflared:latest
    container_name: cf-tunnel-2
    cpuset: "2,3"
    restart: always
    environment:
      - TUNNEL_TOKEN=${CF_TUNNEL_TOKEN_2}
    command: tunnel --no-autoupdate run
    networks:
      - game-internal-net
    depends_on:
      - nginx-gateway

  # Nginx Gateway - Định tuyến giao tiếp & quản lý kết nối SSL/WSS nội bộ
  nginx-gateway:
    image: nginx:alpine
    container_name: nginx-gateway
    cpuset: "1" # Chia sẻ core 1 với Next.js App
    restart: always
    volumes:
      - ./infra/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    networks:
      - game-internal-net
    depends_on:
      - home-app
      - game-worker-1
      - game-worker-2

  # Next.js Landing Page & Web Portal (Chỉ định chạy ở Core 1)
  home-app:
    image: ascii-game-home:latest
    container_name: ascii-home
    cpuset: "1"
    restart: always
    networks:
      - game-internal-net

  # Bun Game Worker 1 - Quản lý phòng 1 - 2500 (Chỉ định chạy độc quyền ở Core 2)
  game-worker-1:
    image: ascii-game-server:latest
    container_name: ascii-game-worker-1
    cpuset: "2"
    restart: always
    environment:
      - WORKER_PORT=8081
      - REDIS_URL=redis://redis-state-engine:6379
    networks:
      - game-internal-net
    depends_on:
      - redis-state-engine

  # Bun Game Worker 2 - Quản lý phòng 2501 - 5000 (Chỉ định chạy độc quyền ở Core 3)
  game-worker-2:
    image: ascii-game-server:latest
    container_name: ascii-game-worker-2
    cpuset: "3"
    restart: always
    environment:
      - WORKER_PORT=8082
      - REDIS_URL=redis://redis-state-engine:6379
    networks:
      - game-internal-net
    depends_on:
      - redis-state-engine

  # Redis Engine - In-Memory State Cache (Chỉ định chạy độc quyền ở Core 0)
  redis-state-engine:
    image: redis:alpine
    container_name: redis-state
    cpuset: "0"
    restart: always
    command: redis-server --save "" --appendonly no # Tắt hoàn toàn Disk I/O để tối ưu hóa RAM, loại bỏ thắt nút cổ chai ổ cứng
    networks:
      - game-internal-net


11. CHIẾN LƯỢC PHÒNG CHỐNG THIÊN TAI (DISASTER RECOVERY PLAN)

Do tài khoản Oracle Free Tier có rủi ro bị hệ thống AI quét cấu hình Idling và thu hồi tài nguyên ngẫu nhiên, kiến trúc hệ thống tuân thủ nghiêm ngặt nguyên lý 100% Stateless Server:

Không lưu trữ dữ liệu trên đĩa cứng VPS: Mọi cấu hình hạ tầng mạng, tệp định tuyến Nginx, Token bảo mật Cloudflare được lưu trữ dưới dạng mã nguồn bảo mật (Secret Environment Variables) trong Repository riêng tư trên GitHub.

Khôi phục thảm họa tự động (Zero-Loss RTO $< 60$ giây): Khi VPS bị xóa sổ hoàn toàn, quản trị viên chỉ cần kích hoạt một máy ảo mới trên Oracle (hoặc bất kỳ nhà cung cấp cloud thay thế nào khác), thực hiện đúng $3$ bước:

Cài đặt Docker nhanh:

curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh


Clone mã nguồn bảo mật:

git clone https://github.com/your-organization/my-ascii-game-universe.git && cd my-ascii-game-universe


Khởi động lại toàn bộ Cluster:

docker compose up -d


Hệ thống sẽ tự động pull các cấu hình bí mật, tải các Image Docker mới nhất và tái thiết lập toàn bộ mạng lưới bảo mật nội bộ, khởi động Cloudflare Tunnel trong vòng dưới $60$ giây.

Vì kiến trúc là Stateless, mọi session cũ đã bốc hơi theo VPS cũ, người chơi chỉ cần nhấn F5 trên trình duyệt để kết nối lại, tạo phòng mới và tiếp tục trải nghiệm game ngay lập tức mà không gặp bất kỳ lỗi nghẽn hay phân mảnh dữ liệu nào.

12. HIẾN PHÁP BẢO TRÌ TÀI LIỆU & NGUYÊN TẮC CODE CHUẨN HOÁ (DEV & AGENT CONSTITUTION)

Để đảm bảo dự án không bị suy thoái cấu trúc (code rot) và luôn giữ vững chuẩn mực kiến trúc ban đầu qua các đợt phát triển dài hạn, mọi AI Agent và Developer phải tuân thủ triệt để "Hiến pháp" vận hành sau:

A. Nguyên tắc quản trị cấu trúc Monorepo

Strict Imports: Không một ứng dụng nào trong apps/ được phép import trực tiếp các file từ ứng dụng khác. Giao tiếp chỉ được thực hiện thông qua các packages độc lập thuộc thư mục packages/.

Duy nhất shared-types: Nghiêm cấm tạo thêm thư mục types hay khai báo thủ công interface trong code client/server. Mọi thay đổi về cấu trúc payload mạng đều phải xuất phát từ packages/shared-types. AI Agents khi nhận yêu cầu sửa đổi API WebSocket bắt buộc phải sửa file types này trước, sau đó mới cập nhật logic triển khai.

Độc lập hóa Game Logic: Mã nguồn trong packages/game-logic-* phải là thư viện thuần TypeScript, không chứa bất kỳ mã nguồn WebSocket, Canvas, hay React nào. Điều này đảm bảo logic game có thể viết unit test chạy tự động một cách dễ dàng và nhanh chóng.

B. Quy chuẩn bắt buộc về Cập nhật Đồng bộ Tài liệu

Atomic Documentation Commit (Commit tài liệu nguyên tử): Khi một lập trình viên hoặc AI Agent thay đổi bất kỳ logic cốt lõi nào của game (Ví dụ: Thêm quân lính mới, thay đổi chỉ số sát thương của AoE tại packages/game-logic-aoe, hay thêm lá bài mới cho Uno tại packages/game-logic-uno), bắt buộc phải cập nhật thông tin chi tiết vào file README.md cục bộ của package đó trong cùng một commit.

Cấm Pull Request Không Tài Liệu: Bất kỳ Pull Request nào thay đổi logic game hoặc luồng dữ liệu mạng mà không cập nhật tài liệu kiến trúc tương ứng đều bị hệ thống CI tự động từ chối (Auto-Reject).

Quy chuẩn README cục bộ: Mỗi thư mục con trong packages/ và apps/ bắt buộc phải duy trì một file README.md với các mục tiêu chuẩn sau:

Tổng quan: Vai trò của folder này trong toàn hệ thống.

Kiểu dữ liệu đặc thù: Các kiểu dữ liệu nội bộ được định nghĩa riêng.

Tham số nghiệp vụ (Business Parameters): Các hằng số (Constants) quy định game balance (Máu, dame, cooldown...).

Hướng dẫn Kiểm thử cục bộ (Testing Guide): Lệnh chạy test riêng lẻ cho module đó.

Nhật ký thay đổi (Change Log): Ghi lại lịch sử cập nhật để các dev sau tiện theo dõi.

C. Quy tắc bảo vệ Tính Stateless tuyệt đối

Không lưu trạng thái cục bộ tại RAM của Worker: Mọi biến toàn cục lưu trạng thái phòng chơi (Room State) ở server worker phải được định kỳ đồng bộ sang Redis State Engine. Nếu một worker bị crash và khởi động lại, worker đó phải có khả năng kéo lại trạng thái từ Redis về RAM và tiếp tục vận hành lockstep mà không làm gián đoạn trò chơi.

Tối ưu hóa Disk Write: Redis bắt buộc phải chạy với cờ --save "" để khóa đĩa cứng hoàn toàn. Nghiêm cấm việc ghi các file log kích thước lớn ra ổ đĩa của VPS. Log chỉ được xuất trực tiếp ra stdout để Docker thu gom tập trung, tránh làm hao mòn ổ đĩa SSD của VPS Free Tier.

Chuẩn hóa Ghi Log JSON qua stdout: Mọi log ghi nhận từ Web App, Game Lobby và Game Workers phải được xuất ra stdout dưới dạng JSON chuỗi đơn một dòng (Single-line JSON Stream) có chứa các trường: {"timestamp": "...", "service": "...", "level": "INFO|WARN|ERROR", "message": "...", "roomId": "..."}. Điều này hỗ trợ thu gom log hiệu quả thông qua Docker logging driver mà không làm treo hiệu năng I/O của server.

D. Quy chế Quản lý Danh sách Nhiệm vụ (Tasklist Management)

Để đảm bảo kiểm soát tiến độ và trạng thái phân phối sản phẩm một cách trực quan, tránh các xung đột logic khi có nhiều tác nhân cùng can thiệp vào hệ thống:

Bắt buộc duy trì Tasklist: AI Agent khi bắt tay vào dự án phải đọc, duy trì và cập nhật trạng thái nhiệm vụ tại file /tasks.md hoặc một mục riêng mang tên ## 🛠️ TASKLIST đặt tại file README.md chính ở thư mục gốc của dự án.

Cấu trúc danh sách: Tasklist bắt buộc phải phân tách rõ ràng các đầu việc theo cấu trúc:

Nhiệm vụ cốt lõi (Core Engines)

Ứng dụng (Apps Integration)

Tối ưu hóa & Hạ tầng (Infra & Optimization)

Mỗi nhiệm vụ cần gắn nhãn trạng thái cụ thể: [To-Do] (Chưa làm), [In-Progress] (Đang thực hiện), [Done] (Đã hoàn thành và test), hoặc [Blocked] (Đang bị nghẽn kèm lý do).

Xử lý luồng làm việc của Agent: Trước khi tiến hành sửa đổi code, AI Agent bắt buộc phải bổ sung dòng trạng thái thực thi hiện tại vào Tasklist (Ví dụ: Chuyển đầu mục sửa đổi từ [To-Do] sang [In-Progress]). Sau khi hoàn thành kiểm thử và cập nhật tài liệu đồng bộ thành công, Agent mới được phép chuyển trạng thái nhiệm vụ đó thành [Done].

E. Phòng ngừa Ảo giác & Cấm tuyệt đối tự ý Cắt xén Tài liệu (Anti-Hallucination & Zero-Compression Directive)

Để bảo đảm tính ổn định và sự vững chắc tuyệt đối của hệ thống kiến trúc trước khi bước vào giai đoạn code, mọi AI Agent bắt buộc phải tuân thủ kỷ luật nghiêm ngặt sau:

Chỉ thị Chống Ảo giác (Anti-Hallucination Guardrail):

Cấm AI Agent tự ý suy đoán, "phát minh" ra các API bên thứ ba, các package ảo không tồn tại, hoặc tự ý thay đổi cấu trúc monorepo đã được định hình tại mục 8.

Mọi tham số, cổng giao tiếp, mạng lưới và thư viện toán học phải bám sát cấu trúc thực tế được định nghĩa trong Monorepo. Khi cần thiết lập các interface mới, Agent bắt buộc phải khai báo đầu tiên tại packages/shared-types, đối chiếu nghiêm ngặt và không được tự ý sinh mã bừa bãi mà không có cơ sở hạ tầng bổ trợ.

Chính sách Cấm Cắt xén/Tóm tắt Tài liệu (Strict Zero-Compression Rule):

Tuyệt đối KHÔNG BAO GIỜ được phép tóm tắt, cắt xén, lược bỏ bớt, hay thu gọn bất kỳ phân mục nào của tài liệu này (như sơ đồ mạng, các công thức toán học isometric/lerp, bảng CPU Pinning, cấu trúc monorepo chi tiết hay tệp cấu hình docker compose) dưới danh nghĩa "làm sạch" hoặc "tối giản".

Mọi hành vi làm biến mất thông tin kiến trúc cốt lõi đều được coi là vi phạm nghiêm trọng kỷ luật phát triển và sẽ bị CI tự động từ chối (Auto-Reject). Tài liệu chỉ được phép bồi đắp chi tiết thêm để ngày một hoàn thiện hơn (no knowledge loss).

13. CHIẾN LƯỢC TỐI ƯU HÓA HIỆU NĂNG NÂNG CAO (ADVANCED PERFORMANCE OPTIMIZATION & HORIZONTAL SCALING)

Để hệ thống đạt ngưỡng tối ưu hóa tuyệt đối (Production-Ready), triệt tiêu hoàn toàn hiện tượng nghẽn cổ chai vật lý và mở rộng dễ dàng sang đa cụm máy chủ trong tương lai, toàn bộ mã nguồn phải áp dụng các giải pháp kỹ thuật nâng cao sau đây:

A. Quản lý Bộ nhớ & Object Pooling (Zero-Allocation Loop)

Khi chạy ở tần số tick $15\text{Hz}$ hoặc $30\text{Hz}$ với hàng vạn đơn vị lính và Zombie di chuyển đồng thời, việc liên tục tạo và giải phóng các Object trong JavaScript (Vector2, CommandPayload, EntityState) sẽ tạo ra áp lực cực lớn lên bộ dọn rác Garbage Collector (GC) của JavaScriptCore (Bun). Điều này dẫn đến các đợt GC pause ngẫu nhiên gây giật lag (frame drop/jitter) trên Client và Server.

Quy tắc thiết kế: Nghiêm cấm khởi tạo đối tượng mới (Cấm sử dụng toán tử new, cấm khai báo mảng rỗng [] hay đối tượng rỗng {}) bên trong các vòng lặp tần số cao (Render Loop 60Hz và Logic Tick Loop 15/30Hz).

Giải pháp Object Pooling: Xây dựng các lớp quản lý bộ nhớ đệm đối tượng tái sử dụng (Object Pools) cho các thực thể toán học và logic:

export class Vector2 {
    constructor(public x: number, public y: number) {}
}

export class Vector2Pool {
    private static pool: Vector2[] = [];
    public static acquire(x: number, y: number): Vector2 {
        if (this.pool.length > 0) {
            const vec = this.pool.pop()!;
            vec.x = x; vec.y = y;
            return vec;
        }
        return new Vector2(x, y);
    }
    public static release(vec: Vector2): void {
        this.pool.push(vec);
    }
}


Toàn bộ logic tính toán vector, cập nhật tọa độ lính và phân phối gói tin mạng bắt buộc phải mượn đối tượng từ Pool thông qua phương thức acquire() và trả lại Pool bằng release() ngay sau khi kết thúc chu kỳ tính toán để đạt trạng thái Zero Memory Allocation trong suốt thời gian trận đấu diễn ra.

B. Kiến trúc Mở rộng Ngang Đa Node (Horizontal Scalability Blueprint)

Để phá vỡ giới hạn tài nguyên của một máy chủ VPS Oracle duy nhất và nâng tầm hệ thống đáp ứng trên $100,000+\text{ CCU}$ trong tương lai, hệ thống áp dụng cơ chế điều phối phân tán thông qua Dynamic Service Registry tích hợp trực tiếp trên Redis Engine:

Đăng ký Node Động (Worker Self-Registration): Khi có thêm máy chủ VPS mới hoạt động (Ví dụ: VPS 2 chạy thêm Container game-worker-3 ở port 8083), Worker này khi khởi động sẽ tự động gửi thông tin đăng ký lên Redis Central Cluster:

Thêm IP và Port của mình vào một Redis Hash Set: HSET active_workers worker_3 "{\"ip\": \"vps2-ip\", \"port\": 8083, \"load\": 0}".

Gửi tín hiệu Keep-alive định kỳ mỗi $5$ giây lên Redis với cơ chế TTL (Time-to-Live) để tự động gỡ bỏ Node khỏi hệ thống nếu Node đó bị crash vật lý.

Định tuyến Phòng thông minh (Intelligent Matchmaking): Server game-lobby khi nhận yêu cầu khởi tạo phòng từ trang chủ Next.js sẽ quét danh sách active_workers trên Redis, chọn ra Node đang có số lượng CCU thấp nhất để gán phòng chơi.

Client Direct Connection: game-lobby trả về URL WebSocket đích chứa chính xác IP/Domain của VPS đang chạy Worker đó (Thay vì đi qua một cổng duy nhất). Người chơi kết nối trực tiếp đến Tunnel của VPS được chỉ định, phân phối tải cực kỳ cân bằng và không tạo ra bất kỳ điểm nghẽn trung tâm (Single Point of Failure) nào.

C. Giao thức Đóng gói Nhị phân (Bit-Packed Binary Protocol)

Mặc dù chuỗi ASCII dạng văn bản tĩnh như CMD_MOVE|PLAYER_1|UNIT_ID_12|TARGET_X_2500|TARGET_Y_4000 rất dễ đọc, nhưng khi CCU tăng cao, kích thước gói tin mạng sẽ tích tụ làm hao tổn băng thông và tăng tải I/O. Hệ thống cho phép kích hoạt bộ chuyển đổi sang truyền tải nhị phân thông qua mảng có định kiểu Uint8Array để giảm thiểu tối đa kích thước frame truyền qua mạng.

Quy chuẩn nén cấu trúc gói tin (Schema-based Binary Packing): Mã hóa thông tin điều khiển thành mảng Buffer nhị phân có kích thước cố định (Ví dụ: Chỉ tốn đúng $12\text{ Bytes}$ cho một lệnh di chuyển hoàn chỉnh):

Byte 0: Lệnh ID (Ví dụ: 0x01 cho lệnh di chuyển - $1\text{ Byte}$).

Byte 1: Player ID (Hỗ trợ từ $0 - 255$ - $1\text{ Byte}$).

Bytes 2-3: Unit ID (Hỗ trợ định danh lên tới $65,535$ đơn vị lính - $2\text{ Bytes}$).

Bytes 4-7: Target X (Fixed-point 32-bit Integer - $4\text{ Bytes}$).

Bytes 8-11: Target Y (Fixed-point 32-bit Integer - $4\text{ Bytes}$).

Gói dữ liệu nhị phân này giúp giảm $85\%$ dung lượng truyền tải mạng biên so với văn bản thô, triệt tiêu hoàn toàn chi phí rò rỉ băng thông và giảm tải xử lý chuỗi trên cả Bun Server lẫn trình duyệt Client.

D. Bộ đệm bù trễ mạng Client (Client-Side Jitter Buffer)

Mạng internet của người chơi thực tế không bao giờ ổn định tuyệt đối (gây ra hiện tượng Jitter - các gói tin tick mạng đến dồn dập hoặc ngắt quãng không đều). Nếu Client hiển thị gói tin ngay khi nhận được, chuyển động của lính sẽ bị giật cục.

Cơ chế Jitter Buffer: Client không lập tức áp dụng dữ liệu mạng vừa nhận được vào Logic Loop. Client duy trì một hàng đợi trượt nhỏ lưu trữ từ $2$ đến $3$ tick mạng gần nhất (Tương đương độ trễ chấp nhận được khoảng $66.6\text{ms} - 99.9\text{ms}$).

Nội suy ổn định: Vòng lặp Render $60\text{Hz}$ của Client sẽ rút dữ liệu từ hàng đợi này ra để nội suy (Lerp) một cách đều đặn, mượt mà dựa trên mốc thời gian thực tại của Client. Nếu có một gói tin mạng đến hơi muộn do lag nhẹ, bộ đệm Jitter Buffer sẽ hấphtu hoàn toàn biến động này, giúp chuyển động trên màn hình ASCII Canvas của người chơi luôn mượt mượt ổn định không tì vết.

14. CƠ CHẾ ĐỒNG THUẬN ĐỒNG BỘ CHỦ ĐỘNG CHỐNG DESYNC & GIÁM SÁT METRICS KHÔNG ĐĨA (ACTIVE DESYNC CONSENSUS & STATELESS TELEMETRY)

Để đưa hệ thống lên mức độ tin cậy tuyệt đối tại môi trường Production, triệt tiêu hoàn toàn các hành vi gian lận và phát hiện lỗi lệch pha dữ liệu (Desync) tức thời, hệ thống áp dụng cơ chế xác thực chéo kết hợp giám sát thời gian thực:

A. Đồng thuận Mã băm Trạng thái (FNV-1a Hash State Consensus)

Trong kiến trúc Lockstep, desync là lỗi nghiêm trọng nhất. Để phát hiện lệch pha dữ liệu giữa các người chơi ngay lập tức mà không cần máy chủ phải tốn CPU tính toán mô phỏng vật lý:

Giải pháp: Định kỳ mỗi $150$ Ticks ($10$ giây một lần với game $15\text{Hz}$), Client tự động tính toán mã băm (Checksum) của toàn bộ dữ liệu trạng thái game hiện tại (vị trí lính, lượng máu, tài nguyên lưu trữ dưới dạng fixed-point).

Thuật toán Hash siêu tốc 32-bit FNV-1a (Fowler-Noll-Vo): Thuật toán này không dùng số thực, chạy cực nhanh trực tiếp trên ArrayBuffer trạng thái:

$$hash \leftarrow offset\_basis$$

Với mỗi $byte$ dữ liệu:

$$hash \leftarrow hash \oplus byte$$

$$hash \leftarrow hash \times fnv\_prime$$

(Trong đó các hằng số 32-bit nguyên bản: $fnv\_prime = 16777619$, $offset\_basis = 2166136261$).

Xác thực đồng thuận tại Server: Client gửi mã băm Checksum này kèm gói tin Input kế tiếp lên Bun Server. Server thu thập Checksum từ tất cả Client trong phòng ở Tick đó.

Nếu mã băm của mọi Client trùng khớp $100\%$: Game hoạt động hoàn hảo.

Nếu có Client lệch mã băm so với số đông (Consensus Deviation): Server lập tức phát hiện Client đó bị Desync. Server sẽ tự động kích hoạt Giao thức Tái kết nối & Đuổi kịp Tick (Catch-up & Reconnect) để buộc Client lệch pha tải lại State Snapshot chuẩn từ Redis, ghi đè và tái thiết lập đồng bộ mượt mà mà người chơi không cần thoát game.

B. Gom gói lệnh tại Server (Server-Side Input Aggregation)

Nếu Bun Server lập tức nhận và broadcast từng gói tin Input của từng Client gửi lên một cách bất đồng bộ, hệ thống sẽ gặp hiện tượng nghẽn I/O (Context Switching Overhead) khi CCU lớn.

Giải pháp: Thiết lập hàng đợi Input tạm thời trên Worker cho mỗi phòng chơi. Server không broadcast lệnh ngay lập tức khi nhận được.

Tại mỗi chu kỳ Tick mạng ($33.3\text{ms}$ hoặc $66.6\text{ms}$), Server chạy một vòng lặp sự kiện duy nhất (Unified Tick Loop): Gom toàn bộ Input của tất cả người chơi nhận được trong chu kỳ đó -> Đóng gói thành một gói tin tích hợp duy nhất (Batched Input Frame) -> Gửi duy nhất một lần (Single-pass Broadcast) tới toàn bộ Client trong phòng.

Giải pháp này giúp giảm thiểu tới $90\%$ số lượng WebSocket write calls, giải phóng hoàn toàn hiệu năng xử lý I/O của Bun Engine.

C. Giám sát Metrics Không Đĩa thời gian thực (Stateless Prometheus Telemetry)

Để duy trì cam kết Không ghi đĩa cứng của Redis/Bun và bảo vệ ổ đĩa SSD của VPS Oracle Free Tier, hệ thống không lưu log tệp tin vật lý cồng kềnh. Thay vào đó, Bun Server được tích hợp một Prometheus HTTP Exporter chạy trực tiếp trên RAM:

Endpoint ẩn sau: Bun Game Worker cung cấp một endpoint nội bộ /metrics chỉ cho phép container Prometheus trong Docker Bridge mạng nội bộ tiếp cận.

Chỉ số đo đạc cốt lõi (Core Telemetry Metrics):

game_active_rooms: Số lượng phòng chơi đang hoạt động thời gian thực.

game_connected_players: Số lượng người chơi (CCU) kết nối trực tiếp.

game_tick_latency_ms: Độ lệch thời gian thực tế của vòng lặp Tick Loop so với target ($33\text{ms}$ hoặc $66\text{ms}$). Giúp phát hiện CPU nghẽn cục bộ.

game_desync_events_total: Tổng số sự kiện Desync phát hiện được để cảnh báo lỗi logic game kịp thời.

game_memory_heap_bytes: Dung lượng RAM Bun đang tiêu thụ (Heap Allocation).

Prometheus sẽ định kỳ cào dữ liệu từ endpoint này và hiển thị trực quan lên Grafana Dashboard từ xa, giúp vận hành hệ thống trơn tru mà không tiêu tốn $1\text{ Byte}$ dung lượng đĩa cứng VPS.

15. KIẾN TRÚC MỞ RỘNG ĐA TRÒ CHƠI & HỆ THỐNG CẤU HÌNH ĐỘNG (MULTI-GAME EXTENSIBILITY & DYNAMIC CONFIGURATION ENGINE)

Để biến dự án thành một "Vũ trụ Game ASCII" có cấu trúc chuẩn quốc tế, cho phép mở rộng không giới hạn hàng chục trò chơi mới trong tương lai mà không cần cấu trúc lại lõi server, hệ thống thiết lập một khung kiến trúc mở rộng và quản trị động cực kỳ chặt chẽ:

A. Giao diện Động cơ Game thống nhất (Standardized IGameEngine Interface)

Mọi trò chơi (dù là Turn-based hay Real-time Lockstep) khi tích hợp vào hệ thống đều bắt buộc phải triển khai một Interface chuẩn quốc tế đặt tại packages/shared-types. Bun Server Worker sẽ không xử lý logic game cụ thể, nó chỉ đóng vai trò là một "Container" vận hành các instance lớp triển khai Interface này:

export interface GameRoomConfig {
  roomId: string;
  gameId: string;
  maxPlayers: number;
  seed: number;
}

export interface PlayerMetadata {
  playerId: string;
  username: string;
}

export interface IGameEngine<TState, TInput> {
  /** Khởi tạo trạng thái ban đầu của game từ cấu hình phòng */
  initialize(roomConfig: GameRoomConfig): TState;

  /** 
   * Trái tim của Lockstep: Nhận trạng thái cũ và danh sách lệnh gom được trong tick 
   * để sinh ra trạng thái mới (Pure function, Fixed-Point Math)
   */
  update(currentState: TState, batchInputs: TInput[], currentTick: number): TState;

  /** Kiểm dịch lệnh đầu vào của một người chơi trước khi gom queue */
  validateInput(player: PlayerMetadata, input: TInput, currentState: TState): boolean;

  /** Nén trạng thái cực đại để tạo Snapshot phục vụ Reconnect */
  serializeState(state: TState): ArrayBuffer;

  /** Giải nén trạng thái Snapshot khi Client Catch-up */
  deserializeState(buffer: ArrayBuffer): TState;
}


Nhờ mô hình Abstraction này, khi muốn tạo một game mới, nhà phát triển chỉ cần tạo một Package logic mới implement IGameEngine (ví dụ: packages/game-logic-chess) và đăng ký nó với bộ sinh Engine (GameEngineFactory) trên Server.

B. Hệ thống Cấu hình Động Tập Trung (packages/game-configs)

Tuyệt đối cấm viết cứng (hard-code) các tham số nghiệp vụ như số người chơi tối đa, kích thước bản đồ, tick rate hay chỉ số cân bằng của đơn vị. Toàn bộ thông số cấu hình được khai báo tập trung dưới dạng Declarative TypeScript Configs trong packages/game-configs:

export interface GameRegistryConfig {
  gameId: string;
  gameTitle: string;
  gameType: 'TURN_BASED' | 'LOCKSTEP_REALTIME';
  tickRateHz: number;             // Tần số chạy logic (15Hz cho RTS, 30Hz cho Action, 0 cho Turn-based)
  maxPlayers: number;             // Số người chơi tối đa trong một phòng
  maxRoomsAllowed: number;        // Giới hạn phòng tối đa cho game này trên toàn hệ thống
  mapDimensions?: { x: number; y: number }; // Kích thước lưới fixed-point
  balanceSheet: Record<string, any>; // Các hằng số cân bằng (Máu, dame, lá bài, tốc độ...)
}

export const GlobalGameRegistry: Record<string, GameRegistryConfig> = {
  "uno": {
    gameId: "uno",
    gameTitle: "ASCII Uno Boardgame",
    gameType: "TURN_BASED",
    tickRateHz: 0, // Không chạy Lockstep Loop liên tục, kích hoạt theo tương tác Client
    maxPlayers: 10,
    maxRoomsAllowed: 1000,
    balanceSheet: {
      initialCardsPerPlayer: 7,
      drawPenaltyCount: 2,
      wildPenaltyCount: 4,
    }
  },
  "zombie-invasion": {
    gameId: "zombie-invasion",
    gameTitle: "Zombie Invasion CO-OP",
    gameType: "LOCKSTEP_REALTIME",
    tickRateHz: 30, // 33.3ms chu kỳ để đạt phản xạ mượt mà
    maxPlayers: 4,
    maxRoomsAllowed: 500,
    mapDimensions: { x: 50000, y: 50000 }, // Kích thước fixed-point (Tương ứng phẳng 500x500)
    balanceSheet: {
      maxZombiesCount: 10000,
      heroMoveSpeed: 1500, // Fixed-point speed
      zombieSpawnIntervalMs: 5000,
    }
  },
  "aoe-1": {
    gameId: "aoe-1",
    gameTitle: "Age of Empires 1 ASCII Edition",
    gameType: "LOCKSTEP_REALTIME",
    tickRateHz: 15, // 66.6ms chu kỳ theo chuẩn AoE cổ điển
    maxPlayers: 8,
    maxRoomsAllowed: 1000,
    mapDimensions: { x: 120000, y: 120000 }, // Fixed-point
    balanceSheet: {
      villagerGatherRate: 100, // fixed-point
      clubmanHealth: 45000,   // HP 45
      clubmanAttack: 3000,     // Dame 3
    }
  }
};


Giao diện Lobby UI (/lobby/[gameId]) và WebSocket server tự động đọc cấu hình này để thiết lập phòng chơi động, hiển thị số slot ghế trống, và quản lý phòng chờ mượt mà.

C. Lộ trình 4 Trò chơi Ưu tiên (Easiest-to-Hardest Roadmap)

Hệ thống được phát triển theo lộ trình từ các trò chơi có logic State-machine đơn giản đến các game RTS cực kỳ phức tạp để đảm bảo kiểm thử và hoàn thiện lõi truyền tin từng bước một:

1. Uno Game (Độ khó: Dễ)

Kiến trúc: Game bài dạng Turn-based (Chạy theo lượt). Trạng thái game là một State Machine hữu hạn (Finite State Machine).

Truyền tin: Không chạy Lockstep Loop định kỳ. Server chỉ broadcast gói tin khi người chơi bấm nút đánh bài hoặc rút bài (ACT_DISCARD, ACT_DRAW).

Đặc trưng: Hoàn hảo để test cơ chế Dynamic Room Routing, Lobby, Matchmaking và Tái kết nối (Catch-up Snapshot) cơ bản.

2. Zombie Invasion (Độ khó: Trung bình)

Kiến trúc: Game hành động CO-OP phòng thủ thời gian thực chạy Tick Rate $30\text{Hz}$.

Công nghệ cốt lõi: Flow Field Pathfinding (Trường vector hướng) gánh hàng vạn Zombie di chuyển về phía người chơi, triệt tiêu hoàn toàn CPU lag.

Hoạt ảnh: Áp dụng kỹ thuật tráo khung hoạt ảnh ASCII đơn giản (2 frames di chuyển của Zombie).

3. Age Of Empires 1 (Độ khó: Khó)

Kiến trúc: Game RTS truyền thống chạy Tick Rate $15\text{Hz}$.

Công nghệ cốt lõi: Quản lý nhiều loại thực thể (Quân lính, tiều phu, mỏ tài nguyên, nhà cửa), cơ chế Fog of War (Sương mù chiến trận) vẽ trên Canvas 1, thuật toán va chạm lính bằng lưới tọa độ phẳng và AI tự động khai thác tài nguyên.

Hoạt ảnh: Thư viện ASCII Sprite đồ sộ cho từng loại quân lính (Nông dân đốn củi, lính rìu chém kiếm) với đầy đủ hướng quay Isometric ($8$ góc hướng chéo).

4. StarCraft (Độ khó: Rất khó)

Kiến trúc: Game RTS không gian tốc độ cao chạy Tick Rate $15\text{Hz}$.

Công nghệ cốt lõi: Khác biệt hoàn toàn về cơ cấu chủng tộc (Terran, Zerg, Protoss) dẫn đến logic State khác nhau hoàn toàn trên cùng một map. Áp dụng cơ chế va chạm đơn vị mật độ cực cao (Flocking & Collision Avoidance nâng cao) cho các đơn vị lính bay (Mutalisk, Wraith), lính bắn tầm xa với đạn đạo định phẩy riêng biệt.

Hoạt ảnh: Các mô hình tàu chiến, quái thú Zerg kích thước lớn được render lồng ghép tinh xảo từ hàng trăm ký tự ASCII đơn lẻ di chuyển siêu mượt trên GPU canvas lớp Foreground.

5. Khả năng mở rộng vô hạn (Extensible Slot)

Cấu trúc monorepo sẵn sàng cho các trò chơi số $5$, $6$, $7$ (ví dụ: ASCII Chess, Bomberman Clone, Zombie MMO...) chỉ bằng cách khai báo thêm config tại GlobalGameRegistry và cài đặt package logic game tương thích với IGameEngine.

D. Nguyên tắc Tái Sử dụng Logic (Logic Reusability Mandate)

Nghiêm cấm viết lặp lại các thuật toán cơ bản. Dự án duy trì các Core Package độc lập hoàn toàn để tái sử dụng $100\%$ mã nguồn:

packages/core-math: Phải chứa toàn bộ các hàm toán học định phẩy dùng chung (Isometric conversions, fixed-point vector calculations, deterministic PRNG seed generators). Cả game AoE và StarCraft đều bắt buộc phải import chung thư viện Isometric này để đồng bộ ma trận vẽ màn hình.

packages/lockstep-engine: Đóng gói sẵn vòng lặp Tick rate chung. Cả client (dùng để nội suy vị trí) và server (dùng để gom và batch inputs) đều thừa kế từ module loop chuẩn hóa này.

packages/shared-types: Khai báo các interface nền tảng cho mạng. Server game-lobby chỉ xử lý các packet cơ bản (REQ_JOIN, ROOM_UPDATE, SERVER_REDIRECT), giảm thiểu tối đa mã nguồn lặp ở các server worker chuyên biệt.
