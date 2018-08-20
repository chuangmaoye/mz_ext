//document.body.style.border = "5px solid red";
var retshopdate=new Array();
Array.prototype.unique3 = function(){
 var res = [];
 var json = {};
 for(var i = 0; i < this.length; i++){
  if(!json[this[i]]){
   res.push(this[i]);
   json[this[i]] = 1;
  }
 }
 return res;
}
Array.prototype.baoremove = function(dx)
　{ // www.jb51.net
	if(isNaN(dx)||dx>this.length){return false;}
	this.splice(dx,1);
　}
function getTop(e){ var offset=e.offsetTop; if(e.offsetParent!=null) offset+=getTop(e.offsetParent); return offset; }
var objarr=Array();
var tds=Array();
function gettbid(obj)
{
	var href= $(obj).find('.title a');
	var td=href.attr('data-nid');
	return td;
}
function gettmid(obj)
{
	var id=$(obj).attr('data-id');
	return id;
}

$(document).ready(function(){
	var oldpage=$(".m-page li.item.active span.num").text();
	var oldtmpage=$(".ui-page .ui-page-num > b.ui-page-cur").text();
	//tb列表
	$('.m-itemlist .item').each(function(e){
		objarr.push([getTop(this),$(this),'tb']);
	});
	//tm列表
	$('#J_ItemList .product').each(function(e){
		objarr.push([getTop(this),$(this),'tm']);
	});
	
	for(var kk=0;kk<objarr.length;kk++)
	{
			//console.log(kk);
			//console.log(objarr[kk][0]);
			
				//console.log(objarr[kk][1]);
				var obj=objarr[kk][1];
				var td;
				if(objarr[kk][2]=='tb')
				{
					td=gettbid(obj);
				}else{
					td=gettmid(obj);
				}
				 
				if(td!=undefined)
				{
					tds.push(td);
					objarr.baoremove(kk);
				}
					
				
			
				
	}
	
	if(tds.length>0)
	{
		
		chrome.runtime.sendMessage({td:tds,type:'tb'},function(response){
					
					for(var jj in response.farewell)
					{
						retshopdate.push(response.farewell[jj]);
					}
				   /*if(response.farewell.error!="1")
				   {
					   //$(href).unbind('click');
					   href.attr('href',response.farewell.click_url);
					   pic.attr('href',response.farewell.click_url);
					   
				   }*/
			  });
        tds.splice(0,tds.length);
	}
	
	
	$(document).scroll(function(){
		
		
		var newpage=$(".m-page li.item.active span.num").text();
		var newtmpage=$(".ui-page .ui-page-num > b.ui-page-cur").text();
		
		if(parseInt(oldpage)!=parseInt(newpage))
		{
			
			oldpage=newpage;
			
			$('.m-itemlist .item').each(function(e){
				objarr.push([getTop(this),$(this),'tb']);
			});
		}
		if(parseInt(oldtmpage)!=parseInt(newtmpage))
		{
			
			oldtmpage=newtmpage;
			
			//tm列表
			$('#J_ItemList .product').each(function(e){
				objarr.push([getTop(this),$(this),'tm']);
			});
		}
		if(objarr.length<=0)
			return;
		//console.log( );
		var postheight= window.screen.availHeight+document.body.scrollTop;
		//console.log(postheight);
		for(var kk=0;kk<objarr.length;kk++)
		{
			//console.log(kk);
			//console.log(objarr[kk][0]);
			if(postheight>objarr[kk][0])
			{
				//console.log(objarr[kk][1]);
				var obj=objarr[kk][1];
				if(objarr[kk][2]=='tb')
				{
					td=gettbid(obj);
				}else{
					td=gettmid(obj);
				}
				
				if(td!=undefined)
				{
					if(tds.length==0)
					{
						tds.push(td);
					}
					for(var ii=0;ii<tds.length;ii++)
					{
						if(tds[ii]==td)
							break;
						else
						{
							
							tds.push(td);
							
						}
						  
					}
					objarr.baoremove(kk);
				}
					
				
			}
				
		}
		
		var tds1=tds.unique3().concat();
		
		if(tds1.length<=0 || tds1.length<6)
			return;
		
		//console.log(tds.length);
		//console.log(tds);
		var ks=new Array(),ks=tds1.concat();
		tds.splice(0,tds.length);
		
		chrome.runtime.sendMessage({td:ks,type:'tb'},function(response){
					for(var jj in response.farewell)
					{
						retshopdate.push(response.farewell[jj]);
					}
				   /*if(response.farewell.error!="1")
				   {
					   //$(href).unbind('click');
					   href.attr('href',response.farewell.click_url);
					   pic.attr('href',response.farewell.click_url);
					   
				   }*/
			  });
			  
        //tds.splice(0,tds.length);			  
	});
	/*console.log($('.m-itemlist .item'));*/
	$("* a").click(function(e){
    
	e.stopPropagation();
	stopDefault(e);
	//console.log(this.attributes);
	var obj=this;
	var list= this.attributes;
	var tu,td;
	td=$(obj).parent().parent().parent().attr("data-id");
	
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
		
		 for(var v in retshopdate)
	     {
			 if(retshopdate[v].num_iid==td)
			 {
				 $(obj).attr('href',retshopdate[v].click_url);
				 $(obj).unbind('click');
			     $(obj).get(0).click();
				 return;
			 }
		 }
		 $(obj).unbind('click');
		 $(obj).get(0).click();
	  
	}
	else
	{
		$(obj).unbind('click');
		$(obj).get(0).click();
	}
	
});
	
});

var postInfo = $("#head");
function stopDefault( e ) { 
     if ( e && e.preventDefault ) 
        e.preventDefault(); 
    else 
        window.event.returnValue = false; 
        
    return false; 
} 
//setTimeout('referreritem()',1000);

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
