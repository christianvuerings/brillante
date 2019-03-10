echo $PATH
which react-scripts
npm run clean
npm run build
npm run chrome:package
webstore upload --file chrome.zip --auto-publish
