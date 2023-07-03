export function toast(message, color) {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right", 
    stopOnFocus: true, 
    style: {
      background: color,
    },
  }).showToast();
}