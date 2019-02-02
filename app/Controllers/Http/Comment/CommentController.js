'use strict'

const Comment = use('App/Models/Comment')
const Ticket = use('App/Models/Ticket')
const Event = use('Event')
const FileuploadServices = use('App/Services/fileuploadServices')

class CommentController {
  async store({ params, request, auth, response }) {
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

    const ticket = await Ticket.query()
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

      Event.fire('new::comment', { ticket, comment, email })
    }

    return response.route('ticketsShow', { id: params.id})
  }
}

module.exports = CommentController
