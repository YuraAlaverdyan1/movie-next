import {NextRequest, NextResponse} from 'next/server';
import {auth} from '@/auth';
import User from '@/app/lib/models/User/User';
import {connectDB} from '@/app/lib/mongodb';
await connectDB();

export const POST = async (req: NextRequest, res: NextResponse) => {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }

  const {title, year, image} = await req.json();

  const existingUser = await User.findOne({
    email: session.user.email,
  });

  if (!existingUser) {
    return NextResponse.json({error: 'User not found'}, {status: 404});
  }

  existingUser.books.push({title, year, image});

  await existingUser.save();

  return new NextResponse('Book added successfully', {status: 200});
};

export const PUT = async (req: NextRequest, res: NextResponse) => {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }

  const bookDetails = await req.json();

  const existingUser = await User.findOne({
    email: session.user.email || '',
  });

  if (!existingUser) {
    return NextResponse.json({error: 'User not found'}, {status: 404});
  }

  const existingBookIndex = existingUser.books.findIndex(
    book => book._id.toString() === bookDetails._id
  );

  if (existingBookIndex === -1) {
    return NextResponse.json({error: 'Book not found'}, {status: 404});
  }

  existingUser.books[existingBookIndex] = {
    ...existingUser.books[existingBookIndex],
    ...bookDetails,
  };

  await existingUser.save();

  return new NextResponse('Book updated successfully', {status: 200});
};

export const GET = async (req: NextRequest, res: NextResponse) => {
  const session = await auth();
  const bookId = req.nextUrl.searchParams.get('bookId');
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10); // Default to page 1 if not specified
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '8', 10); // Default to 8 items per page if not specified


  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existingUser = await User.findOne({
    email: session.user.email || '',
  });

  if (!existingUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Pagination logic
  const totalBooks = existingUser.books.length;
  const totalPages = Math.ceil(totalBooks / limit); // Calculate total pages
  const skip = (page - 1) * limit; // Skip the books based on the current page and limit

  if (bookId) {
    // If a bookId is provided, fetch a single book
    const book = existingUser.books.find((book) => book._id.toString() === bookId);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    return NextResponse.json(book, { status: 200 });
  }

  // Paginate books
  const books = existingUser.books.slice(skip, skip + limit); // Slice the books array to get the current page's books

  return NextResponse.json(
      {
        books,
        page,
        limit,
        totalBooks,
        totalPages,
      },
      { status: 200 }
  );
};
