function componentPolyline(name,cfg){
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
	
	// 画水平网格线 100份-->10份
	var step = 10;
	ctx.beginPath();	//开始canvas
	ctx.lineWidth = 1.5;	   //画笔大小
	ctx.strokeStyle = '#FFFFFF';	   //颜色
	window.ctx = ctx;
	for (var i=0; i<step+1; i++) {
		var y = (h/step) * i;
		ctx.moveTo(0,y);
		ctx.lineTo(w,y);
	}

	// 画垂直网格线（根据项目个数区分）-->>并填写项目名称
	step = cfg.data.length+1;
	var text_w = w/step;
	for (var i=0; i<step+1; i++) {
		var x = (w/step) * i;
		var text = $('<div class="text"></div>');
		ctx.moveTo(x,0);
		ctx.lineTo(x,h);
		if (cfg.data[i]) {
			var span = $('<span>'+cfg.data[i][0]+'</span>');
			// text.text(cfg.data[i][0]);
			text.append(span);
			span.css('color','#FFFFFF');
			text.css('width',text_w).css('left',x/2);
			component.append(text);
		}
	} 
	ctx.stroke(); //收笔

	// 创建画布-->第二层canvas-->数据层
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);

	/*绘制折现以及对应的数据和阴影
	 *@param {per} 0-1之间的数据，会根据这个值绘制最终数据对应的中间状态
	 */
	function draw(per){
		//清空画布
		ctx.clearRect(0,0,w,h);

		// 绘制折线数据
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#ff8878';
		var x = 0;
		var y = 0;
		var row_w = (w / (cfg.data.length+1));
		for(i in cfg.data){  //如果数组被for in，那么i为数组下标（不严谨）
			var item = cfg.data[i];
			x = row_w*i + row_w;
			y = h-(item[1]*h*per);
			ctx.moveTo(x,y);
			ctx.arc(x,y,5,0,2*Math.PI);
		}

		// 连线
			// 移动画笔到第一个数据点位置
		ctx.moveTo(row_w,h-(cfg.data[0][1]*h*per));
		for(i in cfg.data){
			var item = cfg.data[i];
			x = row_w*i + row_w;
			y = h-(item[1]*h*per);
			ctx.lineTo(x,y);
		}

		//绘制阴影
		ctx.lineTo(x,h);
		ctx.lineTo(row_w,h);
		ctx.fillStyle = 'rgba(255,136,120,0.2)';
		ctx.fill();
		ctx.stroke();

		//写数据
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#000000';
		for(i in cfg.data){  //如果数组被for in，那么i为数组下标（不严谨）
			var item = cfg.data[i];
			x = row_w*i + row_w;
			y = h-(item[1]*h*per);
			z = h + 20;
			if (item[2]) {
				ctx.fillStyle = item[2] ? item[2] : 'rgba(255,136,120,1)';
			}
			ctx.fillText(((item[1]*100)>>0)+'%',x-10,y-10);
		}
		ctx.stroke();
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
