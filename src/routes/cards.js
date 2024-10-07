export const cardRoute = ({
  app,
  createCard,
  getCardByID,
  editCardByID,
  deleteCardByID,
  getCards,
  validateCard,
  authenticate,
}) => {
  app
    .route('/cards')
    .all(authenticate)
    .post(validateCard, createCard)
    .get(getCards);

  app
    .route('/cards/:id')
    .all(authenticate)
    .get(getCardByID)
    .put(editCardByID)
    .delete(deleteCardByID);
};
