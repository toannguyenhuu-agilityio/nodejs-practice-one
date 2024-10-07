export const userRoute = ({
  app,
  createUser,
  getUserById,
  deleteUserById,
  authenticate,
}) => {
  app
    .route('/user')
    .post(createUser)
    .get(authenticate, getUserById)
    .delete(authenticate, deleteUserById);
};
