'use strict';

const Helpers = use('Helpers');
const RandomString = require('random-string');

class fileuploadServices {
  async storeMultiple(files, path, data) {
    if (files) {
      await files.moveAll(Helpers.publicPath(`uploads/${path}/${data.id}`), (file) => {
        const string = RandomString({
          length: 8
        });
        return {
          name: `${string}_${new Date().getTime()}.${file.subtype}`
        };
      });

      if (!files.movedAll()) {
        return files.errors();
      }

      return JSON.stringify(files._files);
    }

    return null;
  }

  async updateMultiple(modifiedFiles, storedFiles, newFiles, path, data) {
    if (modifiedFiles) {
      while (modifiedFiles.length) {
        storedFiles.splice(modifiedFiles.pop(), 1);
      }
    }

    if (newFiles) {
      await newFiles.moveAll(Helpers.publicPath(`uploads/${path}/${data.id}`), (file) => {
        return {
          name: `${new Date().getTime()}.${file.subtype}`
        };
      });

      if (!newFiles.movedAll()) {
        return newFiles.errors();
      }
    }

    if (modifiedFiles && newFiles) {
      return JSON.stringify(newFiles._files.concat(storedFiles));
    } else if (modifiedFiles && newFiles == null) {
      return JSON.stringify(storedFiles);
    } else if (modifiedFiles == null && newFiles) {
      return JSON.stringify(newFiles._files.concat(storedFiles));
    }
  }

  async storeSingle(file, path, data) {
    await file.move(Helpers.publicPath(`uploads/${path}/${data.id}`), {
      name: `${new Date().getTime()}.${file.subtype}`
    });

    if (!file.moved()) {
      return file.error();
    }

    return file.fileName;
  }

}

module.exports = new fileuploadServices();
