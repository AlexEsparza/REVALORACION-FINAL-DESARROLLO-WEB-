document.addEventListener('DOMContentLoaded', function() {
    // Función para inicializar el usuario predeterminado
    function initializeDefaultUser() {
        const users = JSON.parse(localStorage.getItem('users')) || [];

        const adminUser = {
            name: 'Admin',
            email: 'admin@example.com',
            password: 'admin123',
            isAdmin: true // Este es el usuario administrador
        };

        // Agregar el usuario administrador si no existe
        if (!users.some(user => user.email === adminUser.email)) {
            users.push(adminUser);
        }

        localStorage.setItem('users', JSON.stringify(users));
    }

    initializeDefaultUser();

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const showForgotPassword = document.getElementById('showForgotPassword');
    const backToLogin = document.getElementById('backToLogin');

    function showForm(formToShow) {
        [loginForm, registerForm, forgotPasswordForm].forEach(form => {
            form.style.display = form === formToShow ? 'block' : 'none';
        });
    }

    showRegister.addEventListener('click', () => showForm(registerForm));
    showLogin.addEventListener('click', () => showForm(loginForm));
    showForgotPassword.addEventListener('click', () => showForm(forgotPasswordForm));
    backToLogin.addEventListener('click', () => showForm(loginForm));

    // Manejo del formulario de inicio de sesión
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            if (user.isAdmin) {
                // Redirigir al usuario administrador
                window.location.href = 'pagina administrador.html';  // Redirige a la página del administrador
            } else {
                // Redirigir al usuario normal
                alert('Inicio de sesión exitoso');
                window.location.href = 'index.html';  // Página para usuarios normales
            }
        } else {
            alert('Correo electrónico o contraseña incorrectos');
        }
    });

    // Manejo del formulario de registro
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find(u => u.email === email)) {
            alert('Este correo electrónico ya está registrado');
        } else {
            users.push({ name, email, password, isAdmin: false }); // Por defecto, los usuarios no son administradores
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registro exitoso');
            showForm(loginForm);
        }
    });

    // Manejo del formulario de recuperación de contraseña
    document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email);
        if (user) {
            sendRecoveryEmail(email);
        } else {
            alert('No se encontró ninguna cuenta con ese correo electrónico');
        }
    });

    // Función para enviar el correo de recuperación de contraseña
    function sendRecoveryEmail(email) {
        const templateParams = {
            to_email: email,
            message: 'Haz clic en el siguiente enlace para restablecer tu contraseña: [ENLACE_DE_RESTABLECIMIENTO]'
        };

        emailjs.send('service_eoukqjz', 'template_b32upe6', templateParams, 'f_zRKevewt-EKvcXZ')
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Se ha enviado un enlace de recuperación a tu correo electrónico');
                showForm(loginForm);
            }, function(error) {
                console.log('FAILED...', error);
                alert('Hubo un error al enviar el correo de recuperación. Por favor, inténtalo de nuevo más tarde.');
            });
    }

    // Función para proteger las rutas y redirigir en caso de no estar autenticado
    function protectRoute() {
        const currentPage = window.location.pathname;

        // Si el usuario no está autenticado y trata de acceder a páginas protegidas
        if (currentPage === '/dashboard.html' || currentPage === '/admin.html') {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                window.location.href = '/login.html'; // Redirige al login
            }
        }
    }

    // Protege las rutas cuando se carga la página
    protectRoute();
});
