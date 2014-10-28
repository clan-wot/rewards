function next(elem) {
  do {
    elem = elem.nextSibling;
  } while (elem && elem.nodeType != 1);
  return elem;
}

var tTable = {};
tTable["0"]  = "2";
tTable["1"]  = "3";
tTable["2"]  = "4";
tTable["3"]  = "5";
tTable["4"]  = "6";
tTable["5"]  = "7";
tTable["6"]  = "8";
tTable["7"]  = "9";
tTable["8"]  = "10";
tTable["9"]  = "11";
tTable["10"] = "12";
tTable["11"] = "13";


var links = document.querySelectorAll('a');
var href = "";
var td = null;

for (var i = 0; i < links.length; i++) {
  href = links[i].getAttribute('href');
  if (href == user_profile_url) {
    td = links[i].parentNode;
    break;
  }
}

for (var i = 0; i < 4; i++) { td = next(td); }
var txt = td.firstChild.getAttribute('src');
var arr = txt.split('/');
txt = arr[arr.length - 1];
txt = txt.split('.')[0];

var rank = tTable[txt];

for (var i = 0; i < 2; i++) { td = next(td); }
txt = td.firstChild.value;

var res = [href, rank, txt]; res
