//-----------------------------------组件配置文件------------------------------//
function componentBase(name,cfg){
	//基本配置文件
	var cfg = cfg || {};
	var id = ('h5_' +Math.random()).replace('.','_');
	var cls = 'h5_' +cfg.type+ ' h5_'+ name;
	var component = $('<div class="h5_component ' +cls+ '" id="' +id+ '"></div>');
	var sloganDiv = $('<div class="'+cfg.sloganClass+'"></div>');
	var slogan = $('<p class="h5_sloganTxt">'+cfg.slogan+'</p>');
		sloganDiv.append(slogan)
	cfg.width && component.width(cfg.width/2);
	cfg.height && component.height(cfg.height/2);
	cfg.css && component.css(cfg.css);
	cfg.class && component.addClass(cfg.class);
	cfg.slogan && component.append(sloganDiv);
	cfg.bg && component.css('backgroundImage','url('+cfg.bg+')');
	if ( cfg.text instanceof Object ) {
		for(i=0;i<cfg.text.length;i++){
			var spanNum = $('<p class="spanNum">'+ cfg.text[i][0] +'</p>');
			var spanText = $('<span class="spanText">'+ cfg.text[i][1] +'</span>');
			var spanPer = $('<span class="spanPer">' + cfg.text[i][2] + '</span>')
			var spanDiv = $('<div class="spanDiv"></div>');
			spanDiv.append(spanNum).append(spanText).append(spanPer);
			component.append(spanDiv); 
		}
	}
	if (typeof cfg.text === 'string') {
		component.text(cfg.text);
	}
	if (cfg.center === true) {
		component.css({
			marginLeft : (cfg.width/4 * -1)+'px',
			left : '50%'
		})
	}
	if (typeof cfg.onclick == 'function') {
		component.on('click',cfg.onclick);
	}

	//fullPage 上下翻页动画：加入css及animate
	component.on('afterLoad',function(){
		setTimeout(function(){
			component.addClass(cfg.type + '_load').removeClass(cfg.type + '_leave');
			cfg.animateIn && component.animate(cfg.animateIn);
		},cfg.delay || 0);
		return false;
	})
	component.on('onLeave',function(){
		setTimeout(function(){
			component.addClass(cfg.type + '_leave').removeClass(cfg.type + '_load');
			cfg.animateOut && component.animate(cfg.animateOut);
		},cfg.delay || 0);
		return false;
	})


	//点击自动触发
	var leave = true;
	$('body').on('click',function() {
		leave = !leave;
		$('.h5_component').trigger(leave ? 'onLeave' : 'afterLoad');
	});
	return component;
}