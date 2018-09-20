/**
 * 根据id属性的值,返回对应的标签元素
 * @param id id属性的值,string类型
 * @returns {Element} 元素对象
 */
function my$(id) {
	return document.getElementById(id)
}


// 获取任意标签中间的文本内容
function getText(ele) {
	if (ele.innerText) {
		return ele.innerText;
	} else {
		return ele.textContent;
	}
}

// 设置任意的标签中间的任意文本内容
function setText(ele, txt) {
	if (ele.innerText) {
		ele.innerText = txt;
	} else {
		ele.textContent = txt;
	}
}

/**获取元素的上一个兄弟元素
 * @param ele  :元素
 * @return node:上一个兄弟元素
 */
function getPreviousElementSibling(ele) {
	if (ele.previousElementSibling) {
		return ele.previousElementSibling;
	} else {
		var node = ele.previousSibling
		while ((node != null) && (node.type != 1)) {
			node = ele.previousSibling
		}
		return node;
	}
}

/**获取元素的下一个兄弟元素
 * @param ele  :元素
 * @return node:下一个兄弟元素
 */
function getNextElementSibling(ele) {
	if (ele.nextElementSibling) {//谷歌火狐
		return ele.nextElementSibling;
	} else {//IE8浏览器
		//1.获取下一个兄弟节点
		var node = ele.nextElementSibling;
		/*node获得是哪些东西：文本  注释  元素 null
		如果获取的不是元素节点并且存在，继续向下找
		 */
		while (node && node.nodeType != 1) {//只要node存在（不是null），并且节点类型不是1（不是元素），继续向下找
			node = node.nextElementSibling;
		}
		;
		//循环结束条件： （1）node是null（找到底了还是没有找到，ele就是最后一个子元素）  （2）nodeType == 1：找到了
		return node;
	}
}

/**获取元素的第一个子元素
 *
 * @param ele 父元素
 * @return node  第一个子元素
 */
function getFirstElementChild(ele) {
	//能力检测
	if (ele.firstElementChild) {//谷歌火狐
		return ele.firstElementChild;
	} else {//IE8
		//1.获取第一个子节点
		var node = ele.firstChild;
		//2.继续往下找条件  （1）能找到  （2）节点类型 != 1
		while (node && node.nodeType != 1) {
			node = node.nextSibling
		}
		;
		//3.返回node
		return node;
	}
}

/**获取元素的最后一个子元素
 *
 * @param ele 父元素
 * @return node  最后一个子元素
 */
//ie8 子节点不包括空文本 包括元素(标签) 注释 文本   --->ie8不能直接通过元素获取语法来获取元素
function getLastElementChild(ele) {
	//能力检测
	if (ele.lastElementChild) {//谷歌火狐
		return ele.lastElementChild;
	} else {//IE8
		//1.获取最后一个子节点
		var node = ele.lastChild;
		//2.继续往上找条件  （1）能找到  （2）节点类型 != 1
		while (node && node.nodeType != 1) {
			node = node.previousSibling
		}
		//3.返回node
		return node;
	}
}

/** 全部移动
 @param form:要移出的元素
 @param to：要移入的元素
 */
function moveAll(from, to) {//传父元素
	for (var i = 0; i < from.children.length; i++) {
		to.appendChild(from.children[i]);
		i--;
	}
}

/**选中移动
 @param form:要移出的元素
 @param to：要移入的元素
 */
function moveSelect(from, to) {//传父元素
	for (var i = 0; i < from.children.length; i++) {
		if (from.children[i].selected == true) {
			to.appendChild(from.children[i]);
			i--;
		}
	}
}

//封装匀速动画函数  --->相对父级元素左侧
//如 my$("btn1").onclick = function (){
// animate(my$("dv"),400);  --->移动到400px位置
// }
function animate1(element, target) {
	clearInterval(element.timeId);
	element.timeId = setInterval(function () {
		var step = 10
		//step 每次移动的步数
		//获取div的当前位置
		var current = element.offsetLeft;//数字类型,没有px
		/****如要实现变速只需将(目标位置-当前位置)的绝对值赋值给step****/
		// current当前位置  target目标位置
		step = current < target ? step : -step;
		//如果当前的步数小于目标步数 就走step 反之走-step
		current += step;
		//当前位置每次加移动的步数
		if (Math.abs(target - current) > Math.abs(step)) {
			//(如果目标步数-当前步数)的绝对值>每次移动的步数的绝对值
			element.style.left = current + "px";
			//元素的左偏移就等于当前位置
		} else {
			clearInterval(element.timeId);
			//否则,清除定时器
			element.style.left = target + "px";
			//元素的左偏移就等于目标位置
		}
	}, 10)
}

// 封装getscroll函数
function getScroll() { //---用法:getScroll().left 获取左卷曲距离  getScroll().top 获取上卷曲距离
	return {
		left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
		top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
	}
}

//封装元素计算后的样式属性值 --->兼容IE8
function getStyle(element, attr) {
	return window.getComputedStyle ? window.getComputedStyle(element, null)[attr] : element.currentStyle[attr];
}

//封装缓动动画函数增加多个属性
function animate(element, json, fn) {
	clearInterval(element.timeId);
	element.timeId = setInterval(function () {
		var flag = true;//假设全部到达目标
		for (var attr in json) {

			if (attr == "opacity") {
				//获取元素的当前的透明度,当前的透明度放大100倍
				var current = getStyle(element, attr) * 100;
				//当前的透明度放大100倍
				var target = json[attr] * 100;
				var step = (target - current) / 10;
				step = step > 0 ? Math.ceil(step) : Math.floor(step);
				current += step;//移动后的值
				element.style[attr] = current / 100;
			}
			else if (attr == "zIndex") {
				element.style[attr] = json[attr];
			}
			else { //普通的属性
				//获取元素这个属性的当前的值
				var current = parseInt(getStyle(element, attr));//---这个方法是调用封装的元素计算后的样式属性值,如果要用必须先写封装函数
				//当前的属性对应的目标值
				var target = json[attr];
				//移动的步数
				var step = (target - current) / 10;
				step = step > 0 ? Math.ceil(step) : Math.floor(step);
				current += step;//移动后的步数
				element.style[attr] = current + "px";
			}
			//是否到达目标
			if (current != target) {
				flag = false
			}
		}
		if (flag) {
			//如果flag成立
			//清理定时器
			clearInterval(element.timeId);
			if (fn) {//---如果传入的函数成立才执行
				fn()
			}
		}
	}, 20);
}

//封装图片跟着鼠标动的兼容性代码--->为了IE8!!
var evt = {
	//window.event和事件参数对象e的兼容
	getEvent: function (e) {
		return window.event || e
	},
	//可视区域的横坐标的兼容性代码
	getClientX: function () {
		return this.getEvent(e).clientX;
	},
	//可视区域的纵坐标的兼容性代码
	getClientY: function () {
		return this.getEvent(e).clientY;
	},
	//页面向左卷曲出去的横坐标的兼容性代码
	getScrollLeft: function () {
		return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
	},
	//页面向上卷曲出去的纵坐标的兼容性代码
	getScrollTop: function () {
		return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
	},
	//相对于页面的横坐标(pageX或者是clientX+scrollLeft)
	getPageX: function (e) {
		return this.getEvent(e).pageX ? this.getEvent(e).pageX : this.getClientX(e) + this.getScrollLeft();
	},
	//相对于页面的纵坐标(pageY或者是clientY+scrollTop)
	getPageY: function (e) {
		return this.getEvent(e).pageY ? this.getEvent(e).pageY : this.getClientY(e) + this.getScrollTop();
	}
}


//为任意元素,绑定任意的事件,任意的元素,事件类型,事件处理函数,为了兼容IE8
function addEvent(element, type, fn) {
	//判断浏览器是否支持这个方法
	if (element.addEventListener) {
		element.addEventListener(type, fn, false);
	} else if (element.attachEvent) {
		element.attachEvent("on" + type, fn);
	} else {
		element["on" + type] = fn;
	}
}

//解绑事件的兼容性代码
function removeEvent(element, type, fnName) {//要解绑的话,函数必须是具名函数
	if (element.removeEventListener) {
		element.removeEventListener(type, fnName, false);
	} else if (element.datachEvent) {
		element.datachEvent("on" + type, fnName);
	} else {
		element["on" + type] = null;
	}
}





