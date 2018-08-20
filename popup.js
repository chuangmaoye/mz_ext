var pattern = Array(/[\u4e00-\u9fa5]/,/[0-9]/,/[a-zA-z]/,/\W/) ;//判断是否是中文
var header=false;
var postzdy=false;
//存储数据
function setdata(data)
{
	chrome.storage.StorageArea.set(data, function(){
    //do something
	});
}
//获取数据
function getdata(keys)
{
	chrome.storage.StorageArea.get(keys, function(result){
		return result;
	});
}
function autotb()
{
	for(kk in localStorage){
	    var type=$(kk).attr('type');
		console.log(kk);
		console.log(localStorage.getItem(kk));
		switch(type)
		{
			case 'text':subtext(kk,localStorage.getItem(kk));
			 break;
			case 'radio':subradio(kk,localStorage.getItem(kk));
			 break;
			case 'checkbox':subcheckbox(kk,localStorage.getItem(kk));
			 break;
			case 'table':subtable(kk,localStorage.getItem(kk));
		}
	}
}
function subtable(obj,val)
{
	$(obj).html(val);
	$(obj).find("tr td").click(function(){
		edittext(this);
	});
	
}
function subradio(obj,val)
{
	$(obj).each(function(){
		if($(this).val()==val)
		{
			$(this).click();
			
		}
	});
}
function subcheckbox(obj,val)
{
	if(val)
	{
		
		$(obj).click();
	}
	
}
function subtext(obj,val)
{
	$(obj).val(val);
}
function arrayToJson(o) {
    var r = [];
    if (typeof o == "string") return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
    if (typeof o == "object") {
      if (!o.sort) {
        for (var i in o)
          r.push(i + ":" + arrayToJson(o[i]));
        if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
          r.push("toString:" + o.toString.toString());
        }
        r = "{" + r.join() + "}";
      } else {
        for (var i = 0; i < o.length; i++) {
          r.push(arrayToJson(o[i]));
        }
        r = "[" + r.join() + "]";
      }
      return r;
    }
    return o.toString();
  }
//去除字符串尾部空格或指定字符  
String.prototype.trimEnd = function(c)  
{  
    if(c==null||c=="")  
    {  
        var str= this;  
        var rg = "//s/";
        var i = str.length;
        while (rg.test(str.charAt(--i)));  
        return str.slice(0, i + 1);  
    }  
    else  
    {  
        var str= this;
        var rg = new RegExp(c);
        var i = str.length;
        while (rg.test(str.charAt(--i)));
        return str.slice(0, i + 1);  
    }  
}  
//显示编辑框
function edittext(obj)
{
	//alert(obj);
	//console.log(this);
	$(obj).attr('onclick','');
	var index=$(obj).index();
	var trindex=$(obj).parent().index();
	var trlength=$(obj).parent().parent().find('tr').length;
	
	var txt=$(obj).text();
	
	var objtxt=$("<input text='text' value='' style='width:100%;border:none;background-color:transparent;' />");
	if(index==1 && trindex==(trlength-1))
	{
		//console.log(1);
		var html="<tr><td >&nbsp;</td><td >&nbsp;</td></tr>";
		$(obj).parent().parent().append(html);
		$(obj).parent().parent().find('tr td').off('click');
		$(obj).parent().parent().find('tr td').click(function(){
			edittext(this);
		});
	}
	objtxt.on('blur',hidtext);
	objtxt.val(txt);
	$(obj).html(objtxt);
	objtxt.focus();
	
}
//隐藏编辑框
function hidtext(obj)
{
	var txt=$(this).val();
	var par= $(this).parent();
	var id="#"+$(this).parent().parent().parent().parent().attr('id');
	par.html(txt);
	par.attr('onclick','edittext(this)');
	console.log(id);
	
	localStorage.setItem(id, $(id).html());
	//par.on('click',edittext);
}
function linet(txt)
{
	var strs=txt.split("\n");
	var str="";
	for(var i=0;i<strs.length;i++)
	{
		str+="\t"+strs[i]+"\n";
	}
	str=str.trimEnd("\n");
	return str;
}
//检验json并转换
function isjson(txt)
{
	if(txt=='' || txt==undefined)
		return;
	try{
		var str='';
		var jso=txt;
		if(typeof(txt)=='string')
		{
			//console.log(1);
			jso=JSON.parse(txt.trim());
		}
			
		var isarray = jso instanceof Array;
		//console.log(isarray);
		$.each(jso,function(n,value){
			if(isarray)
			{
				//console.log(value);
				str+=linet(isjson(value))+",\n";
			}else
			{
				var ret="";
				if(typeof(value)=='string')
					value="\""+value+"\"";
				else if(typeof(value)=='object')
				{
					
					value="\n"+linet(isjson(value));
				}
					
				str+="\t\""+n+"\":"+value+","+"\n"
			}
			
		});
		if(isarray)
		{
			str= str.trimEnd('\n').trimEnd(',');
			str="[\n"+str+"\n]";
		}
		else
		{
			str= str.trimEnd('\n').trimEnd(',');
			str="{\n"+str+"\n}";
		}
		
		return str;
	}
	catch(e)
	{
		return e;
	}
}
function request(url,type,data,headers)
{
	var ret;
	 $.ajax({
            type:type,
            url,
            dataType:"text",
			headers:headers,
			data:data,
            beforeSend:function(XMLHttpRequest)
                {
                    $("#recv_data").val("正在请求...");
                  // Pause(this,100000);
                },
            success:function(msg)
                {  
                    $("#recv_data").val(decodeUnicode(msg));
					localStorage.setItem("#recv_data", decodeUnicode(msg));
                },
           complete:function(XMLHttpRequest,textStatus)
                {
					
                    //隐藏正在查询图片
                },
          error:function(e)
               {
				  
				   $("#recv_data").val("返回错误！");
				   localStorage.setItem("#recv_data", "返回错误！");
                    //错误处理
               }
            });
	
}

function getcode(code,type)
{
	var retcode="";
	$.ajax({
			url:"http://180.76.167.20/index.php/Home/Index/retcode",
			cache: false,
			async:false,
			type: "POST",
			data: {type:type,code:code},
			dataType: "json"
		}).done(function(msg) {
			//console.log(JSON.stringify(msg));
			retcode= msg.code;
		});
		return retcode;
}

var GB2312UnicodeConverter = { 
    ToUnicode: function (str) {
      return escape(str).toLocaleLowerCase().replace(/%u/gi, '\\u');
      } 
    , ToGB2312: function (str) {
        return unescape(str.replace(/\\u/gi, '%u'));
      } 
  };
    // 转为unicode 编码  
    function encodeUnicode(str) {  
        var res = [];  
        for ( var i=0; i<str.length; i++ ) {  
        res[i] = ( "00" + str.charCodeAt(i).toString(16) ).slice(-4);  
        }  
        return "\\u" + res.join("\\u");  
    }  
      
    // 解码  
    function decodeUnicode(str) {  
        str = str.replace(/\\/g, "%");  
        return unescape(str);  
    }  
document.addEventListener('DOMContentLoaded', function () {
	var data = chrome.extension.getBackgroundPage().articleData;
	$("#intefaceurl").change(function(){
		var val=$(this).val();
		localStorage.setItem("#intefaceurl", val);
		
	});
	$("#recv_data").change(function(){
		var val=$(this).val();
		localStorage.setItem("#recv_data", val);
	});
	//表格监听
	$("#input_val tr td").click(function(){
		edittext(this);
	});
	$("#input_header tr td").click(function(){
		edittext(this);
	});
	$("#post_data").change(function(){
		localStorage.setItem('#post_data', $(this).val());
	});
	$('input[name="header"]').click(function(){
		if($(this).prop('checked'))
		{
			$("#input_header").show();
			header=true;
		}
		else
		{
			$("#input_header").hide();
			header=false;
		}
		localStorage.setItem('input[name="header"]', header);
	});
	
	$('input[name="requetype"]').click(function(){
		var type=$(this).val();
		localStorage.setItem('input[name="requetype"]', type);
		switch(type)
		{
			case '1':$("#input_val").parent().hide();
			break;
			case '2':$("#input_val").parent().show();
			break;
			case '3':$("#input_val").parent().show();
			break;
			case '4':$("#input_val").parent().show();
			break;
		}
	});
	$('input[name="postdata"]').click(function(){
		var type=$(this).val();
		localStorage.setItem('input[name="postdata"]', type);
		switch(type)
		{
			case '1':$("#post_data").hide().siblings('table').show();postzdy=false;
			break;
			case '2':$("#post_data").show().siblings('table').hide();postzdy=true;
			break;
		}
	});
	$('input[name="datatype"]').click(function(){
		var type=$(this).val();
		localStorage.setItem('input[name="datatype"]', type);
		switch(type)
		{
			case '1':
			try{
				$("#recv_data").val(JSON.stringify(JSON.parse($("#recv_data").val())) );
			}
			catch(e){
				
			}
			break;
			case '2':$("#recv_data").val(isjson($("#recv_data").val()));
			break;
			case '3':console.log(1);
			break;
			
		}
	});
  $('#myTabs a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	});
	
	$('#btn_code').click(function(e){
		
		var code=$("#code").val();
		
		if(code==null || code=='')
			return;
		var type = $('input[name="type"]:checked ').val();
		
		switch(type)
		{
			case '1':$("#sendcode").val(encodeURIComponent(code));
			break;
			case '2':$("#sendcode").val(encodeUnicode(code));
			break;
			case '3':$("#sendcode").val(btoa(code));
			break;
			case '4':$("#sendcode").val(getcode(code,'md5'));
			break;
			default:
			 $("#sendcode").val(encodeURIComponent(code));
			 break;
		}
		
	});
    $("#btn_decode").click(function(e){
		
		var code=$("#code").val();
		
		if(code==null || code=='')
			return;
		var type = $('input[name="type"]:checked ').val();
		switch(type)
		{
			case '1':$("#sendcode").val(decodeURIComponent(code));
			break;
			case '2':$("#sendcode").val(decodeUnicode(code));
			break;
			case '3':$("#sendcode").val(atob(code));
			break;
			case '4':return;
			break;
			default:
			 $("#sendcode").val(decodeURIComponent(code));
			 break;
		}
		
	});
	$('#btn_regexcode').click(function(e){
		
		var code=$('#regexcode').val();
		//var pattern = /[\u4e00-\u9fa5]/;//判断是否是中文
		for(var j=0;j<code.length;j++)
		{
			for(var i=0;i<pattern.length;i++)
			{
			   if(pattern[i].test(code[j]))
			   {
				   console.log(pattern[i].test(code[j]));
				   //console.log(code[j]);
				   break;
			   }
			   
			}
		}
		
	
        //console.log(pattern.test(code));
		//console.log(code.length);
	});
	//request功能
	$("#btn_send").click(function(e){
		
		var type = $('input[name="requetype"]:checked ').val();
		var url=$("#intefaceurl").val();
		var reqtype;
		var data='';
		switch(type)
		{
			case '1':reqtype='GET';
			break;
			case '2':reqtype='POST';
			break;
			case '3':reqtype='PUT';
			break;
			case '4':reqtype='DELETE';;
			break;
		}
		var headerdata=Array();
		if(header)
		{
			$("#input_header tr").each(function(){
				var key1=$(this).children('td:eq(0)').text();
				var val1=$(this).children('td:eq(1)').text();
				if(key1.trim()!=' ' && key1!='undefined' && key1!='&nbsp;' && key1.trim()  && val1.trim() )
				  headerdata[key1.trim()]=val1.trim();
			});
		}
		console.log(headerdata);
		if(reqtype!='GET')
		{
			if(!postzdy)
			{
				$("#input_val tr").each(function(){
				var key1=$(this).children('td:eq(0)').text();
				var val1=$(this).children('td:eq(1)').text();
				if(key1.trim()!=' ' && key1!='undefined' && key1!='&nbsp;' && key1.trim()  && val1.trim() )
				  data+=key1.trim()+"="+val1.trim()+"&";
				});
				data=data.trimEnd('&');
			}
			else
			{
				data=$("#post_data").val();
			}
			
		}
		
		//console.log(reqtype);
		var ret=request(url,reqtype,data,headerdata);
		//$("#recv_data").val(ret);
	});
	/*if(data.error){
		$("#message").text(data.error);
		$("#content").hide();
	}else{
		$("#message").hide();
		$("#content-title").text(data.title);
		$("#content-author").text(data.author);
		$("#content-date").text(data.postDate);
		$("#content-first-access").text(data.firstAccess);
	}*/
	autotb();
});

