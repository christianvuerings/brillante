echo $PATH
PATH=./node_modules/.bin:$PATH
echo $PATH
pwd
ls -la
npm run clean
npm run build
npm run chrome:package
webstore upload --file chrome.zip --auto-publish
