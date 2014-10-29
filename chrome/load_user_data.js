function getElementByXpath (path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

var rank = getElementByXpath("//*[@id='profile-advanced-right']/div[2]/div[2]/img[2]");

if (rank != null) {
  rank = rank.getAttribute("src");
} else {
  rank = getElementByXpath("//*[@id='profile-advanced-right']/div[1]/div[2]/img[2]");
  if (rank != null) {
    rank = rank.getAttribute("src");
  }
}

var rslt = [rank];
var reward_cont = getElementByXpath("//*[@id='field_id2']/dd/div[1]/table");

if (reward_cont != null) {
  var lst = reward_cont.getElementsByTagName("img");
//  console.log( lst );
  for (var i=0; i < lst.length; i++) {
    rslt.push(lst[i].getAttribute("src"));
  }
//  console.log( rslt );
}

rslt
