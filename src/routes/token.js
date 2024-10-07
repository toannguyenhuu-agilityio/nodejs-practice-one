export const tokenRoute = (app, createToken) => {
  app.route('/token').post(createToken);
};
