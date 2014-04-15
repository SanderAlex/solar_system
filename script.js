window.onload = function() {
  var browser, W, H, counter, au, s, sunD, termTab, termSize;
  var html = document.documentElement;
  var body = document.getElementById("body");

  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var canvas0 = document.getElementById("canvas0");
  var context0 = canvas0.getContext("2d");
  var orbits = document.getElementById("orbits");
  var ctxOrb = orbits.getContext("2d");
  var terminal = document.getElementById("terminal");
  var ctxTerm = terminal.getContext("2d");

  var fullScreen = document.getElementById("full_screen_button");

  var IMG = new Array;

  IMG[0] = new Image; IMG[0].src = "img/ls22.jpg";
  IMG[1] = new Image; IMG[1].src = "img/sun.png";
  IMG[2] = new Image; IMG[2].src = "img/mercury.png";
  IMG[3] = new Image; IMG[3].src = "img/venus.png";
  IMG[4] = new Image; IMG[4].src = "img/earth.png";
  IMG[5] = new Image; IMG[5].src = "img/mars.png";
  IMG[6] = new Image; IMG[6].src = "img/fog.png";
  IMG[7] = new Image; IMG[7].src = "img/jupiter.png";
  IMG[8] = new Image; IMG[8].src = "img/saturn.png";
  IMG[9] = new Image; IMG[9].src = "img/uranius.png";
  IMG[10] = new Image; IMG[10].src = "img/neptune.png";
  IMG[11] = new Image; IMG[11].src = "img/pluto.png";
  IMG[12] = new Image; IMG[12].src = "img/asteroid.png";
  IMG[13] = new Image; IMG[13].src = "img/asteroid1.png";

  function browserSearch() {
      var ua = navigator.userAgent;
      console.log(ua);
      if (ua.search(/Trident/) > 0) return 'Internet Explorer';
      if (ua.search(/Firefox/) > 0) return 'Firefox';
      if (ua.search(/OPR/) > 0) return 'Opera';
      if (ua.search(/Chrome/) > 0) return 'Google Chrome';
      if (ua.search(/Safari/) > 0) return 'Safari';
  }

  function pageConfig() {
    if (browser == "Google Chrome" || browser == "Firefox" || browser == "Opera" || browser == "Safari") {
      body.setAttribute("marginwidth", 0);
      body.setAttribute("marginheight", 0);
    }
    else if (browser == "Internet Explorer") {
      body.setAttribute("leftmargin", 0);
      body.setAttribute("topmargin", 0);
    }

    W = canvas.width = window.screen.availWidth;
    H = canvas.height = window.screen.height;
    orbits.width = terminal.width = canvas0.width = W;
    orbits.height = terminal.height = canvas0.height = H;
    body.style.width = W + "px";
    body.style.height = H + "px";

    counter = 24;
    au = H/counter;
    s = 2*Math.PI/720;
    sunD = au*3;
    termTab = 0;
    termSize = H/4;
  }

  function waitForImages() {
  	for (var i = 0; i < IMG.length; i++) 
  		if(!IMG[i].complete) {
  			setTimeout(waitForImages, 100)
  			return;
  		}
  		main();
  }

  function drawBackground() {
    space = context0.createPattern(IMG[0], "repeat");
    context0.fillStyle = space;
    context0.fillRect(0, 0, W, H);

    drawFog(200);
    drawAsteroids(35);
  }

  function drawFog(k) {
    for(var i = 0; i < H; i += Math.random()*k) {
      for(var j = 0; j < W; j += Math.random()*k) {
        var r = Math.random()*256;
        context0.drawImage(IMG[6], j, i, r, r);
      }
    }
  }

  function drawAsteroids(r) {
    var x, y, f = 0;
    context0.save();
    context0.translate(-r/2, -r/2);
    for (var i = 0; i < 60; i++) {
      f += s*15;
      x = W/2 + W/counter*6*Math.sin(f) + Math.random()*13 - Math.random()*13;
      y = H/2 + au*6*Math.cos(f) + Math.random()*13 - Math.random()*13;
      context0.drawImage(IMG[12], x, y, r, r);
    }
    for (var i = 0; i < 60; i++) {
      f += s*10;
      x = W/2 + W/counter*6*Math.sin(f) + Math.random()*20 - Math.random()*20;
      y = H/2 + au*6*Math.cos(f) + Math.random()*20 - Math.random()*20;
      context0.drawImage(IMG[12], x, y, r, r);
    }
    context0.restore();
  }

  function Planet(name, n, d, s) {
    this.name = name;
    this.picked = false;
  	this.num = n;
  	this.d = d;
    this.s = s;
    this.x0 = W/counter*n;
    this.y0 = n*au;
    if(this.num != 1) {
      this.f = Math.random() * 20 - 10;
      this.x = Math.sin(this.f);
      this.y = Math.cos(this.f);
      this.ellipse(ctxOrb, "#f2ddc6", 0.3);
    }
    else {
      this.x = W/2;
      this.y = H/2;
    }
  }

  Planet.prototype.draw = function() {
    context.save();
      context.translate(-this.d/2, -this.d/2);
    	context.drawImage(IMG[this.num], this.x, this.y, this.d, this.d);
      if (this.picked == true)
        context.fillText(this.name, this.x, this.y - 5);
    context.restore();
  }

  Planet.prototype.move = function() {
    this.f += this.s*s;
  	this.x = W/2 + this.x0*Math.sin(this.f);
  	this.y = H/2 + this.y0*Math.cos(this.f);
  }

  Planet.prototype.ellipse = function(ctx, color, w) {
  	ctx.save();
    	ctx.beginPath();

    	ctx.translate(W/2, H/2);
    	ctx.scale(this.x0/this.y0, 1);

    	ctx.arc(0, 0, this.y0, 0, Math.PI*2, true);
    	ctx.closePath();
    	ctx.strokeStyle = color;
    	ctx.lineWidth = w;
    	ctx.stroke();

  	ctx.restore();
  }

  function main() {
    context.font = "normal normal 32px WIDEAWAKEBLACK";
    context.fillStyle = "white";
    drawBackground();
    termBg(ctxOrb);

  	var Planets = new Array;
    Planets[0] = new Planet("Sun", 1, sunD, 0);
  	Planets[1] = new Planet("Mercury", 2, 13, 4.2);
  	Planets[2] = new Planet("Venus", 3, 18, 1.7);
  	Planets[3] = new Planet("Earth", 4, 20, 1);
  	Planets[4] = new Planet("Mars", 5, 16, 0.5);
  	Planets[5] = new Planet("Jupiter", 7, 32, 0.083);
  	Planets[6] = new Planet("Saturn", 8, 32, 0.033);
  	Planets[7] = new Planet("Uranius", 9, 26, 0.012);
  	Planets[8] = new Planet("Neptune", 10, 24, 0.006);
  	Planets[9] = new Planet("Pluto", 11, 11, 0.004);

    function drawOrbits(i) {
      ctxOrb.clearRect(0, 0, W, H);
      for(var j = 1; j < Planets.length; j++) {
        if (j == i) {
          Planets[j].ellipse(ctxOrb, "#c7fcec", 1);
        }
        else {
          Planets[j].ellipse(ctxOrb, "#f2ddc6", 0.3);
        }
      }
      termBg(ctxOrb);
    }

    function termBg(ctx) {
      var grad = ctx.createRadialGradient(0,0,0,0,0,termSize*2);
      grad.addColorStop(0,"black");  
      grad.addColorStop(0.4,"#1d2726");  
      grad.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(termTab, termTab, termTab+termSize*2, termTab+termSize*2);
    }

    function drawTerminal(ctx, pln) {
      ctx.drawImage(IMG[pln], W/48, H/24, H/6, H/6);
    }

    terminal.addEventListener("mousemove", function(event) {
      ctxTerm.clearRect(0, 0, W, H);
      ctxOrb.clearRect(0, 0, W, H);
      var picked = Planets[Planets.length];

      for(var i = Planets.length - 1; i >= 0; i--) {
        Planets[i].picked = false;
        if ((Math.pow((event.pageX - W/2), 2)/Math.pow((Planets[i].x0 + au/2), 2) + Math.pow((event.pageY - H/2), 2)/Math.pow((Planets[i].y0 + au/2), 2)) <= 1) {
          picked = i;
          ctxTerm.clearRect(0, 0, W, H);
          drawTerminal(ctxTerm, Planets[picked].num);
        }
      }
      if(picked != undefined)
        Planets[picked].picked = true;

      drawOrbits(picked);
    }, false);

  	setInterval(function() {
  		for(var i = 1; i < Planets.length; i++) {
  			Planets[i].move();
  		}
  		context.clearRect(0, 0, W, H);
  		for(var i = 0; i < Planets.length; i++) {
  			Planets[i].draw();
  	  }
  	}, 60);

    fullScreen.addEventListener("click", function() {
      if(browser == "Internet Explorer") {
        if(document.msFullscreenElement == null)
          html.msRequestFullscreen();
        else
          document.msExitFullscreen();
      } 
      else if(browser == "Google Chrome" || browser == "Opera" || browser == "Safari") {
        if(document.webkitFullscreenElement == null)
          html.webkitRequestFullScreen();
        else
          document.webkitExitFullscreen();
      } 
      else if(browser == "Firefox") {
        if(document.mozFullScreenElement == null)
          html.mozRequestFullScreen();
        else
          document.mozCancelFullScreen();
      }
    }, false);

    fullScreen.addEventListener("mouseover", function() {
      this.style.opacity = 1;
    }, false);
    fullScreen.addEventListener("mouseout", function() {
      this.style.opacity = 0.5;
    }, false);
  }
  browser = browserSearch();
  pageConfig();
  waitForImages();
}