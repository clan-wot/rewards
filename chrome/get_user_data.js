//console.log("user_profile_url: " + user_profile_url);
var arr = user_profile_url.split('/');
var user_id = arr[arr.length - 1];
//console.log("user_id: " + user_id);
var item = document.getElementById("link_" + user_id);
var rank_code = item.getAttribute('rank_code');
//console.log("rank_code: " + rank_code);
var medal_bbc = item.getAttribute('title');
//console.log("medal_bbc: " + medal_bbc);
var res = [user_profile_url, rank_code, medal_bbc]; res
