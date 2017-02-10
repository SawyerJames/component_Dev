/*散点图*/
function componentPoint(name, cfg){
	var component = new componentBase(name,cfg);
	var base = cfg.data[0][1];//base = 0.4

	// 输出每一个point,循环数组
	$.each(cfg.data,function(index, item) {
		var point = $('<div class="point point_' +index+ '"></div>');
		var name = $('<div class="name" style="font-size:'+ 80*item[1]+ 'px' + '">' +item[0]+ '</div>');
		var rate = $('<div class="per">' +(item[1]*100)+ '%</div>');
		var per = (item[1]/base*100) + '%';
		point.width(per).height(per);
		if (item[2]) {
			point.css('backgroundColor', item[2]);
		}
		if (item[3]!==undefined && item[4]!==undefined) {
			point.css('left',item[3]).css('top',item[4]);
		}
		name.append(rate);
		point.append(name);
		component.append(point);
	});

	return component;
}
