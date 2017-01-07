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
  var _paddle_x = 0;
  var _paddle_y = 0;
  var _player_start_x = 0;
  var _player_start_y = 0;
  var _change_x = 0;
  var _change_y = 0;
  // var _lastSendTime = undefined;
  // var _lastSendDiff = 0;
  var _processMouseInformations = false;

  /**
    * Differentiates between touch and mouse
    * Returns coordinate for given axis
    */
  function axis(event, axis) {
    if (event.touches) {
      return event.touches[0][axis];
    }
    else {
      return event[axis];
    }
  }

  /**
    * Gets called when input (mouse/ touch) starts
    */
  function processInputStart(event){
    _processMouseInformations = true;
    _player_start_x = axis(event, 'pageX');
    _player_start_y = axis(event, 'pageY');

    console.log("relative touch start", _player_x, _player_y);
    // TODO: Prevent iPad from scrolling, the one below doesnt really work
    event.preventDefault();
  }

  /**
    * Gets called when movement is noticed
    */
  function processInput(event){
    if(_processMouseInformations){
      if(_touchzone.getContext){
        var ctx = _touchzone.getContext("2d");

        _change_x = axis(event, 'pageX') - _player_start_x;
        _change_y = axis(event, 'pageY') - _player_start_y;

        console.log("CHANGE", _change_x, _change_y);
        var _x = _paddle_x + _change_x;
        var _y = _paddle_y + _change_y;

        ctx.fillRect(_x, _y, 5, 5);
        var currentTime = new Date().getTime();
        // if((currentTime - _lastSendTime) >= (_interval - _lastSendDiff) || _lastSendTime === undefined){
          for (var i = 0, len = callbackFunctions.length; i < len; i++) {
            callbackFunctions[i](_x, _y);
          }
        //   if(_lastSendTime){
        //     _lastSendDiff = (currentTime - _lastSendTime) - _interval;
        //     if(_lastSendDiff < 0){
        //       _lastSendDiff = 0;
        //     }
        //   }
        //   _lastSendTime = currentTime;
        // }
      }
    }
    // Prevent iPad from scrolling
    event.preventDefault();
  }

  /**
    * Gets called when input ends
    */
  function processInputEnd(event){
    //document.getElementById("mouseInfo").innerHTML += "<br>processInputEnd"
    // _lastSendTime = undefined;
    // _lastSendDiff = 0;
    _processMouseInformations = false;
    // set paddle coordinates therewith after input starts again, the movement is relative to last position
    _paddle_x += _change_x;
    _paddle_y += _change_y;
    // Prevent iPad from scrolling
    event.preventDefault();
  }

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
