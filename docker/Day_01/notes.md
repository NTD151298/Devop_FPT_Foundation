notes:

- slide 1: Chào mừng và giới thiệu module
- slide 2: Giới thiệu nội dung bài giảng
- slide 3: Sự phát triển của Docker
- slide 4: Đưa ra câu hỏi tại sao lại có sự phát triển mạnh mẽ như thế?
- slide 5: Các vấn đề mà Docker xử lý
  - Đơn giản hóa việc quản lý dependencies and đảm bảo tính nhât quán giữa các môi trường trong quá trình phát triển và triển khai ứng dụng
    VD: 
    - Trong dự án phần mềm có 3 môi trường: dev và staging
    - Với môi trường staging, các app yêu cầu sự ổn định cao, các dependencies ít khi thay đổi
    - Với môi trường dev, các app liên tục cập nhật tính năng mới, các dependencies cũng thay đổi theo.
    - Docker giúp đơn giản hóa việc quản lý các dependencies ở các môi trường khác nhau: môi trường dev sẽ có Docker container sử dụng code của môi trường dev và tương tự với môi trường staging.
  - Đảm bảo ứng dụng được chạy độc lập và xử lý xung đột giữa các dependencies
    VD:
    - Trên một server đang có một microservice chạy bằng NodeJS v18. Một microservice mới được yêu cầu triển khai trên server này nhưng chạy bằng NodeJS v16. 
    - Docker giải quyết bài toán bằng cách tạo ra 2 môi trường riêng biệt cho 2 microservice tương ứng với 2 container. Mỗi container sẽ chứa dependencies dành cho một microservice.
  - Hỗ trợ triển khai ứng dụng đa nền tảng
    VD: 
    - Khi sử dụng laptop cá nhân để develop applications, developer sử dụng hệ điều hành Ubuntu 18.04 và code Java. Nhưng khi triển khai ứng dụng trên server, chỉ có server Ubuntu 22.04.
    - Docker sẽ giúp developer tạo ra một môi trường tách biệt sử dụng phiên bản giống với server và phát triển code trên môi trường này.