export async function displayMauCount(element: HTMLElement): Promise<void> {
  try {
    const response = await fetch('/api/mau');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as { mau?: number };

    if (typeof data.mau === 'number') {
      element.textContent = `${new Intl.NumberFormat('en-US').format(data.mau)} MAU this month`;
      element.style.display = 'block';
    } else {
      element.style.display = 'none';
    }
  } catch {
    element.style.display = 'none';
  }
}
