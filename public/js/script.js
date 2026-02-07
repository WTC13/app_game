$(document).ready(function() {
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        const email = $('#email').val();
        const password = $('#password').val();

        console.log("Tentativa de login com:", email);
        
        // Simulação simples de feedback
        alert('Login enviado! Verifique o console.');
    });
});