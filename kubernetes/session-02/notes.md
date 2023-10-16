- Pod definition
- Slides:
  - slide 4: 
    - Network Address Translation (NAT) is a process in which one or more local IP address is translated into one or more Global IP address and vice versa in order to provide Internet access to the local hosts. 
  
  - slide 5:
  - - Có 4 network level trong cụm k8s: 
      - container: network giữa các container trong cùng pod
      - pod: network giữa các pod trong cùng node
      - node: network giữa các node trong cùng cluster
      - cluster: network từ cluster ra ngoài
  
  - slide 6:
    -  Node sẽ có:
       -  network interface eth0: đóng vai trò là nơi tiếp nhận packet từ internet.
       -  bridge: đóng vai trò như một switch, đưa packet tới network interface đích
       -  eth0-veth0: cặp network interface đóng vai trò nối network của pod tới network host.

  - slide 7: 
    - Một số câu lệnh và parameters hữu dụng
    - **DEMO**: Show một vài cặp commands

  - slide 8:
    -  Mỗi Pod có một địa chỉ IP độc nhất trên toàn cluster, các container trong pod chia sẻ chung một network, do đó sẽ sử dụng chung network interface, bao gồm địa chỉ IP và MAC. Điều này cũng có nghĩa port number của từng container cũng sẽ phải khác nhau.
    -  **DEMO**: Tạo 1 pod có 2 container, trong đó có 1 container call tới port đang mở của container còn lại thông qua localhost
 
  - slide 9:
    - Nếu các bạn sử dụng kubeadm để khởi tạo cluster thì sẽ thấy pod CIDR range được sử dụng khi tạo cluster.
    - Pod CIDR range có thể được tìm thấy từ command dưới, hoặc xem config của CNI:
      ```bash
      kubectl cluster-info dump | grep cluster-cidr      
      ```
    - Từ pod này sang pod khác có thể communicate với nhau thông qua IP của pod 
    - **DEMO**: tạo 2 pod nginx, exec vào 1 pod và call tới pod còn lại

  - slide 10:
    - Đường đi của packet từ pod ở node này tới một pod ở node khác sẽ là:
      - từ pod tới bridge của node thông qua cặp network interface eth0-veth1
      - tại bridge của node, không tìm thấy interface cần route tới, packet sẽ được đưa tới default route eht0 và route tới node cần tới.
      - Tới node cần tới, đi qua bridge của node đó và qua cặp veth-eth của pod cần tới và tới pod đó.

  - slide 11:
    - Một vài vấn đề với IP của pod
    - Kubernetes sử  dụng Service để giải quyết

  - slide 12:
    - mô tả một service và cách service hoạt động 
    - **DEMO**: Tạo một service với config đứng trước hai pod nginx bên trên và xem xem service có load balance không.

    slide 13:
    - **DEMO**: Call tới service bằng service name thay vì IP của service\

    slide 14: 
    - **DEMO**: Từ 1 pod nginx, thực hiện call tới pod nginx còn lại bằng FQDN. Sau đó thử scale down coredns xuống 0 replica và call lại.