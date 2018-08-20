
function getDomainFromUrl(url){
	var host = "null";
	if(typeof url == "undefined" || null == url)
		url = window.location.href;
	var regex = /.*\:\/\/([^\/]*).*/;
	var match = url.match(regex);
	if(typeof match != "undefined" && null != match)
		host = match[1];
	return host;
}

function checkForValidUrl(tabId, changeInfo, tab) {
	
		//chrome.pageAction.show(tabId);
	
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

var articleData = {};
articleData.error = "加载中...";
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	articleData = request;
	if(request.type=="tb")
    {
		$.ajax({
			url:"http://180.76.167.20/index.php/Home/index/getshopurl",//"http://wechat.youjiankeji.com/app/common/mzteam/",
			cache: false,
			async:false,
			type: "POST",
			data: {tds:articleData.td},
			dataType: "json"
		}).done(function(msg) {
			//console.log(JSON.stringify(msg));
			console.log(msg);
			sendResponse({farewell: msg});
		}).fail(function(jqXHR, textStatus) {
			articleData.firstAccess = textStatus;
		});
	}
	
	
	
});

