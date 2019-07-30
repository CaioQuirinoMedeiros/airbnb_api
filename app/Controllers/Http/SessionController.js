"use strict";

const User = use("App/Models/User");

class SessionController {
  async create({ request, response, auth }) {
    const { email, password } = request.all();

    const token = await auth.attempt(email, password);
    const { id, username } = await User.findByOrFail("email", email);

    return response.status(200).send({ ...token, id, username });
  }
}

module.exports = SessionController;
