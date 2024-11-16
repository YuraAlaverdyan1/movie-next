import {BookItemITF} from '@/components/BookItem/BookItem';
import mongoose, {model, Schema} from 'mongoose';

export interface UserDocumentITF {
  _id: string;
  email: string;
  password: string;
  books: BookItemITF[];
  createdAt: Date;
  updatedAt: Date;
}

const BookItemSchema = new Schema<BookItemITF>({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

const UserSchema = new Schema<UserDocumentITF>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email is invalid',
      ],
    },
    password: {
      type: String,
      required: true,
    },
    books: {
      type: [BookItemSchema],
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models?.User || model<UserDocumentITF>('User', UserSchema);
export default User;
