document.querySelectorAll('.accordion-btn').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const openItem = document.querySelector('.accordion-item.open');
    if (openItem && openItem !== item) {
      openItem.classList.remove('open');
    }
    item.classList.toggle('open');
  });
});
