echo $PATH
$PATH=/travis/home/node_modules/.bin:$PATH
echo $PATH
ls /travis/home/node_modules/.bin
npm run clean
npm run build
npm run chrome:package
webstore upload --file chrome.zip --auto-publish
