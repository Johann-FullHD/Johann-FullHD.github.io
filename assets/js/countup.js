// File#: _1_countup
// Usage: codyhouse.co/license
(function() {	
  var CountUp = function(opts) {
    this.options = extendProps(CountUp.defaults , opts);
    this.element = this.options.element;
    this.initialValue = parseFloat(this.options.initial);
    this.finalValue = parseFloat(this.element.textContent);
    this.deltaValue = parseFloat(this.options.delta);
    this.intervalId;
    this.animationTriggered = false;
    this.srClass = 'sr-only';
    initCountUp(this);
  };

  CountUp.prototype.reset = function() { // reset element to its initial value
    window.cancelAnimationFrame(this.intervalId);
    this.element.textContent = this.initialValue;
  };  

  CountUp.prototype.restart = function() { // restart element animation
    countUpAnimate(this);
  };

  function initCountUp(countup) {
    // reset initial value
    countup.initialValue = getCountupStart(countup);

    // reset countUp for SR
    initCountUpSr(countup);

    // listen for the element to enter the viewport -> start animation
    var observer = new IntersectionObserver(countupObserve.bind(countup), { threshold: [0, 0.1] });
    observer.observe(countup.element);

    // listen to events
    countup.element.addEventListener('countUpReset', function(){countup.reset();});
    countup.element.addEventListener('countUpRestart', function(){countup.restart();});
  };

  function countUpShow(countup) { // reveal countup after it has been initialized
    countup.element.closest('.countup').classList.add('countup--is-visible');
  };

  function countupObserve(entries, observer) { // observe countup position -> start animation when inside viewport
    if(entries[0].intersectionRatio.toFixed(1) > 0 && !this.animationTriggered) {
      countUpAnimate(this);
    }
  };

  function countUpAnimate(countup) { // animate countup
    countup.element.textContent = countup.initialValue;
    countUpShow(countup);
    window.cancelAnimationFrame(countup.intervalId);
    var currentTime = null;

    function runCountUp(timestamp) {
      if (!currentTime) currentTime = timestamp;        
      var progress = timestamp - currentTime;
      if(progress > countup.options.duration) progress = countup.options.duration;
      var val = getValEaseOut(progress, countup.initialValue, countup.finalValue - countup.initialValue, countup.options.duration);
      countup.element.textContent = getCountUpValue(val, countup);
      if(progress < countup.options.duration) {
        countup.intervalId = window.requestAnimationFrame(runCountUp);
      } else {
        countUpComplete(countup);
      }
    };

    countup.intervalId = window.requestAnimationFrame(runCountUp);
  };

  function getCountUpValue(val, countup) { // reset new countup value to proper decimal places+separator
    if(countup.options.decimal) {val = parseFloat(val.toFixed(countup.options.decimal));}
    else {val = parseInt(val);}
    if(countup.options.separator) val = val.toLocaleString('en');
    return val;
  }

  function countUpComplete(countup) { // emit event when animation is over
    countup.element.dispatchEvent(new CustomEvent('countUpComplete'));
    countup.animationTriggered = true;
  };

  function initCountUpSr(countup) { // make sure countup is accessible
    // hide elements that will be animated to SR
    countup.element.setAttribute('aria-hidden', 'true');
    // create new element with visible final value - accessible to SR only
    var srValue = document.createElement('span');
    srValue.textContent = countup.finalValue;
    srValue.classList.add(countup.srClass);
    countup.element.parentNode.insertBefore(srValue, countup.element.nextSibling);
  };

  function getCountupStart(countup) {
    return countup.deltaValue > 0 ? countup.finalValue - countup.deltaValue : countup.initialValue;
  };

  function getValEaseOut(t, b, c, d) { 
    t /= d;
    return -c * t*(t-2) + b;
  };

  var extendProps = function () {
    // Variables
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;
  
    // Check if a deep merge
    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
      deep = arguments[0];
      i++;
    }
  
    // Merge the object into the extended object
    var merge = function (obj) {
      for ( var prop in obj ) {
        if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
          // If deep merge and property is an object, merge properties
          if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
            extended[prop] = extend( true, extended[prop], obj[prop] );
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };
  
    // Loop through each object and conduct a merge
    for ( ; i < length; i++ ) {
      var obj = arguments[i];
      merge(obj);
    }
  
    return extended;
  };

  CountUp.defaults = {
    element : '',
    separator : false,
    duration: 3000,
    decimal: false,
    initial: 0,
    delta: 0
  };

  window.CountUp = CountUp;

  //initialize the CountUp objects
  var countUp = document.getElementsByClassName('js-countup');
  if( countUp.length > 0 ) {
    for( var i = 0; i < countUp.length; i++) {(function(i){
    	var separator = (countUp[i].getAttribute('data-countup-sep')) ? countUp[i].getAttribute('data-countup-sep') : false,
        duration = (countUp[i].getAttribute('data-countup-duration')) ? countUp[i].getAttribute('data-countup-duration') : CountUp.defaults.duration,
        decimal = (countUp[i].getAttribute('data-countup-decimal')) ? countUp[i].getAttribute('data-countup-decimal') : false,
    		initial = (countUp[i].getAttribute('data-countup-start')) ? countUp[i].getAttribute('data-countup-start') : 0,
        delta = (countUp[i].getAttribute('data-countup-delta')) ? countUp[i].getAttribute('data-countup-delta') : 0;
    	new CountUp({element: countUp[i], separator : separator, duration: duration, decimal: decimal, initial: initial, delta: delta});
    })(i);}
  }
}());