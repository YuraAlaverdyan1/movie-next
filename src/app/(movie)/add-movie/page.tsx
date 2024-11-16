'use client';
import React, {useState} from 'react';
import {Button, Input} from '@/components/ui';
import styles from './addMovie.module.scss';
import Image from 'next/image';
import {toBase64} from '@/utils';
import {redirect, useRouter} from 'next/navigation';

const AddMovie: React.FC = () => {
  const router = useRouter();

  const [file, setFile] = useState<File | undefined>();
  const [bookDetails, setBookDetails] = useState({
    title: '',
    year: '',
  });
  const [isDragging, setIsDragging] = useState(false);
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
    if (!file) {
      return;
    }

    if (!bookDetails.year || !bookDetails.title) {
      return;
    }

    setLoading(true); // Start loading

    const base64Img = (await toBase64(file)) as string;

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: bookDetails.title,
          year: bookDetails.year,
          image: base64Img,
        }),
      });

      if (res.status === 200) {
        router.push('/'); // Redirect to the main page after success
      } else {
        console.log('Failed to create the book');
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
      <div className={styles.container}>
        <p className={styles.container_title}>Create a new movie</p>
        <div className={styles.container_content}>
          <div className={styles.container_form_actionBox_media}>
            <Button variant="outline" onClick={() => redirect('/')}>Cancel</Button>
            <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={loading} // Disable button when loading
            >
              {loading ? 'Submitting...' : 'Submit'} {/* Change text when loading */}
            </Button>
          </div>
          <div className={styles.container_upload}>
            {file ? (
                <Image
                    src={URL.createObjectURL(file)}
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
                  disabled={loading} // Disable button while loading
              >
                {loading ? 'Submitting...' : 'Submit'} {/* Change button text */}
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AddMovie;
