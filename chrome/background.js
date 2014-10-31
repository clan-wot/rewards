// http://stackoverflow.com/questions/13641658/chrome-tabs-onupdated-addlistener-is-getting-complete-status-twice-or-more-for-e

//var msg_text01 = "Update on forum";
//var msg_text02 = "Update user profiles";
//var msg_text03 = "Users without valid profile";
//var msg_text04 = "Valid user profile is not found at this page!";

var msg_text01 = "Обновить на форуме";
var msg_text02 = "Обновить профили пользователей";
var msg_text03 = "Пользователи без профиля";
var msg_text04 = "На этой странице не обнаружено правильных пользовательских профилей!";
var msg_text05 = "Загрузить с форума";

var host = 'spice-rewards.appspot.com'
//var host = 'localhost:8080'

var reward_url_edit = host + '/edit';
var reward_url_view = host + '/clan';

var forum_url = 'spice.forum2x2.net/';
var admin_url = 'http://' + forum_url + "admin/index.forum";

var work_tab_id = -1;
var current_user_profile = '';
var current_admin_profile = '';

var current_user_rank = '0';
var current_user_rewards = '[img]http://illiweb.com/fa/empty.gif[/img]';

var job_list = [];
var data_page_tabId = 0;

/* ******************** */
/* load data from forum */
/* ******************** */

function ForumLoad(info, tab) {
  console.log("ForumLoad " + info.linkUrl);
  current_user_profile = info.linkUrl;
  chrome.tabs.onUpdated.addListener(onUserProfileOpenForLoad);
  chrome.tabs.create({url: info.linkUrl});
}

function onUserProfileOpenForLoad(tabId, changeInfo, tab) {
  console.log("call onUserProfileOpenForLoad");
  if (changeInfo.status == 'complete') {
    console.log("onUserProfileOpenForLoad status complete");
    if (tab.url == current_user_profile) {
      console.log("onUserProfileOpenForLoad " + tab.url);
      chrome.tabs.onUpdated.removeListener(onUserProfileOpenForLoad);
      chrome.tabs.executeScript(tabId, {file: "load_user_data.js"}, loadUserData);
    }
  }
}

function loadUserData(results) {
  var rslt = results[0];

  var user_id = "'" + current_user_profile.split(forum_url)[1] + "'";

  var user_rank = rslt.shift();
  if (user_rank == null) {
    user_rank = "''";
  } else {
    user_rank = "'" + user_rank + "'";
  }

  var user_rewards = "";
  if (rslt.length > 0) {
    user_rewards = rslt.join("', '");
    user_rewards = "'" + user_rewards + "'";
  }
  var js_code = "var user_id = " + user_id + "; var user_rank = " + user_rank + "; var user_rewards = [" + user_rewards + "];";
  /*
  console.log("loadUserData: ");
  console.log("js_code: " + js_code);
  */
  chrome.tabs.executeScript(work_tab_id, {code: js_code}, 
       function() {
       chrome.tabs.executeScript(work_tab_id, {file: 'set_user_data.js'});
  });
  chrome.tabs.update(work_tab_id, {selected: true});
}

/* ******************** */
/* update data on forum */
/* ******************** */

function getUserData(results) {
  current_user_profile = results[0][0];

  //alert("rank: " + results[0][1] + "\nrewards:\n" + results[0][2]);
  current_user_rank = results[0][1];
  current_user_rewards = results[0][2];

  chrome.tabs.onUpdated.addListener(onUserProfileOpen);
  chrome.tabs.create({url: current_user_profile});
}

function runProfileUpdate(profile_url) {
// http://stackoverflow.com/questions/17567624/pass-parameter-using-executescript-chrome
  chrome.tabs.executeScript(null, {code: "var user_profile_url = '" + profile_url + "';"}, function() {
    chrome.tabs.executeScript(null, {file: 'get_user_data.js'}, getUserData);
  });
}

function ForumUpdate(info, tab) {
  runProfileUpdate(info.linkUrl);
}

function updateAdminProfile(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    if (tab.url == current_admin_profile) {
      chrome.tabs.onUpdated.removeListener(updateAdminProfile);
      chrome.tabs.onUpdated.addListener(updateAdminRewards);

      chrome.tabs.executeScript(tabId, {code: "var user_rank = '" + current_user_rank + "';"}, function() {
        chrome.tabs.executeScript(tabId, {file: 'set_admin_profile.js'});
      });
    }
  }
}

function updateAdminRewards(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    if (tab.url.indexOf(admin_url) > -1) {
      current_admin_profile = '';
      chrome.tabs.onUpdated.removeListener(updateAdminRewards);
      chrome.tabs.onUpdated.addListener(GoToUserProfile);
      var jscode = "var user_rewards = " + JSON.stringify(current_user_rewards);
      chrome.tabs.executeScript(tabId, {code: jscode}, function() {
        chrome.tabs.executeScript(tabId, {file: 'set_admin_rewards.js'});
      });
    }
  }
}

function runNextProfile() {
  runProfileUpdate(job_list.pop());
}

function GoToUserProfile(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    //alert("GoToUserProfile " + changeInfo.status + "\n" + tab.url);
    if (tab.url.indexOf(admin_url) > -1) {
      chrome.tabs.onUpdated.removeListener(GoToUserProfile);
      if (job_list.length > 0) {
        chrome.tabs.remove(tabId, runNextProfile);
        chrome.tabs.update(data_page_tabId, {selected: true});
      } else {
        chrome.tabs.update(tabId, {url: current_user_profile});
      }
      current_user_profile = '';
    }
  }
}

function getProfileAdminLink(results) {
  chrome.tabs.onUpdated.addListener(updateAdminProfile);
  current_admin_profile = 'http://' + forum_url + results;
  chrome.tabs.update(work_tab_id, {url: current_admin_profile});
}

function onUserProfileOpen(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    if (tab.url == current_user_profile) {
      work_tab_id = tabId;
      chrome.tabs.onUpdated.removeListener(onUserProfileOpen);
      chrome.tabs.executeScript(tabId, {file: "get_admin_profile.js"}, getProfileAdminLink);
    }
  }
}

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {

    if (tab.url.indexOf('http://' + reward_url_edit) > -1) {
      chrome.pageAction.show(tabId);
      work_tab_id = tabId;
      //console.log("tab.url: " + tab.url);
      chrome.contextMenus.removeAll();
      chrome.contextMenus.create(
        {
         "title": msg_text05, 
         "contexts": ["link"], 
         "targetUrlPatterns": ["*://" + forum_url + "u*"], 
         "onclick": ForumLoad
        });
    }

    if (tab.url.indexOf('http://' + reward_url_view) > -1) {
      chrome.pageAction.show(tabId);
      //console.log("tab.url: " + tab.url);
      chrome.contextMenus.removeAll();
      chrome.contextMenus.create(
        {
         "title": msg_text01, 
         "contexts": ["link"], 
         "targetUrlPatterns": ["*://" + forum_url + "u*"], 
         "onclick": ForumUpdate
        });
    }

  }
}

function getAccounts(results) {
  if (results[0][0].length > 0) {

    var txt = msg_text02 + ": " + results[0][0].length + " ?";
    if (results[0][1].length > 0) {
      txt = txt + "\n\n" + msg_text03 + ": " + results[0][1].length;
      txt = txt + "\n(" + results[0][1].join() + ")";
    }

    if (confirm(txt)) {
      job_list = results[0][0];
      //job_list.push(results[0][0].pop());
      runProfileUpdate(job_list.pop());
    }

  } else {
    alert(msg_text04);
  }
  chrome.pageAction.onClicked.addListener(updateAll);
}

function updateAll(tab) {
  if (job_list.length > 0) {
    alert("Already run...");
    return;
  }
  chrome.pageAction.onClicked.removeListener(updateAll);
  data_page_tabId = tab.id;
  chrome.tabs.executeScript(tab.id, {file: "get_accounts.js"}, getAccounts)
}

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.pageAction.onClicked.addListener(updateAll);
