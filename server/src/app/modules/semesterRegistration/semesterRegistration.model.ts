import { Schema, model } from 'mongoose';
import { TSemesterRegistrationDB } from './semesterRegistration.interface';
import { SemesterRegistrationStatuses } from './semesterRegistration.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const semesterRegistrationSchema = new Schema<TSemesterRegistrationDB>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'Academic_Semester',
      required: [true, 'Academic semester is required'],
    },
    status: {
      type: String,
      enum: {
        values: SemesterRegistrationStatuses,
        message: 'Invalid status. Please enter a valid status',
      },
      required: [true, 'Status is required'],
    },
    startDate: { type: Date, required: [true, 'Start date is required'] },
    endDate: { type: Date, required: [true, 'End date is required'] },
    minCredit: { type: Number, default: 3 },
    maxCredit: { type: Number, default: 15 },
  },
  { timestamps: true },
);

semesterRegistrationSchema.pre('save', async function (next) {
  const doesSemesterRegistrationExist = await SemesterRegistration.findOne({
    academicSemester: this?.academicSemester,
  });

  if (doesSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This academic semester has been registered already`,
    );
  }
  next();
});

export const SemesterRegistration = model<TSemesterRegistrationDB>(
  'Semester_Registration',
  semesterRegistrationSchema,
);
