# LeadFlow CRM — Omnichannel Lead Management (MVP)

Hệ thống quản lý khách hàng tiềm năng (Leads) đa kênh thời gian thực. Dự án được thiết kế để giải quyết bài toán phân tán tin nhắn/đơn hàng từ nhiều nền tảng (Facebook Messenger, Zalo OA, TikTok Shop) về một Dashboard duy nhất, giúp các doanh nghiệp SME/Agencies không bị bỏ sót khách hàng.

## 🚀 Tính năng nổi bật (MVP)

- **🔐 Xác thực bảo mật cao:** Đăng nhập, phân quyền với JWT kết hợp `HttpOnly Cookie` và Next.js Middleware.
- **⚡ Realtime Synchronization:** Lắng nghe và cập nhật trạng thái leads ngay lập tức thông qua `Socket.IO`.
- **📊 Quản lý trung tâm:** Dashboard theo dõi trạng thái khách hàng (Mới, Đang chờ, Đã chuyển đổi...).
- **🗄️ Hiệu năng cao:** Phân trang, tìm kiếm, và tối ưu bộ nhớ đệm phía client với `TanStack Query`.

---

## 🛠️ Tech Stack

Dự án theo kiến trúc **Monorepo** quản lý bởi [Turborepo](https://turbo.build/repo) + [pnpm](https://pnpm.io/).

### Backend (`apps/api`)

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL · **ORM:** Prisma
- **Realtime:** `@nestjs/websockets` (Socket.IO)
- **Authentication:** Passport · JWT (`HttpOnly Cookie`) · bcrypt
- **Docs:** Swagger / OpenAPI
- **Logging:** Winston + winston-daily-rotate-file

### Frontend (`apps/web`)

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript · React 19
- **Styling:** Tailwind CSS v4 · shadcn/ui · Radix UI
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query v5)
- **Realtime:** socket.io-client
- **Forms & Validation:** React Hook Form + Zod v4
- **Utilities:** date-fns · lucide-react · Sonner (toast)

---

## 📁 Cấu trúc thư mục (Monorepo)

```text
lead-flow/
├── apps/
│   ├── api/                  # NestJS Backend — REST API & WebSocket Gateway
│   ├── web/                  # Next.js 16 Frontend — Dashboard chính
├── packages/
│   ├── types/                # @repo/types — Shared TypeScript interfaces & types
│   ├── eslint-config/        # @repo/eslint-config — Cấu hình ESLint dùng chung
│   ├── prettier-config/      # @repo/prettier-config — Cấu hình Prettier dùng chung
│   └── typescript-config/   # @repo/typescript-config — tsconfig.json base dùng chung
├── turbo.json                # Cấu hình Turborepo (pipeline build/dev/lint/test)
├── pnpm-workspace.yaml       # Khai báo workspace pnpm
└── package.json
```

### Apps

| App        | Mô tả                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `apps/api` | NestJS REST API & WebSocket server. Prisma + PostgreSQL, JWT auth, Swagger, Winston logging.                       |
| `apps/web` | Next.js 16 frontend (ứng dụng chính). React 19, TanStack Query, Zustand, shadcn/ui, Socket.IO client, Tailwind v4. |

### Packages

| Package                   | Mô tả                                                                 |
| ------------------------- | --------------------------------------------------------------------- |
| `@repo/types`             | Shared TypeScript type definitions dùng chung giữa `api` và `web`.    |
| `@repo/eslint-config`     | Cấu hình ESLint v9 chia sẻ (typescript-eslint, prettier integration). |
| `@repo/prettier-config`   | Cấu hình Prettier chia sẻ toàn monorepo.                              |
| `@repo/typescript-config` | Các `tsconfig.json` base chia sẻ toàn monorepo.                       |

---

## 🚀 Bắt đầu

### Yêu cầu

- Node.js ≥ 20
- pnpm ≥ 9
- PostgreSQL

### Cài đặt

```sh
# Cài dependencies toàn bộ workspace
pnpm install

# Khởi động tất cả apps ở chế độ dev
pnpm dev

# Hoặc chạy từng app riêng lẻ
pnpm --filter api dev
pnpm --filter web dev
```

### Các lệnh phổ biến

```sh
pnpm build        # Build tất cả apps & packages
pnpm lint         # Lint toàn bộ codebase
pnpm type-check   # Kiểm tra TypeScript

# Prisma (chạy trong apps/api)
pnpm --filter api db:seed   # Seed dữ liệu
```
