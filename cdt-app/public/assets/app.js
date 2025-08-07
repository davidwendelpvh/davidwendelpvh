document.addEventListener('click', function(e){
  const el = e.target.closest('[data-disabled="true"], .action-card.disabled');
  if (el){
    e.preventDefault();
    alert('Funcionalidade demonstrativa. Apenas a opção indicada está ativa.');
  }
});

// Máscara simples de CPF na tela de login
(function(){
  const cpfInput = document.querySelector('input[name="cpf"]');
  if (!cpfInput) return;
  cpfInput.addEventListener('input', () => {
    const digits = cpfInput.value.replace(/\D/g, '').slice(0,11);
    let out = digits;
    if (digits.length > 9) out = digits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    else if (digits.length > 6) out = digits.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    else if (digits.length > 3) out = digits.replace(/(\d{3})(\d{0,3})/, '$1.$2');
    cpfInput.value = out;
  });
})();