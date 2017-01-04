// JavaScript Document
(function($){
	//默认参数
	var defaults ={
		imgUrl:"",
		width:'100%',
		height:'100%',
		size:"200×200",//大小
		camera:0,	   //摄像头是否开启
		isrefresh:0,	//是否刷新页面
		quality:80,		//生成图片质量
		upUrl:"",			//图片处理地址
		type:5,			//剪裁类型
		avatarPreview:true,//是否屏蔽左边的预览图
		wmode:"transparent",//flash透明`
		uploadType:2,//上传类型 
		id:"m",	//容器id
		params:{},
		onBeforeUpload:null,
		onClose:null,
		onUpload:null,
		onUploadResponse:null,
	};
	$.fn.meituClip=function(options){
		//var settings=$.extend(defaults,options);//！！！option为传递过来的参数,传过来的参数会代替默认值,并且会修改了defaults默认值，defaults.size为修改后的
		var settings=$.extend({},defaults,options||{});//没有破坏默认值，下次可以继续调用
		var mei=new MeituClip(settings);
		//debugger;//断点
		/*console.log(settings.size);
		console.log(defaults.size);
		console.log(settings.onBeforeUpload())*/
		//var meituClip=new MeituClip();
		//meituClip.onInit();
		mei.onInit();//加载美图
		/*return this.each(function(){////遍历匹配的元素，此处的this表示为jquery对象，而不是dom对象 
			var o=$(this);
			//alert("a");
		});*/
	}
	//定义美图的
	function MeituClip(settings){
		this.settings=settings;
	}
	MeituClip.prototype={
		onInit:function(){
			var _this=this;
			xiuxiu.embedSWF(this.settings.id, this.settings.type, this.settings.width, this.settings.height,"xiuxiuEditor");
			xiuxiu.onInit = function (){
				//默认加载图片地址
				xiuxiu.loadPhoto(_this.settings.imgUrl);
			}
			//图片处理后台地址
			xiuxiu.setUploadURL(this.settings.upUrl);
			//设置上传类型，2为标准表单上传，1为流式上传
			xiuxiu.setUploadType (2);
			xiuxiu.setUploadDataFieldName("upload_file");
			//防止美图秀秀编辑器盖住了顶导
			xiuxiu.params.wmode = this.settings.wmode;
			//设置剪裁框大小，即最后生成图片的大小。格式：["320x240","640x480"])，或格式["3:5"]
			xiuxiu.setLaunchVars("cropPresets", this.settings.size);
			//禁用摄像头,0禁用，1开启
			xiuxiu.setLaunchVars("cameraEnabled",  this.settings.camera);
			//生成图片质量
			xiuxiu.setLaunchVars("quality",  this.settings.quality);
			//设置上传参数
			xiuxiu.setUploadArgs(this.settings.params);
			//美团秀秀关闭事件
			if($.isFunction(this.settings.onClose)){
				this.settings.onClose();
			}
			else{
				this.onClose();
			}
			//上传前函数	
			if($.isFunction(this.settings.onBeforeUpload)){
				this.settings.onBeforeUpload();
			}
			else{
				this.onBeforeUpload();
			}
			//保存按钮被点击的时候触发的方法
			if($.isFunction(this.settings.onUpload)){
				this.settings.onUpload();
			}
			else{
				this.onUpload();
			}
			//美团秀秀响应事件
			if($.isFunction(this.settings.onUploadResponse)){
				this.settings.onUploadResponse();
			}
			else{
				this.onUploadResponse();
			}
		},
		onBeforeUpload:function(){
			//上传前函数	
			xiuxiu.onBeforeUpload = function (data, id){
			  //上传前更新参数
			  xiuxiu.setUploadArgs(this.settings.params, id);
			  return true;
			}
		},
		onClose:function(){
			//美团秀秀关闭事件
			xiuxiu.onClose = function (id){
				//隐藏
				$(".meituClip,.meituClipBg").hide();
				//关闭object flash,预防打开一张图片，原来默认加载的第一张
				xiuxiu.remove("xiuxiuEditor");
			}
		},
		onUpload:function(){
			//保存按钮被点击的时候触发的方法
		},
		onUploadResponse:function(){
			//美团秀秀响应事件，需要自己写回调数据
			xiuxiu.onUploadResponse = function (data)
			{
				if(data!=""){
					alert("上传成功")
				}
			}
		}
	}
})(jQuery);