const writeFile = require('./write-file');

module.exports = function (opts) {
    const title = opts.data.name || 'iView project';

    const file = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>${title}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;">
    <link rel="stylesheet" href="<%= htmlWebpackPlugin.files.css[0] %>">
</head>
<body>
    <div id="app"></div>
    <script type="text/javascript" src="<%= htmlWebpackPlugin.files.js[0] %>"></script>
    <script type="text/javascript" src="<%= htmlWebpackPlugin.files.js[1] %>"></script>
</body>
</html>
    `;
    writeFile({
        directory: `${opts.directory}/src/template`,
        fileName: 'index.ejs',
        data: file,
        codeType: 'html',
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};