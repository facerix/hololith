export {};

const STORAGE_KEY = 'hololith-theme';

type Theme = 'dark' | 'light';

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme | null): void {
  if (theme) {
    document.documentElement.dataset.theme = theme;
  } else {
    delete document.documentElement.dataset.theme;
  }
}

class ThemeToggle extends HTMLElement {
  #button: HTMLButtonElement | null = null;
  #mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  connectedCallback(): void {
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        button {
          background: transparent;
          border: 1px solid var(--accent-color);
          border-radius: 4px;
          color: var(--text-color);
          cursor: pointer;
          font-size: 1rem;
          line-height: 1;
          padding: 0.25em 0.6em;
        }
        button:hover {
          background: color-mix(in srgb, var(--accent-color) 18%, transparent);
        }
      </style>
      <button type="button"></button>
    `;

    this.#button = shadow.querySelector('button');
    this.#button?.addEventListener('click', () => this.#toggle());

    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    applyTheme(saved);
    this.#updateLabel();

    this.#mediaQuery.addEventListener('change', () => this.#updateLabel());
  }

  disconnectedCallback(): void {
    this.#mediaQuery.removeEventListener('change', () => this.#updateLabel());
  }

  #effectiveTheme(): Theme {
    return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? systemTheme();
  }

  #toggle(): void {
    const next: Theme = this.#effectiveTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
    this.#updateLabel();
  }

  #updateLabel(): void {
    if (!this.#button) return;
    const theme = this.#effectiveTheme();
    this.#button.textContent = theme === 'dark' ? '☀' : '☾';
    this.#button.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  }
}

customElements.define('theme-toggle', ThemeToggle);

declare global {
  interface HTMLElementTagNameMap {
    'theme-toggle': ThemeToggle;
  }
}
