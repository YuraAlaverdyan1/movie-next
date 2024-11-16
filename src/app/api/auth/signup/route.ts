import bcrypt from 'bcrypt';
import {NextRequest, NextResponse} from 'next/server';
import {users} from '../../../../../users';
import {connectDB} from '@/app/lib/mongodb';
import User from '@/app/lib/models/User/User';

export const POST = async (request: NextRequest) => {
  const {email, password} = await request.json();
  try {
    await connectDB();
    const userFound = await User.findOne({email});

    if (userFound) {
      return new NextResponse('Email is already in use', {status: 400});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      books: [],
    });

    await user.save();

    return new NextResponse('user is registered', {status: 200});
  } catch (e) {
    console.log(e);
  }
};
