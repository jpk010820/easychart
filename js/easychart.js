/*参数设置*/
	var paddingLR = 20;//左右空白像素
	var paddingTB = 20;//上下空白像素
	
	var canvas,context,themeColorList,iconLineX,iconLineY,proportionWidth,proportionHeight;
	
	function setLine(object){
		objectList = object;
		
		/*ini初始化*/
		canvas = document.getElementById(object.id)
		context = canvas.getContext('2d');
		
		/*设置canvas窗体大小*/
		canvas.width=object.windowLimit.x+paddingLR;
		canvas.height=object.windowLimit.y+paddingTB;
		
		/*设置主题颜色*/
		if(object.themeColorList==undefined){
			themeColorList = {
				pink:{
					border:"#b6b6b6",
					background:"#ffffff",
					chartBackground:"rgba(241,241,241,0.8)",
					line:"#647cfa",
					lineDot:"#647cfa",
					lineText:"#191919",
					iconLine:"#888888",
					dataBox:"#d1d1d1",
					dataBoxBackground:"rgba(255,255,255,0.8)",
					boxText:"#0d0d0d"
				},
				dark:{
					border:"#ffffff",
					background:"#111111",
					chartBackground:"rgba(30,30,30,0.8)",
					line:"#bc87f9",
					lineDot:"#bc87f9",
					lineText:"#ffffff",
					iconLine:"#ffffff",
					dataBox:"#bcbcbc",
					dataBoxBackground:"#1e1e1e",
					boxText:"#f3f3f3"
				},
				orange:{
					border:"#b6b6b6",
					background:"#ffffff",
					chartBackground:"rgba(241,241,241,0.8)",
					line:"#f36535",
					lineDot:"#f36535",
					lineText:"#191919",
					iconLine:"#888888",
					dataBox:"#d1d1d1",
					dataBoxBackground:"rgba(255,255,255,0.8)",
					boxText:"#0d0d0d"
				},
			}
		}else{
			themeColorList=object.themeColorList;
		}
		
		
		drawLine(object);
		
		/*移动端监听拖动事件*/
		canvas.addEventListener("touchmove", function(event){
			iconLineX =  event.changedTouches[0].clientX;
			iconLineY =  event.changedTouches[0].clientY;
			if(iconLineX>paddingLR && iconLineX<canvas.width && iconLineY>0 && iconLineY<canvas.height-paddingTB){
				context.clearRect(0,0,canvas.width,canvas.height)
				context.beginPath();
				context.moveTo(iconLineX,0);
				context.lineTo(iconLineX,canvas.height-paddingTB);
				context.strokeStyle = themeColorList[object.theme].iconLine;
				context.stroke(); 
				
				context.beginPath();
				context.moveTo(paddingLR,iconLineY);
				context.lineTo(canvas.width,iconLineY);
				context.strokeStyle = themeColorList[object.theme].iconLine;
				context.stroke(); 
				
				/*重绘*/
				drawLine(object);
				
				/*数据详情*/
				dataBox(object)
			}
			
		});
		
		/*移动端监听单击事件*/
		canvas.addEventListener("click", function(event){
			iconLineX =  event.offsetX;
			iconLineY =  event.offsetY;
			if(iconLineX>paddingLR && iconLineX<canvas.width && iconLineY>0 && iconLineY<canvas.height-paddingTB){
				context.clearRect(0,0,canvas.width,canvas.height)
				
				/*重绘*/
				drawLine(object);
			}
		});
		
		/*PC端鼠标事件监控*/
		canvas.addEventListener("mousemove", function(event){
			iconLineX =  event.clientX-4;
			iconLineY =  event.clientY-4;
			if(iconLineX>paddingLR && iconLineX<canvas.width && iconLineY>0 && iconLineY<canvas.height-paddingTB){
				context.clearRect(0,0,canvas.width,canvas.height)
				context.beginPath();
				context.moveTo(iconLineX,0);
				context.lineTo(iconLineX,canvas.height-paddingTB);
				context.strokeStyle = themeColorList[object.theme].iconLine;
				context.stroke(); 
				
				context.beginPath();
				context.moveTo(paddingLR,iconLineY);
				context.lineTo(canvas.width,iconLineY);
				context.strokeStyle = themeColorList[object.theme].iconLine;
				context.stroke(); 
				
				/*重绘*/
				drawLine(object);
				
				/*数据详情*/
				dataBox(object)
			}
			
		});
		
		/*PC端鼠标事件监控*/
		canvas.addEventListener("mouseout", function(event){
			context.clearRect(0,0,canvas.width,canvas.height)
			/*重绘*/
			drawLine(object);
		});
	}
	
	function drawLine(object){
		
		border({
			topLeft:{x:0+paddingLR,y:0},
			topRight:{x:0+paddingLR,y:canvas.height-paddingTB},
			bottomRight:{x:canvas.width,y:canvas.height-paddingTB},
			bottomLeft:{x:canvas.width,y:0},
			color:themeColorList[object.theme].border,
			dataBoxBackground:themeColorList[object.theme].chartBackground
		})
		canvas.style.background = themeColorList[object.theme].background;
		
		/*配置data数据 */ 
		proportionWidth = canvas.width/object.limit.x;
		proportionHeight = canvas.height/object.limit.y;
		
		for (var i = 0; i < object.data.length; i++) {
			if(i == 0){
				var lastData = {x:0,y:0}
			}else{
				var lastData = object.data[i-1]
			}
			
			var data = object.data[i]
			
			/*设置折线*/
			context.beginPath();
			context.moveTo(lastData.x*proportionWidth+paddingLR,(canvas.height-lastData.y*proportionHeight)-paddingTB);
			context.lineTo(data.x*proportionWidth+paddingLR,(canvas.height-data.y*proportionHeight)-paddingTB);
			context.strokeStyle = themeColorList[object.theme].line;
			context.closePath();
			context.stroke(); 
			/*设置折线上的点*/
			if(object.showLinePot==true){
				context.beginPath();
				context.arc(data.x*proportionWidth+paddingLR,(canvas.height-data.y*proportionHeight)-paddingTB,4,0,2*Math.PI);
				context.fillStyle=themeColorList[object.theme].lineDot; 
				context.strokeStyle=themeColorList[object.theme].lineDot; 
				context.closePath(); 
				context.fill(); 
			}
			
		}
		
		if(object.showTipUnit==true){
			
			/*设置y轴标注*/
			for (var i = 0; i < parseInt(object.limit.y/object.tipUnit.y); i++) {
				context.beginPath();
				context.fillText((parseInt(object.limit.y/object.tipUnit.y)-i)*object.tipUnit.y,0,i*(canvas.height/(object.limit.y/object.tipUnit.y)));
				context.fillStyle = themeColorList[object.theme].lineText; 
				context.stroke();
			}
			
			/*设置x轴标注*/
			for (var i = 0; i < parseInt(object.limit.x/object.tipUnit.x)-1; i++) {
				context.beginPath();
				context.fillText(i*object.tipUnit.x,i*(canvas.width/(object.limit.x/object.tipUnit.x))+paddingLR,canvas.height);
				context.fillStyle = themeColorList[object.theme].lineText; 
				context.strokeStyle = themeColorList[object.theme].lineText; 
				context.stroke();
			}
			
		}
	}
	
	function dataBox(object){
		if(iconLineX<(canvas.width+2*paddingLR)/2){ //鼠标在左
			border({
				topLeft:{x:(canvas.width+2*paddingLR)/2,y:1},
				topRight:{x:canvas.width-1,y:1},
				bottomRight:{x:canvas.width-1,y:(canvas.height-paddingTB)/2},
				bottomLeft:{x:(canvas.width+2*paddingLR)/2,y:(canvas.height-paddingTB)/2},
				color:themeColorList[object.theme].dataBox,
				dataBoxBackground:themeColorList[object.theme].dataBoxBackground
			})
			boxText(object,(canvas.width+2*paddingLR)/2+10);
		}else{
			border({
				topLeft:{x:0+paddingLR,y:1},
				topRight:{x:(canvas.width-paddingLR)/2,y:1},
				bottomRight:{x:(canvas.width-paddingLR)/2,y:(canvas.height-paddingTB)/2},
				bottomLeft:{x:0+paddingLR,y:(canvas.height-paddingTB)/2},
				color:themeColorList[object.theme].dataBox,
				dataBoxBackground:themeColorList[object.theme].dataBoxBackground
			})
			boxText(object,10+paddingLR);
		}
	}	
	
	function boxText(object,x){
		var boxMargin = 5;
		for (var i = 0; i < object.data.length; i++) {
			if(object.dataBoxMode){
				switch (object.dataBoxMode.toUpperCase()){
					case 'X':
						if(Math.ceil((iconLineX-paddingLR)/proportionWidth)==object.data[i].x){
							for (var o = 0; o < object.dataBox.length; o++) {
								boxMargin +=15;
								context.fillStyle = themeColorList[object.theme].boxText;
								context.fillText(object.dataBox[o].content+" ："+object.data[i][object.dataBox[o].label],x,boxMargin);
								context.fillStyle = themeColorList[object.theme].boxText; 
							}				
						}
						break;
					case 'Y':
						if(Math.ceil(canvas.height-object.data[i].y*proportionHeight)==iconLineY+paddingTB){
							for (var o = 0; o < object.dataBox.length; o++) {
								boxMargin +=15;
								context.fillStyle = themeColorList[object.theme].boxText;
								context.fillText(object.dataBox[o].content+" ："+object.data[i][object.dataBox[o].label],x,boxMargin);
								context.fillStyle = themeColorList[object.theme].boxText; 
							}
							return;
						}
						break;
					case 'XY':
						if(Math.ceil(canvas.height-object.data[i].y*proportionHeight)==iconLineY+paddingTB && Math.ceil((iconLineX-paddingLR)/proportionWidth)==object.data[i].x){
							for (var o = 0; o < object.dataBox.length; o++) {
								boxMargin +=15;
								context.fillStyle = themeColorList[object.theme].boxText;
								context.fillText(object.dataBox[o].content+" ："+object.data[i][object.dataBox[o].label],x,boxMargin);
								context.fillStyle = themeColorList[object.theme].boxText; 
							}				
						}
						break;
				}
			}else{
				if(Math.ceil((iconLineX-paddingLR)/proportionWidth)==object.data[i].x){
					for (var o = 0; o < object.dataBox.length; o++) {
						boxMargin +=15;
						context.fillStyle = themeColorList[object.theme].boxText;
						context.fillText(object.dataBox[o].content+":"+object.data[i][object.dataBox[o].label],x,boxMargin);
						context.fillStyle = themeColorList[object.theme].boxText; 
					}				
				}
			}
			
		}
		
	}
	
	function border(info){
		context.beginPath();
		
		context.moveTo(info.topLeft.x,info.topLeft.y);
		context.lineWidth = info.lineWidth;
		context.lineTo(info.bottomLeft.x,info.bottomLeft.y);
		context.lineTo(info.bottomRight.x,info.bottomRight.y);
		context.lineTo(info.topRight.x,info.topRight.y);
		context.lineTo(info.topLeft.x,info.topLeft.y);
		context.strokeStyle = info.color;
		context.stroke(); 
		context.closePath(); 
		context.fillStyle=info.dataBoxBackground;
		context.fill(); 
	}
