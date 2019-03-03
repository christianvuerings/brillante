/* global chrome */
const filesInDirectory = dir =>
  new Promise(resolve =>
    dir.createReader().readEntries(entries =>
      Promise.all(
        entries
          .filter(e => e.name[0] !== ".")
          .map(e =>
            e.isDirectory
              ? filesInDirectory(e)
              : new Promise(resolve => e.file(resolve))
          )
      )
        .then(files => [].concat(...files))
        .then(resolve)
    )
  );

const lastModifiedTimeStamp = dir =>
  filesInDirectory(dir).then(
    files => files.map(f => f.lastModified).sort((a, b) => b - a)[0]
  );

// const reload = () => {
//   chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//     // NB: see https://github.com/xpl/crx-hotreload/issues/5s
//     console.log("reload 4");
//     // if (tabs[0]) {
//     //   chrome.tabs.reload(tabs[0].id);
//     // }
//     chrome.runtime.reload();
//   });
// };

const watchFileChanges = (dir, file) =>
  new Promise(resolve =>
    dir.createReader().readEntries(entries =>
      Promise.all(entries.filter(e => e.name === file))
        .then(files => {
          console.log("watchFileChanges", files);
          return [].concat(...files);
        })
        .then(resolve)
    )
  );
const untilFileExists = (dir, file) =>
  new Promise(resolve =>
    watchFileChanges(dir, "index.html").then(files => {
      if (files && files.length) {
        console.log("files", files);
        chrome.runtime.reload();
        resolve("index.html changed");
      } else {
        setTimeout(() => untilFileExists(dir, file), 100);
      }
    })
  );

const watchChanges = ({ dir, lastTimestamp }) => {
  console.log(dir);
  lastModifiedTimeStamp(dir).then(timestamp => {
    if (!lastTimestamp || lastTimestamp === timestamp) {
      setTimeout(() => watchChanges({ dir, lastTimestamp: timestamp }), 500);
    } else {
      untilFileExists(dir, "index.html");
    }
  });
};

chrome.management.getSelf(self => {
  if (self.installType === "development") {
    chrome.runtime.getPackageDirectoryEntry(dir =>
      watchChanges({
        dir
      })
    );
  }
});

chrome.runtime.onInstalled.addListener(function(details) {
  console.log(details);

  if (details.reason === "install") {
    console.log("This is a first install!");
  } else if (details.reason === "update") {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      // NB: see https://github.com/xpl/crx-hotreload/issues/5
      if (tabs[0] && tabs[0].url.includes("chrome://newtab")) {
        chrome.tabs.update(tabs[0].id, { url: "chrome://newtab" });
      }
    });
  }
});
