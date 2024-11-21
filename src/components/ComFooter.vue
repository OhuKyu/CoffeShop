<template>
    <footer>
        <div class="footer-container">
            <div class="footer-column">
                <h3>Giới thiệu</h3>
                <ul>
                    <li><a href="./gioithieu">Về Chúng Tôi</a></li>
                    <li><a href="./thucdon">Sản phẩm</a></li>
                    <li><a href="./lienhe">Liên hệ</a></li>
                    <li><a href="./tintuc">Tin tức</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Điều khoản</h3>
                <ul>
                    <li><a href="#">Điều khoản sử dụng</a></li>
                    <li><a href="#">Chính sách bảo mật thông tin</a></li>
                    <li><a href="#">Hướng dẫn xuất hóa đơn GTGT</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Liên hệ</h3>
                <p>Họ và Tên: <strong>Trần Bá Hoàng Duy</strong></p>
                <p>Đặt hàng: <strong>0919516087</strong></p>
                <p>Địa chỉ: <strong>123 Đàm Vĩnh Hưng, P.12, Q.Tân Bình, TP.HCM</strong></p>
                <p>Email: <a href="mailto:hoangduy51232@gmail.com">hoangduy51232@gmail.com</a></p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2021-2024 Công ty trách nhiệm hữu hạn một mình Duy. Tất cả quyền được bảo lưu.</p>
        </div>
    </footer>
</template>

<script>
export default {
}
</script>

<style>
footer {
    background-color: #8B4513;
    color: #fff;
    padding: 20px;
    font-size: 14px;
}

.footer-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: 0 auto;
}

.footer-column {
    flex: 1;
    padding: 10px;
    min-width: 200px;
    text-align: left;
}

.footer-column h3 {
    margin-top: 0;
    font-size: 16px;
    font-weight: bold;
}

.footer-column ul {
    list-style-type: none;
    padding: 0;
}

.footer-column li {
    margin: 5px 0;
}

.footer-column a {
    color: #fcb034;
    text-decoration: none;
}

.footer-column a:hover {
    text-decoration: underline;
}

.footer-bottom {
    text-align: center;
    margin-top: 20px;
    font-size: 12px;
}
</style>