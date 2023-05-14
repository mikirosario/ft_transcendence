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

/*
** Normalizes a number 'x' in a range between 'min' and 'max' to a number
** between -1 and 1.
*/
export function normalizeRange(x: number, min: number, max: number): number
{
  return 2 * ((x - min) / (max - min)) - 1;
}

export function isInRange(x: number, min: number, max: number): boolean
{
  return !(x < min || x > max);
}
