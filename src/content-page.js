import './style.css';

const slug = location.pathname.replace(/^\/+|\/+$/g, '');
document.body.innerHTML = `<main class="content-page"><a class="content-home" href="/">← ROOFTOP DRIVE</a><article id="page-content"><p class="content-status">Loading page…</p></article><footer>ROOFTOP DRIVE · AN INDEPENDENT ARCADE EXPERIENCE</footer></main>`;

try {
  const [response, metaResponse] = await Promise.all([
    fetch(`/api/public/content?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' }),
    fetch('/api/public/meta', { cache: 'no-store' })
  ]);
  if (!response.ok) throw new Error(response.status === 404 ? 'This page is not published or does not exist.' : 'Published content is temporarily unavailable.');
  const page = await response.json();
  document.title = `${page.title} · Rooftop Drive`;
  const robots = document.querySelector('meta[name="robots"]');
  const meta = metaResponse.ok ? await metaResponse.json().catch(() => null) : null;
  if (robots) robots.content = meta?.settings?.noindex ? 'noindex, nofollow' : 'index, follow';
  const description = document.querySelector('meta[name="description"]');
  if (description && meta?.settings?.description) description.content = meta.settings.description;
  if (meta?.settings?.canonical_base_url) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
    canonical.href = `${meta.settings.canonical_base_url}${slug}`;
  }
  const article = document.querySelector('#page-content');
  article.replaceChildren();
  const title = document.createElement('h1');
  title.textContent = page.title;
  const copy = document.createElement('div');
  copy.className = 'content-copy';
  copy.textContent = page.body;
  article.append(title, copy);
} catch (error) {
  const article = document.querySelector('#page-content');
  article.replaceChildren();
  const title = document.createElement('h1');
  title.textContent = 'Page unavailable';
  const message = document.createElement('p');
  message.className = 'content-status';
  message.textContent = error.message;
  article.append(title, message);
}
