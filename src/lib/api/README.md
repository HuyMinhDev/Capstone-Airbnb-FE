# API Services

Thư viện API được tổ chức để dễ dàng import và sử dụng trong ứng dụng.

## Cấu trúc thư mục

```
src/lib/api/
├── config.ts          # Cấu hình API và endpoints
├── client.ts          # Axios client và interceptors
├── services/          # Các service API riêng biệt
│   ├── auth.ts       # Authentication API
│   ├── images.ts     # Images API
│   └── users.ts      # Users API
├── index.ts          # Export tất cả services
└── README.md         # Hướng dẫn sử dụng
```

## Cách sử dụng

### 1. Import toàn bộ API services

```typescript
import api from "@/lib/api";

// Sử dụng auth API
const loginResponse = await api.auth.login({ email, password });

// Sử dụng images API
const images = await api.images.list();

// Sử dụng users API
const profile = await api.users.profile();
```

### 2. Import từng service riêng lẻ

```typescript
import { authApi, imagesApi, usersApi } from "@/lib/api";

// Auth
const loginResponse = await authApi.login({ email, password });
const user = await authApi.me();

// Images
const images = await imagesApi.list({ name: "search term" });
const image = await imagesApi.detail(1);
const newImage = await imagesApi.create({ name: "My Image", file: imageFile });

// Users
const profile = await usersApi.profile();
const savedImages = await usersApi.savedImages();
```

### 3. Import utilities

```typescript
import { tokenStorage, handleApiError, API_CONFIG } from "@/lib/api";

// Token management
tokenStorage.set({ accessToken: "token", refreshToken: "refresh" });
const tokens = tokenStorage.get();
tokenStorage.clear();

// Error handling
try {
  await api.auth.login(credentials);
} catch (error) {
  const apiError = handleApiError(error);
  console.error(apiError.message);
}
```

## Các tính năng

### ✅ Automatic Token Management

- Tự động thêm Bearer token vào headers
- Tự động refresh token khi hết hạn
- Tự động logout khi refresh token hết hạn

### ✅ Error Handling

- Xử lý lỗi network và server
- Interceptor để refresh token
- Utility function để format error

### ✅ TypeScript Support

- Đầy đủ type definitions
- Type safety cho tất cả API calls
- IntelliSense support

### ✅ Environment Configuration

- Cấu hình base URL từ environment variables
- Timeout và headers configuration

## Environment Variables

Thêm vào file `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

## Ví dụ sử dụng trong component

```typescript
"use client";

import { useState, useEffect } from "react";
import { imagesApi, handleApiError } from "@/lib/api";
import type { Image } from "@/lib/api";

export default function ImagesList() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await imagesApi.list();
        setImages(response.data);
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {images.map((image) => (
        <div key={image.id}>
          <h3>{image.name}</h3>
          <img src={image.url} alt={image.name} />
        </div>
      ))}
    </div>
  );
}
```
