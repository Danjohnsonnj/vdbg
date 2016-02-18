'use strict';


class vdbg {
  constructor(props) {
    this.initializeProperties(props);
    this.initializeYouTube();
    this.setUpVideoWithConfig();
  };

  initializeProperties(props) {
    props = props || {};
    this.container = props['container'] || document.querySelector('.background-wrapper');
    this.videoId = props['videoId'] || '9kKyF_Yn6HQ';
    this.fitMode = props['fitMode'] || 'cover';
    this.limitLoops = props['limitLoops'] || false;
    this.maxLoops = props['maxLoops'] || '';
    this.scaleFactor = props['scaleFactor'] || 1;
    this.orientation = props['orientation'] || '';
    this.speed = props['speed'] || 1;
    this.textColor = props['textColor'] || 'ffffff';
    this.textOpacity = props['textOpacity'] || 0.5;
    this.textBlendMode = props['textBlendMode'] || 'normal';
    this.overlayColor = props['overlayColor'] || '000000';
    this.overlayColorOpacity = props['overlayColorOpacity'] || 0.5;
    this.overlayColorBlendMode = props['overlayColorBlendMode'] || 'normal';
    this.overlayPattern = props['overlayPattern'] || 'none';
    this.overlayPatternOpacity = props['overlayPatternOpacity'] || 0.5;
    this.overlayPatternBlendMode = props['overlayPatternBlendMode'] || 'normal';
    this.filter = props['filter'] || 'none';
    this.filterStrength = props['filterStrength'] || 50;

    this.player = {};
    this.currentLoop = 0;
    this.isMobileSafari = (window.navigator.userAgent.indexOf('AppleWebKit') !== -1 && window.navigator.userAgent.indexOf('Mobile') !== -1);
  };

  initializeYouTube() {
    this.player.ready = false;

    const tag = document.createElement('script');
    const protocol = document.location.protocol === 'file:' ? 'http:' : document.location.protocol;
    tag.src = protocol + '//www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    tag.addEventListener('load', function() { this.onYouTubeIframeAPIReady() }.bind(this), true);
  };

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
  };

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
  };

  getMaxLoops() {
    const enabled = document.body.querySelector('#ConfigPane #LimitLoops').checked;
    const num = document.body.querySelector('#ConfigPane #MaxLoops').value;
    if (!enabled || isNaN(num)) {
      return null;
    } else if (enabled && !isNaN(num)) {
      return parseInt(num);
    }
  };

  setOrientation() {
    this.container.classList.toggle('flip-x', this.orientation.indexOf('x') !== -1);
    this.container.classList.toggle('flip-y', this.orientation.indexOf('y') !== -1);
  };

  setColor(prop, targetSel, property) {
    document.body.querySelector(targetSel).style[property] = prop;
  };

  setOpacity(prop, targetSel) {
    document.body.querySelector(targetSel).style.opacity = Math.min(0.95, prop);
  };

  setBlend(prop, targetSel) {
    const el = document.body.querySelector(targetSel);

    if (prop === 'none') {
      el.style.mixBlendMode = 'initial';
    } else {
      el.style.mixBlendMode = prop;
    }
  };

  setPattern() {
    this.container.querySelector('.pattern').setAttribute('data-pattern-name', this.overlayPattern);
  };

  setFilter() {
    if (typeof(this.player) === 'undefined') {
      return false;
    }

    var pstyle = this.player.f.style;

    switch (this.filter) {
      case 'blur': {
        pstyle.webkitFilter = 'blur(' + this.filterStrength / 5 + 'px)';
        break;
      }
      case 'brightness': {
        pstyle.webkitFilter = 'brightness(' + this.filterStrength / 5 + ')';
        break;
      }
      case 'contrast': {
        pstyle.webkitFilter = 'contrast(' + this.filterStrength * 5 + '%)';
        break;
      }
      case 'drop-shadow': {
        pstyle.webkitFilter = 'drop-shadow(16px 16px 20px #000)';
        break;
      }
      case 'grayscale': {
        pstyle.webkitFilter = 'grayscale(' + this.filterStrength + '%)';
        break;
      }
      case 'hue-rotate': {
        pstyle.webkitFilter = 'hue-rotate(' + this.filterStrength / 100 * 360 + 'deg)';
        break;
      }
      case 'invert': {
        pstyle.webkitFilter = 'invert()';
        break;
      }
      case 'opacity': {
        pstyle.webkitFilter = 'opacity(' + this.filterStrength + '%)';
        break;
      }
      case 'saturate': {
        pstyle.webkitFilter = 'saturate(' + this.filterStrength * 3 + '%)';
        break;
      }
      case 'sepia': {
        pstyle.webkitFilter = 'sepia(' + this.filterStrength + '%)';
        break;
      }
      default: {
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
      } catch(e) {
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
        'onReady': function() {
          this.onPlayerReady(event);
        }.bind(this),
        'onStateChange': function() {
          this.onPlayerStateChange(event);
        }.bind(this)
      }
    });
  };

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
  };

  onPlayerStateChange(event, context) {
    if (event.data === YT.PlayerState.PLAYING) {
      if (this.maxLoops) {
        var l = this.checkLoops();
        if (l > maxLoops) {
          this.player.pauseVideo();
          clearInterval(this.player.loopTimer);
          this.loops = 0;
        }
      }
    }
  };

  checkLoops() {
    this.loops++;
    return this.loops;
  };

  scaleVideo() {
    if (typeof(this.player) === 'undefined') {
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
      this.player.f.style.width = (containerWidth * this.scaleFactor) + 'px';
      this.player.f.style.height = (containerWidth * this.scaleFactor) / videoRatio + 'px';
    } else if (videoRatio > containerRatio) {
      // at the same width, the video is shorter than the window
      this.player.f.style.width = (containerHeight * this.scaleFactor) * videoRatio + 'px';
      this.player.f.style.height = (containerHeight * this.scaleFactor) + 'px';
    } else {
      // the window and video ratios match
      this.player.f.style.width = (containerWidth * this.scaleFactor) + 'px';
      this.player.f.style.height = (containerHeight * this.scaleFactor) + 'px';
    }
  };

  setSpeed() {
    if (!this.player) {
      return false;
    }
    this.player.setPlaybackRate(this.speed);
  };

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
  };

}

window.vvv = new vdbg();


/*
* CONFIG, to be wired to app UI
*/
// let videoId = null; // e.g. String: 'dN6Zt3D3jT8'
// let fitMode = 'cover'; // String: 'cover' | 'contain'
// let LimitLoops = false; // Boolean
// let maxLoops = null; // Integer
// let scaleFactor = 1; // Number
// let flip = null; // String: 'x' | 'y' \ 'xy'
// let speed = 1; // Number: 0.25 | 0.5 | 1 | 1.25 | 1.5 | 2
//
// let textColor = 'ffffff'; // String: Hex value (no leading '#'), or CSS color name
// let textOpacity = 0.5; // Number: 0 to 1
// let textBlendMode = 'normal' // String: one of CSS mix-blend-mode values
//
// let overlayColor = '000000'; // String: Hex value (no leading '#'), or CSS color name
// let overlayOpacity = 0.5; // Number: 0 to 1
// let overlayBlendMode = 'normal' // String: one of CSS mix-blend-mode values
//
// let overlayPattern = 'none'; // String: 'simple-horizontal' | 'static' | 'subtle-dots'
// let overlayPatternOpacity = 0.5; // Number: 0 to 1
// let overlayPatternBlendMode = 'normal' // String: one of CSS mix-blend-mode values
//
// let filter = 'none'; // String: one of CSS filter values

/*
 * Some stuff related only to this config panel implementation
 */
  const colors = {
   'aliceblue': '#f0f8ff', 'antiquewhite': '#faebd7', 'aqua': '#00ffff', 'aquamarine': '#7fffd4', 'azure': '#f0ffff', 'beige': '#f5f5dc', 'bisque': '#ffe4c4', 'black': '#000000', 'blanchedalmond': '#ffebcd', 'blue': '#0000ff', 'blueviolet': '#8a2be2', 'brown': '#a52a2a', 'burlywood': '#deb887', 'cadetblue': '#5f9ea0', 'chartreuse': '#7fff00', 'chocolate': '#d2691e', 'coral': '#ff7f50', 'cornflowerblue': '#6495ed', 'cornsilk': '#fff8dc', 'crimson': '#dc143c', 'cyan': '#00ffff', 'darkblue': '#00008b', 'darkcyan': '#008b8b', 'darkgoldenrod': '#b8860b', 'darkgray': '#a9a9a9', 'darkgrey': '#a9a9a9', 'darkgreen': '#006400', 'darkkhaki': '#bdb76b', 'darkmagenta': '#8b008b', 'darkolivegreen': '#556b2f', 'darkorange': '#ff8c00', 'darkorchid': '#9932cc', 'darkred': '#8b0000', 'darksalmon': '#e9967a', 'darkseagreen': '#8fbc8f', 'darkslateblue': '#483d8b', 'darkslategray': '#2f4f4f', 'darkslategrey': '#2f4f4f', 'darkturquoise': '#00ced1', 'darkviolet': '#9400d3', 'deeppink': '#ff1493', 'deepskyblue': '#00bfff', 'dimgray': '#696969', 'dimgrey': '#696969', 'dodgerblue': '#1e90ff', 'firebrick': '#b22222', 'floralwhite': '#fffaf0', 'forestgreen': '#228b22', 'fuchsia': '#ff00ff', 'gainsboro': '#dcdcdc', 'ghostwhite': '#f8f8ff', 'gold': '#ffd700', 'goldenrod': '#daa520', 'gray': '#808080', 'grey': '#808080', 'green': '#008000', 'greenyellow': '#adff2f', 'honeydew': '#f0fff0', 'hotpink': '#ff69b4', 'indianred': '#cd5c5c', 'indigo': '#4b0082', 'ivory': '#fffff0', 'khaki': '#f0e68c', 'lavender': '#e6e6fa', 'lavenderblush': '#fff0f5', 'lawngreen': '#7cfc00', 'lemonchiffon': '#fffacd', 'lightblue': '#add8e6', 'lightcoral': '#f08080', 'lightcyan': '#e0ffff', 'lightgoldenrodyellow': '#fafad2', 'lightgray': '#d3d3d3', 'lightgrey': '#d3d3d3', 'lightgreen': '#90ee90', 'lightpink': '#ffb6c1', 'lightsalmon': '#ffa07a', 'lightseagreen': '#20b2aa', 'lightskyblue': '#87cefa', 'lightslategray': '#778899', 'lightslategrey': '#778899', 'lightsteelblue': '#b0c4de', 'lightyellow': '#ffffe0', 'lime': '#00ff00', 'limegreen': '#32cd32', 'linen': '#faf0e6', 'magenta': '#ff00ff', 'maroon': '#800000', 'mediumaquamarine': '#66cdaa', 'mediumblue': '#0000cd', 'mediumorchid': '#ba55d3', 'mediumpurple': '#9370d8', 'mediumseagreen': '#3cb371', 'mediumslateblue': '#7b68ee', 'mediumspringgreen': '#00fa9a', 'mediumturquoise': '#48d1cc', 'mediumvioletred': '#c71585', 'midnightblue': '#191970', 'mintcream': '#f5fffa', 'mistyrose': '#ffe4e1', 'moccasin': '#ffe4b5', 'navajowhite': '#ffdead', 'navy': '#000080', 'oldlace': '#fdf5e6', 'olive': '#808000', 'olivedrab': '#6b8e23', 'orange': '#ffa500', 'orangered': '#ff4500', 'orchid': '#da70d6', 'palegoldenrod': '#eee8aa', 'palegreen': '#98fb98', 'paleturquoise': '#afeeee', 'palevioletred': '#d87093', 'papayawhip': '#ffefd5', 'peachpuff': '#ffdab9', 'peru': '#cd853f', 'pink': '#ffc0cb', 'plum': '#dda0dd', 'powderblue': '#b0e0e6', 'purple': '#800080', 'red': '#ff0000', 'rosybrown': '#bc8f8f', 'royalblue': '#4169e1', 'saddlebrown': '#8b4513', 'salmon': '#fa8072', 'sandybrown': '#f4a460', 'seagreen': '#2e8b57', 'seashell': '#fff5ee', 'sienna': '#a0522d', 'silver': '#c0c0c0', 'skyblue': '#87ceeb', 'slateblue': '#6a5acd', 'slategray': '#708090', 'slategrey': '#708090', 'snow': '#fffafa', 'springgreen': '#00ff7f', 'steelblue': '#4682b4', 'tan': '#d2b48c', 'teal': '#008080', 'thistle': '#d8bfd8', 'tomato': '#ff6347', 'turquoise': '#40e0d0', 'violet': '#ee82ee', 'wheat': '#f5deb3', 'white': '#ffffff', 'whitesmoke': '#f5f5f5', 'yellow': '#ffff00', 'yellowgreen': '#9acd32'
  };

  // let options = '<option value="none">none</option>';
  // Object.keys(colors).forEach(function(a) {
  //  options += '<option value="' + a + '">' + a + '</option>';
  // });
  // [].slice.call(document.body.querySelectorAll('.webColors')).forEach(function(s) {
  //  s.innerHTML = options;
  // });

/*
 * MEAT AND POTATOES (unless you're not eating carbs; then it's just meat)
 */
// let player = {};
// player.ready = false;
// let loops = 0;
// const isMobileSafari = (window.navigator.userAgent.indexOf('AppleWebKit') !== -1 && window.navigator.userAgent.indexOf('Mobile') !== -1);
//
// const tag = document.createElement('script');
// const protocol = document.location.protocol === 'file:' ? 'http:' : document.location.protocol;
// tag.src = protocol + '//www.youtube.com/iframe_api';
// const firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//
// function setUpVideoWithConfig() {
//   var embedValue = document.body.querySelector('#EmbedCode').value;
//   videoId = getVideoUrl(embedValue);
//   maxLoops = getMaxLoops();
//   [].slice.call(document.body.querySelectorAll('input[name="flip-checkbox"]')).forEach(function(i) {
//     setOrientation(i);
//   });
//   getColor('#TextColor', '.sample-text', 'color');
//   getOpacity('#TextColorOpacity', '.sample-text');
//   getColor('#OverlayColor', '.color', 'background-color');
//   getOpacity('#ColorOpacity', '.overlay.color');
//   getBlend('#ColorBlendMode', '.overlay.color');
//   getPattern();
//   getOpacity('#PatternOpacity', '.overlay.pattern');
//   getBlend('#PatternBlendMode', '.overlay.pattern');
// }
//
// function onYouTubeIframeAPIReady() {
//   if (!videoId) {
//     return false;
//   }
//
//   if (typeof(player) !== 'undefined') {
//     try {
//       player.destroy();
//     } catch(e) {
//     }
//   }
//
//   player = new YT.Player('player', {
//     height: '315',
//     width: '560',
//     videoId: videoId,
//     playerVars: {
//       'autoplay': 1,
//       'controls': 0,
//       'autohide': 1,
//       'wmode': 'opaque',
//       'showinfo': 0,
//       'loop': 0,
//       'iv_load_policy': 3,
//       'playlist': videoId
//     },
//     events: {
//       'onReady': onPlayerReady,
//       'onStateChange': onPlayerStateChange
//     }
//   });
// }
//
// function onPlayerReady(event) {
//   var player = event.target;
//   player.f.classList.add('background-video');
//   if (isMobileSafari) {
//     body.classList.add('mobile');
//   };
//   scaleVideo(player);
//   setSpeed();
//   getFilter();
//   player.mute();
//   !isMobileSafari && player.playVideo();
//   document.body.classList.add('ready');
//   player.f.classList.add('ready');
//   player.ready = true;
//   player.loopTimer = setInterval(loopOnEnd, 250);
// }
//
// function onPlayerStateChange(event) {
//   if (event.data === YT.PlayerState.PLAYING) {
//     if (maxLoops) {
//       var l = checkLoops();
//       if (l > maxLoops) {
//         player.pauseVideo();
//         clearInterval(player.loopTimer);
//         loops = 0;
//       }
//     }
//   }
// }
//
// function scaleVideo(player) {
//   if (typeof(player) === 'undefined') {
//     return false;
//   }
//
//   fitMode = document.body.querySelector('#ConfigPane #FitMode input:checked').value;
//
//   if (fitMode !== 'cover') {
//     player.f.style.width = '';
//     player.f.style.height = '';
//     return false;
//   }
//
//   scaleFactor = getZoom();
//
//   var containerWidth = player.f.parentNode.clientWidth;
//   var containerHeight = player.f.parentNode.clientHeight;
//   var containerRatio = containerWidth / containerHeight;
//   var videoRatio = player.h.f.width / player.h.f.height;
//   if (containerRatio > videoRatio) {
//     // at the same width, the video is taller than the window
//     player.f.style.width = (containerWidth * scaleFactor) + 'px';
//     player.f.style.height = (containerWidth * scaleFactor) / videoRatio + 'px';
//   } else if (videoRatio > containerRatio) {
//     // at the same width, the video is shorter than the window
//     player.f.style.width = (containerHeight * scaleFactor) * videoRatio + 'px';
//     player.f.style.height = (containerHeight * scaleFactor) + 'px';
//   } else {
//     // the window and video ratios match
//     player.f.style.width = (containerWidth * scaleFactor) + 'px';
//     player.f.style.height = (containerHeight * scaleFactor) + 'px';
//   }
// }
//
// function getVideoUrl(value) {
//   var v;
//   if (value.indexOf('youtube.com/embed/') !== -1) {
//     // regex this?
//     v = value.substring(value.indexOf('/embed/') + 7);
//     v = v.substring(0, v.indexOf('"'));
//   } else if (value.indexOf('youtube.com/watch?v=') !== -1) {
//     v = value.substring(value.indexOf('watch?v=') + 8);
//   } else if (value.indexOf('youtu.be/') !== -1) {
//     v = value.substring(value.indexOf('youtu.be/' + 9));
//   }
//
//   if (v.length > 0) {
//     return v;
//   } else {
//     return false;
//   }
// }
//
// function getMaxLoops() {
//   var enabled = document.body.querySelector('#ConfigPane #LimitLoops').checked;
//   var num = document.body.querySelector('#ConfigPane #MaxLoops').value;
//   if (!enabled || isNaN(num)) {
//     return null;
//   } else if (enabled && !isNaN(num)) {
//     return parseInt(num);
//   }
// }
//
// function setSpeed() {
//   if (!player) {
//     return false;
//   }
//   player.setPlaybackRate(document.body.querySelector('#ConfigPane #PlaybackSpeed input:checked').value);
// }
//
// function getFilter() {
//   var filterValue = document.body.querySelector('#ConfigPane #Filter').value;
//   var inputEl = document.body.querySelector('#ConfigPane #FilterStrength');
//   var strengthValue = parseInt(inputEl.value);
//   if (filterValue === 'none' || filterValue === 'drop-shadow' || filterValue === 'invert') {
//     inputEl.previousElementSibling.classList.add('hidden');
//   } else {
//     inputEl.previousElementSibling.classList.remove('hidden');
//   }
//
//   if (typeof(player) === 'undefined') {
//     return false;
//   }
//
//   var p = player.f.style;
//
//   switch (filterValue) {
//     case 'blur': {
//       p.webkitFilter = 'blur(' + strengthValue / 5 + 'px)';
//       break;
//     }
//     case 'brightness': {
//       p.webkitFilter = 'brightness(' + strengthValue / 5 + ')';
//       break;
//     }
//     case 'contrast': {
//       p.webkitFilter = 'contrast(' + strengthValue * 5 + '%)';
//       break;
//     }
//     case 'drop-shadow': {
//       p.webkitFilter = 'drop-shadow(16px 16px 20px #000)';
//       break;
//     }
//     case 'grayscale': {
//       p.webkitFilter = 'grayscale(' + strengthValue + '%)';
//       break;
//     }
//     case 'hue-rotate': {
//       p.webkitFilter = 'hue-rotate(' + strengthValue / 100 * 360 + 'deg)';
//       break;
//     }
//     case 'invert': {
//       p.webkitFilter = 'invert()';
//       break;
//     }
//     case 'opacity': {
//       p.webkitFilter = 'opacity(' + strengthValue + '%)';
//       break;
//     }
//     case 'saturate': {
//       p.webkitFilter = 'saturate(' + strengthValue * 3 + '%)';
//       break;
//     }
//     case 'sepia': {
//       p.webkitFilter = 'sepia(' + strengthValue + '%)';
//       break;
//     }
//     default: {
//       p.webkitFilter = '';
//     }
//   }
// }
//
// function getColor(inputSel, targetSel, property) {
//   var colorValue;
//   var input = document.body.querySelector('#ConfigPane ' + inputSel);
//   var inputValue = input.value;
//   var selectValue = document.body.querySelector('#ConfigPane .webColors[data-for="' + inputSel + '"]').value;
//   if (selectValue !== 'none') {
//     input.setAttribute('disabled', 'true');
//     colorValue = selectValue;
//   } else {
//     input.removeAttribute('disabled');
//     colorValue = '#' + inputValue.match(/[0-9a-f]{6}/i);
//   }
//   document.body.querySelector(targetSel).style[property] = colorValue ;
// }
//
// function getPattern() {
//   var input = document.body.querySelector('#ConfigPane #PatternLibrary');
//   var inputValue = input.value;
//   document.body.querySelector('.pattern').setAttribute('data-pattern-name', inputValue);
// }
//
// function getOpacity(inputSel, targetSel) {
//   var opacityStrength = document.body.querySelector('#ConfigPane ' + inputSel).value / 100;
//   document.body.querySelector(targetSel).style.opacity = Math.min(0.95, opacityStrength);
// }
//
// function getBlend(inputSel, targetSel) {
//   var blendModeValue = document.body.querySelector('#ConfigPane ' + inputSel).value;
//   var el = document.body.querySelector(targetSel);
//
//   if (blendModeValue === 'none') {
//     el.style.mixBlendMode = '';
//   } else {
//     el.style.mixBlendMode = blendModeValue;
//   }
// }
//
// function checkLoops() {
//   loops++;
//   return loops;
// }
//
// function getZoom() {
//   return document.body.querySelector('#ConfigPane #Zoom').value;
// }
//
// function setOrientation(input) {
//   document.body.querySelector('.background-wrapper').classList.toggle(input.value, input.checked);
// }
//
// function loopOnEnd() {
//   if (!player || !player.ready) {
//     return false;
//   }
//
//   var duration = player.getDuration();
//   var current = player.getCurrentTime();
//
//   if (current / (duration - 0.25) >= 0.99) {
//     player.seekTo(0);
//   }
// }

/*
 * LISTENERS
 */
// document.body.querySelector('#EmbedCode').addEventListener('click', function() {
//   event.target.setAttribute('data-old-value', event.target.value);
//   event.target.value = '';
// });
//
// document.body.querySelector('#EmbedCode').addEventListener('blur', function() {
//   if (event.target.value === '') {
//     event.target.value = event.target.getAttribute('data-old-value');
//   }
// });
//
// document.body.querySelector('#ConfigPane #FitMode').addEventListener('change', function() {
//   scaleVideo(player);
// });
//
// document.body.querySelector('#ConfigPane #PlaybackSpeed').addEventListener('change', function() {
//   setSpeed();
// });
//
// document.body.querySelector('#ConfigPane form').addEventListener('submit', function() {
//   event.preventDefault();
//   setUpVideoWithConfig();
//   onYouTubeIframeAPIReady();
//   event.target.parentNode.classList.remove('open');
// }, true);
//
// document.body.querySelector('#ConfigPane h6').addEventListener('click', function() {
//   event.target.parentNode.classList.toggle('open');
// });
//
// document.body.querySelector('#ConfigPane #Filter').addEventListener('change', function() {
//   getFilter();
// });
//
// document.body.querySelector('#ConfigPane #Zoom').addEventListener('change', function() {
//   scaleVideo(player);
// });
//
// [].slice.call(document.body.querySelectorAll('input[name="flip-checkbox"]')).forEach(function(i) {
//   i.addEventListener('change', function() {
//     setOrientation(event.target);
//   });
// });
//
// document.body.querySelector('#ConfigPane #FilterStrength').addEventListener('change', function() {
//   getFilter();
// });
//
// document.body.querySelector('#ConfigPane #TextColor').addEventListener('blur', function() {
//   getColor('#TextColor', '.sample-text', 'color');
// });
//
// document.body.querySelector('#ConfigPane .webColors[data-for="#TextColor"]').addEventListener('change', function() {
//   getColor('#TextColor', '.sample-text', 'color');
// });
//
// document.body.querySelector('#ConfigPane #TextColorOpacity').addEventListener('change', function() {
//   getOpacity('#TextColorOpacity', '.sample-text');
// });
//
// document.body.querySelector('#ConfigPane #TextColorBlendMode').addEventListener('change', function() {
//   getBlend('#TextColorBlendMode', '.sample-text');
// });
//
// document.body.querySelector('#ConfigPane #PatternBlendMode').addEventListener('change', function() {
//   getBlend('#PatternBlendMode', '.overlay.pattern');
// });
//
// document.body.querySelector('#ConfigPane #OverlayColor').addEventListener('blur', function() {
//   getColor('#OverlayColor', '.color', 'background-color');
// });
//
// document.body.querySelector('#ConfigPane .webColors[data-for="#OverlayColor"]').addEventListener('change', function() {
//   getColor('#OverlayColor', '.color', 'background-color');
// });
//
// document.body.querySelector('#ConfigPane #ColorOpacity').addEventListener('change', function() {
//   getOpacity('#ColorOpacity', '.overlay.color');
// });
//
// document.body.querySelector('#ConfigPane #ColorBlendMode').addEventListener('change', function() {
//   getBlend('#ColorBlendMode', '.overlay.color');
// });
//
// document.body.querySelector('#ConfigPane #PatternLibrary').addEventListener('change', function() {
//   getPattern();
// });
//
// document.body.querySelector('#ConfigPane #PatternOpacity').addEventListener('change', function() {
//   getOpacity('#PatternOpacity', '.overlay.pattern');
// });
//
// document.body.querySelector('#ConfigPane #PatternBlendMode').addEventListener('change', function() {
//   getBlend('#PatternBlendMode', '.overlay.pattern');
// });
//
// document.body.querySelector('.background-wrapper').addEventListener('click', function() {
//   document.body.querySelector('#ConfigPane').classList.remove('open');
// });
//
// window.addEventListener('resize', function() {
//   window.requestAnimationFrame(function() {
//     scaleVideo(player);
//   });
// }, true);
//
// window.addEventListener('load', function() {
//   setUpVideoWithConfig();
//   if (YT.loaded) {
//     onYouTubeIframeAPIReady();
//   } else {
//     setTimeout(onYouTubeIframeAPIReady, 500);
//   }
// }, true);
