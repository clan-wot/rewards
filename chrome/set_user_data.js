//console.log("user_id: " + user_id);
//console.log("user_rank: " + user_rank);
//console.log("user_rewards: " + user_rewards);

var rank_table = new Object();
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/marsha10.png"] = 13;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/genera13.png"] = 12;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/genera12.png"] = 11;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/genera11.png"] = 10;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/genera10.png"] = 9;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/polkov11.png"] = 8;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/podpol10.png"] = 7;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/major10.png"]  = 6;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/kapita10.png"] = 5;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/st_lej10.png"] = 4;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/lejten10.png"] = 3;
rank_table["http://i56.servimg.com/u/f56/18/61/98/69/ml_lej10.png"] = 2;

rank_table["http://raw.githubusercontent.com/clan-wot/forum2x2.net/master/images/ranks/02.png"] = 2;
rank_table["http://raw.githubusercontent.com/clan-wot/forum2x2.net/master/images/ranks/03.png"] = 3;
rank_table["http://raw.githubusercontent.com/clan-wot/forum2x2.net/master/images/ranks/04.png"] = 4;
rank_table["http://raw.githubusercontent.com/clan-wot/forum2x2.net/master/images/ranks/05.png"] = 5;
rank_table["http://raw.githubusercontent.com/clan-wot/forum2x2.net/master/images/ranks/06.png"] = 6;
rank_table["http://raw.githubusercontent.com/clan-wot/forum2x2.net/master/images/ranks/07.png"] = 7;
rank_table["http://raw.githubusercontent.com/clan-wot/forum2x2.net/master/images/ranks/08.png"] = 8;
rank_table["http://raw.githubusercontent.com/clan-wot/forum2x2.net/master/images/ranks/09.png"] = 9;
rank_table["http://raw.githubusercontent.com/clan-wot/forum2x2.net/master/images/ranks/10.png"] = 10;
rank_table["http://raw.githubusercontent.com/clan-wot/forum2x2.net/master/images/ranks/11.png"] = 11;
rank_table["http://raw.githubusercontent.com/clan-wot/forum2x2.net/master/images/ranks/12.png"] = 12;
rank_table["http://raw.githubusercontent.com/clan-wot/forum2x2.net/master/images/ranks/13.png"] = 13;

var medal_table = new Object();

medal_table["http://wot.inf.lv/imgs/small/znachki/21.png"] =               "10=1";
medal_table["http://wot.inf.lv/imgs/small/znachki/20.png"] =               "11=1";
medal_table["http://wot.inf.lv/imgs/small/znachki/uchastnik.png"] =        "12=1";
medal_table["http://wot.inf.lv/imgs/small/znachki/ledi.png"] =             "13=1";

medal_table["http://wot.inf.lv/imgs/small/medali/star2.png"] =             "20=1";
medal_table["http://wot.inf.lv/imgs/small/medali/7.png"] =                 "21=1";
medal_table["http://wot.inf.lv/imgs/small/medali/8.png"] =                 "22=1";
medal_table["http://wot.inf.lv/imgs/small/medali/9.png"] =                 "23=1";
medal_table["http://wot.inf.lv/imgs/small/medali/10.png"] =                "24=1";
medal_table["http://wot.inf.lv/imgs/small/medali/11.png"] =                "25=1";
medal_table["http://wot.inf.lv/imgs/small/medali/12.png"] =                "26=1";
medal_table["http://wot.inf.lv/imgs/small/medali/13.png"] =                "27=1";
medal_table["http://wot.inf.lv/imgs/small/medali/17.png"] =                "28=1";
medal_table["http://wot.inf.lv/imgs/small/medali/18.png"] =                "29=1";
medal_table["http://wot.inf.lv/imgs/small/medali/22.png"] =                "30=1";
medal_table["http://wot.inf.lv/imgs/small/medali/23.png"] =                "30=2";
medal_table["http://wot.inf.lv/imgs/small/medali/24.png"] =                "30=3";
medal_table["http://wot.inf.lv/imgs/small/medali/25.png"] =                "30=4";
medal_table["http://wot.inf.lv/imgs/small/medali/26.png"] =                "30=5";
medal_table["http://wot.inf.lv/imgs/small/medali/27.png"] =                "30=6";

medal_table["http://wot.inf.lv/imgs/small/ordena/veteran.png"] =           "50=1";
medal_table["http://wot.inf.lv/imgs/small/ordena/1.png"] =                 "51=1";
medal_table["http://wot.inf.lv/imgs/small/ordena/2.png"] =                 "52=1";
medal_table["http://wot.inf.lv/imgs/small/ordena/3.png"] =                 "53=1";
medal_table["http://wot.inf.lv/imgs/small/ordena/6.png"] =                 "54=1";
medal_table["http://wot.inf.lv/imgs/small/ordena/5.png"] =                 "54=2";
medal_table["http://wot.inf.lv/imgs/small/ordena/4.png"] =                 "54=3";

var medals = new Object();
for (var itm in medal_table) {

   var medal_code = medal_table[itm].split("=")[0];
   //console.log("medal_table itm: " + medal_code);

   if (medal_code in medals) {
     medals[medal_code] = 1
   } else {
     medals[medal_code] = 0
   }
}

var user_rewards_codes = new Object();
for (var i=0; i < user_rewards.length; i++) {
  var m = user_rewards[i];
  if (m in medal_table) {
    var dat = medal_table[m].split("=");
    user_rewards_codes[dat[0]] = dat[1];
  }
}

//console.log("user_rewards_codes:");
//for (var itm in user_rewards_codes) {
//  console.log(itm + " -> " + user_rewards_codes[itm]);
//}

//console.log("controls:");
for (var itm in medals) {
  var inp = document.getElementById("reward_" + itm + "_" + user_id);
  if (inp) {
    if (itm in user_rewards_codes) {

      //console.log("set " + itm + " -> " + user_rewards_codes[itm]);
      if (medals[itm] > 0) {
        inp.value=user_rewards_codes[itm];
      } else {
        inp.checked = true;
      }

    } else {

      //console.log("clear " + itm);
      if (medals[itm] > 0) {
        inp.value="0";
      } else {
        inp.checked = false;
      }

    }
  }
}

var sel = document.getElementById("rank_" + user_id);
//console.log("sel: " + sel.innerHTML);

var rank_code = 0;
if (user_rank in rank_table) {
  rank_code =rank_table[user_rank];
}

sel.value=rank_code;
