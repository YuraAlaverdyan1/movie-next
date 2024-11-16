'use client';
import React, {useEffect, useState} from 'react';
import {Button, Input} from '@/components/ui';
import styles from './editMovie.module.scss';
import Image from 'next/image';
import {toBase64} from '@/utils';
import {redirect, useParams, useRouter} from 'next/navigation';
import classNames from "classnames";

const EditBook: React.FC = () => {
  const router = useRouter();
  const {bookId} = useParams<{bookId: string}>();

  const [file, setFile] = useState<File | undefined>();
  const [isDragging, setIsDragging] = useState(false);
  const [bookDetails, setBookDetails] = useState({
    title: '',
    year: '',
    image: ''
  });
  const [loading, setLoading] = useState(false); // Track loading state

  // Handle file drop event
  const handleDrop = e => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
    }
  };

  // Handle drag over event (to allow drop)
  const handleDragOver = e => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave event (to reset state when dragging leaves the drop zone)
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Handle file selection via the file input
  const handleFileSelect = e => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!file && !bookDetails.image) {
      return;
    }
    if (!bookDetails.year || !bookDetails.title) {
      return;
    }

    setLoading(true); // Start loading

    const base64Img = file ? (await toBase64(file)) as string : bookDetails.image;

    try {
      const res = await fetch('/api/book', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: bookId,
          title: bookDetails.title,
          year: bookDetails.year,
          image: base64Img,
        }),
      });

      if (res.status === 200) {
        router.push('/');
      } else {
        console.log('Failed to update the book');
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Fetch book details when the component mounts
  const fetchBookWithTitle = async () => {
    try {
      const res = await fetch(`/api/book?bookId=${bookId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200) {
        const data = await res.json();
        setBookDetails({
          title: data.title,
          year: data.year,
          image: data.image
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (bookId) fetchBookWithTitle();
  }, [bookId]);

  return (
      <div className={styles.container}>
        <p className={styles.container_title}>Edit</p>
        <div className={styles.container_content}>
          <div className={styles.container_form_actionBox_media}>
            <Button variant="outline" onClick={() => redirect('/')}>Cancel</Button>
            <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={loading} // Disable the button when loading
            >
              {loading ? 'Submitting...' : 'Submit'} {/* Change button text */}
            </Button>
          </div>
          <div className={styles.container_upload}>
            {file || bookDetails.image ? (
                <Image
                    src={file ? URL.createObjectURL(file) : bookDetails.image}
                    alt="book image"
                    width={1000}
                    height={1000}
                />
            ) : (
                <div
                    className={styles.container_upload_body}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                  <Image
                      src="/download.svg"
                      alt="download"
                      width={1000}
                      height={1000}
                  />
                  <p>Drag an image here</p>
                </div>
            )}
            <input type="file" onChange={e => setFile(e.target?.files?.[0])}/>
          </div>
          <div className={styles.container_form}>
            <div className={styles.container_form_inputBox}>
              <Input
                  placeholder="Title"
                  value={bookDetails.title}
                  onChange={e =>
                      setBookDetails({...bookDetails, title: e.target.value})
                  }
              />
              <Input
                  placeholder="Publishing year"
                  style={{width: '60%'}}
                  type="number"
                  value={bookDetails.year}
                  onChange={e =>
                      setBookDetails({...bookDetails, year: e.target.value})
                  }
              />
            </div>
            <div className={styles.container_form_actionBox}>
              <Button variant="outline" onClick={() => redirect('/')}>Cancel</Button>
              <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={loading} // Disable the button while loading
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default EditBook;
