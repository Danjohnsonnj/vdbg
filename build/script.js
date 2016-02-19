(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

const VideoBackground = require('./videobackground.js');
const vvv = new VideoBackground();

/*
 * Some stuff related only to this config panel implementation
 */
const panel = document.getElementById('ConfigPane');
const colors = {
  'aliceblue': '#f0f8ff', 'antiquewhite': '#faebd7', 'aqua': '#00ffff', 'aquamarine': '#7fffd4', 'azure': '#f0ffff', 'beige': '#f5f5dc', 'bisque': '#ffe4c4', 'black': '#000000', 'blanchedalmond': '#ffebcd', 'blue': '#0000ff', 'blueviolet': '#8a2be2', 'brown': '#a52a2a', 'burlywood': '#deb887', 'cadetblue': '#5f9ea0', 'chartreuse': '#7fff00', 'chocolate': '#d2691e', 'coral': '#ff7f50', 'cornflowerblue': '#6495ed', 'cornsilk': '#fff8dc', 'crimson': '#dc143c', 'cyan': '#00ffff', 'darkblue': '#00008b', 'darkcyan': '#008b8b', 'darkgoldenrod': '#b8860b', 'darkgray': '#a9a9a9', 'darkgrey': '#a9a9a9', 'darkgreen': '#006400', 'darkkhaki': '#bdb76b', 'darkmagenta': '#8b008b', 'darkolivegreen': '#556b2f', 'darkorange': '#ff8c00', 'darkorchid': '#9932cc', 'darkred': '#8b0000', 'darksalmon': '#e9967a', 'darkseagreen': '#8fbc8f', 'darkslateblue': '#483d8b', 'darkslategray': '#2f4f4f', 'darkslategrey': '#2f4f4f', 'darkturquoise': '#00ced1', 'darkviolet': '#9400d3', 'deeppink': '#ff1493', 'deepskyblue': '#00bfff', 'dimgray': '#696969', 'dimgrey': '#696969', 'dodgerblue': '#1e90ff', 'firebrick': '#b22222', 'floralwhite': '#fffaf0', 'forestgreen': '#228b22', 'fuchsia': '#ff00ff', 'gainsboro': '#dcdcdc', 'ghostwhite': '#f8f8ff', 'gold': '#ffd700', 'goldenrod': '#daa520', 'gray': '#808080', 'grey': '#808080', 'green': '#008000', 'greenyellow': '#adff2f', 'honeydew': '#f0fff0', 'hotpink': '#ff69b4', 'indianred': '#cd5c5c', 'indigo': '#4b0082', 'ivory': '#fffff0', 'khaki': '#f0e68c', 'lavender': '#e6e6fa', 'lavenderblush': '#fff0f5', 'lawngreen': '#7cfc00', 'lemonchiffon': '#fffacd', 'lightblue': '#add8e6', 'lightcoral': '#f08080', 'lightcyan': '#e0ffff', 'lightgoldenrodyellow': '#fafad2', 'lightgray': '#d3d3d3', 'lightgrey': '#d3d3d3', 'lightgreen': '#90ee90', 'lightpink': '#ffb6c1', 'lightsalmon': '#ffa07a', 'lightseagreen': '#20b2aa', 'lightskyblue': '#87cefa', 'lightslategray': '#778899', 'lightslategrey': '#778899', 'lightsteelblue': '#b0c4de', 'lightyellow': '#ffffe0', 'lime': '#00ff00', 'limegreen': '#32cd32', 'linen': '#faf0e6', 'magenta': '#ff00ff', 'maroon': '#800000', 'mediumaquamarine': '#66cdaa', 'mediumblue': '#0000cd', 'mediumorchid': '#ba55d3', 'mediumpurple': '#9370d8', 'mediumseagreen': '#3cb371', 'mediumslateblue': '#7b68ee', 'mediumspringgreen': '#00fa9a', 'mediumturquoise': '#48d1cc', 'mediumvioletred': '#c71585', 'midnightblue': '#191970', 'mintcream': '#f5fffa', 'mistyrose': '#ffe4e1', 'moccasin': '#ffe4b5', 'navajowhite': '#ffdead', 'navy': '#000080', 'oldlace': '#fdf5e6', 'olive': '#808000', 'olivedrab': '#6b8e23', 'orange': '#ffa500', 'orangered': '#ff4500', 'orchid': '#da70d6', 'palegoldenrod': '#eee8aa', 'palegreen': '#98fb98', 'paleturquoise': '#afeeee', 'palevioletred': '#d87093', 'papayawhip': '#ffefd5', 'peachpuff': '#ffdab9', 'peru': '#cd853f', 'pink': '#ffc0cb', 'plum': '#dda0dd', 'powderblue': '#b0e0e6', 'purple': '#800080', 'red': '#ff0000', 'rosybrown': '#bc8f8f', 'royalblue': '#4169e1', 'saddlebrown': '#8b4513', 'salmon': '#fa8072', 'sandybrown': '#f4a460', 'seagreen': '#2e8b57', 'seashell': '#fff5ee', 'sienna': '#a0522d', 'silver': '#c0c0c0', 'skyblue': '#87ceeb', 'slateblue': '#6a5acd', 'slategray': '#708090', 'slategrey': '#708090', 'snow': '#fffafa', 'springgreen': '#00ff7f', 'steelblue': '#4682b4', 'tan': '#d2b48c', 'teal': '#008080', 'thistle': '#d8bfd8', 'tomato': '#ff6347', 'turquoise': '#40e0d0', 'violet': '#ee82ee', 'wheat': '#f5deb3', 'white': '#ffffff', 'whitesmoke': '#f5f5f5', 'yellow': '#ffff00', 'yellowgreen': '#9acd32'
};

let options = '<option value="none">none</option>';
Object.keys(colors).forEach(function (a) {
  options += '<option value="' + a + '">' + a + '</option>';
});
[].slice.call(document.body.querySelectorAll('.webColors')).forEach(function (s) {
  s.innerHTML = options;
});

/*
 * LISTENERS
 */
panel.querySelector('h6').addEventListener('click', function () {
  event.target.parentNode.classList.toggle('open');
});

panel.querySelector('#EmbedCode').addEventListener('focus', function () {
  event.target.setAttribute('data-old-value', event.target.value);
  event.target.value = '';
});

panel.querySelector('#EmbedCode').addEventListener('blur', function () {
  if (event.target.value === '') {
    event.target.value = event.target.getAttribute('data-old-value');
  } else {
    vvv.videoId = vvv.getVideoUrl(event.target.value);
    vvv.onYouTubeIframeAPIReady();
  }
});

panel.querySelector('#FitMode').addEventListener('change', function () {
  vvv.fitMode = event.target.value;
  vvv.scaleVideo();
});

panel.querySelector('#LimitLoops').addEventListener('change', function () {
  vvv.limitLoops = event.target.checked;
  vvv.maxLoops = parseInt(panel.querySelector('#MaxLoops').value);
  vvv.onYouTubeIframeAPIReady();
});

panel.querySelector('#MaxLoops').addEventListener('change', function () {
  vvv.limitLoops = event.target.checked;
  vvv.maxLoops = parseInt(panel.querySelector('#MaxLoops').value);
  vvv.onYouTubeIframeAPIReady();
});

panel.querySelector('#Zoom').addEventListener('change', function () {
  vvv.scaleFactor = parseFloat(event.target.value);
  vvv.scaleVideo();
});

[].slice.call(document.body.querySelectorAll('input[name="flip-checkbox"]')).forEach(function (i) {
  i.addEventListener('change', function () {
    vvv.orientation[event.target.value] = event.target.checked;
    vvv.setOrientation();
  });
});

panel.querySelector('#PlaybackSpeed').addEventListener('change', function () {
  vvv.speed = parseFloat(event.target.value);
  vvv.setSpeed();
});

panel.querySelector('#TextColor').addEventListener('blur', function () {
  vvv.textColor = '#' + event.target.value;
  vvv.setColor(vvv.textColor, '.sample-text', 'color');
});

panel.querySelector('.webColors[data-for="#TextColor"]').addEventListener('change', function () {
  vvv.textColor = event.target.value;
  vvv.setColor(vvv.textColor, '.sample-text', 'color');
});

panel.querySelector('#TextColorOpacity').addEventListener('change', function () {
  vvv.textOpacity = parseFloat(event.target.value) / 100;
  vvv.setOpacity(vvv.textOpacity, '.sample-text');
});

panel.querySelector('#TextBlendMode').addEventListener('change', function () {
  vvv.textBlendMode = event.target.value;
  setBlend(vvv.textBlendMode, '.overlay.color');
});

panel.querySelector('#OverlayColor').addEventListener('blur', function () {
  vvv.overlayColor = '#' + event.target.value;
  vvv.setColor(vvv.overlayColor, '.overlay.color', 'background-color');
});

panel.querySelector('.webColors[data-for="#OverlayColor"]').addEventListener('change', function () {
  vvv.overlayColor = event.target.value;
  vvv.setColor(vvv.overlayColor, '.overlay.color', 'background-color');
});

panel.querySelector('#OverlayColorOpacity').addEventListener('change', function () {
  vvv.overlayColorOpacity = parseFloat(event.target.value) / 100;
  vvv.setOpacity(vvv.overlayColorOpacity, '.overlay.color');
});

panel.querySelector('#OverlayColorBlendMode').addEventListener('change', function () {
  vvv.overlayColorBlendMode = event.target.value;
  vvv.setBlend(vvv.overlayColorBlendMode, '.overlay.color');
});

panel.querySelector('#PatternLibrary').addEventListener('change', function () {
  vvv.overlayPattern = event.target.value;
  vvv.setPattern();
});

panel.querySelector('#OverlayPatternOpacity').addEventListener('change', function () {
  vvv.overlayPatternOpacity = parseFloat(event.target.value) / 100;
  vvv.setOpacity(vvv.overlayPatternOpacity, '.overlay.pattern');
});

panel.querySelector('#PatternBlendMode').addEventListener('change', function () {
  vvv.overlayPatternBlendMode = event.target.value;
  vvv.setBlend(vvv.overlayPatternBlendMode, '.overlay.pattern');
});

panel.querySelector('#Filter').addEventListener('change', function () {
  vvv.filter = event.target.value;
  vvv.setFilter();

  panel.querySelector('label[for="FilterStrength"]').classList.toggle('hidden', event.target.value === 'none');
});

panel.querySelector('#FilterStrength').addEventListener('change', function () {
  vvv.filterStrength = parseFloat(event.target.value);
  vvv.setFilter();
});

document.body.querySelector('.background-wrapper').addEventListener('click', function () {
  panel.classList.remove('open');
});

panel.querySelector('form').addEventListener('submit', function () {
  event.preventDefault();
  vvv.setUpVideoWithConfig();
  vvv.onYouTubeIframeAPIReady();
  event.target.parentNode.classList.remove('open');
}, true);

},{"./videobackground.js":2}],2:[function(require,module,exports){
'use strict';

const DEFAULT_PROPERTY_VALUES = {
  'container': document.querySelector('.background-wrapper'),
  'videoId': '9kKyF_Yn6HQ',
  'fitMode': 'cover',
  'limitLoops': false,
  'maxLoops': '',
  'scaleFactor': 1,
  'orientation': { 'x': false, 'y': false },
  'speed': 1,
  'textColor': '#ffffff',
  'textOpacity': 0.5,
  'textBlendMode': 'normal',
  'overlayColor': '000000',
  'overlayColorOpacity': 0.5,
  'overlayColorBlendMode': 'normal',
  'overlayPattern': 'none',
  'overlayPatternOpacity': 0.5,
  'overlayPatternBlendMode': 'normal',
  'filter': 'none',
  'filterStrength': 50
};

class VDBG {
  constructor(props) {
    this.initializeProperties(props);
    this.initializeYouTube();
    this.setUpVideoWithConfig();
    this.bindUI();
  }

  initializeProperties(props) {
    props = props || {};
    let _props = Object.assign({}, DEFAULT_PROPERTY_VALUES, props);
    this.container = _props['container'];
    this.videoId = _props['videoId'];
    this.fitMode = _props['fitMode'];
    this.limitLoops = _props['limitLoops'];
    this.maxLoops = _props['maxLoops'];
    this.scaleFactor = _props['scaleFactor'];
    this.orientation = _props['orientation'];
    this.speed = _props['speed'];
    this.textColor = _props['textColor'];
    this.textOpacity = _props['textOpacity'];
    this.textBlendMode = _props['textBlendMode'];
    this.overlayColor = _props['overlayColor'];
    this.overlayColorOpacity = _props['overlayColorOpacity'];
    this.overlayColorBlendMode = _props['overlayColorBlendMode'];
    this.overlayPattern = _props['overlayPattern'];
    this.overlayPatternOpacity = _props['overlayPatternOpacity'];
    this.overlayPatternBlendMode = _props['overlayPatternBlendMode'];
    this.filter = _props['filter'];
    this.filterStrength = _props['filterStrength'];

    this.player = {};
    this.currentLoop = 0;
    this.isMobileSafari = window.navigator.userAgent.indexOf('AppleWebKit') !== -1 && window.navigator.userAgent.indexOf('Mobile') !== -1;
  }

  initializeYouTube() {
    this.player.ready = false;

    const tag = document.createElement('script');
    const protocol = document.location.protocol === 'file:' ? 'http:' : document.location.protocol;
    tag.src = protocol + '//www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    tag.addEventListener('load', function () {
      this.onYouTubeIframeAPIReady();
    }.bind(this), true);
  }

  setUpVideoWithConfig() {
    this.setOrientation();
    this.setColor(this.textColor, '.sample-text', 'color');
    this.setOpacity(this.textOpacity, '.sample-text');
    this.setColor(this.overlayColor, '.overlay.color', 'background-color');
    this.setOpacity(this.overlayColorOpacity, '.overlay.color');
    this.setBlend(this.overlayColorBlendMode, '.overlay.color');
    this.setPattern();
    this.setOpacity(this.overlayPatternOpacity, '.overlay.pattern');
    this.setBlend(this.overlayPatternBlendMode, '.overlay.pattern');
  }

  getVideoUrl(value) {
    let v;
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

  setOrientation() {
    this.container.classList.toggle('flip-x', this.orientation.x);
    this.container.classList.toggle('flip-y', this.orientation.y);
  }

  setColor(prop, targetSel, property) {
    document.body.querySelector(targetSel).style[property] = prop;
  }

  setOpacity(prop, targetSel) {
    document.body.querySelector(targetSel).style.opacity = Math.min(0.95, prop);
  }

  setBlend(prop, targetSel) {
    const el = document.body.querySelector(targetSel);

    if (prop === 'none') {
      el.style.mixBlendMode = 'initial';
    } else {
      el.style.mixBlendMode = prop;
    }
  }

  setPattern() {
    this.container.querySelector('.pattern').setAttribute('data-pattern-name', this.overlayPattern);
  }

  setFilter() {
    if (typeof this.player === 'undefined') {
      return false;
    }

    var pstyle = this.player.f.style;

    switch (this.filter) {
      case 'blur':
        {
          pstyle.webkitFilter = 'blur(' + this.filterStrength / 5 + 'px)';
          break;
        }
      case 'brightness':
        {
          pstyle.webkitFilter = 'brightness(' + this.filterStrength / 5 + ')';
          break;
        }
      case 'contrast':
        {
          pstyle.webkitFilter = 'contrast(' + this.filterStrength * 5 + '%)';
          break;
        }
      case 'drop-shadow':
        {
          pstyle.webkitFilter = 'drop-shadow(16px 16px 20px #000)';
          break;
        }
      case 'grayscale':
        {
          pstyle.webkitFilter = 'grayscale(' + this.filterStrength + '%)';
          break;
        }
      case 'hue-rotate':
        {
          pstyle.webkitFilter = 'hue-rotate(' + this.filterStrength / 100 * 360 + 'deg)';
          break;
        }
      case 'invert':
        {
          pstyle.webkitFilter = 'invert()';
          break;
        }
      case 'opacity':
        {
          pstyle.webkitFilter = 'opacity(' + this.filterStrength + '%)';
          break;
        }
      case 'saturate':
        {
          pstyle.webkitFilter = 'saturate(' + this.filterStrength * 3 + '%)';
          break;
        }
      case 'sepia':
        {
          pstyle.webkitFilter = 'sepia(' + this.filterStrength + '%)';
          break;
        }
      default:
        {
          pstyle.webkitFilter = '';
        }
    }
  }

  onYouTubeIframeAPIReady() {
    if (!this.videoId) {
      return false;
    }

    if (this.player.ready) {
      try {
        this.player.destroy();
      } catch (e) {
        // nothing to destroy
      }
    }

    if (YT.loaded !== 1) {
      setTimeout(this.onYouTubeIframeAPIReady.bind(this), 500);
      return false;
    }

    this.player = new YT.Player('player', {
      height: '315',
      width: '560',
      videoId: this.videoId,
      playerVars: {
        'autoplay': 1,
        'controls': 0,
        'autohide': 1,
        'wmode': 'opaque',
        'showinfo': 0,
        'loop': 0,
        'iv_load_policy': 3,
        'playlist': this.videoId
      },
      events: {
        'onReady': function () {
          this.onPlayerReady(event);
        }.bind(this),
        'onStateChange': function () {
          this.onPlayerStateChange(event);
        }.bind(this)
      }
    });
  }

  onPlayerReady(event) {
    this.player.f.classList.add('background-video');
    if (this.isMobileSafari) {
      body.classList.add('mobile');
    };
    this.scaleVideo();
    this.setSpeed();
    this.setFilter();
    this.player.mute();
    !this.isMobileSafari && this.player.playVideo();
    document.body.classList.add('ready');
    this.player.f.classList.add('ready');
    this.player.ready = true;
    this.player.loopTimer = setInterval(this.loopOnEnd, 250);
  }

  onPlayerStateChange(event, context) {
    if (event.data === YT.PlayerState.PLAYING) {
      if (this.maxLoops && this.limitLoops) {
        var l = this.checkLoops();
        if (l > this.maxLoops) {
          this.player.pauseVideo();
          clearInterval(this.player.loopTimer);
          this.loops = 0;
        }
      }
    }
  }

  checkLoops() {
    this.loops++;
    return this.loops;
  }

  scaleVideo() {
    if (typeof this.player === 'undefined') {
      return false;
    }

    if (this.fitMode !== 'cover') {
      this.player.f.style.width = '';
      this.player.f.style.height = '';
      return false;
    }

    let containerWidth = this.player.f.parentNode.clientWidth;
    let containerHeight = this.player.f.parentNode.clientHeight;
    let containerRatio = containerWidth / containerHeight;
    let videoRatio = this.player.h.f.width / this.player.h.f.height;
    if (containerRatio > videoRatio) {
      // at the same width, the video is taller than the window
      this.player.f.style.width = containerWidth * this.scaleFactor + 'px';
      this.player.f.style.height = containerWidth * this.scaleFactor / videoRatio + 'px';
    } else if (videoRatio > containerRatio) {
      // at the same width, the video is shorter than the window
      this.player.f.style.width = containerHeight * this.scaleFactor * videoRatio + 'px';
      this.player.f.style.height = containerHeight * this.scaleFactor + 'px';
    } else {
      // the window and video ratios match
      this.player.f.style.width = containerWidth * this.scaleFactor + 'px';
      this.player.f.style.height = containerHeight * this.scaleFactor + 'px';
    }
  }

  setSpeed() {
    if (!this.player) {
      return false;
    }
    this.player.setPlaybackRate(this.speed);
  }

  loopOnEnd() {
    if (!this.player || !this.player.ready) {
      return false;
    }

    const duration = this.player.getDuration();
    const current = this.player.getCurrentTime();

    // todo: make the 0.25 offset a calculated value, or a variable
    if (current / (duration - 0.25) >= 0.99) {
      this.player.seekTo(0);
    }
  }

  bindUI() {
    window.addEventListener('resize', function () {
      window.requestAnimationFrame(function () {
        this.scaleVideo();
      }.bind(this));
    }.bind(this), true);
  }
}

module.exports = VDBG;

},{}]},{},[2,1]);