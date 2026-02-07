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

$(document).ready(function() {
    // Interação de Checkbox para Missões
    $('input[type="checkbox"]').on('change', function() {
        if($(this).is(':checked')) {
            $(this).parent().css('text-decoration', 'line-through');
            $(this).parent().css('opacity', '0.5');
            // Aqui entraria a chamada para o seu backend Node.js
            console.log("XP Ganho com sucesso!");
        } else {
            $(this).parent().css('text-decoration', 'none');
            $(this).parent().css('opacity', '1');
        }
    });

    // Simulação de pulso na barra de XP ao carregar
    $('.xp-bar').hide().fadeIn(1500);
});