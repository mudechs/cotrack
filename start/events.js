const Mail = use('Mail')
const Event = use('Event')
const Ticket = use('App/Models/Ticket')
const User = use('App/Models/User')

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