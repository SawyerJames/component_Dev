function H5(){
	this.id = ('h5_' +Math.random()).replace('.','_');
	this.el = $('<div class="h5" id="' +this.id+ '"></div>').hide();
	this.page = [];
	$('body').append(this.el);

	/**
	 * 新增页
	 * @param {[name]} name [组件名称，加入classname中]
	 * @param {[text]} text [页内默认文本]
	 * @返回H5对象，可以重复使用H5对象支持的方法
	 */
	this.addPage = function(name,text){
		var page = $('<div class="h5_page"></div>');
		if (name !== undefined) {
			page.addClass('h5_page section ' +name);
		}
		if (text !==undefined) {
			page.text(text);
		}
		this.el.append(page);
		this.page.push(page);
		if (typeof this.whenAddPage == 'function') {
			this.whenAddPage();
		}
		return this;
	}

	// 新增组件
	this.addComponent = function(name,cfg){
		var cfg = cfg ||{};
		var page = this.page.slice(-1)[0];
		cfg = $.extend({
			type : 'base',
		},cfg);
		var component;
		switch(cfg.type){
			case 'base':
				component = new componentBase(name,cfg);
				break;
			case 'Polyline':
				component = new componentPolyline(name,cfg);
				break;
			case 'Pie':
				component = new componentPie(name,cfg);
				break;
			case 'Point':
				component = new componentPoint(name,cfg);
				break;
			case 'radar':
				component = new componentRadar(name,cfg);
				break;
			case 'Bar':
				component = new componentBar(name,cfg);
				break;
			default:;
		}
		page.append(component);
		return this;
	}


	//页面初始化呈现 -->@param firstPage可以定位到初始第几页 -->测试直接使用loader(param)即可
	this.loader = function(firstPage){
		this.el.fullpage({
			'sectionsColor':['#000000','#000000','#000000'],
			onLeave:function(index,nextIndex,direction){
				$(this).find('.h5_component').trigger('onLeave');
			},
			afterLoad:function(anchorLink,index){
				$(this).find('.h5_component').trigger('afterLoad');
			},
		});
		this.page[0].find('.h5_component').trigger('afterLoad');
		this.el.show();
		//$.fn 指jq的命名空间，加上fn上的方法及属性，会对每一个jq实例有效。
		//eg. $.fn.abc(); -->之后可以使用$('#div').abc();
		if (firstPage) {
			$.fn.fullpage.moveTo(firstPage);
		}
	}
	this.loader = typeof H5_loading == 'function' ? H5_loading : this.loader;
	//返回H5对象，可以重复使用H5对象支持的方法
	return this;

}