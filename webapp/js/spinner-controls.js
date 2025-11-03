// Spinner Controls for Input Fields
document.addEventListener('DOMContentLoaded', function() {
  // Find all spinner buttons
  const spinnerButtons = document.querySelectorAll('.spinner-btn');
  
  // Add click event listeners to each button
  spinnerButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Get the target input field
      const targetId = this.getAttribute('data-target');
      const inputField = document.getElementById(targetId);
      
      if (!inputField) return;
      
      // Get current value, min, max
      let value = parseInt(inputField.value) || 0;
      const min = parseInt(inputField.getAttribute('min')) || 0;
      const max = parseInt(inputField.getAttribute('max')) || 9999;
      
      // Increment or decrement based on button class
      if (this.classList.contains('spinner-up')) {
        value = Math.min(value + 1, max);
      } else if (this.classList.contains('spinner-down')) {
        value = Math.max(value - 1, min);
      }
      
      // Update input value
      inputField.value = value;
      
      // Trigger change event
      const event = new Event('change', { bubbles: true });
      inputField.dispatchEvent(event);
    });
  });
});