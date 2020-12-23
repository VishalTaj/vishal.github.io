var util = util || {};
util.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};

var Terminal = Terminal || function(cmdLineContainer, outputContainer) {
  window.URL = window.URL || window.webkitURL;
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  var cmdLine_ = document.querySelector(cmdLineContainer);
  var output_ = document.querySelector(outputContainer);

  const CMDS_ = [
    'cat', 'clear', 'echo', 'help', 'open', 'uname', 'whoami', 'download', 'projects'
  ];
  
  const PROJECTS_ = [
    'says.com', 'ohbulan.com', 'viralcham.com', 'siraplimau.com', 'myresipi.com', 'rojaklah.com', 'juiceonline.com',
    'loanstreet.com.my', 'loanplus.com.my', 'hotncool.qa', 'dosahouse.online', 'libsimarkah.com'
  ]
  var fs_ = null;
  var cwd_ = null;
  var history_ = [];
  var histpos_ = 0;
  var histtemp_ = 0;

  window.addEventListener('click', function(e) {
    cmdLine_.focus();
  }, false);

  cmdLine_.addEventListener('click', inputTextClick_, false);
  cmdLine_.addEventListener('keydown', historyHandler_, false);
  cmdLine_.addEventListener('keydown', processNewCommand_, false);

  //
  function inputTextClick_(e) {
    this.value = this.value;
  }

  //
  function historyHandler_(e) {
    if (history_.length) {
      if (e.keyCode == 38 || e.keyCode == 40) {
        if (history_[histpos_]) {
          history_[histpos_] = this.value;
        } else {
          histtemp_ = this.value;
        }
      }

      if (e.keyCode == 38) { // up
        histpos_--;
        if (histpos_ < 0) {
          histpos_ = 0;
        }
      } else if (e.keyCode == 40) { // down
        histpos_++;
        if (histpos_ > history_.length) {
          histpos_ = history_.length;
        }
      }

      if (e.keyCode == 38 || e.keyCode == 40) {
        this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
        this.value = this.value; // Sets cursor to end of input.
      }
    }
  }

  //
  function processReturnCommand(t) {
    // enter
    // Save shell history.
    if (t.value) {
      history_[history_.length] = t.value;
      histpos_ = history_.length;
    }

    // Duplicate current input and append to output section.
    var line = t.parentNode.parentNode.cloneNode(true);
    line.removeAttribute('id')
    line.classList.add('line');
    var input = line.querySelector('input.cmdline');
    input.autofocus = false;
    input.readOnly = true;
    output_.appendChild(line);

    if (t.value && t.value.trim()) {
      var args = t.value.split(' ').filter(function(val, i) {
        return val;
      });
      var cmd = args[0].toLowerCase();
      args = args.splice(1); // Remove cmd from arg list.
    }

    switch (cmd) {
      case 'cat':
        var url = args.join(' ');
        if (!url) {
          output('Usage: ' + cmd + ' https://s.codepen.io/...');
          output('Example: ' + cmd + ' https://s.codepen.io/AndrewBarfield/pen/LEbPJx.js');
          break;
        }
        $.get( url, function(data) {
          var encodedStr = data.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
              return '&#'+i.charCodeAt(0)+';';
          });
          output('<pre>' + encodedStr + '</pre>');
        });          
        break;
      case 'clear':
        output_.innerHTML = '';
        t.value = '';
        return;
      case 'echo':
        output( args.join(' ') );
        break;
      case 'help':
        output('list of commands: ')
        output('<div class="ls-files">' + CMDS_.join('<br>') + '</div>');
        break;
      case 'projects':
          output('<div class="ls-files">' + PROJECTS_.join('<br>') + '</div>');
          break;
      case 'uname':
        output(navigator.appVersion);
        break;
      case 'whoami':
        var result = "<p>A passionate programmer who always love to code. Keen to learn new things and I believe coding as a supernatural power. Being a web developer, I always tries to write better optimal and reusable code which helps in both commercial perspective also , my unequivocal love for making things, and my mission-driven work ethic to literally change the world. That's why I’m excited to make a big impact at a high growth company.</p>";
        output(result);
        break;
      case 'download':
          output('Downloading your resume....');
          break;
      default:
        if (cmd) {
          output(cmd + ': command not found');
        }
    };

    var twindow = document.querySelector('.terminal-window')
    twindow.scrollTo(0, getDocHeight_(twindow));
    document.querySelector('body').scrollTop = 0
    t.value = ''; // Clear/setup line for next input.
  }

  //
  function processNewCommand_(e) {

    if (e.keyCode == 9) { // tab
      e.preventDefault();
      // Implement tab suggest.
    } else if (e.keyCode == 13) {
      processReturnCommand(this);
    }
  }

  //
  function formatColumns_(entries) {
    var maxName = entries[0].name;
    util.toArray(entries).forEach(function(entry, i) {
      if (entry.name.length > maxName.length) {
        maxName = entry.name;
      }
    });

    var height = entries.length <= 3 ?
        'height: ' + (entries.length * 15) + 'px;' : '';

    // 12px monospace font yields ~7px screen width.
    var colWidth = maxName.length * 7;

    return ['<div class="ls-files" style="-webkit-column-width:',
            colWidth, 'px;', height, '">'];
  }

  //
  function output(html) {
    output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
  }

  //
  function input(html) {
    output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
  }

  // Cross-browser impl to get document's height.
  function getDocHeight_(twindow) {
    var d = twindow;
    return Math.max(
        d.scrollHeight,
        d.offsetHeight,
        d.clientHeight
    );
  }

  //
  return {
    init: function() {
    },
    output: output,
    enter: function(selector) {
      processReturnCommand(selector);
    }
  }
};