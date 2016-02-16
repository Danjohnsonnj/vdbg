'use strict';

/*
* CONFIG, to be wired to app UI
*/
var scaleFactor = 1;
var fitMode = 'cover';
var maxLoops = null;
var videoId = null;


/*
 * MEAT AND POTATOES (unless you're not eating carbs; then it's just meat)
 */
var player;
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

  scaleFactor = getZoom();

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
  } else if (value.indexOf('youtu.be/') !== -1) {
    v = value.substring(value.indexOf('youtu.be/' + 9));
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
  var overlayColor;
  var input = document.body.querySelector('#ConfigPane #OverlayColor');
  var inputValue = input.value;
  var selectValue = document.body.querySelector('#ConfigPane #WebColors').value;
  if (selectValue !== 'none') {
    input.setAttribute('disabled', 'true');
    overlayColor = selectValue;
  } else {
    input.removeAttribute('disabled');
    overlayColor = '#' + inputValue.match(/[0-9a-f]{6}/i);
  }
  document.body.querySelector('.color').style.backgroundColor = overlayColor;
}

function getPattern() {
  var input = document.body.querySelector('#ConfigPane #PatternLibrary');
  var inputValue = input.value;
  document.body.querySelector('.pattern').setAttribute('data-pattern-name', inputValue);
}

function getOverlayOpacity(overlayType) {
  var opacityStrength = document.body.querySelector('#ConfigPane #' + overlayType.charAt(0).toUpperCase() + overlayType.slice(1) + 'Opacity').value / 100;
  document.body.querySelector('.' + overlayType).style.opacity = Math.min(0.95, opacityStrength);
}

function getOverlayBlend(overlayType) {
  var blendModeValue = document.body.querySelector('#ConfigPane #' + overlayType.charAt(0).toUpperCase() + overlayType.slice(1) + 'BlendMode').value;
  var overlayEl = document.body.querySelector('.' + overlayType);

  if (blendModeValue === 'none') {
    overlayEl.style.mixBlendMode = '';
  } else {
    overlayEl.style.mixBlendMode = blendModeValue;
  }
}

function checkLoops() {
  loops++;
  return loops;
}

function getZoom() {
  return document.body.querySelector('#ConfigPane #Zoom').value;
}

var colors = {
  'aliceblue': '#f0f8ff', 'antiquewhite': '#faebd7', 'aqua': '#00ffff', 'aquamarine': '#7fffd4', 'azure': '#f0ffff', 'beige': '#f5f5dc', 'bisque': '#ffe4c4', 'black': '#000000', 'blanchedalmond': '#ffebcd', 'blue': '#0000ff', 'blueviolet': '#8a2be2', 'brown': '#a52a2a', 'burlywood': '#deb887', 'cadetblue': '#5f9ea0', 'chartreuse': '#7fff00', 'chocolate': '#d2691e', 'coral': '#ff7f50', 'cornflowerblue': '#6495ed', 'cornsilk': '#fff8dc', 'crimson': '#dc143c', 'cyan': '#00ffff', 'darkblue': '#00008b', 'darkcyan': '#008b8b', 'darkgoldenrod': '#b8860b', 'darkgray': '#a9a9a9', 'darkgrey': '#a9a9a9', 'darkgreen': '#006400', 'darkkhaki': '#bdb76b', 'darkmagenta': '#8b008b', 'darkolivegreen': '#556b2f', 'darkorange': '#ff8c00', 'darkorchid': '#9932cc', 'darkred': '#8b0000', 'darksalmon': '#e9967a', 'darkseagreen': '#8fbc8f', 'darkslateblue': '#483d8b', 'darkslategray': '#2f4f4f', 'darkslategrey': '#2f4f4f', 'darkturquoise': '#00ced1', 'darkviolet': '#9400d3', 'deeppink': '#ff1493', 'deepskyblue': '#00bfff', 'dimgray': '#696969', 'dimgrey': '#696969', 'dodgerblue': '#1e90ff', 'firebrick': '#b22222', 'floralwhite': '#fffaf0', 'forestgreen': '#228b22', 'fuchsia': '#ff00ff', 'gainsboro': '#dcdcdc', 'ghostwhite': '#f8f8ff', 'gold': '#ffd700', 'goldenrod': '#daa520', 'gray': '#808080', 'grey': '#808080', 'green': '#008000', 'greenyellow': '#adff2f', 'honeydew': '#f0fff0', 'hotpink': '#ff69b4', 'indianred': '#cd5c5c', 'indigo': '#4b0082', 'ivory': '#fffff0', 'khaki': '#f0e68c', 'lavender': '#e6e6fa', 'lavenderblush': '#fff0f5', 'lawngreen': '#7cfc00', 'lemonchiffon': '#fffacd', 'lightblue': '#add8e6', 'lightcoral': '#f08080', 'lightcyan': '#e0ffff', 'lightgoldenrodyellow': '#fafad2', 'lightgray': '#d3d3d3', 'lightgrey': '#d3d3d3', 'lightgreen': '#90ee90', 'lightpink': '#ffb6c1', 'lightsalmon': '#ffa07a', 'lightseagreen': '#20b2aa', 'lightskyblue': '#87cefa', 'lightslategray': '#778899', 'lightslategrey': '#778899', 'lightsteelblue': '#b0c4de', 'lightyellow': '#ffffe0', 'lime': '#00ff00', 'limegreen': '#32cd32', 'linen': '#faf0e6', 'magenta': '#ff00ff', 'maroon': '#800000', 'mediumaquamarine': '#66cdaa', 'mediumblue': '#0000cd', 'mediumorchid': '#ba55d3', 'mediumpurple': '#9370d8', 'mediumseagreen': '#3cb371', 'mediumslateblue': '#7b68ee', 'mediumspringgreen': '#00fa9a', 'mediumturquoise': '#48d1cc', 'mediumvioletred': '#c71585', 'midnightblue': '#191970', 'mintcream': '#f5fffa', 'mistyrose': '#ffe4e1', 'moccasin': '#ffe4b5', 'navajowhite': '#ffdead', 'navy': '#000080', 'oldlace': '#fdf5e6', 'olive': '#808000', 'olivedrab': '#6b8e23', 'orange': '#ffa500', 'orangered': '#ff4500', 'orchid': '#da70d6', 'palegoldenrod': '#eee8aa', 'palegreen': '#98fb98', 'paleturquoise': '#afeeee', 'palevioletred': '#d87093', 'papayawhip': '#ffefd5', 'peachpuff': '#ffdab9', 'peru': '#cd853f', 'pink': '#ffc0cb', 'plum': '#dda0dd', 'powderblue': '#b0e0e6', 'purple': '#800080', 'red': '#ff0000', 'rosybrown': '#bc8f8f', 'royalblue': '#4169e1', 'saddlebrown': '#8b4513', 'salmon': '#fa8072', 'sandybrown': '#f4a460', 'seagreen': '#2e8b57', 'seashell': '#fff5ee', 'sienna': '#a0522d', 'silver': '#c0c0c0', 'skyblue': '#87ceeb', 'slateblue': '#6a5acd', 'slategray': '#708090', 'slategrey': '#708090', 'snow': '#fffafa', 'springgreen': '#00ff7f', 'steelblue': '#4682b4', 'tan': '#d2b48c', 'teal': '#008080', 'thistle': '#d8bfd8', 'tomato': '#ff6347', 'turquoise': '#40e0d0', 'violet': '#ee82ee', 'wheat': '#f5deb3', 'white': '#ffffff', 'whitesmoke': '#f5f5f5', 'yellow': '#ffff00', 'yellowgreen': '#9acd32'
};

var options = '<option value="none">none</option>';
Object.keys(colors).forEach(function(a) {
  options += '<option value="' + a + '">' + a + '</option>';
});
document.getElementById('WebColors').innerHTML = options  ;

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
  getOverlayColor();
  getOverlayOpacity('color');
  getOverlayBlend('color');
  getPattern();
  getOverlayOpacity('pattern');
  getOverlayBlend('pattern');
  event.target.parentNode.classList.remove('open');
}, true);

document.body.querySelector('#ConfigPane h6').addEventListener('click', function() {
  event.target.parentNode.classList.toggle('open');
});

document.body.querySelector('#ConfigPane #Filter').addEventListener('change', function() {
  getFilter();
});

document.body.querySelector('#ConfigPane #Zoom').addEventListener('change', function() {
  scaleVideo(player);
});

document.body.querySelector('#ConfigPane #FilterStrength').addEventListener('change', function() {
  getFilter();
});

document.body.querySelector('#ConfigPane #FitMode').addEventListener('change', function() {
  scaleVideo(player);
});

document.body.querySelector('#ConfigPane #OverlayColor').addEventListener('blur', function() {
  getOverlayColor();
});

document.body.querySelector('#ConfigPane #WebColors').addEventListener('change', function() {
  getOverlayColor();
});

document.body.querySelector('#ConfigPane #ColorOpacity').addEventListener('change', function() {
  getOverlayOpacity('color');
});

document.body.querySelector('#ConfigPane #ColorBlendMode').addEventListener('change', function() {
  getOverlayBlend('color');
});

document.body.querySelector('#ConfigPane #PatternLibrary').addEventListener('change', function() {
  getPattern();
});

document.body.querySelector('#ConfigPane #PatternOpacity').addEventListener('change', function() {
  getOverlayOpacity('pattern');
});

document.body.querySelector('#ConfigPane #PatternBlendMode').addEventListener('change', function() {
  getOverlayBlend('pattern');
});

document.body.querySelector('.background-wrapper').addEventListener('click', function() {
  document.body.querySelector('#ConfigPane').classList.remove('open');
});

window.addEventListener('resize', function() {
  window.requestAnimationFrame(function() {
    scaleVideo(player);
  });
}, true);
