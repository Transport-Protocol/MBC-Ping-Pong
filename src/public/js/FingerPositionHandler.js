//Interface
module.exports = FingerPositionHandler;
/**
  * String canvas:                        Die ID des Canvas, das überwacht werden soll
  * Integer interval:                     Zeit in Millisekunden, die zwischen den Calls der Callbacks liegen sollte
  * List<function(x,y) callbackFunctions: Liste von Funktionen, die in dem intervall gecall werden sollen
  *
  * Angelehnt an: https://mobiforge.com/design-development/html5-mobile-web-touch-events
  */
function FingerPositionHandler(canvas, interval, callbackFunctions){
  var _canvas = canvas;
  var _interval = interval;
  var _callbackFunctions = callbackFunctions;
  var _touchzone = document.getElementById(canvas);
  var _x = 0;
  var _y = 0;
  var _lastSendTime = undefined;
  var _lastSendDiff = 0;
  var _processMouseInformations = false;

  /**
    * Wird aufgerufen, wenn die Mouse- oder Toucheingabe startet
    */
  function processInputStart(event){
    _processMouseInformations = true;
    // Prevent iPad from scrolling
    event.preventDefault();
  }

  /**
    * Wird aufgerufen, wenn die Mouse- oder Toucheingabe eine Bewegung feststellt
    */
  function processInput(event){
    if(_processMouseInformations){
      if(_touchzone.getContext){
        var ctx = _touchzone.getContext("2d");
        if(event.touches){
          _x = event.touches[0].pageX - _offset.left;
          _y = event.touches[0].pageY - _offset.top;
        }
        else{
          _x = event.pageX - _offset.left;
          _y = event.pageY - _offset.top;
        }
        ctx.fillRect(_x, _y, 5, 5);
        var currentTime = new Date().getTime();
        if((currentTime - _lastSendTime) >= (_interval - _lastSendDiff) || _lastSendTime === undefined){
          for (var i = 0, len = callbackFunctions.length; i < len; i++) {
            callbackFunctions[i](_x, _y);
          }
          console.log("send: x= " + _x + "y= " + _y + ", after : " + (currentTime - _lastSendTime));
          console.error("send has to be implemented");
          if(_lastSendTime){
            _lastSendDiff = (currentTime - _lastSendTime) - _interval;
            if(_lastSendDiff < 0){
              _lastSendDiff = 0;
            }
          }
          _lastSendTime = currentTime;
        }
      }
    }
    // Prevent iPad from scrolling
    event.preventDefault();
  }

  /**
    * Wird aufgerufen, wenn die Mouse- oder Toucheingabe endet
    */
  function processInputEnd(event){
    //document.getElementById("mouseInfo").innerHTML += "<br>processInputEnd"
    _lastSendTime = undefined;
    _lastSendDiff = 0;
    _processMouseInformations = false;
    // Prevent iPad from scrolling
    event.preventDefault();
  }

  /**
    * Bestimmt die Position des Canvas in dem Browser.
    * Diese wird benötigt, da die Position im Mouseevent absolut ist.
    */
  function getOffset(obj) {
    var offsetLeft = 0;
    var offsetTop = 0;
    do {
      if (!isNaN(obj.offsetLeft)) {
          offsetLeft += obj.offsetLeft;
      }
      if (!isNaN(obj.offsetTop)) {
          offsetTop += obj.offsetTop;
      }
    } while(obj = obj.offsetParent );
    return {left: offsetLeft, top: offsetTop};
  }

  var _offset = getOffset(_touchzone);
  /**
    * Register Listener
    */
  _touchzone.addEventListener("mousedown", processInputStart, false);
  _touchzone.addEventListener("touchstart", processInputStart, false);

  _touchzone.addEventListener("touchmove", processInput, false);
  _touchzone.addEventListener("mousemove", processInput, false);

  _touchzone.addEventListener("touchend", processInputEnd, false);
  _touchzone.addEventListener("mouseup", processInputEnd, false);

}
