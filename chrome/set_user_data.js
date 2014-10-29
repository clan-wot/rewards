console.log("user_id: " + user_id);
console.log("user_rank: " + user_rank);
console.log("user_rewards: " + user_rewards);

var rank_table = new Object();
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/marsha10.png"] = 13;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/genera13.png"] = 12;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/genera12.png"] = 11;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/genera11.png"] = 10;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/genera10.png"] = 9;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/polkov11.png"] = 8;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/podpol10.png"] = 7;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/major10.png"] = 6;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/kapita10.png"] = 5;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/st_lej10.png"] = 4;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/lejten10.png"] = 3;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/ml_lej10.png"] = 2;

var sel = document.getElementById("rank_" + user_id);
//console.log("sel: " + sel.innerHTML);

var rank_code = 0;
if (user_rank in rank_table) {
  rank_code =rank_table[user_rank];
}

sel.value=rank_code;
