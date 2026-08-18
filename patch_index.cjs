const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const newScript = `
    <script>
      function isExtErr(e) {
        if (!e) return false;
        var str = '';
        if (typeof e === 'string') {
          str = e.toLowerCase();
        } else if (e && e.message) {
          str = String(e.message).toLowerCase();
          if (e.stack) str += ' ' + String(e.stack).toLowerCase();
        } else {
          try { str = JSON.stringify(e).toLowerCase(); } catch(err) { str = String(e).toLowerCase(); }
        }
        return str.indexOf('ethereum') !== -1 || str.indexOf('metamask') !== -1;
      }
      
      window.addEventListener('error', function(event) {
        if (isExtErr(event.message) || isExtErr(event.error)) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
        }
      }, true);
      
      window.addEventListener('unhandledrejection', function(event) {
        if (isExtErr(event.reason)) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
        }
      }, true);
      
      const origError = console.error;
      console.error = function() {
        var args = Array.prototype.slice.call(arguments);
        if (!args.some(isExtErr)) {
          origError.apply(console, args);
        }
      };
      const origWarn = console.warn;
      console.warn = function() {
        var args = Array.prototype.slice.call(arguments);
        if (!args.some(isExtErr)) {
          origWarn.apply(console, args);
        }
      };
    </script>
`;

html = html.replace(/<script>[\s\S]*?<\/script>/, newScript);
fs.writeFileSync('index.html', html);
