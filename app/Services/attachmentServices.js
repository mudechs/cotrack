'use strict'

const Helpers = use('Helpers')

class attachmentServices {
  async updateHandler(modifiedAttachments, storedAttachments, attachments, path, data) {
    if (modifiedAttachments) {
      while(modifiedAttachments.length) {
        storedAttachments.splice(modifiedAttachments.pop(), 1);
      }
    }

    if(attachments) {
      await attachments.moveAll(Helpers.publicPath(`uploads/${path}/${data.id}`), (file) => {
        return {
          name: `${new Date().getTime()}.${file.subtype}`
        }
      })

      if (!attachments.movedAll()) {
        return attachments.errors()
      }
    }

    if(modifiedAttachments && attachments) {
      return data.attachments = JSON.stringify(attachments._files.concat(storedAttachments))
    }
    else if(modifiedAttachments && attachments == null) {
      return data.attachments = JSON.stringify(storedAttachments)
    }
    else if(modifiedAttachments == null && attachments) {
      return data.attachments = JSON.stringify(attachments._files.concat(storedAttachments))
    }
  }
}

module.exports = new attachmentServices()
