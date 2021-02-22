
let processUpdate = require('./process-update');
let socket;


let options = {
    overlay: true,
    reload: false,
    log: true,
    warn: true,
    name: '',
    overlayStyles: {},
    overlayWarnings: false,
    ansiColors: {},
  };

  
  // the reporter needs to be a singleton on the page
  // in case the client is being used by multiple bundles
  // we only want to report once.
  // all the errors will go to all clients
  let singletonKey = '__webpack_hot_middleware_reporter__';
  let reporter;
  if (typeof window !== 'undefined') {
    if (!window[singletonKey]) {
      window[singletonKey] = createReporter();
    }
    reporter = window[singletonKey];
  }
  
  function createReporter() {
    let strip = require('strip-ansi');
  
    let overlay;
    if (typeof document !== 'undefined' && options.overlay) {
      overlay = require('./client-overlay')({
        ansiColors: options.ansiColors,
        overlayStyles: options.overlayStyles,
      });
    }
  
    let styles = {
      errors: 'color: #ff0000;',
      warnings: 'color: #999933;',
    };
    let previousProblems = null;
    function log(type, obj) {
      let newProblems = obj[type]
        .map(function (msg) {
          return strip(msg);
        })
        .join('\n');
      if (previousProblems == newProblems) {
        return;
      } else {
        previousProblems = newProblems;
      }
  
      let style = styles[type];
      let name = obj.name ? "'" + obj.name + "' " : '';
      let title = '[HMR] bundle ' + name + 'has ' + obj[type].length + ' ' + type;
      // NOTE: console.warn or console.error will print the stack trace
      // which isn't helpful here, so using console.log to escape it.
      if (console.group && console.groupEnd) {
        console.group('%c' + title, style);
        console.log('%c' + newProblems, style);
        console.groupEnd();
      } else {
        console.log(
          '%c' + title + '\n\t%c' + newProblems.replace(/\n/g, '\n\t'),
          style + 'font-weight: bold;',
          style + 'font-weight: normal;'
        );
      }
    }
  
    return {
      cleanProblemsCache: function () {
        previousProblems = null;
      },
      problems: function (type, obj) {
        if (options.warn) {
          log(type, obj);
        }
        if (overlay) {
          if (options.overlayWarnings || type === 'errors') {
            overlay.showProblems(type, obj[type]);
            return false;
          }
          overlay.clear();
        }
        return true;
      },
      success: function () {
        if (overlay) overlay.clear();
      },
      useCustomOverlay: function (customOverlay) {
        overlay = customOverlay;
      },
    };
  }
  
  
  
const processMessage = (obj) => {
    // console.log('process', obj)
    switch (obj.action) {
        case 'building':
        if (options.log) {
            console.log(`[HMR] bundle ${obj.name || ""} rebuilding`);
        }
        break;
        case 'built':
        if (options.log) {
            console.log(`[HMR] bundle ${obj.name || ""} rebuilt in ${obj.time}ms`);
        }
        // fall through
        case 'sync':
        if (obj.name && options.name && obj.name !== options.name) {
            return;
        }
        let applyUpdate = true;
        if (obj.errors.length > 0) {
            if (reporter) reporter.problems('errors', obj);
            applyUpdate = false;
        } else if (obj.warnings.length > 0) {
            if (reporter) {
            let overlayShown = reporter.problems('warnings', obj);
            applyUpdate = overlayShown;
            }
        } else {
            if (reporter) {
            reporter.cleanProblemsCache();
            reporter.success();
            }
        }
        if (applyUpdate) {
            processUpdate(obj.hash, obj.modules, options);
        }
        break;
    }
    }

const connect = () => {
    socket = new WebSocket('ws://localhost:8888');
    socket.addEventListener('open', e => { if (options.log) console.log('[HMR] connected'); })
    socket.addEventListener('message', e => {
        processMessage(JSON.parse(e.data));
    });
    socket.addEventListener('close', e => { 
        if (options.log) console.log('[HMR] closed');
        setTimeout(connect, 1000)
    });
}
  
module.exports = {
    connect(){
        if(window.__react_hot){ return; }
        window.__react_hot = 1;
        connect();
    },
    disconnect(){
        if(window.__react_hot){ return; }
        window.__react_hot = 1;
        socket.close();
    }
};