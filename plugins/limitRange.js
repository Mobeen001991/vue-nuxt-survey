import { defineNuxtPlugin } from '#app';

const limitRangeDirective = {
  beforeMount(el) {
    el.addEventListener('input', (event) => {
      let value = parseFloat(event.target.value);

      if (isNaN(value)) {
        value = ''; // Set to empty instead of NaN
      } else if (value < 0) {
        value = 0;
      } else if (value > 5) {
        value = 5;
      }

      // Only update if the value actually changed
      if (event.target.value !== String(value)) {
        event.target.value = value;
        event.target.dispatchEvent(new Event('input', { bubbles: true })); // Ensure Vue detects the change
      }
    });
  }
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('limit-range', limitRangeDirective);
});
