const writeFile = require('./write-file');

module.exports = function (opts) {
    const file = `
        const routers = {
            '/index': {
                component (resolve) {
                    require(['./views/index.vue'], resolve);
                }
            }
        };
        export default routers;
    `;
    writeFile({
        directory: `${opts.directory}/src`,
        fileName: 'router.js',
        data: file,
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};