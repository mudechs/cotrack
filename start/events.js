const Mail = use('Mail')
const Event = use('Event')
const Antl = use('Antl')

Event.on('new::login', async ({ fullName, token, email }) => {
  await Mail.send('emails.confirm_2fa_login', { fullName, token }, message => {
    message
      .to(email)
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .subject('Dein 2FA-Code zum Anmelden')
  })
})

Event.on('new::passwordReset', async ({ fullName, email, token }) => {
  await Mail.send('emails.password_reset', { fullName, token }, message => {
    message
      .to(email)
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .subject('Link zum zurücksetzen deines Passworts')
  })
})

Event.on('new::ticket', async ({ ticket, recipient }) => {
  const messages = {
    subject: Antl.forLocale(recipient.locale).formatMessage('emails.message7', { ticketid: ticket.id }),
    body: Antl.forLocale(recipient.locale).formatMessage('emails.message8'),
    link: Antl.forLocale(recipient.locale).formatMessage('emails.message6'),
    hint: Antl.forLocale(recipient.locale).formatMessage('emails.hint')
  }

  await Mail.send('emails.new_ticket_notification', { messages, ticket }, message => {
    message
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .to(recipient.email)
      .subject(messages.subject)
  })
})

Event.on('new::ticketStatusChange', async ({ ticket, author }) => {
  const messages = {
    subject: Antl.forLocale(author.locale).formatMessage('emails.message4', { ticketid: ticket.id, status: ticket.status }),
    body: Antl.forLocale(author.locale).formatMessage('emails.message5', { ticketid: ticket.id, status: ticket.status }),
    link: Antl.forLocale(author.locale).formatMessage('emails.message6'),
    hint: Antl.forLocale(author.locale).formatMessage('emails.hint')
  }

  await Mail.send('emails.ticket_change_status_notification', { messages, ticket }, message => {
    message
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .to(author.email)
      .subject(messages.subject)
  })
})

Event.on('new::ticketAssigned', async ({ ticket, author, recipient }) => {
  const messages = {
    subject: Antl.forLocale(author.locale).formatMessage('emails.message1', { ticketid: ticket.id, recipientFirstName: recipient.first_name, recipientLastName: recipient.last_name }),
    body: Antl.forLocale(author.locale).formatMessage('emails.message2'),
    link: Antl.forLocale(author.locale).formatMessage('emails.message3'),
    hint: Antl.forLocale(author.locale).formatMessage('emails.hint')
  }

  await Mail.send('emails.assigned_ticket_notification', { messages, ticket }, message => {
    message
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .to(author.email)
      .subject(messages.subject)
  })
})

Event.on('new::user', async ({ user, password }) => {
  const messages = {
    subject: Antl.forLocale(user.locale).formatMessage('emails.message9', { firstname: user.first_name }),
    body: Antl.forLocale(user.locale).formatMessage('emails.message10'),
    username: Antl.forLocale(user.locale).formatMessage('static.benutzer'),
    password: Antl.forLocale(user.locale).formatMessage('static.passwort'),
    link: Antl.forLocale(user.locale).formatMessage('emails.message11'),
    hint: Antl.forLocale(user.locale).formatMessage('emails.hint')
  }

  await Mail.send('emails.user_credentials', { user, password, messages }, message => {
    message
      .to(user.email)
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .subject(messages.subject)
  })
})

Event.on('new::comment', async ({ ticket, comment, email, locale }) => {
  const messages = {
    subject: Antl.forLocale(locale).formatMessage('emails.message12', { ticketid: ticket.id }),
    body: Antl.forLocale(locale).formatMessage('emails.message13'),
    link: Antl.forLocale(locale).formatMessage('emails.message14'),
    hint: Antl.forLocale(locale).formatMessage('emails.hint')
  }

  await Mail.send('emails.new_comment_notification', { ticket, comment, messages }, message => {
    message
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .to(email)
      .subject(messages.subject)
  })
})