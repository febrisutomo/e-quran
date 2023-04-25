import Head from 'next/head';
import Link from 'next/link';
import * as React from 'react';

export default function Home({ surats }) {
  // const suratList = [
  //   {
  //     nomor: 1,
  //     nama: 'الفاتحة',
  //     namaLatin: 'Al-Fatihah',
  //     jumlahAyat: 7,
  //     tempatTurun: 'Mekah',
  //     arti: 'Pembukaan',
  //     deskripsi:
  //       "Surat <i>Al Faatihah</i> (Pembukaan) yang diturunkan di Mekah dan terdiri dari 7 ayat adalah surat yang pertama-tama diturunkan dengan lengkap  diantara surat-surat yang ada dalam Al Quran dan termasuk golongan surat Makkiyyah. Surat ini disebut <i>Al Faatihah</i> (Pembukaan), karena dengan surat inilah dibuka dan dimulainya Al Quran. Dinamakan <i>Ummul Quran</i> (induk Al Quran) atau <i>Ummul Kitaab</i> (induk Al Kitaab) karena dia merupakan induk dari semua isi Al Quran, dan karena itu diwajibkan membacanya pada tiap-tiap sembahyang.<br> Dinamakan pula <i>As Sab'ul matsaany</i> (tujuh yang berulang-ulang) karena ayatnya tujuh dan dibaca berulang-ulang dalam sholat.",
  //     audioFull: {
  //       '01': 'https://equran.nos.wjv-1.neo.id/audio-full/Abdullah-Al-Juhany/001.mp3',
  //       '02': 'https://equran.nos.wjv-1.neo.id/audio-full/Abdul-Muhsin-Al-Qasim/001.mp3',
  //       '03': 'https://equran.nos.wjv-1.neo.id/audio-full/Abdurrahman-as-Sudais/001.mp3',
  //       '04': 'https://equran.nos.wjv-1.neo.id/audio-full/Ibrahim-Al-Dossari/001.mp3',
  //       '05': 'https://equran.nos.wjv-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/001.mp3',
  //     },
  //   },
  // ];

  const [suratList, setSuratList] = React.useState(surats);

  const filterBySearch = (event) => {
    const query = event.target.value;
    const updatedList = surats.filter(({ namaLatin }) => {
      return namaLatin.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    setSuratList(updatedList);
  };

  return (
    <>
      <Head>
        <title>Al-Qur&apos;an Online Bahasa Indonesia | E-Quran</title>
      </Head>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-gray-900 outline-none focus:border-primary-500  focus:ring-primary-500 dark:border-gray-600  dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
          placeholder="Cari surat..."
          onChange={filterBySearch}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suratList.map((surat, index) => (
          <Link href={`surat/${surat.nomor}`} key={surat.nomor}>
            <div className="group flex items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 hover:border-primary-500 hover:bg-primary-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-primary-100 dark:hover:bg-primary-700 lg:p-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 group-hover:bg-primary-400 dark:bg-gray-500 ">
                  <p className="font-semibold text-gray-800  dark:text-white">
                    {surat.nomor}
                  </p>
                </div>
                <div className="flex-row items-center pl-5">
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    {surat.namaLatin}
                  </h4>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {surat.tempatTurun === 'Mekah' ? 'Makkiyah' : 'Madaniyah'} -{' '}
                    {surat.jumlahAyat} Ayat
                  </p>
                </div>
              </div>
              <div>
                {/* <p dir='auto' className="text-right font-isep-misbah text-lg leading-10 dark:text-white">
                  {surat.nama}
                </p> */}
                <i
                  className={`surah-icon icon-${surat.nomor} text-4xl text-gray-600 dark:text-white`}
                ></i>
                {/* <p className="text-right text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {surat.jumlahAyat} Ayat
                </p> */}
              </div>

              {/* <i className="surah-icon icon-1 text-4xl text-gray-600 dark:text-white"></i> */}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export async function getStaticProps() {
  const res = await fetch('https://equran.id/api/v2/surat');
  const resJson = await res.json();

  let surats = [];
  if (res.ok) {
    surats = resJson.data;
  }

  return {
    props: {
      surats,
    },
  };
}
