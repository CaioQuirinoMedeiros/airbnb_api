"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Property = use("App/Models/Property");

/**
 * Resourceful controller for interacting with properties
 */
class PropertyController {
  async index({ request }) {
    const { latitude, longitude, max_price, min_price } = request.all();

    const query = Property.query();

    if (max_price) query.where("price", "<=", max_price);
    if (min_price) query.where("price", ">=", min_price);

    const properties = query
      .with("images")
      .nearBy(latitude, longitude, 10)
      .fetch();

    return properties;
  }

  async store({ request, auth }) {
    const { id } = auth.user;

    const data = request.only([
      "title",
      "address",
      "description",
      "price",
      "latitude",
      "longitude"
    ]);

    const property = Property.create({ ...data, user_id: id });

    return property;
  }

  async show({ params }) {
    const property = await Property.findOrFail(params.id);

    await property.load("images");

    return property;
  }

  async update({ params, request, response, auth }) {
    const data = request.only([
      "title",
      "address",
      "description",
      "price",
      "latitude",
      "longitude"
    ]);

    const property = await Property.findOrFail(params.id);

    if (auth.user.id !== property.user_id) {
      return response.status(401).send({ error: "Not authorized" });
    }

    property.merge(data);

    await property.save();

    return property;
  }

  async destroy({ params, auth, response }) {
    const property = await Property.findOrFail(params.id);

    if (property.user_id !== auth.user.id) {
      return response.status(401).send({ error: "Not authorized" });
    }

    await property.delete();
  }
}

module.exports = PropertyController;
