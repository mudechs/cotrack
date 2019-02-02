const Mail = use('Mail')
const Event = use('Event')

Event.on('new::login', async ({ fullName, token, email }) => {
  await Mail.send('emails.confirm_2fa_login', { fullName, token }, message => {
    message
      .to(email)
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .subject('Dein 2FA-Code zum Anmelden')
  })
})

Event.on('new::ticket', async ({ ticket, recipient }) => {
  await Mail.send('emails.new_ticket_notification', ticket.toJSON(), message => {
    message
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .to(recipient.email)
      .subject(`Dir wurde ein neues Ticket [#${ticket.id}] zugewiesen.`)
  })
})

Event.on('new::ticketStatusChange', async ({ ticket, author }) => {
  await Mail.send('emails.ticket_change_status_notification', ticket.toJSON(), message => {
    message
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .to(author.email)
      .subject(`Das Ticket [#${ticket.id}] wurde auf "${ticket.status}" gesetzt.`)
  })
})

Event.on('new::ticketAssigned', async ({ ticket, author, recipient }) => {
  await Mail.send('emails.assigned_ticket_notification', ticket.toJSON(), message => {
    message
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .to(author.email)
      .subject(`Das Ticket [#${ticket.id}] wurde von ${recipient.first_name} ${recipient.last_name} übernommen.`)
  })
})

Event.on('new::user', async ({ user, password }) => {
  await Mail.send('emails.user_credentials', { user, password }, message => {
    message
      .to(user.email)
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .subject('Willkommen bei CoTrack!')
  })
})

Event.on('new::comment', async ({ ticket, comment, email }) => {
  await Mail.send('emails.new_comment_notification', { ticket, comment }, message => {
    message
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .to(email)
      .subject(`Es wurde ein neuer Kommentar [#${comment.id}] im Ticket [#${ticket.id}] erfasst.`)
  })
})