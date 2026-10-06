# Quản lý bài tập

Ứng dụng React + TypeScript để quản lý bài tập, theo dõi hạn nộp và xem thống kê.

## Chạy ứng dụng

```sh
npm install
npm run dev
```

Thêm `?stress=1` vào URL để tải sẵn 10.000 bài tập khi kiểm tra hiệu năng. Trong ứng dụng, nút **Tạo 10.000 bài tập mẫu** cũng bật chế độ này.

## Kiểm thử và build

```sh
npm test
npm run test:coverage
npm run build
```

Coverage statements cho `src/features/` được yêu cầu tối thiểu 70%. Kết quả đo và cách profiling được ghi trong [PERFORMANCE.md](./PERFORMANCE.md).
