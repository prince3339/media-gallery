import Head from 'next/head';
import React from 'react';
import styles from '../styles/Home.module.css';
import MediaCard from '../components/media';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Media Gallery</title>
        <meta name="description" content="Media gallery app for Momos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <MediaCard />
      </main>
    </div>
  )
}
