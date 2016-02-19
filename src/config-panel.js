'use strict'

const VideoBackground = require('./videobackground.js');

const panel = document.getElementById('ConfigPane');
const config = {};

function getUrlParameters() {
  let urlParameters = decodeURIComponent(document.location.hash.substring(1));
  if (urlParameters) {
    Object.assign(config, JSON.parse(urlParameters));
    setPanelValues();
    console.log(config);
    return config;
  }
}

function setUrl() {
  let url = vvv.getProps();
  delete url.container;
  document.location.hash = encodeURIComponent(JSON.stringify(url));
}

function setPanelValues() {
  panel.querySelector('#EmbedCode').value = 'https://www.youtube.com/watch?v=' + config.videoId;
  panel.querySelector('#FitMode').value = config.fitMode;
  panel.querySelector('#LimitLoops').value = config.limitLoops;
  panel.querySelector('#MaxLoops').value = config.maxLoops;
  panel.querySelector('#Zoom').value = config.scaleFactor;
  [].slice.call(document.body.querySelectorAll('input[name="flip-checkbox"]')).forEach(function(i) {
    i.checked = config.orientation[i.value];
  });
  panel.querySelector('#PlaybackSpeed').value = config.speed;
  panel.querySelector('#TextColor').value = config.textColor.replace('#', '');
  panel.querySelector('#TextColorOpacity').value = config.textOpacity * 100;
  panel.querySelector('#TextBlendMode').value = config.textBlendMode;
  panel.querySelector('#OverlayColor').value = config.overlayColor.replace('#', '');
  panel.querySelector('#OverlayColorOpacity').value = config.overlayColorOpacity * 100;
  panel.querySelector('#OverlayColorBlendMode').value = config.overlayColorBlendMode;
  panel.querySelector('#PatternLibrary').value = config.overlayPattern;
  panel.querySelector('#OverlayPatternOpacity').value = config.overlayPatternOpacity * 100;
  panel.querySelector('#PatternBlendMode').value = config.overlayPatternBlendMode;
  panel.querySelector('#Filter').value = config.filter;
  panel.querySelector('#FilterStrength').value = config.filterStrength;

}

const vvv = new VideoBackground(getUrlParameters());

if (document.location.protocol === 'file:') {
  window.vvv = vvv;
}

/*
 * Some stuff related only to this config panel implementation
 */
const colors = {
 'aliceblue': '#f0f8ff', 'antiquewhite': '#faebd7', 'aqua': '#00ffff', 'aquamarine': '#7fffd4', 'azure': '#f0ffff', 'beige': '#f5f5dc', 'bisque': '#ffe4c4', 'black': '#000000', 'blanchedalmond': '#ffebcd', 'blue': '#0000ff', 'blueviolet': '#8a2be2', 'brown': '#a52a2a', 'burlywood': '#deb887', 'cadetblue': '#5f9ea0', 'chartreuse': '#7fff00', 'chocolate': '#d2691e', 'coral': '#ff7f50', 'cornflowerblue': '#6495ed', 'cornsilk': '#fff8dc', 'crimson': '#dc143c', 'cyan': '#00ffff', 'darkblue': '#00008b', 'darkcyan': '#008b8b', 'darkgoldenrod': '#b8860b', 'darkgray': '#a9a9a9', 'darkgrey': '#a9a9a9', 'darkgreen': '#006400', 'darkkhaki': '#bdb76b', 'darkmagenta': '#8b008b', 'darkolivegreen': '#556b2f', 'darkorange': '#ff8c00', 'darkorchid': '#9932cc', 'darkred': '#8b0000', 'darksalmon': '#e9967a', 'darkseagreen': '#8fbc8f', 'darkslateblue': '#483d8b', 'darkslategray': '#2f4f4f', 'darkslategrey': '#2f4f4f', 'darkturquoise': '#00ced1', 'darkviolet': '#9400d3', 'deeppink': '#ff1493', 'deepskyblue': '#00bfff', 'dimgray': '#696969', 'dimgrey': '#696969', 'dodgerblue': '#1e90ff', 'firebrick': '#b22222', 'floralwhite': '#fffaf0', 'forestgreen': '#228b22', 'fuchsia': '#ff00ff', 'gainsboro': '#dcdcdc', 'ghostwhite': '#f8f8ff', 'gold': '#ffd700', 'goldenrod': '#daa520', 'gray': '#808080', 'grey': '#808080', 'green': '#008000', 'greenyellow': '#adff2f', 'honeydew': '#f0fff0', 'hotpink': '#ff69b4', 'indianred': '#cd5c5c', 'indigo': '#4b0082', 'ivory': '#fffff0', 'khaki': '#f0e68c', 'lavender': '#e6e6fa', 'lavenderblush': '#fff0f5', 'lawngreen': '#7cfc00', 'lemonchiffon': '#fffacd', 'lightblue': '#add8e6', 'lightcoral': '#f08080', 'lightcyan': '#e0ffff', 'lightgoldenrodyellow': '#fafad2', 'lightgray': '#d3d3d3', 'lightgrey': '#d3d3d3', 'lightgreen': '#90ee90', 'lightpink': '#ffb6c1', 'lightsalmon': '#ffa07a', 'lightseagreen': '#20b2aa', 'lightskyblue': '#87cefa', 'lightslategray': '#778899', 'lightslategrey': '#778899', 'lightsteelblue': '#b0c4de', 'lightyellow': '#ffffe0', 'lime': '#00ff00', 'limegreen': '#32cd32', 'linen': '#faf0e6', 'magenta': '#ff00ff', 'maroon': '#800000', 'mediumaquamarine': '#66cdaa', 'mediumblue': '#0000cd', 'mediumorchid': '#ba55d3', 'mediumpurple': '#9370d8', 'mediumseagreen': '#3cb371', 'mediumslateblue': '#7b68ee', 'mediumspringgreen': '#00fa9a', 'mediumturquoise': '#48d1cc', 'mediumvioletred': '#c71585', 'midnightblue': '#191970', 'mintcream': '#f5fffa', 'mistyrose': '#ffe4e1', 'moccasin': '#ffe4b5', 'navajowhite': '#ffdead', 'navy': '#000080', 'oldlace': '#fdf5e6', 'olive': '#808000', 'olivedrab': '#6b8e23', 'orange': '#ffa500', 'orangered': '#ff4500', 'orchid': '#da70d6', 'palegoldenrod': '#eee8aa', 'palegreen': '#98fb98', 'paleturquoise': '#afeeee', 'palevioletred': '#d87093', 'papayawhip': '#ffefd5', 'peachpuff': '#ffdab9', 'peru': '#cd853f', 'pink': '#ffc0cb', 'plum': '#dda0dd', 'powderblue': '#b0e0e6', 'purple': '#800080', 'red': '#ff0000', 'rosybrown': '#bc8f8f', 'royalblue': '#4169e1', 'saddlebrown': '#8b4513', 'salmon': '#fa8072', 'sandybrown': '#f4a460', 'seagreen': '#2e8b57', 'seashell': '#fff5ee', 'sienna': '#a0522d', 'silver': '#c0c0c0', 'skyblue': '#87ceeb', 'slateblue': '#6a5acd', 'slategray': '#708090', 'slategrey': '#708090', 'snow': '#fffafa', 'springgreen': '#00ff7f', 'steelblue': '#4682b4', 'tan': '#d2b48c', 'teal': '#008080', 'thistle': '#d8bfd8', 'tomato': '#ff6347', 'turquoise': '#40e0d0', 'violet': '#ee82ee', 'wheat': '#f5deb3', 'white': '#ffffff', 'whitesmoke': '#f5f5f5', 'yellow': '#ffff00', 'yellowgreen': '#9acd32'
};

let options = '<option value="none">none</option>';
Object.keys(colors).forEach(function(a) {
 options += '<option value="' + a + '">' + a + '</option>';
});
[].slice.call(document.body.querySelectorAll('.webColors')).forEach(function(s) {
 s.innerHTML = options;
});


/*
 * LISTENERS
 */
panel.querySelector('h6').addEventListener('click', function() {
  event.target.parentNode.classList.toggle('open');
});

panel.querySelector('#EmbedCode').addEventListener('focus', function() {
  event.target.setAttribute('data-old-value', event.target.value);
  event.target.value = '';
});

panel.querySelector('#EmbedCode').addEventListener('blur', function() {
  if (event.target.value === '') {
    event.target.value = event.target.getAttribute('data-old-value');
  } else {
    vvv.videoId = vvv.getVideoUrl(event.target.value);
    vvv.onYouTubeIframeAPIReady();
  }
});

panel.querySelector('#FitMode').addEventListener('change', function() {
  vvv.fitMode = event.target.value;
  vvv.scaleVideo();
});

panel.querySelector('#LimitLoops').addEventListener('change', function() {
  vvv.limitLoops = event.target.checked;
  vvv.maxLoops = parseInt(panel.querySelector('#MaxLoops').value);
  vvv.onYouTubeIframeAPIReady();
});

panel.querySelector('#MaxLoops').addEventListener('change', function() {
  vvv.limitLoops = event.target.checked;
  vvv.maxLoops = parseInt(panel.querySelector('#MaxLoops').value);
  vvv.onYouTubeIframeAPIReady();
});

panel.querySelector('#Zoom').addEventListener('change', function() {
  vvv.scaleFactor = parseFloat(event.target.value);
  vvv.scaleVideo();
});

[].slice.call(document.body.querySelectorAll('input[name="flip-checkbox"]')).forEach(function(i) {
  i.addEventListener('change', function() {
    vvv.orientation[event.target.value] = event.target.checked;
    vvv.setOrientation();
  });
});

panel.querySelector('#PlaybackSpeed').addEventListener('change', function() {
  vvv.speed = parseFloat(event.target.value);
  vvv.setSpeed();
});

panel.querySelector('#TextColor').addEventListener('blur', function() {
  vvv.textColor = '#' + event.target.value;
  vvv.setColor(vvv.textColor, '.sample-text', 'color');
});

panel.querySelector('.webColors[data-for="#TextColor"]').addEventListener('change', function() {
  vvv.textColor = event.target.value
  vvv.setColor(vvv.textColor, '.sample-text', 'color');
});

panel.querySelector('#TextColorOpacity').addEventListener('change', function() {
  vvv.textOpacity = parseFloat(event.target.value) / 100;
  vvv.setOpacity(vvv.textOpacity, '.sample-text');
});

panel.querySelector('#TextBlendMode').addEventListener('change', function() {
  vvv.textBlendMode = event.target.value;
  vvv.setBlend(vvv.textBlendMode, '.sample-text');
});

panel.querySelector('#OverlayColor').addEventListener('blur', function() {
  vvv.overlayColor = '#' + event.target.value;
  vvv.setColor(vvv.overlayColor, '.overlay.color', 'background-color');
});

panel.querySelector('.webColors[data-for="#OverlayColor"]').addEventListener('change', function() {
  vvv.overlayColor = event.target.value
  vvv.setColor(vvv.overlayColor, '.overlay.color', 'background-color');
});

panel.querySelector('#OverlayColorOpacity').addEventListener('change', function() {
  vvv.overlayColorOpacity = parseFloat(event.target.value) / 100;
  vvv.setOpacity(vvv.overlayColorOpacity, '.overlay.color');
});

panel.querySelector('#OverlayColorBlendMode').addEventListener('change', function() {
  vvv.overlayColorBlendMode = event.target.value;
  vvv.setBlend(vvv.overlayColorBlendMode, '.overlay.color');
});

panel.querySelector('#PatternLibrary').addEventListener('change', function() {
  vvv.overlayPattern = event.target.value;
  vvv.setPattern();
});

panel.querySelector('#OverlayPatternOpacity').addEventListener('change', function() {
  vvv.overlayPatternOpacity = parseFloat(event.target.value) / 100;
  vvv.setOpacity(vvv.overlayPatternOpacity, '.overlay.pattern');
});

panel.querySelector('#PatternBlendMode').addEventListener('change', function() {
  vvv.overlayPatternBlendMode = event.target.value;
  vvv.setBlend(vvv.overlayPatternBlendMode, '.overlay.pattern');
});

panel.querySelector('#Filter').addEventListener('change', function() {
  vvv.filter = event.target.value;
  vvv.setFilter();

  panel.querySelector('label[for="FilterStrength"]').classList.toggle('hidden', event.target.value === 'none')
});

panel.querySelector('#FilterStrength').addEventListener('change', function() {
  vvv.filterStrength = parseFloat(event.target.value);
  vvv.setFilter();
});

document.body.querySelector('.background-wrapper').addEventListener('click', function() {
  panel.classList.remove('open');
});

panel.querySelector('form').addEventListener('submit', function() {
  event.preventDefault();
  vvv.setUpVideoWithConfig();
  vvv.onYouTubeIframeAPIReady();
  setUrl();
  event.target.parentNode.classList.remove('open');
}, true);
