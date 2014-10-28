var href = '';
var links = document.querySelectorAll('a');

for (var i = 0; i < links.length; i++) {
  href = links[i].getAttribute('href');
  if ((href != null) && (href.indexOf('admin/index.forum?mode=edit') > -1 )) {
    break;
  }
}
href
