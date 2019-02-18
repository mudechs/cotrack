'use strict';

const Comment = use('App/Models/Comment');
const Ticket = use('App/Models/Ticket');
const Event = use('Event');
const FileuploadServices = use('App/Services/fileuploadServices');

class CommentController {
  async store({
    params,
    request,
    auth,
    response
  }) {
    const comment = await Comment.create({
      body: request.input('body'),
      author_id: auth.user.id,
      ticket_id: params.id
    });

    const files = request.file('attachments', {
      size: '5mb'
    });

    comment.attachments = await FileuploadServices.storeMultiple(
      files,
      'comments',
      comment
    );

    await comment.save();

    const ticket = await Ticket.query()
      .where('id', comment.ticket_id)
      .select('id', 'author_id', 'recipient_id')
      .first();

    const author = await ticket.ticketAuthor().select('email', 'locale').first();
    const recipient = await ticket.ticketRecipient().select('email', 'locale').first();

    const commentRaw = await Comment.findBy('id', comment.id);
    const commentAuthorId = comment.author_id;
    const ticketAuthorId = author.author_id;
    const ticketAuthorLocale = author.locale;
    const authorEmail = author.email;
    const ticketRecipientId = recipient.recipient_id;
    const ticketRecipientLocale = recipient.locale;
    const recipientEmail = recipient.email;

    if (commentAuthorId != ticketAuthorId && commentAuthorId != ticketRecipientId) {
      if (ticketAuthorId == ticketRecipientId) {
        Event.fire('new::comment', ticket, commentRaw, authorEmail, ticketAuthorLocale);
      } else {
        Event.fire('new::comment', ticket, commentRaw, authorEmail, ticketAuthorLocale);
        Event.fire('new::comment', ticket, commentRaw, recipientEmail, ticketRecipientLocale);
      }
    } else if (commentAuthorId == ticketAuthorId) {
      Event.fire('new::comment', ticket, commentRaw, recipientEmail, ticketRecipientLocale);
    } else if (commentAuthorId == ticketRecipientId) {
      Event.fire('new::comment', ticket, commentRaw, authorEmail, ticketAuthorLocale);
    }

    return response.route('ticketsShow', {
      id: params.id
    });
  }

  async update({
    params,
    request,
    session,
    response
  }) {
    const comment = await Comment.find(params.id);
    const ticketId = request.input('ticket_id');

    comment.body = request.input('body');

    await comment.save();

    session.flash({
      notification: {
        type: 'success',
        message: 'Die Änderungen wurden erfolgreich übernommen.'
      }
    });

    return response.route('ticketsShow', {
      id: ticketId
    });
  }

  async apiGetComment({
    params,
    response
  }) {
    const comment = await Comment.query()
      .where('id', params.id)
      .first();

    return response.send(comment);
  }
}

module.exports = CommentController;
