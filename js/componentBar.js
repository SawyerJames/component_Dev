function componentBar(name,cfg){
	var component = new componentBase(name,cfg);
	$.each(cfg.data,function(index, item) {
		var name = $('<div class="name"></div>');
		var line = $('<div class="line"></div>');
		var rate = $('<div class="rate"></div>');
		var per = $('<div class="per"></div>');
		var width = item[1]*100 + '%';
		// bg 作为遮罩层,实现柱形图生长动画
		var bg = $('<div class="bg"></div>');
		var bgStyle = '';

		if (item[2]) {
			bgStyle = ('style="background-color:'+item[3]+'"');
		}
		rate.html('<div class="bg"' +bgStyle+ '></div>');
		rate.css('width', width);
		per.text(item[2]);
		name.css('color','#DADADA');
		name.text(item[0]);
		line.append(name).append(rate).append(per);
		component.append(line);
	});
	return component;
}