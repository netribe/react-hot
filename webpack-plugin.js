
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8888 });

const broadcast = (obj) => {
    let data = JSON.stringify(obj)
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

class ReactHotWebpackPlugin{
    constructor(opts){
        this.opts = opts;
    }
    apply(compiler){
        let opts = this.opts || { log: console.log };
        if (compiler.hooks) {
            compiler.hooks.invalid.tap('webpack-hot-middleware', onInvalid);
            compiler.hooks.done.tap('webpack-hot-middleware', onDone);
        } else {
            compiler.plugin('invalid', onInvalid);
            compiler.plugin('done', onDone);
        }
        function onInvalid() {
            if (opts.log) opts.log('webpack building...');
                broadcast({ action: 'building' });
            }
        function onDone(statsResult) {
            var stats = statsResult.toJson({
                all: false,
                cached: true,
                children: true,
                modules: true,
                timings: true,
                hash: true,
            });
              // For multi-compiler, stats will be an object with a 'children' array of stats
            var bundles = extractBundles(stats);
            bundles.forEach(function (stats) {
                var name = stats.name || '';
            
                // Fallback to compilation name in case of 1 bundle (if it exists)
                if (bundles.length === 1 && !name && statsResult.compilation) {
                  name = statsResult.compilation.name || '';
                }
            
                if (opts.log) {
                    opts.log(`webpack built ${name || ''} ${ stats.hash} in ${stats.time}ms`);
                }
                broadcast({
                  name: name,
                  action: 'built',
                  time: stats.time,
                  hash: stats.hash,
                  warnings: stats.warnings || [],
                  errors: stats.errors || [],
                  modules: buildModuleMap(stats.modules),
                });
            });
        }
    }
}

function extractBundles(stats) {
  // Stats has modules, single bundle
  if (stats.modules) return [stats];

  // Stats has children, multiple bundles
  if (stats.children && stats.children.length) return stats.children;

  // Not sure, assume single
  return [stats];
}

function buildModuleMap(modules) {
  var map = {};
  modules.forEach(function (module) {
    map[module.id] = module.name;
  });
  return map;
}

module.exports = ReactHotWebpackPlugin;