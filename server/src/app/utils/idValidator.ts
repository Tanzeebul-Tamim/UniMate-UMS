import httpStatus from 'http-status';
import AppError from '../errors/AppError';

export const validateId = (
  id: string,
  allowedUserType: 'A' | 'F' | 'S',
  receivedUserType: string,
): void => {
  //* Regular expression to match the format
  let regex: RegExp;

  switch (allowedUserType) {
    case 'A':
      regex = /^[A]-\d{10}$/;
      if (receivedUserType !== 'A') {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Invalid ID format! ID must start with A.',
        );
      }
      break;
    case 'F':
      regex = /^[F]-\d{10}$/;
      if (receivedUserType !== 'F') {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Invalid ID format! ID must start with F.',
        );
      }
      break;
    case 'S':
      regex = /^[S]-\d{10}$/;
      if (receivedUserType !== 'S') {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Invalid ID format! ID must start with S.',
        );
      }
      break;
  }

  if (!regex.test(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid ID format!');
  }

  const year = parseInt(id.substring(2, 6), 10);
  const monthOrCode = parseInt(id.substring(6, 8), 10);

  //* Check if code is valid for students
  if (allowedUserType === 'S' && ![1, 2, 3].includes(monthOrCode)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid ID format: For students, the semester code represented by the 5th and 6th digits and can only be "01", "02", or "03".',
    );
  }

  //* Check if year and month are valid
  if (
    isNaN(year) ||
    isNaN(monthOrCode) ||
    year < 2000 ||
    year > 2100 ||
    monthOrCode < 1 ||
    monthOrCode > 12
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid ID format: Valid year must be represented by the first 4 digits and valid month must be represented by the next 2 digits.',
    );
  }
};
