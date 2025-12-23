# Frontend Structure

Cấu trúc thư mục được tổ chức theo chuẩn best practices cho React/TypeScript project.

## 📁 Cấu trúc thư mục

```
src/
├── assets/              # Static assets (images, icons, etc.)
├── components/          # Reusable UI components
│   └── ui/             # Base UI components (Shadcn/UI)
├── constants/           # Application constants
│   ├── api.constants.ts
│   └── storage.constants.ts
├── features/            # Feature-based modules
│   └── auth/           # Authentication feature
│       ├── components/  # Auth-specific components
│       └── schemas/     # Auth validation schemas
├── pages/               # Page components
├── services/            # API services
│   ├── api.service.ts   # Base API service
│   └── auth.service.ts  # Auth API service
├── types/               # TypeScript type definitions
│   ├── api.types.ts
│   └── auth.types.ts
└── utils/               # Utility functions
    ├── cn.util.ts       # Class name utility
    └── storage.util.ts  # LocalStorage utilities
```

## 📋 Mô tả các thư mục

### `components/`
Chứa các reusable UI components. Thư mục `ui/` chứa base components từ Shadcn/UI.

### `features/`
Tổ chức code theo feature/module. Mỗi feature có:
- `components/`: Components riêng của feature
- `schemas/`: Validation schemas (Zod)
- `hooks/`: Custom hooks (nếu có)
- `types/`: Type definitions riêng (nếu có)

### `services/`
Chứa các API service functions:
- `api.service.ts`: Base API client với error handling
- `auth.service.ts`: Auth-related API calls

### `types/`
TypeScript type definitions:
- `api.types.ts`: API response types, ApiError
- `auth.types.ts`: Auth-related types (User, LoginResponse, etc.)

### `constants/`
Application constants:
- `api.constants.ts`: API endpoints, base URL
- `storage.constants.ts`: LocalStorage keys

### `utils/`
Utility functions:
- `cn.util.ts`: Tailwind class name merger
- `storage.util.ts`: LocalStorage helpers

### `pages/`
Page-level components (routes).

## 🔄 Import Paths

Sử dụng path aliases (`@/`) để import:
- `@/components` → `src/components`
- `@/features` → `src/features`
- `@/services` → `src/services`
- `@/types` → `src/types`
- `@/utils` → `src/utils`
- `@/constants` → `src/constants`

## 📝 Best Practices

1. **Feature-based organization**: Mỗi feature được tổ chức trong `features/`
2. **Separation of concerns**: Services, types, utils được tách riêng
3. **Reusable components**: UI components trong `components/ui/`
4. **Type safety**: Tất cả types được định nghĩa trong `types/`
5. **Constants**: Magic strings/numbers được đưa vào `constants/`

