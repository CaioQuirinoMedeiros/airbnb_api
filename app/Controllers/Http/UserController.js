"use strict";

const User = use("App/Models/User");
const Property = use("App/Models/Property");

class UserController {
  async create({ request, response }) {
    const data = request.only(["username", "email", "password"]);

    const user = await User.create(data);

    return user;
  }

  async indexProperties({ auth }) {
    const id = auth.user.id;

    const properties = await Property.query()
      .where("user_id", id)
      .with("images")
      .fetch();

    return properties;
  }
}

module.exports = UserController;
