import { Transform } from "./types";

const errorMessage = document.getElementById('error-message');
export function showError(message: string) {
  if (errorMessage)
  {
    errorMessage.innerHTML = message;
    errorMessage.style.display = 'block';
    console.error(message);
  }
  else
  {
    console.error('Error message element not found.');
  }
}
