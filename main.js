document.addEventListener('DOMContentLoaded', function() {
    // Validasi Form Login
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const loginBtn = document.querySelector('.login-btn');
    const formBox = document.querySelector('.form-box');

    // Fungsi untuk menyembunyikan semua pesan
    function hideAllMessages() {
        errorMessage.classList.remove('show');
        successMessage.classList.remove('show');
    }

    // Pastikan pesan disembunyikan saat halaman dimuat
    hideAllMessages();

    // Validasi saat form di-submit
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        hideAllMessages();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Validasi username dan password
        if (username === 'kopihitam' && password === 'kopisusu12') {
            // Jika benar, tampilkan pesan sukses
            successMessage.classList.add('show');
            
            // Ubah style tombol menjadi sukses
            loginBtn.classList.add('success-btn');
            loginBtn.innerHTML = '<span><i class="fas fa-check"></i> BERHASIL</span>';
            
            // Nonaktifkan tombol login
            loginBtn.disabled = true;
            
            // REDIRECT ke halaman berikutnya setelah 2 detik
            setTimeout(function() {
                window.location.href = 'home.html'; // Ganti dengan halaman tujuan Anda
            }, 2000);
        } else {
            // Jika salah, tampilkan pesan error
            errorMessage.classList.add('show');
            
            // Animasi form bergetar
            formBox.classList.add('shake');
            setTimeout(() => {
                formBox.classList.remove('shake');
            }, 500);
            
            // Reset form setelah 3 detik
            setTimeout(() => {
                loginForm.reset();
                hideAllMessages();
            }, 3000);
        }
    });

    // Sembunyikan pesan error saat user mulai mengetik
    usernameInput.addEventListener('input', function() {
        hideAllMessages();
    });

    passwordInput.addEventListener('input', function() {
        hideAllMessages();
    });
});