'use strict'

const { validateAll } = use('Validator')
const Comment = use('App/Models/Comment')
const Ticket = use('App/Models/Ticket')
const Mail = use('Mail')
const FileuploadServices = use('App/Services/fileuploadServices')

class CommentController {
  async store({ params, request, auth, session, response }) {
    const validation = await validateAll(request.all(), {
      body: 'required'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
    }

    const comment = await Comment.create({
      body: request.input('body'),
      author_id: auth.user.id,
      ticket_id: params.id
    })

    const files = request.file('attachments', {
      size: '5mb'
    })

    comment.attachments = await FileuploadServices.storeMultiple(
      files,
      'comments',
      comment
    )

    await comment.save()

    try {
      let ticket = await Ticket.query()
        .where('id', comment.ticket_id)
        .select('id', 'author_id', 'recipient_id')
        .first()

      const authorEmail = await ticket.ticketAuthor().select('email').first()
      const recipientEmail = await ticket.ticketRecipient().select('email').first()
      let email

      if(ticket.author_id != ticket.recipient_id) {
        switch (comment.author_id) {
          case ticket.author_id:
            email = recipientEmail.email
            break;
          case ticket.recipient_id:
            email = authorEmail.email
          default:
            break;
        }

        const data = {
          ticket,
          comment
        }

        await Mail.send('emails.new_comment_notification', data, message => {
          message
            .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
            .to(email)
            .subject(`Es wurde ein neuer Kommentar [#${comment.id}] im Ticket [#${ticket.id}] erfasst.`)
        })
      }
    } catch (error) {
      console.log(error)
    }

    return response.route('ticketsShow', { id: params.id})
  }
}

module.exports = CommentController
