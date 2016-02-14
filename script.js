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
var loops = 0;

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

  if (player) {
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
  scaleVideo(player);
  player.mute();
  player.playVideo();
  document.body.classList.add('ready');
  player.f.classList.add('ready');

  window.addEventListener('resize', function() {
    window.requestAnimationFrame(function() {
      scaleVideo(player);
    });
  }, true);
}

var done = false;
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING && !done) {
    // setTimeout(stopVideo, 6000);
    // done = true;
  }

  if (maxLoops) {
    if (event.data === YT.PlayerState.BUFFERING) {
      var l = checkLoops();
      console.log(l);
      if (l >= maxLoops) {
        stopVideo();
      }
    }
  }
}

function stopVideo() {
  player.stopVideo();
}

function scaleVideo(player) {
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
  var filterStrength = document.body.querySelector('#ConfigPane #FilterStrength');
  var strengthValue = parseInt(filterStrength.value);
  if (filterValue === 'none' || filterValue === 'drop-shadow' || filterValue === 'invert') {
    filterStrength.previousElementSibling.classList.add('hidden');
  } else {
    filterStrength.previousElementSibling.classList.remove('hidden');
  }

  if (typeof(player) === 'undefined') {
    return false;
  }

  var p = player.f;

  switch (filterValue) {
    case 'blur': {
      p.style.webkitFilter = 'blur(' + strengthValue / 5 + 'px)';
      break;
    }
    case 'brightness': {
      p.style.webkitFilter = 'brightness(' + strengthValue / 5 + ')';
      break;
    }
    case 'contrast': {
      p.style.webkitFilter = 'contrast(' + strengthValue * 5 + '%)';
      break;
    }
    case 'drop-shadow': {
      p.style.webkitFilter = 'drop-shadow(16px 16px 20px #000)';
      break;
    }
    case 'grayscale': {
      p.style.webkitFilter = 'grayscale(' + strengthValue + '%)';
      break;
    }
    case 'hue-rotate': {
      p.style.webkitFilter = 'hue-rotate(' + strengthValue / 100 * 360 + 'deg)';
      break;
    }
    case 'invert': {
      p.style.webkitFilter = 'invert()';
      break;
    }
    case 'opacity': {
      p.style.webkitFilter = 'opacity(' + strengthValue + '%)';
      break;
    }
    case 'saturate': {
      p.style.webkitFilter = 'saturate(' + strengthValue * 3 + '%)';
      break;
    }
    case 'sepia': {
      p.style.webkitFilter = 'sepia(' + strengthValue + '%)';
      break;
    }
    default: {
      p.style.webkitFilter = '';
    }
  }
}

function getOverlayColor() {
  var overlayColor = ('#' + document.body.querySelector('#ConfigPane #OverlayColor').value).match(/^#[0-9a-f]{6}/i);
  if (Array.isArray(overlayColor)) {
    overlayColor = overlayColor[0];
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
  return (Math.floor(loops / 2));
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
  fitMode = event.target.querySelector('radiogroup input:checked').value;
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

document.body.querySelector('#ConfigPane #OverlayOpacity').addEventListener('change', function() {
  getOverlayOpacity();
});

document.body.querySelector('#ConfigPane #OverlayColor').addEventListener('blur', function() {
  getOverlayColor();
});

document.body.querySelector('#ConfigPane #OverlayBlendMode').addEventListener('change', function() {
  getOverlayBlend();
});
