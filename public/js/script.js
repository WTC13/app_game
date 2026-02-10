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

$(document).ready(function() {
    // 1. Gráfico de XP Semanal (Linha Suave)
    const ctxXP = document.getElementById('xpChart').getContext('2d');
    const xpGradient = ctxXP.createLinearGradient(0, 0, 0, 200);
    xpGradient.addColorStop(0, 'rgba(112, 0, 255, 0.4)');
    xpGradient.addColorStop(1, 'rgba(112, 0, 255, 0)');

    new Chart(ctxXP, {
        type: 'line',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [{
                label: 'XP',
                data: [400, 900, 750, 1200, 1100, 1800, 1500],
                borderColor: '#7000FF',
                backgroundColor: xpGradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { display: false },
                x: { grid: { display: false }, ticks: { color: '#555' } }
            }
        }
    });

    // 2. Gráfico de Esportes (Barras)
    const ctxSports = document.getElementById('sportsChart').getContext('2d');
    new Chart(ctxSports, {
        type: 'bar',
        data: {
            labels: ['S', 'S', 'D'],
            datasets: [{
                data: [60, 90, 45],
                backgroundColor: '#CCFF00',
                borderRadius: 5
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { display: false }, x: { grid: { display: false } } }
        }
    });

    // 3. Gráfico Financeiro (Donut)
    const ctxFinance = document.getElementById('financeChart').getContext('2d');
    new Chart(ctxFinance, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [70, 30],
                backgroundColor: ['#7000FF', '#222'],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '80%',
            plugins: { legend: { display: false } }
        }
    });
});

$(document).ready(function() {
    // Filtro por Categoria
    $('.cat-card').on('click', function() {
        $('.cat-card').removeClass('active');
        $(this).addClass('active');
        
        const filter = $(this).data('filter');
        
        if(filter === 'all') {
            $('.faq-item').fadeIn();
        } else {
            $('.faq-item').hide();
            $(`.faq-item[data-category="${filter}"]`).fadeIn();
        }
    });

    // Busca Real-time
    $("#wikiSearch").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#wikiAccordion .faq-item").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$(document).ready(function() {
    // Gráfico Ciclismo
    const ctxCiclismo = document.getElementById('ciclismoChart').getContext('2d');
    new Chart(ctxCiclismo, {
        type: 'line',
        data: {
            labels: ['2ª', '3ª', '4ª', '5ª', '6ª'],
            datasets: [{
                data: [15, 25, 10, 30, 20],
                borderColor: '#CCFF00',
                tension: 0.4,
                pointRadius: 4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    // Gráfico Musculação
    const ctxGym = document.getElementById('gymChart').getContext('2d');
    new Chart(ctxGym, {
        type: 'bar',
        data: {
            labels: ['Peito', 'Costas', 'Perna', 'Ombro'],
            datasets: [{
                data: [2000, 2500, 4500, 1500],
                backgroundColor: '#7000FF',
                borderRadius: 8
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
});

// Lógica de Tarefas
function completeTask(btn) {
    const taskItem = $(btn).closest('.task-item');
    taskItem.css('opacity', '0.5');
    taskItem.css('text-decoration', 'line-through');
    $(btn).html('<i class="bi bi-check-all"></i>').addClass('btn-success').removeClass('btn-complete');
    alert('Concluído! + XP adicionado à sua conta.');
}

function addTask(type) {
    const title = prompt("Qual a nova missão de " + type + "?");
    if (title) {
        const newTask = `
            <div class="task-item" style="border-left-color: #CCFF00">
                <div class="task-info">
                    <span>${title}</span>
                    <small>+100 XP</small>
                </div>
                <button class="btn-complete" onclick="completeTask(this)"><i class="bi bi-check-lg"></i></button>
            </div>
        `;
        $(`#${type}-tasks`).append(newTask);
    }
}

$(document).ready(function() {
    const ctxPie = document.getElementById('financePieChart').getContext('2d');
    
    new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: ['Investimentos', 'Lazer', 'Fixo', 'Reserva'],
            datasets: [{
                data: [40, 15, 30, 15],
                backgroundColor: ['#7000FF', '#CCFF00', '#333', '#555'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#888', font: { size: 10 } }
                }
            }
        }
    });
});