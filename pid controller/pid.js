https://codepen.io/anon/pen/pYvKLy

var vendors = ['webkit', 'moz', 'ms'],
	prefix = '',
	element = document.createElement('div');

for(var i in vendors){
	if(['-' + vendors[i] + '-transform'] in element.style){
		prefix = '-' + vendors[i] + '-';
	}
}

var target = document.getElementById('target'),
    follower = document.getElementById('follower'),
    regex = new RegExp(/\(([^)]+)\)/);

target.style[prefix + 'transform'] = 'translate3d(0, 0, 0)';
follower.style[prefix + 'transform'] = 'translate3d(0, 0, 0)';


setInterval(function(){
  var offset = parseInt(Math.random() * 400);
  target.style[prefix + 'transform'] = 'translate3d(0, ' + offset + 'px, 0)';
}, 2000);


function getCurrentPosition(element){
  return parseFloat(regex.exec(element.style[prefix + 'transform'])[1].split(', ')[1]);
}

function setCurrentPosition(element, offset){
  element.style[prefix + 'transform'] = 'translate3d(0, ' + offset + 'px, 0)';
}

var currentPosition = getCurrentPosition(follower),
    targetPosition = getCurrentPosition(target),
    delta = targetPosition - currentPosition,
    i = 0,
    proportion = 0,
    integral = 0,
    derivative = 0,
    Kp = 0.1,
    Ki = 0.4,
    Kd = 0.001;

var initialTime = performance.now(),
    currentTime,
    deltaTime = 0;

function tick(){
  currentTime = performance.now();
  deltaTime = (currentTime - initialTime) / 1000;
  initialTime = currentTime;

  requestAnimationFrame(tick);
  
  targetPosition = getCurrentPosition(target),
  
  
  
  delta = targetPosition - currentPosition;
  
  //Proporition is the difference between the target value and the current value
  proportion = delta;
  
  //integrel is the total values added over time - essentially an approximation of the area under the graph
  integral += delta;
  
  derivative = delta / deltaTime;
  //console.log(derivative * 0.1);
  
  currentPosition += (proportion * Kp) + (integral * Ki) + (derivative * Kd);
  setCurrentPosition(follower, currentPosition);
  
}

tick();

setInterval(function(){
  //tick();
}, 1000);