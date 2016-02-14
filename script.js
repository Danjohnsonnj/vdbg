'use strict';

/*
* CONFIG, to be wired to app UI
*/
var embedCode = '<iframe width="560" height="315" src="https://www.youtube.com/embed/9dxua41fAgo" frameborder="0" allowfullscreen></iframe>';
var scaleFactor = 1;
var fitMode = 'cover';
var maxLoops = null;
var videoId = null;


/*
 * MEAT AND POTATOES (unless you're not eating carbs; then it's just meat)
 */
var player;
var resizeTimer = null;
var loops = 0;
var isMobileSafari = (window.navigator.userAgent.indexOf('AppleWebKit') !== -1 && window.navigator.userAgent.indexOf('Mobile') !== -1);

var tag = document.createElement('script');
var protocol = document.location.protocol;
protocol = protocol === 'file:' ? 'http:' : protocol;
tag.src = protocol + '//www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
  if (!videoId) {
    return false;
  }

  if (typeof(player) !== 'undefined') {
    try {
      player.destroy();
    } catch(e) {
      // nothing to destroy
    }
  }

  player = new YT.Player('player', {
    height: '315',
    width: '560',
    videoId: videoId,
    playerVars: {
      'autoplay': 1,
      'controls': 0,
      'autohide': 1,
      'wmode': 'opaque',
      'showinfo': 0,
      'loop': 1,
      'iv_load_policy': 3,
      //'start': 15,
      //'end': 110,
      'playlist': videoId
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  var player = event.target;
  player.f.classList.add('background-video');
  if (isMobileSafari) {
    player.f.classList.add('mobile');
  };
  scaleVideo(player);
  player.mute();
  !isMobileSafari && player.playVideo();
  document.body.classList.add('ready');
  player.f.classList.add('ready');
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    if (maxLoops) {
      var l = checkLoops();
      console.log(l);
      if (l > maxLoops) {
        stopVideo();
      }
    }
  }
}

function stopVideo() {
  player.stopVideo();
}

function scaleVideo(player) {
  if (typeof(player) === 'undefined') {
    return false;
  }

  fitMode = document.body.querySelector('#ConfigPane #FitMode input:checked').value;

  if (fitMode !== 'cover') {
    player.f.style.width = '';
    player.f.style.height = '';
    return false;
  }

  var containerWidth = player.f.parentNode.clientWidth;
  var containerHeight = player.f.parentNode.clientHeight;
  var containerRatio = containerWidth / containerHeight;
  var videoRatio = player.h.f.width / player.h.f.height;
  if (containerRatio > videoRatio) {
    // at the same width, the video is taller than the window
    player.f.style.width = (containerWidth * scaleFactor) + 'px';
    player.f.style.height = (containerWidth * scaleFactor) / videoRatio + 'px';
  } else if (videoRatio > containerRatio) {
    // at the same width, the video is shorter than the window
    player.f.style.width = (containerHeight * scaleFactor) * videoRatio + 'px';
    player.f.style.height = (containerHeight * scaleFactor) + 'px';
  } else {
    // the window and video ratios match
    player.f.style.width = (containerWidth * scaleFactor) + 'px';
    player.f.style.height = (containerHeight * scaleFactor) + 'px';
  }
}

function getVideoUrl(value) {
  var v;
  if (value.indexOf('youtube.com/embed/') !== -1) {
    // regex this?
    v = value.substring(value.indexOf('/embed/') + 7);
    v = v.substring(0, v.indexOf('"'));
  } else if (value.indexOf('youtube.com/watch?v=') !== -1) {
    v = value.substring(value.indexOf('watch?v=') + 8);
  }

  if (v.length > 0) {
    return v;
  } else {
    return false;
  }
}

function getMaxLoops() {
  var enabled = event.target.querySelector('#LimitLoops').checked;
  var num = event.target.querySelector('#MaxLoops').value;
  if (!enabled || isNaN(num)) {
    return null;
  } else if (enabled && !isNaN(num)) {
    return parseInt(num);
  }
}

function getFilter() {
  var filterValue = document.body.querySelector('#ConfigPane #Filter').value;
  var inputEl = document.body.querySelector('#ConfigPane #FilterStrength');
  var strengthValue = parseInt(inputEl.value);
  if (filterValue === 'none' || filterValue === 'drop-shadow' || filterValue === 'invert') {
    inputEl.previousElementSibling.classList.add('hidden');
  } else {
    inputEl.previousElementSibling.classList.remove('hidden');
  }

  if (typeof(player) === 'undefined') {
    return false;
  }

  var p = player.f.style;

  switch (filterValue) {
    case 'blur': {
      p.webkitFilter = 'blur(' + strengthValue / 5 + 'px)';
      break;
    }
    case 'brightness': {
      p.webkitFilter = 'brightness(' + strengthValue / 5 + ')';
      break;
    }
    case 'contrast': {
      p.webkitFilter = 'contrast(' + strengthValue * 5 + '%)';
      break;
    }
    case 'drop-shadow': {
      p.webkitFilter = 'drop-shadow(16px 16px 20px #000)';
      break;
    }
    case 'grayscale': {
      p.webkitFilter = 'grayscale(' + strengthValue + '%)';
      break;
    }
    case 'hue-rotate': {
      p.webkitFilter = 'hue-rotate(' + strengthValue / 100 * 360 + 'deg)';
      break;
    }
    case 'invert': {
      p.webkitFilter = 'invert()';
      break;
    }
    case 'opacity': {
      p.webkitFilter = 'opacity(' + strengthValue + '%)';
      break;
    }
    case 'saturate': {
      p.webkitFilter = 'saturate(' + strengthValue * 3 + '%)';
      break;
    }
    case 'sepia': {
      p.webkitFilter = 'sepia(' + strengthValue + '%)';
      break;
    }
    default: {
      p.webkitFilter = '';
    }
  }
}

function getOverlayColor() {
  var colorValue = document.body.querySelector('#ConfigPane #OverlayColor').value;
  var overlayColor = colorValue.match(/^#[0-9a-f]{6}/i);
  if (Array.isArray(overlayColor)) {
    overlayColor = '#' + overlayColor[0];
  } else if (!!Array.prototype.some && colors.some(function(arrVal) {
      return colorValue === arrVal;
    })) {
      overlayColor = colorValue;
  } else {
    overlayColor = '#000000';
    document.body.querySelector('#ConfigPane #OverlayColor').value = '000000';
  }
  document.body.querySelector('.overlay').style.backgroundColor = overlayColor;
}

function getOverlayOpacity() {
  var opacityStrength = document.body.querySelector('#ConfigPane #OverlayOpacity').value / 100;
  document.body.querySelector('.overlay').style.opacity = Math.min(0.95, opacityStrength);
}

function checkLoops() {
  loops++;
  return loops;
}

function getOverlayBlend() {
  var blendModeValue = document.body.querySelector('#ConfigPane #OverlayBlendMode').value;
  var overlayEl = document.body.querySelector('.overlay');

  if (blendModeValue === 'none') {
    overlayEl.style.mixBlendMode = '';
  } else {
    overlayEl.style.mixBlendMode = blendModeValue;
  }
}

var colors = [
  "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"
];


/*
 * LISTENERS
 */
document.body.querySelector('#EmbedCode').addEventListener('click', function() {
  event.target.setAttribute('data-old-value', event.target.value);
  event.target.value = '';
});

document.body.querySelector('#EmbedCode').addEventListener('blur', function() {
  if (event.target.value === '') {
    event.target.value = event.target.getAttribute('data-old-value');
  }
});

document.body.querySelector('#ConfigPane form').addEventListener('submit', function() {
  event.preventDefault();
  var embedValue = event.target.querySelector('#EmbedCode').value;
  videoId = getVideoUrl(embedValue);
  maxLoops = getMaxLoops();
  onYouTubeIframeAPIReady();
  getFilter();
  getOverlayOpacity();
  getOverlayColor();
  getOverlayBlend();
  event.target.parentNode.classList.remove('open');
}, true);

document.body.querySelector('#ConfigPane h6').addEventListener('click', function() {
  event.target.parentNode.classList.toggle('open');
});

document.body.querySelector('#ConfigPane #Filter').addEventListener('change', function() {
  getFilter();
});

document.body.querySelector('#ConfigPane #FilterStrength').addEventListener('change', function() {
  getFilter();
});

document.body.querySelector('#ConfigPane #FitMode').addEventListener('change', function() {
  scaleVideo(player);
});

document.body.querySelector('#ConfigPane #OverlayOpacity').addEventListener('change', function() {
  getOverlayOpacity();
});

document.body.querySelector('#ConfigPane #OverlayColor').addEventListener('blur', function() {
  getOverlayColor();
});

document.body.querySelector('#ConfigPane #OverlayBlendMode').addEventListener('change', function() {
  getOverlayBlend();
});

document.body.querySelector('.background-wrapper').addEventListener('click', function() {
  document.body.querySelector('#ConfigPane').classList.remove('open');
});

window.addEventListener('resize', function() {
  if (resizeTimer !== null) {
    window.clearTimeout(resizeTimer);
  }
  resizeTimer = window.setTimeout(function() {
    window.requestAnimationFrame(function() {
      scaleVideo(player);
    }, 10);
  });
}, true);
