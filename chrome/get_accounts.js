var user_profile = 'http://spice.forum2x2.net/u';
var r1 = [];
var r2 = [];
var e = document.querySelectorAll('td');
for (var i=0; i < e.length; i++) {
  if (e[i].getAttribute('class') == 'account_name') {
    var lnk = e[i].firstChild;
    if (lnk.getAttribute('href').indexOf(user_profile) > -1) {
      r1.push(lnk.getAttribute('href'));
    } else {
      r2.push(lnk.innerText);
    }
  }
}
[r1, r2]
