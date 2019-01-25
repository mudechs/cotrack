'use strict'

const { validateAll } = use('Validator')
const Comment = use('App/Models/Comment')
const Ticket = use('App/Models/Ticket')
const Mail = use('Mail')

class CommentController {
  async store({ params, request, auth, session, response }) {
    const validation = await validateAll(request.all(), {
      body: 'required'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
    }

    const comment = new Comment()

    comment.body = request.input('body')
    comment.author_id = auth.user.id
    comment.ticket_id = params.id

    await comment.save()

    try {
      const ticket = await Ticket.query()
        .where('id', comment.ticket_id)
        .first()

      const authorEmail = await ticket.ticketAuthor().select('email').first()
      const recipientEmail = await ticket.ticketRecipient().select('email').first()
      let email

      switch (comment.author_id) {
        case ticket.author_id:
          email = recipientEmail.email
          break;
        case ticket.recipient_id:
          email = authorEmail.email
        default:
          break;
      }

      await Mail.send('emails.new_comment_notification', ticket.toJSON(), message => {
        message
          .from('noreply@codiac.ch')
          .to(email)
          .subject(`Es wurde ein neuer Kommentar [#${comment.id}] im Ticket [#${ticket.id}] erfasst.`)
      })
    } catch (error) {
      console.log(error)
    }

    return response.route('ticketsShow', { id: params.id})
  }
}

module.exports = CommentController
