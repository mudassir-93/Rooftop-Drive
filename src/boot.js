if (location.pathname.startsWith('/admin')) {
  import('./admin.js');
} else if (location.pathname !== '/') {
  import('./content-page.js');
} else {
  import('./main.js');
}
