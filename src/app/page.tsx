'use client';
import Image from 'next/image';
import styles from './page.module.scss';
import { Button } from '@/components/ui/Button/Button';
import { BookItem, BookItemITF } from '@/components/BookItem/BookItem';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination/Pagination";
import classNames from "classnames";

export default function Home() {
  const { data, status } = useSession();

  const [books, setBooks] = useState<BookItemITF[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // State to manage the current page
  const [totalPages, setTotalPages] = useState(1); // State to store the total number of pages
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [pageSize] = useState(8); // Number of items per page (limit)

  if (!data?.user) {
    redirect('/signin');
  }

  // Fetch books based on the current page
  const fetchBooks = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/book?page=${page}&limit=${pageSize}`);
      if (res.status === 200) {
        const data = await res.json();
        setBooks(data.books); // Set the books data
        setTotalPages(data.totalPages); // Set total pages
      }
    } catch (err) {
      console.log('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch books when the page number changes
  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]); // This will trigger a re-fetch every time `currentPage` changes

  // Skeleton loader for individual book items
  const BookSkeleton = () => (
      <div className={styles.bookSkeleton}>
        <div className={styles.skeletonImage}></div>
        <div className={styles.skeletonText}></div>
        <div className={styles.skeletonText}></div>
      </div>
  );

  return (
      <div className={styles.container}>
        {!books.length && !loading ? (
            <div className={styles.container_missingBooks}>
              <p className={styles.container_missingBooks_title}>
                Your movie list is empty
              </p>
              <Button onClick={() => redirect('/add-movie')}>Add a new movie</Button>
            </div>
        ) : (
            <div className={styles.container_books}>
              <div className={styles.container_books_navbar}>
                <div className={styles.iconBox}>
                  <p className={styles.container_books_navbar_title}>My Movies</p>
                  <Image src="/plus.svg" alt="plus icon" width={1000} height={1000} onClick={() => redirect('/add-movie')} />
                </div>
                <div className={classNames(styles.iconBox, styles.logout)}>
                  <p className={styles.container_books_navbar_logout} onClick={() => signOut()}>Log out</p>
                  <Image src="/logout.svg" alt="logout icon" width={1000} height={1000} style={{ width: "24px", height: "24px" }} />
                </div>
              </div>

              {/* Book list */}
              <div className={styles.container_books_bookList}>
                {loading
                    ? Array.from({ length: pageSize }).map((_, index) => (
                        <BookSkeleton key={index} />
                    ))
                    : books.map(({ image, title, year, _id }, index) => (
                        <BookItem title={title} year={year} image={image} key={`${title}-${index}`} _id={_id} />
                    ))}
              </div>
              <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage} // Handle page change
                  pageSize={pageSize} // Number of items per page
              />
            </div>
        )}
      </div>
  );
}
