function componentRadar(name,cfg){
	var component = new componentBase(name,cfg);

	//绘制网格线
	var w = cfg.width;
	var h = cfg.height;

	// 创建画布-->第1层canvas-->背景层
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);
	// 创建完毕
	
	/* 计算一个圆周上的坐标（多边形定点坐标）
	 * 圆心(a,b),半径r;角度deg;
	 * x = a + Math.sin( rad ) * r;
	 * y = b + Math.cos( rad ) * r;
	 * rad = ( 2 * Math.PI /360) * ( 360 / step ) * i;
	 */
	//填充雷达图背景(分10面绘制)
	var r = w/2;
	var step = cfg.data.length;
	var isFalse = false;
	for(var s=10;s>0;s--){
		ctx.beginPath();
		ctx.strokeStyle = '#f1f9ff';
		for(var i=0;i<step;i++){
			var rad = ( 2 * Math.PI /360) * ( 360 / step ) * i;
			var x = r + Math.sin( rad ) * r * (s/10);
			var y = r + Math.cos( rad ) * r * (s/10);
			ctx.lineTo(x,y);
		}
		ctx.closePath();
		ctx.fillStyle = (isFalse = !isFalse) ? '#99c0ff' : '#f1f9ff';
		ctx.fill();
	}
	ctx.stroke();
	

	//绘制伞骨图
	for(var i=0;i<step;i++){
		var rad = ( 2 * Math.PI /360) * ( 360 / step ) * i;
		var x = r + Math.sin( rad ) * r;
		var y = r + Math.cos( rad ) * r;
		ctx.moveTo(r,r);
		ctx.lineTo(x,y);
		//输出项目文字
		var text = $('<div class="text"></div>');
		text.text(cfg.data[i][0]);
		//延迟出现技巧：使用css3与for循环延迟动画
		text.css('-webkit-transition', 'all .5s ' + i*.1 + 's');
		text.css('-o-transition', 'all .5s ' + i*.1 + 's');
		text.css('transition', 'all .5s ' + i*.1 + 's');
		if ( x > w/2) {
			text.css('left',x/2+2);
		}
		else{
			text.css('right',(w-x)/2+2);
		}
		if ( y > h/2) {
			text.css('top',y/2+2);
		}
		else{
			text.css('bottom',(h-y)/2+2);
		}
		if (cfg.data[i][2]) {
			text.css('color',cfg.data[i][2]);
		}
		component.append(text);
		text.css('opacity', 0);
	}
	ctx.lineWidth = 3;
	ctx.stroke();

	/*绘制数据层
	 *创建数据层画布
	 */
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);

	//绘制类函数
	function draw(per){
		if (per >= 1) {
			component.find('.text').css('opacity', 1);
		}
		if (per <= 1) {
			component.find('.text').css('opacity', 0);
		}
		ctx.clearRect(0,0,w,h);
		ctx.lineWidth = 1.5;
		for(var i=0;i<step;i++){
			var rad = ( 2 * Math.PI /360) * ( 360 / step ) * i;
			var rate = cfg.data[i][1] * per;
			var x = r + Math.sin( rad ) * r * rate;
			var y = r + Math.cos( rad ) * r * rate;
			ctx.lineTo(x,y);
		}
		ctx.closePath();
		ctx.stroke();
		ctx.fillStyle = '#ff7676';
		ctx.strokeStyle = '#F00909';
		for(var i=0;i<step;i++){
			var rad = ( 2 * Math.PI /360) * ( 360 / step ) * i;
			var rate = cfg.data[i][1] * per;
			var x = r + Math.sin( rad ) * r * rate;
			var y = r + Math.cos( rad ) * r * rate;
			ctx.beginPath();
			ctx.arc(x,y,5,0,2*Math.PI);
			ctx.fill();
			ctx.closePath();
		}
	}
	draw(0);

	//折线生长动画
	component.on('afterLoad', function() {
		var s = 0;
		for(i=0;i<100;i++){
			setTimeout(function(){
				s += 0.01;
				draw(s);
			}, i*10+300);
		}
	});
	component.on('onLeave', function() {
		var s = 1;
		for(i=0;i<100;i++){
			setTimeout(function(){
				s -= 0.01;
				draw(s);
			}, i*10);
		}
	});
	
	return component;
}