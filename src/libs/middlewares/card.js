// Constants
import { HTTP_STATUS_CODES } from '../../constants/httpStatusCodes.js';
import { CARD_VALIDATION_MESSAGES } from '../../constants/messages.js';
import {
  CARD_TYPES,
  CARD_NUMBER_REGEX,
  VALID_CARD_TYPES,
  VALID_CARD_SUB_TYPES,
  VALID_CARD_ATTRIBUTES,
} from '../../constants/cards.js';

export const validateCard = async (req, res, next) => {
  const {
    number,
    name,
    type,
    image,
    attribute,
    subTypes,
    description,
    level,
    attack,
    defense,
  } = req.body;

  // Validate name field is not empty or not a string or is a blank string
  const isNameInValid = !name || typeof name !== 'string' || name.trim() === '';

  if (isNameInValid) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .json({ message: CARD_VALIDATION_MESSAGES.NAME });
  }

  // Validate type field is not empty or not a string
  const isTypeInValid =
    !type || typeof type !== 'string' || !VALID_CARD_TYPES.includes(type);

  if (isTypeInValid) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .json({ message: CARD_VALIDATION_MESSAGES.TYPE });
  }

  // Validate image field is not empty or not a string
  const isImageInValid =
    !image || typeof image !== 'string' || image.trim() === '';

  if (isImageInValid) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .json({ message: CARD_VALIDATION_MESSAGES.IMAGE });
  }

  // Validate attribute field is not empty or not a string and includes valid attributes (Dark, Light, Earth, Water, Fire, Wind, Divine)
  const isAttributeInValid =
    !type ||
    typeof type !== 'string' ||
    !VALID_CARD_ATTRIBUTES.includes(attribute);

  if (isAttributeInValid) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .json({ message: CARD_VALIDATION_MESSAGES.ATTRIBUTE });
  }

  // Validate description field is not empty or not a string
  const isDescriptionInValid =
    (!description && typeof description !== 'string') ||
    description.trim() === '';

  if (isDescriptionInValid) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .json({ message: CARD_VALIDATION_MESSAGES.DESCRIPTION });
  }

  // Validate card type is monster
  const isMonsterType = type === CARD_TYPES.MONSTER;

  if (isMonsterType) {
    // Validate card number is not empty or not a string or is a blank string or not in the format ABCD-AB123
    const isNumberInvalid =
      number !== undefined &&
      (typeof number !== 'string' || !CARD_NUMBER_REGEX.test(number));

    if (isNumberInvalid) {
      return res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: CARD_VALIDATION_MESSAGES.NUMBER });
    }

    // Validate level is not empty or not a number or is a blank string or not in the range of 1 to 6
    const isLevelInValid =
      !level ||
      typeof level !== 'number' ||
      isNaN(level) ||
      (level < 1 && level > 6);

    if (isLevelInValid) {
      return res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: CARD_VALIDATION_MESSAGES.LEVEL });
    }

    // Validate subTypes is not empty or not a string or is a blank string and includes valid subTypes (Normal, Ritual, Effect, XYZ, Toon, Fusion, Synchro)
    const isSubTypesInvalid =
      !subTypes ||
      typeof subTypes !== 'string' ||
      subTypes.trim() === '' ||
      !VALID_CARD_SUB_TYPES.includes(subTypes);

    if (isSubTypesInvalid) {
      return res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: CARD_VALIDATION_MESSAGES.SUB_TYPES });
    }

    // Validate attack is not empty or not a number
    const isAttackInvalid =
      !attack || typeof attack !== 'number' || isNaN(attack);

    if (isAttackInvalid) {
      return res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: CARD_VALIDATION_MESSAGES.ATTACK });
    }

    // Validate attack is not empty or not a number
    const isDefenseInvalid =
      !defense || typeof defense !== 'number' || isNaN(defense);

    if (isDefenseInvalid) {
      return res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: CARD_VALIDATION_MESSAGES.DEFENSE });
    }
  }

  next();
};
