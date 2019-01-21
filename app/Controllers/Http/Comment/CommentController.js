'use strict'

const { validateAll } = use('Validator')
const Comment = use('App/Models/Comment')

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

    return response.route('ticketsShow', { id: params.id})
  }
}

module.exports = CommentController
