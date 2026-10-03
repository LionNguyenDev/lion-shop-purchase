# Lion Shopping

Trang bán hàng đơn giản: khách đăng ký tài khoản, nhập mật khẩu cửa hàng do admin cấp để vào mua, đặt hàng thanh toán khi nhận hàng (COD). Admin quản lý sản phẩm, danh mục, đơn hàng và người dùng.

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router, Route Handlers) + React 19 + TypeScript
- [MongoDB](https://www.mongodb.com/) với [Mongoose](https://mongoosejs.com/) cho dữ liệu cửa hàng
- [Better Auth](https://www.better-auth.com/) cho đăng ký/đăng nhập, phiên đăng nhập và OTP quên mật khẩu (sẵn chỗ cho Google login)
- [TanStack Query 5](https://tanstack.com/query) + Axios, [React Hook Form](https://react-hook-form.com/) + [Zod 4](https://zod.dev/) (schema dùng chung client/server)
- Tailwind CSS 3, Radix UI (Dialog, Dropdown), lucide-react, sonner
- Nodemailer (SMTP) để gửi OTP, Cloudinary để lưu ảnh sản phẩm
- Địa chỉ: [provinces.open-api.vn](https://provinces.open-api.vn) v2, đơn vị hành chính mới (34 tỉnh/thành → phường/xã)
- Biome, Husky, lint-staged, commitlint, Docker + Nginx

UI theo design system sinh bởi skill [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (cài ở `.claude/skills/`, chỉ áp dụng cho project này). Token và các điều chỉnh nằm ở `design-system/lion-shopping/MASTER.md`.

## Chức năng

**Khách hàng**

- Đăng ký (tên, email, mật khẩu, nhắc lại mật khẩu, số điện thoại, link Facebook), đăng nhập, quên mật khẩu bằng OTP 6 số gửi qua email (hết hạn 10 phút, tối đa 5 lần nhập sai)
- Đăng ký xong chỉ ở landing page. Bấm "Vào cửa hàng" sẽ hiện dialog nhập mật khẩu cửa hàng. Nhập đúng một lần thì giữ quyền cho tới khi admin thu hồi
- Cửa hàng: lọc theo danh mục, tìm kiếm không dấu ("ao" khớp "Áo"), lọc khoảng giá, chỉ còn hàng, sắp xếp, phân trang. Bộ lọc lưu trên URL
- Giỏ hàng lưu trong DB, kiểm tra tồn kho khi thêm/sửa số lượng
- Đặt hàng: tên, SĐT, link Facebook (điền sẵn từ tài khoản), tỉnh/thành → phường/xã lấy từ API, số nhà, ghi chú. Kho được trừ an toàn khi nhiều người đặt cùng lúc
- Xem đơn của mình, huỷ đơn khi còn "Chờ xác nhận" (hoàn lại kho)

**Admin** (`/admin`)

- Tổng quan: doanh thu, số user, sản phẩm ẩn/hết hàng, đơn theo trạng thái
- Sản phẩm: CRUD, bật/tắt hiển thị, upload ảnh lên Cloudinary (kéo thả, nhiều ảnh, chọn ảnh chính) hoặc dán link
- Danh mục: CRUD (không xoá được danh mục còn sản phẩm)
- Đơn hàng: lọc theo trạng thái, tìm theo mã/tên/SĐT, xem chi tiết, chuyển trạng thái `Chờ xác nhận → Đã xác nhận → Đang giao → Hoàn thành`, huỷ ở bất kỳ bước nào trước khi hoàn thành (hoàn lại kho)
- Người dùng: danh sách, tìm kiếm, thu hồi quyền vào cửa hàng
- Cài đặt: đặt/đổi mật khẩu cửa hàng và xem lại mật khẩu hiện tại. Đổi mật khẩu sẽ thu hồi quyền của tất cả khách, họ phải nhập mật khẩu mới

## Bắt đầu

### Yêu cầu

- Node.js >= 20, pnpm 10 (`corepack enable`)
- MongoDB (Atlas hoặc local). Không cần replica set

> **Windows:** đặt line ending LF trước khi clone để git hooks chạy được:
>
> ```bash
> git config --global core.eol lf
> git config --global core.autocrlf input
> ```

### Cài đặt

```bash
pnpm install
cp .env.example .env      # rồi điền các biến bên dưới
pnpm seed:admin           # tạo tài khoản admin từ ADMIN_EMAIL / ADMIN_PASSWORD
pnpm seed:demo            # (tuỳ chọn) thêm vài danh mục + sản phẩm mẫu
pnpm dev
```

Sau đó đăng nhập bằng tài khoản admin, vào **Quản trị → Cài đặt** để đặt mật khẩu cửa hàng. Khi chưa có mật khẩu thì khách chưa vào được cửa hàng.

`pnpm seed:admin` cũng dùng để nâng một tài khoản đã đăng ký lên admin: đặt `ADMIN_EMAIL` là email đó rồi chạy lại.

### Biến môi trường

| Biến | Mô tả |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | URL public của app, ví dụ `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Base URL cho Axios, mặc định `/api` |
| `MONGODB_URI` | Chuỗi kết nối MongoDB (có tên database) |
| `BETTER_AUTH_SECRET` | Secret ký session, tạo bằng `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | URL app dùng cho auth, giống `NEXT_PUBLIC_APP_URL` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | SMTP gửi OTP. Để trống `SMTP_HOST` khi dev thì OTP được in ra console của server |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER` | Upload ảnh sản phẩm. Trình duyệt upload thẳng lên Cloudinary bằng chữ ký do server cấp (chỉ admin), URL ảnh được lưu vào `product.images` |
| | API key phải có quyền upload (tạo asset). Nếu upload báo `missing permissions (actions=["create"])` thì key đang bị giới hạn quyền, dùng key có role Master Admin |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Dùng cho `pnpm seed:admin` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google login (sau này). Có giá trị thì provider tự bật phía server |

Với Gmail: bật xác minh 2 bước rồi tạo [App Password](https://myaccount.google.com/apppasswords), dùng `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server with Turbopack |
| `pnpm build` | Build for production (standalone output) |
| `pnpm start` | Start the production server |
| `pnpm seed:admin` | Create or promote the admin account |
| `pnpm seed:demo` | Insert demo categories and products into an empty catalog |
| `pnpm lint` / `pnpm lint:fix` | Lint with Biome |
| `pnpm format:check` / `pnpm format:fix` | Check / fix formatting |
| `pnpm type-check` | Type-check with `tsc --noEmit` |

## Project structure

```
src/
├── api/              # Axios client + React Query hooks (shop.ts, admin.ts), response types
├── app/
│   ├── (auth)/       # /login, /register, /forgot-password
│   ├── shop/         # Khu mua hàng: layout chặn user chưa nhập mật khẩu cửa hàng
│   ├── admin/        # Khu quản trị: layout chặn user không phải admin
│   ├── api/          # Route handlers (auth, shop, cart, orders, address, admin/*)
│   └── page.tsx      # Landing page
├── components/       # ui/ (button, input, dialog...), layout/, shop/, admin/, auth/
├── config/           # App config, site metadata, fonts
├── lib/              # validations (Zod, dùng chung), auth-client, routes, format, text
├── server/           # Chỉ chạy phía server
│   ├── auth.ts       # Cấu hình Better Auth
│   ├── session.ts    # requireUser / requireShopUser / requireAdmin
│   ├── shop-access.ts# Mật khẩu cửa hàng
│   ├── models/       # Mongoose: user (view của collection Better Auth), product, category, cart, order, setting
│   └── services/     # Logic sản phẩm, giỏ hàng, đơn hàng
└── middleware.ts     # Chuyển khách chưa đăng nhập ở /shop, /admin về /login
scripts/              # seed-admin.ts, seed-demo.ts, db-backup.sh, db-restore.sh, backup-crypto.mjs
design-system/        # Design system từ ui-ux-pro-max
```

Phân quyền thật sự nằm ở layout (server) và từng API handler. Middleware chỉ kiểm tra nhanh cookie.

## Backup & khôi phục dữ liệu

Atlas gói free không có backup tự động, nên repo dùng GitHub Actions để backup hằng ngày.

- **`Database backup`** ([.github/workflows/db-backup.yml](.github/workflows/db-backup.yml)): chạy 01:00 giờ Việt Nam mỗi ngày (hoặc bấm **Run workflow**). Chạy `mongodump`, **mã hoá AES-256-GCM** bằng `BACKUP_PASSPHRASE`, rồi lưu thành artifact `db-backup-<run id>` (giữ 30 ngày, đổi bằng biến `BACKUP_RETENTION_DAYS`, tối đa 90). Repo public nên ai cũng tải được artifact, nhưng không có passphrase thì không đọc được.
- **`Database restore`** ([.github/workflows/db-restore.yml](.github/workflows/db-restore.yml)): chạy tay, khôi phục backup mới nhất (hoặc theo run ID) vào database trong secret `RESTORE_MONGODB_URI`. Phải gõ `RESTORE` để xác nhận. Collection trùng tên trong database đích sẽ bị xoá và thay thế.

### Cài đặt (một lần)

Vào repo GitHub → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Giá trị |
| --- | --- |
| `MONGODB_URI` | Chuỗi kết nối database đang chạy (có tên database, ví dụ `.../lion-shop-purchase?...`) |
| `BACKUP_PASSPHRASE` | Chuỗi ngẫu nhiên ≥ 16 ký tự, tạo bằng `openssl rand -base64 32`. **Lưu vào trình quản lý mật khẩu**, mất là không giải mã được backup |
| `RESTORE_MONGODB_URI` | Chỉ cần khi khôi phục: chuỗi kết nối database mới |

Atlas: thêm `0.0.0.0/0` vào **Network Access**, vì runner của GitHub không có IP cố định.

### Khi mất database

1. Tạo cluster / database mới, lấy connection string (tên database có thể khác database cũ).
2. Lưu nó vào secret `RESTORE_MONGODB_URI`, chạy workflow **Database restore** với `confirm = RESTORE`.
3. Đổi `MONGODB_URI` của app (Vercel và `.env`) sang database mới. Giữ nguyên `BETTER_AUTH_SECRET` cũ để khách không bị đăng xuất và vẫn xem được mật khẩu cửa hàng. Mật khẩu của user không phụ thuộc secret này.
4. Cập nhật secret `MONGODB_URI` để backup tiếp tục chạy với database mới.

Khôi phục trên máy (cần `brew install mongodb-database-tools` và Node): tải artifact về, giải nén, rồi chạy

```bash
RESTORE_MONGODB_URI="mongodb+srv://.../ten-database?..." BACKUP_PASSPHRASE="..." \
  scripts/db-restore.sh lion-shop-2026-10-03T180000Z.archive.enc
```

Backup thủ công trên máy: `MONGODB_URI=... BACKUP_PASSPHRASE=... scripts/db-backup.sh backups`.

Lưu ý: GitHub tự tắt workflow theo lịch của repo public nếu 60 ngày không có commit nào. Thỉnh thoảng nên tải một bản backup về lưu riêng (Google Drive...), phòng khi mất cả tài khoản GitHub.

## Git conventions

- **pre-commit:** lint-staged runs `biome lint --write` and `biome format --write` on staged files.
- **commit-msg:** commitlint enforces [Conventional Commits](https://www.conventionalcommits.org/). Allowed types: `feat`, `fix`, `docs`, `chore`, `style`, `refactor`, `ci`, `test`, `revert`, `perf`, `release`.

```bash
git commit -m "feat: add login page"
```

## CI

The GitHub Actions workflow in `.github/workflows/lint.yml` runs lint, type-check and a format check on pull requests to `main` and `dev`.

## Docker

```bash
cp .env.example .env
docker compose up --build
```

This builds the Next.js app (standalone output) and puts an Nginx reverse proxy in front of it at [http://localhost:8080](http://localhost:8080).

## Author

Made by Lưu Nguyễn Danh ([luund206@gmail.com](mailto:luund206@gmail.com))
