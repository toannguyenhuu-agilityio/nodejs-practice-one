export const MESSAGES = {
  INVALID_USER_ID: 'Invalid user ID',
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_LIMIT:
    "The 'limit' parameter must be a positive integer and cannot exceed 100.",
  INVALID_PARAMETER: 'Invalid parameter',
  USER_NOT_FOUND: 'User not found',
  CREATE_USER_FAILED: 'User creation failed',
  CARD_MISSING_ATTRIBUTES: 'Card is missing attributes',
  CARD_MONSTER_MISSING_ATTRIBUTES: 'Card monster is missing attributes',
  CARD_NOT_FOUND: 'Card not found',
  CARD_ID_IS_REQUIRED: 'Card ID is required',
  DELETE_USER_SUCCESS: 'User deleted successfully',
  UPDATE_CARD_SUCCESS: 'Card updated successfully',
  DELETE_CARD_SUCCESS: 'Card deleted successfully',
  INTERNAL_SERVER_ERROR: 'Internal server error',
};

export const CARD_VALIDATION_MESSAGES = {
  NAME: 'Name is required and must be a non-empty string.',
  NUMBER:
    'Number is required to Monster type and must be a string matching format ex: A24D-A12B.',
  TYPE: 'Type is required and must be include in [Monster, Trap, Spell].',
  IMAGE: 'Image is required and must be a non-empty string.',
  ATTRIBUTE:
    'Attribute is required and include in [Dark, Light, Earth, Water, Fire, Wind, Divine].',
  SUB_TYPES:
    'SubTypes is required to Monster type and must be a non-empty string.',
  DESCRIPTION: 'Description is required and must be a non-empty string.',
  LEVEL:
    'Level is required to Monster type and must be a number in range [1, 6].',
  ATTACK: 'Attack is required to Monster type and must be a number.',
  DEFENSE: 'Defense is required to Monster type and must be a number.',
};
