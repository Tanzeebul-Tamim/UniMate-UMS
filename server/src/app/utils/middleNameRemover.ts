import httpStatus from 'http-status';
import { TName } from '../interface/common';
import { Student } from '../modules/student/student.model';
import AppError from '../errors/AppError';
import { Admin } from '../modules/admin/admin.model';
import { Faculty } from '../modules/faculty/faculty.model';

export const removeMiddleName = async (
  payloadName: TName,
  id: string,
  user: 'A' | 'F' | 'S',
) => {
  const payloadFirstName = payloadName.firstName;
  const payloadLastName = payloadName.lastName;

  let getName;

  switch (user) {
    case 'A':
      getName = await Admin.findOne({ id }).select('name');
      break;
    case 'F':
      getName = await Faculty.findOne({ id }).select('name');
      break;
    case 'S':
      getName = await Student.findOne({ id }).select('name');
      break;
  }

  if (getName) {
    const {
      firstName: existingFirstName,
      middleName: existingMiddleName,
      lastName: existingLastName,
    } = getName.name;

    if (existingMiddleName) {
      if (!payloadFirstName && !payloadLastName) {
        return {
          firstName: existingFirstName,
          lastName: existingLastName,
        };
      } else if (payloadFirstName && !payloadLastName) {
        return {
          firstName: payloadFirstName,
          lastName: existingLastName,
        };
      } else if (!payloadFirstName && payloadLastName) {
        return {
          firstName: existingFirstName,
          lastName: payloadLastName,
        };
      } else if (payloadFirstName && payloadLastName) {
        return {
          firstName: payloadFirstName,
          lastName: payloadLastName,
        };
      }
    } else {
      throw new AppError(
        httpStatus.CONFLICT,
        'Middle name already does not exist!',
      );
    }
  } else {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'An unexpected error occurred!',
    );
  }
};

export const removeGuardianMiddleName = async (
  id: string,
  guardian: 'father' | 'mother',
) => {
  const getGuardian = await Student.findOne({ id }).select('guardian');

  if (getGuardian) {
    const { firstName, middleName, lastName } =
      getGuardian.guardian[guardian].name;

    const removedMiddleName = { firstName, lastName };

    if (middleName) {
      await Student.findOneAndUpdate(
        { id },
        { [`guardian.${guardian}.name`]: removedMiddleName },
        { runValidators: true },
      );
    } else {
      throw new AppError(
        httpStatus.CONFLICT,
        `${guardian.charAt(0).toUpperCase() + guardian.slice(1)}'s middle name already does not exist!`,
      );
    }
  } else {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'An unexpected error occurred!',
    );
  }
};

export const removeLocalGuardianMiddleName = async (id: string) => {
  const getLocalGuardian = await Student.findOne({ id }).select(
    'localGuardian',
  );

  if (getLocalGuardian) {
    const { firstName, middleName, lastName } =
      getLocalGuardian.localGuardian.name;

    const removedMiddleName = { firstName, lastName };

    if (middleName) {
      await Student.findOneAndUpdate(
        { id },
        { ['localGuardian.name']: removedMiddleName },
        { runValidators: true },
      );
    } else {
      throw new AppError(
        httpStatus.CONFLICT,
        "Local guardian's middle name already does not exist!",
      );
    }
  } else {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'An unexpected error occurred!',
    );
  }
};
