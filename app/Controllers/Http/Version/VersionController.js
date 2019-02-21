'use strict';

const Version = use('App/Models/Version');

class VersionController {
  async show({ params, response }) {
    const versions = await Version.query()
      .where('project_id', params.id)
      .fetch();

    return response.status(200).send(versions.toJSON());
  }

  async create({ params, request, response }) {
    const version = await Version.create({
      title: request.body.data.version,
      project_id: params.id
    });

    await version.save();

    return response.status(200).send(version);
  }

  async delete({ params, response }) {
    const version = await Version.find(params.id);

    await version.delete();

    return response.status(200).send('Deleted');
  }
}

module.exports = VersionController;
