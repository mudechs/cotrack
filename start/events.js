const Mail = use('Mail')
const Event = use('Event')
const Antl = use('Antl')

Event.on('new::login', async ({ token, email, locale }) => {
  const messages = {
    subject: Antl.forLocale(locale).formatMessage('emails.message15'),
    body: Antl.forLocale(locale).formatMessage('emails.message16'),
    hint: Antl.forLocale(locale).formatMessage('emails.hint')
  }

  await Mail.send('emails.confirm_2fa_login', { token, messages }, message => {
    message
      .to(email)
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .subject(messages.subject)
  })
})

Event.on('new::passwordReset', async ({ email, token, locale }) => {
  const messages = {
    subject: Antl.forLocale(locale).formatMessage('emails.message17'),
    body: Antl.forLocale(locale).formatMessage('emails.message18'),
    link: Antl.forLocale(locale).formatMessage('emails.message19'),
    hint: Antl.forLocale(locale).formatMessage('emails.hint')
  }

  await Mail.send('emails.password_reset', { token, messages }, message => {
    message
      .to(email)
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .subject('Link zum zurücksetzen deines Passworts')
  })
})

Event.on('new::ticket', async ({ ticket, project, user, author }) => {
  const messages = {
    subject: Antl.forLocale(user.locale).formatMessage('emails.message7', { ticketid: ticket.id }),
    body: Antl.forLocale(user.locale).formatMessage('emails.message8'),
    link: Antl.forLocale(user.locale).formatMessage('emails.message6'),
    hint: Antl.forLocale(user.locale).formatMessage('emails.hint'),
    titleLabel: Antl.forLocale(user.locale).formatMessage('static.betreff'),
    projectLabel: Antl.forLocale(user.locale).formatMessage('static.projekt'),
    fromLabel: Antl.forLocale(user.locale).formatMessage('emails.message24')
  }

  await Mail.send('emails.new_ticket_notification', { messages, ticket, project, author }, message => {
    message
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .to(user.email)
      .subject(messages.subject)
  })
})

Event.on('new::ticketUnassigned', async ({ ticket, project, user, author }) => {
  const messages = {
    subject: Antl.forLocale(user.locale).formatMessage('emails.message23', { ticketid: ticket.id }),
    body: Antl.forLocale(user.locale).formatMessage('emails.message8'),
    link: Antl.forLocale(user.locale).formatMessage('emails.message6'),
    hint: Antl.forLocale(user.locale).formatMessage('emails.hint'),
    titleLabel: Antl.forLocale(user.locale).formatMessage('static.betreff'),
    projectLabel: Antl.forLocale(user.locale).formatMessage('static.projekt'),
    fromLabel: Antl.forLocale(user.locale).formatMessage('emails.message24')
  }

  await Mail.send('emails.new_ticket_notification', { messages, ticket, project, author }, message => {
    message
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .to(user.email)
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

Event.on('new::userRegistration', async ({ user }) => {
  const messages = {
    subject: Antl.forLocale('en').formatMessage('emails.message22'),
    body: Antl.forLocale('en').formatMessage('emails.message20'),
    link: Antl.forLocale('en').formatMessage('emails.message21'),
    hint: Antl.forLocale('en').formatMessage('emails.hint')
  }

  await Mail.send('emails.confirm_registration', { user, messages }, message => {
    message
      .to(user.email)
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .subject(messages.subject)
  })
})

Event.on('new::comment', async (ticket, commentRaw, email, locale) => {
  const messages = {
    subject: Antl.forLocale(locale).formatMessage('emails.message12', { ticketid: ticket.id }),
    body: Antl.forLocale(locale).formatMessage('emails.message13'),
    link: Antl.forLocale(locale).formatMessage('emails.message14'),
    hint: Antl.forLocale(locale).formatMessage('emails.hint')
  }

  const comment = commentRaw.toJSON()

  await Mail.send('emails.new_comment_notification', { ticket, comment, messages} , message => {
    message
      .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
      .to(email)
      .subject(messages.subject)
  })
})
