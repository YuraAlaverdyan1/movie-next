import React from 'react';
import Image from 'next/image';

import styles from './bookItem.module.scss';
import {redirect} from "next/navigation";

export interface BookItemITF {
  _id: string;
  title: string;
  year: number;
  image: string;
}

export const BookItem: React.FC<BookItemITF> = ({image, year, title, _id}) => {
  return (
    <div className={styles.container} onClick={() => redirect(`/${_id}`)}>
      <Image src={image} alt="Book image" width={1000} height={400} />
      <div className={styles.container_textBox}>
        <p className={styles.container_textBox_title}>{title}</p>
        <p className={styles.container_textBox_description}>{year}</p>
      </div>
    </div>
  );
};
