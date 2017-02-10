function componentPie(name,cfg){
	var component = new componentBase(name,cfg);

	//绘制网格线
	var w = cfg.width;
	var h = cfg.height;

	// 创建画布-->第1层canvas-->背景层
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	$(cns).css('z-index', 1);
	component.append(cns);
	// 创建完毕
	
	//绘制底图层
	var r = w/2;
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.fillStyle = '#eee';
	ctx.strokeStyle = '#eee';
	ctx.arc(r,r,r,0,2*Math.PI);
	ctx.fill();
	ctx.stroke();

	/*绘制数据层
	 *创建数据层画布
	 */
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	$(cns).css('z-index', 2);
	component.append(cns);

	var colors = ['red','green','blue','#FF0EDA']; //备用颜色
	var sAngel = 1.5*Math.PI; //12点的开始角度
	var eAngel = 0; //结束角度
	var aAngel = 2*Math.PI //100%圆的结束角度
	var step = cfg.data.length;

	for(var i=0;i<step;i++){
		var item = cfg.data[i];
		var color = item[2] || (item[2] = colors.pop());
		eAngel = sAngel + aAngel*item[1];
		ctx.beginPath();
		ctx.lineWidth = .1;
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
		ctx.moveTo(r,r);
		ctx.arc(r,r,r,sAngel,eAngel);
		ctx.fill();
		ctx.stroke();
		sAngel = eAngel;

		//加入项目名称
		var text = $('<div class="text"></div>');
		text.text(cfg.data[i][0]);

		var x = r + Math.sin( .6*Math.PI - sAngel ) * r;
		var y = r + Math.cos( .6*Math.PI - sAngel ) * r;
		if (x>w/2) {
			text.css('left',x/2+10);
		}
		else{
			text.css('right',(w-x)/2+10);
		}
		if (y>h/2) {
			text.css('top',y/2+10);
		}
		else{
			text.css('bottom',(h-y)/2+10);
		}
		if (cfg.data[i][2]) {
			text.css('color',cfg.data[i][2]);
		}
		text.css('opacity',0);
		component.append(text);
	}

	//加入蒙版层
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	$(cns).css('z-index', 3);
	component.append(cns);
 
	ctx.lineWidth = 1;
	ctx.fillStyle = '#eee';
	ctx.strokeStyle = '#eee';
	
	//生长动画
	function draw(per){
		ctx.clearRect(0,0,w,h);
		ctx.beginPath();
		ctx.moveTo(r,r);
		if (per<=0) {
			ctx.arc(r,r,r,0,2*Math.PI);
			component.find('.text').css('opacity', 0);
		}
		else{
			ctx.arc(r,r,r,sAngel,sAngel+2*Math.PI*per,true);
		}
		if(per>=1){
			// component.find('.text').css('transition', 'all 0s');
			componentPie.reSort( component.find('.text') );
			component.find('.text').css('transition', 'all 1s');
			component.find('.text').css('opacity', 1);
		}
		ctx.fill();
		ctx.stroke();
	}
	draw(0);
	//饼图生长动画控件
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

// 重排元素位置，分隔元素使之不重叠-->>投影检测法
componentPie.reSort = function(list){
	// 检测相交
	function compare(domA,domB){
		//获取偏移量,不直接选择css-left是因为未定义的left会产生auto
		var offsetA = $(domA).offset(); 
		var offsetB = $(domB).offset();

		//获取A,B投影
		var shadowA_x = [offsetA.left, $(domA).width()+offsetA.left];
		var shadowA_y = [offsetA.top, $(domA).height()+offsetA.top];
		var shadowB_x = [offsetB.left, $(domB).width()+offsetB.left];
		var shadowB_y = [offsetB.top, $(domB).height()+offsetB.top];

		//检测--固定公式,相交为true，不相交为false
		var intersect_x = (shadowA_x[0] > shadowB_x[0] && shadowA_x[0] < shadowB_x[1]) || (shadowA_x[1] > shadowB_x[0] && shadowA_x[1] < shadowB_x[1]);
		var intersect_y = (shadowA_y[0] > shadowB_y[0] && shadowA_y[0] < shadowB_y[1]) || (shadowA_y[1] > shadowB_y[0] && shadowA_y[1] < shadowB_y[1]);
		return intersect_x && intersect_y;
	}

	//重排
	function resetY(domA,domB){
		//纵向重排，错开两个元素其中一个height的高度，由于css获取到的top为字符串
		//则parseInt转换成数值后再相加.
		if ($(domA).css('top') != 'auto') {
			$(domA).css('top',parseInt($(domA).css('top')) + $(domB).height());
		}
		if ($(domA).css('bottom') != 'auto') {
			$(domA).css('bottom',parseInt($(domA).css('bottom')) + $(domB).height());
		}
		//横向排列，仅供参考
		// if ($(domA).css('right') != 'auto') {
		// 	$(domA).css('right',(parseInt($(domA).css('right')) + $(domB).width())/2);
		// }
		// if ($(domA).css('left') != 'auto') {
		// 	$(domA).css('left',(parseInt($(domA).css('left')) + $(domB).width())/2);
		// }
	}

	//定义将要重排的元素
	var willReset = [];

	//循环list列表，i,domTarget均为被循环函数，如果两者相交比较为true，将其中一个放入栈中用于重排
	//如果超出列表循环范围，取消循环。
	$.each(list,function(i,domTarget){
		if (list[i+1]) {
			compare(domTarget,list[i+1]);
			if (compare(domTarget,list[i+1])) {
				willReset.push(domTarget);
			}
			// console.log($(domTarget).text(),'和',$(list[i+1]).text(),'是否相交:'+compare(domTarget,list[i+1]));
		}
	})

	//从栈中循环元素，使两者重排
	if (willReset.length > 1) {
		$.each(willReset,function(i,domA){
			if (willReset[i+1]) {
				resetY(domA,willReset[i+1]);
			}
		});

		//递归 -->将位置不满足要求的元素重新进行重排
		componentPie.reSort(willReset);
	}
}