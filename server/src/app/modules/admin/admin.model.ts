import { Schema, model } from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { AdminModel, TAdmin } from './admin.interface';
import {
  BloodGroups,
  Genders,
  Nationalities,
  Religions,
  nameSchema,
} from '../../constant/common';
import { AdminDesignations } from './admin.constant';
import { ManagementDepartment } from '../managementDepartment/managementDepartment.model';

const adminSchema = new Schema<TAdmin, AdminModel>(
  {
    id: { type: String, required: [true, 'ID is required'], unique: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    designation: {
      type: String,
      enum: {
        values: AdminDesignations,
        message:
          '{VALUE} is an invalid designation. Please enter a valid designation',
      },
      required: [true, 'Designation is required'],
    },
    name: { type: nameSchema, required: [true, 'Name is required'] },
    gender: {
      type: String,
      enum: {
        values: Genders,
        message:
          "{VALUE} is an invalid gender. The gender field can only be one of the following: 'male', 'female' or 'others'",
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: {
      type: String,
      required: [true, 'Contact no is required'],
      unique: true,
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact no is required'],
      unique: true,
    },
    bloodGroup: {
      type: String,
      enum: {
        values: BloodGroups,
        message:
          "{VALUE} is an invalid blood group. The blood group field can only be one of the following: 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'",
      },
      required: [true, 'Blood group is required'],
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    profileImage: {
      type: String,
      required: [true, 'Profile image is required'],
    },
    managementDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'Management_Department',
      required: [true, ''],
    },
    joiningDate: { type: Date, required: [true, 'Joining date is required'] },
    nationality: {
      type: String,
      enum: {
        values: Nationalities,
        message:
          '{VALUE} is an invalid nationality. Please enter a valid nationality.',
      },
      required: [true, 'Nationality is required'],
    },
    religion: {
      type: String,
      enum: {
        values: Religions,
        message:
          '{VALUE} is an invalid religion. Please enter a valid religion.',
      },
      required: [true, 'Religion is required'],
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

//* virtual
adminSchema.virtual('fullName').get(function () {
  const name = this.name;
  if (name && name?.middleName) {
    return name.firstName + ' ' + name?.middleName + ' ' + name.lastName;
  } else if (name && !name?.middleName) {
    return name.firstName + ' ' + name.lastName;
  }
});

//* Query middleware
adminSchema.pre('save', async function (next) {
  try {
    const isDepartmentValid = await ManagementDepartment.findById(
      this.managementDepartment,
    );

    if (!isDepartmentValid) {
      throw new AppError(httpStatus.CONFLICT, 'Invalid management department');
    }

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(
        new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'An unexpected error occurred!',
        ),
      );
    }
  }
});

adminSchema.pre('find', function (next) {
  try {
    this.find({ isDeleted: { $eq: false } });
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(
        new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'An unexpected error occurred!',
        ),
      );
    }
  }
});

adminSchema.pre('findOne', async function (next) {
  try {
    this.findOne({ isDeleted: { $eq: false } });
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(
        new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'An unexpected error occurred!',
        ),
      );
    }
  }
});

adminSchema.pre('findOneAndUpdate', function (next) {
  try {
    this.find({ isDeleted: { $eq: false } });
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(
        new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'An unexpected error occurred!',
        ),
      );
    }
  }
});

adminSchema.pre('updateOne', function (next) {
  try {
    this.find({ isDeleted: { $eq: false } });
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(
        new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'An unexpected error occurred!',
        ),
      );
    }
  }
});

adminSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const query = this.getQuery();
    const doesAdminExist = await Admin.findOne(query);

    if (!doesAdminExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'Admin not found!');
    }

    const updatedAdmin = this.getUpdate() as Partial<TAdmin>;
    const { contactNo, emergencyContactNo } = updatedAdmin;

    if (contactNo || emergencyContactNo) {
      const doesContactNoAlreadyExist = await Admin.findOne({
        $or: [
          { contactNo },
          { emergencyContactNo },
          { contactNo: emergencyContactNo },
          { emergencyContactNo: contactNo },
        ],
      });

      if (doesContactNoAlreadyExist) {
        throw new AppError(
          httpStatus.CONFLICT,
          contactNo && !emergencyContactNo
            ? `This contact no ${contactNo} is already in use. Provide a different one`
            : !contactNo && emergencyContactNo
              ? `This emergency contact no ${emergencyContactNo} is already in use. Provide a different one`
              : contactNo && emergencyContactNo
                ? `This contact no ${contactNo} or this emergency contact no ${emergencyContactNo} is already in use. Provide a different one`
                : '',
        );
      }
    }

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(
        new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'An unexpected error occurred!',
        ),
      );
    }
  }
});

//* creating a custom static method
adminSchema.statics.doesUserExist = async function (id: string) {
  const existingUser = await Admin.findOne({ id });
  return existingUser;
};

export const Admin = model<TAdmin, AdminModel>('Admin', adminSchema);
