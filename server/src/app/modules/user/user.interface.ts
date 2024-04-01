export type TRole = 'admin' | 'student' | 'faculty';

export type TStatus = 'in-progress' | 'blocked';

export type TUser = {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: TRole;
  status: TStatus;
  isDeleted: boolean;
};

