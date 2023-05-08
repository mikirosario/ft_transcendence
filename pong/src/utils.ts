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

// rethink this monstrosity
export function resizeCanvas(canvas: HTMLCanvasElement, aspectRatio: number) {
  const margin = 0.1; // 10% margin on each side
  const maxAreaRatio = 0.75; // Maximum area the canvas can occupy

  const maxWidth = window.innerWidth * (1 - 2 * margin);
  const maxHeight = window.innerHeight * (1 - 2 * margin);

  const maxCanvasWidth = Math.sqrt(maxWidth * maxHeight * maxAreaRatio / aspectRatio);
  const maxCanvasHeight = maxCanvasWidth / aspectRatio;

  const widthBasedOnHeight = Math.min(maxHeight * aspectRatio, maxCanvasWidth);
  const heightBasedOnWidth = Math.min(maxWidth / aspectRatio, maxCanvasHeight);

  if (widthBasedOnHeight <= maxWidth && heightBasedOnWidth <= maxHeight) {
    canvas.width = widthBasedOnHeight;
    canvas.height = heightBasedOnWidth;
  } else {
    if (widthBasedOnHeight * maxHeight <= maxWidth * maxHeight * maxAreaRatio) {
      canvas.width = widthBasedOnHeight;
      canvas.height = maxHeight;
    } else {
      canvas.width = maxWidth;
      canvas.height = heightBasedOnWidth;
    }
  }
}
