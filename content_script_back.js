//document.body.style.border = "5px solid red";


Array.prototype.baoremove = function(dx)
　{ // www.jb51.net
	if(isNaN(dx)||dx>this.length){return false;}
	this.splice(dx,1);
　}
function getTop(e){ var offset=e.offsetTop; if(e.offsetParent!=null) offset+=getTop(e.offsetParent); return offset; }
var objarr=Array();

$(document).ready(function(){
	$('.m-itemlist .item').each(function(e){
		objarr.push([getTop(this),$(this)]);
	});
	//console.log(objarr);
	$(document).scroll(function(){
		if(objarr.length<=0)
			return;
		//console.log( );
		var postheight= window.screen.availHeight+document.body.scrollTop;
		//console.log(postheight);
		for(kk in objarr)
		{
			//console.log(kk);
			//console.log(objarr[kk][0]);
			if(postheight>objarr[kk][0])
			{
				//console.log(objarr[kk][1]);
				var obj=objarr[kk][1];
				var href= obj.find('.title a');
				var pic=obj.find('.pic a');
				//console.log(href.attr('href'));
				//console.log(objarr[kk][1]);
				var tu=href.attr('href');
				var td=href.attr('data-nid');
				objarr.baoremove(kk);
				chrome.runtime.sendMessage({type:"cnblog-article-information", tu:tu,td:td},function(response){
					console.log(response);
				   if(response.farewell.error!="1")
				   {
					   //$(href).unbind('click');
					   href.attr('href',response.farewell.click_url);
					   pic.attr('href',response.farewell.click_url);
					   
				   }
			  }); 
				
			}
				
		}
	});
	/*console.log($('.m-itemlist .item'));
	$("* a").click(function(e){
    
	e.stopPropagation();
	stopDefault(e);
	//console.log(this.attributes);
	var obj=this;
	var list= this.attributes;
	var tu,td;
	for(var i=0;i<list.length;i++)
	{
	   var	attributename=list[i].name;
	   
	   if(attributename=="href")
	   {
		   tu=list[i].value;
		   //console.log(list[i].value);
	   }
	   if(attributename=="data-nid")
	   {
		   td=list[i].value;
		   //console.log(list[i].value);
	   }
	}
	
	if(tu!=null && td!=null)
	{
		 chrome.runtime.sendMessage({type:"cnblog-article-information", tu:tu,td:td},function(response){
		   
		   if(response.farewell.error!="1")
		   {
			   
			   $(obj).attr('href',response.farewell.click_url);
			   $(obj).unbind('click');
			   $(obj).get(0).click();
		   }
		   else
		   {
			   $(obj).unbind('click');
			   $(obj).get(0).click();
		   }
	  }); 
	}
	else
	{
		$(obj).unbind('click');
		$(obj).get(0).click();
	}
	
});*/
	
});

var postInfo = $("#head");
function stopDefault( e ) { 
     if ( e && e.preventDefault ) 
        e.preventDefault(); 
    else 
        window.event.returnValue = false; 
        
    return false; 
} 
setTimeout('referreritem()',1000);
var oldpage=$(".m-page li.item.active span.num").text();
function referreritem()
{
	var newpage=$(".m-page li.item.active span.num").text();
	//console.log(newpage);
	if(oldpage!=newpage && objarr.length<=0)
	{
		oldpage=newpage;
		
		$('.m-itemlist .item').each(function(e){
			objarr.push([getTop(this),$(this)]);
		});
	}
	setTimeout('referreritem()',1000);
}
