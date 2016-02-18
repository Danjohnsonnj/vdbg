'use strict';

class VDBG {
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
    this.textColor = props['textColor'] || '#ffffff';
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
      if (this.maxLoops && this.limitLoops) {
        var l = this.checkLoops();
        if (l > this.maxLoops) {
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

module.exports = VDBG;
