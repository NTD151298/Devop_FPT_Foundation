# Session 5: Volume, Storage, ConfigMap, and Secret

## Slide notes
- slide 7:
  - **DEMO**: Tạo emptyDir pod với file manifest chuẩn bị sẵn. Pod này lỗi do không tìm thấy command `curl`. Trong khoảng thời gian Pod vẫn chạy thì thêm data vào volume `emptyDir`. Lần tiếp theo container restart kiểm tra xem data được thêm vào còn tồn tại không.
- slide 8:
  - **DEMO**: Tạo hostPath pod với file manifest chuẩn bị sẵn. Pod này in ra danh sách file trong thư mục mount bởi volume `hostPath`. Exec vào node provision Pod, tạo file mới vào thư mục của volume vừa tạo và kiểm tra log của pod.
- slide 11:
  - **DEMO**: Show StorageClass của Kind
- slide 13:
  - **DEMO**: Tạo PV với file manifest chuẩn bị sẵn.
- slide 15: 
  - **DEMO**: Tạo 2 PVC với file manifest chuẩn bị sẵn.
- slide 17:
  - **DEMO**: Tạo configmap với file manifest chuẩn bị sẵn và tạo configmap từ file `example-configmap.txt`.
  - **DEMO**: Tạo pod với file configmap vừa tạo phía trên.
- slide 18:
  - **DEMO**: Tạo secret với pod sử dụng secret với file manifest chuẩn bị sẵn.
- slide 19:
  - **DEMO**: Tạo statefulset với file manifest đã tạo sẵn.
  - **DEMO**: Tạo bảng mới trên một pod của statefulset, xóa pod chứa bảng mới, đợi pod được tạo lại và kiểm tra xem bảng mới tạo có còn tồn tại không.