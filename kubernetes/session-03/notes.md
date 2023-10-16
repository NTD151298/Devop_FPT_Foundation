notes:
- slide 4:
  - Note for apiVersion: K8s có rất nhiều API version, ở mỗi version thì API object có thể có các thay đổi và cập nhật, nên sẽ có apiVersion để chỉ định rõ version nào của API object đang được sử dụng.

- slide 8:
  - **DEMO**: Tạo namespace mới 

- slide 10:
  - **DEMO**: Tạo pod trên namespace mới 

- slide 12:
  - **DEMO**:
    - Thêm label cho node 
    - Tạo file manifest cho Pod sử dụng `--dry-run=client`
    - Thêm nodeSelector vào file vừa tạo và sử dụng file manifest đó để tạo Pod

- slide 15:
  - **DEMO**:
    - Tạo thêm một pod 
    - Đảm bảo hai pod đã tạo có cùng labels
    - Tạo ClusterIP service để expose hai pod đã tạo

- slide 17: 
  - **DEMO**:
    - Tạo NodePort service để expose hai pod đã tạo
- slide 18:
  - **DEMO**:
    - Tạo LoadBalancer service 