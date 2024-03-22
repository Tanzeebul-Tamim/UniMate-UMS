import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: [true, 'ID is a required field'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is a required field'],
      maxlength: [20, 'Password cannot be longer 20 characters'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    needsPasswordChange: { type: Boolean, default: true },
    role: { type: String, enum: ['admin', 'student', 'faculty'] },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
  },
  { timestamps: true },
);

//* pre save middleware/hook : will work on create() and save() functions
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // document

  //* hashing password and saving to database
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

//* post save middleware/hook -> set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

export const User = model<TUser>('User', userSchema);
