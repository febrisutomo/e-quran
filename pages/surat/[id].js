import Head from 'next/head';
import Basmallah from '../../components/basmallah';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import * as React from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import {
  XMarkIcon,
  PlayIcon,
  PauseIcon,
  BookOpenIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import {
  InformationCircleIcon,
  BackwardIcon,
  ForwardIcon,
  PauseIcon as PauseIconSolid,
  PlayIcon as PlayIconSolid,
} from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';

const audioFile = (surat, ayat) => {
  return `https://verses.quran.com/Alafasy/mp3/${surat
    .toString()
    .padStart(3, '0')}${ayat.toString().padStart(3, '0')}.mp3`;
};

export default function Surat({ surat, tafsir }) {
  const [isOpenModal, setIsOpenModal] = React.useState(false);

  const [openedTafsir, setOpenedTafsir] = React.useState({
    ayat: '',
    nomorAyat: '',
    teksTafsir: '',
  });

  const readTafsir = async (ayat) => {
    const processedContent = await remark()
      .use(html)
      .process(tafsir[ayat - 1].teks);
    const contentHtml = processedContent.toString();
    setOpenedTafsir({
      ayat: surat.ayat[ayat - 1].teksArab,
      nomorAyat: tafsir[ayat - 1].ayat,
      teksTafsir: contentHtml,
    });
    setIsOpenModal(true);
  };

  const nextTafsir = () => {
    readTafsir(openedTafsir.nomorAyat + 1);
  };

  const prevTafsir = () => {
    readTafsir(openedTafsir.nomorAyat - 1);
  };

  const [audioSource, setAudioSource] = React.useState('');

  const audioRef = React.useRef();

  const [isPlaying, setIsPlaying] = React.useState(false);

  const [ayatPlaying, setAyatPlaying] = React.useState(1);

  const [isShowAudioControl, setIsShowAudioControl] = React.useState(false);

  const scrollIntoAyat = (nomorAyat) => {
    const element = document.getElementById(`ayat-${nomorAyat}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      console.log('scroll to', nomorAyat);
    }
  };

  const playAyat = (nomorAyat) => {
    setIsShowAudioControl(true);
    const source = audioFile(surat.nomor, nomorAyat);
    setAyatPlaying(nomorAyat);
    setAudioSource(source);
    audioRef.current.load();
    audioRef.current.play();
    setIsPlaying(true);
    scrollIntoAyat(nomorAyat);
  };

  const pauseAyat = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const handleTogglePlayAyat = (nomorAyat) => {
    setIsShowAudioControl(true);
    if (isPlaying && ayatPlaying === nomorAyat) {
      pauseAyat();
    } else {
      playAyat(nomorAyat);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      pauseAyat();
    } else {
      playAyat(ayatPlaying);
    }
  };

  const playPrevAyat = () => {
    playAyat(ayatPlaying - 1);
  };

  const playNextAyat = () => {
    playAyat(ayatPlaying + 1);
  };

  const handleEnded = () => {
    if (ayatPlaying !== surat.ayat.length) {
      playNextAyat();
    } else {
      const nomorAyat = 1;
      const source = audioFile(surat.nomor, nomorAyat);
      setAyatPlaying(nomorAyat);
      setAudioSource(source);
      audioRef.current.load();
      setIsPlaying(false);
    }
  };

  const handleCloseAudioControl = () => {
    setIsShowAudioControl(false);
    pauseAyat();
  };

  const dynamicRoute = useRouter().asPath;

  React.useEffect(() => {
    audioRef.current.pause();
    setAyatPlaying(1);
    setIsPlaying(false);
    console.log(dynamicRoute);
    console.log('ayat', ayatPlaying);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamicRoute]);

  return (
    <>
      <Head>
        <title>Surat {surat.namaLatin} | E-Quran</title>
      </Head>

      <div className="mb-8">
        <h1 className="text-center text-2xl font-semibold text-gray-900 dark:text-white">
          {surat.namaLatin}
        </h1>
        <h3 className="text-semibold text-center text-gray-700 dark:text-gray-400">
          {surat.tempatTurun === 'Mekah' ? 'Makkiyah' : 'Madaniyah'} •{' '}
          {surat.arti} • {surat.jumlahAyat} Ayat{' '}
        </h3>
      </div>

      {surat.nomor !== 1 && (
        <div className="mb-6 flex justify-center">
          <Basmallah />
        </div>
      )}

      <div className="mb-2 flex justify-between">
        <button
          className="float-right inline-flex rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 "
          onClick={handleTogglePlay}
        >
          {isPlaying ? (
            <>
              <PauseIcon className="-ml-1 mr-2 h-5 w-5" /> Jeda Audio
            </>
          ) : (
            <>
              <PlayIcon className="-ml-1 mr-2 h-5 w-5" /> Putar Audio
            </>
          )}
        </button>

        <audio controls ref={audioRef} onEnded={handleEnded} className="hidden">
          <source src={audioSource} type="audio/mpeg" />
        </audio>

        <Link
          className="flex items-center justify-center text-gray-600 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
          href={`${surat.nomor}/info`}
        >
          <InformationCircleIcon className="mr-1 h-5 w-5" />

          <p className="inline-flex items-center font-medium">Info Surat</p>
        </Link>
      </div>

      {surat.ayat.map((ayat, index) => (
        <div
          id={`ayat-${ayat.nomorAyat}`}
          key={index}
          className="flex flex-col border-b border-b-gray-300 py-4 md:flex-row lg:py-8 "
        >
          <div className="mb-6 flex flex-row items-center gap-2  md:mb-0 md:flex-col md:pr-16">
            <p className="text-gray-500 dark:text-white lg:mb-2">
              {surat.nomor}:{ayat.nomorAyat}
            </p>
            <button
              type="button"
              className="inline-flex items-center rounded-full p-2 text-gray-500 hover:bg-primary-100 hover:text-primary-700 dark:text-white  dark:hover:bg-gray-600 "
              onClick={() => handleTogglePlayAyat(ayat.nomorAyat)}
            >
              {isPlaying && ayatPlaying === ayat.nomorAyat ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-full p-2 text-gray-500 hover:bg-primary-100 hover:text-primary-700 dark:text-white  dark:hover:bg-gray-600 "
              onClick={() => readTafsir(ayat.nomorAyat)}
            >
              <BookOpenIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-grow">
            {/* {!data ? (
              <p>Loading...</p>
            ) : (
              <p
                className={`mb-4 text-right font-indopak text-3xl leading-snug lg:mb-6 ${
                  isPlaying && ayat.audio['05'] === audioSource
                    ? 'text-primary-700 dark:text-primary-500'
                    : 'text-dark-900 dark:text-white'
                }`}
              >
                {data.verses[index]['text_indopak']}
              </p>
            )} */}

            <p
              className={`mb-4 text-right font-lateef text-4xl leading-snug lg:mb-6 ${
                isPlaying && ayatPlaying === ayat.nomorAyat
                  ? 'text-primary-700 dark:text-primary-500'
                  : 'text-dark-900 dark:text-white'
              }`}
            >
              {ayat.teksArab}
            </p>

            <p className="mb-2 font-semibold italic dark:text-white">
              {ayat.teksLatin}
            </p>
            <p className="text-gray-700 dark:text-gray-400">
              {ayat.teksIndonesia}
            </p>
          </div>
        </div>
      ))}

      <div className="mb-4 py-6">
        {surat.nomor !== 1 && (
          <Link
            href={`/surat/${surat.nomor - 1}`}
            className="float-left inline-flex rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 "
          >
            <ChevronLeftIcon className="-ml-1 mr-2 h-5 w-5" />
            Surat Sebelumnya
          </Link>
        )}

        {surat.nomor !== 114 && (
          <Link
            href={`/surat/${surat.nomor + 1}`}
            className="float-right inline-flex rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 "
          >
            Surat Berikutnya
            <ChevronRightIcon className="-mr-1 ml-2 h-5 w-5" />
          </Link>
        )}
      </div>

      {isShowAudioControl && (
        <div className="fixed bottom-0 left-0 flex w-full items-center justify-center gap-4 bg-white p-2 shadow-lg shadow-gray-800 dark:bg-gray-800">
          <button className="inline-flex items-center rounded-full p-2 text-gray-500 hover:bg-primary-100 hover:text-primary-700 disabled:opacity-50 dark:text-white  dark:hover:bg-gray-600">
            <EllipsisHorizontalIcon className="h-6 w-6" />
          </button>
          <button
            className="inline-flex items-center rounded-full p-2 text-gray-500 hover:bg-primary-100 hover:text-primary-700 disabled:opacity-50 dark:text-white  dark:hover:bg-gray-600"
            onClick={playPrevAyat}
            disabled={ayatPlaying === 1}
          >
            <BackwardIcon className="h-6 w-6" />
          </button>
          <button
            className="inline-flex items-center rounded-full p-2 text-gray-500 hover:bg-primary-100 hover:text-primary-700 dark:text-white  dark:hover:bg-gray-600"
            onClick={handleTogglePlay}
          >
            {isPlaying ? (
              <PauseIconSolid className="h-6 w-6" />
            ) : (
              <PlayIconSolid className="h-6 w-6" />
            )}
          </button>
          <button
            className="inline-flex items-center rounded-full p-2 text-gray-500 hover:bg-primary-100 hover:text-primary-700 disabled:opacity-50 dark:text-white  dark:hover:bg-gray-600"
            onClick={playNextAyat}
            disabled={ayatPlaying === surat.ayat.length}
          >
            <ForwardIcon className="h-6 w-6" />
          </button>
          <button
            className="inline-flex items-center rounded-full p-2 text-gray-500 hover:bg-primary-100 hover:text-primary-700 disabled:opacity-50 dark:text-white  dark:hover:bg-gray-600"
            onClick={handleCloseAudioControl}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      )}

      <Transition appear show={isOpenModal} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpenModal(false)}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 ">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex max-h-[calc(100vh-32px)] w-full max-w-xl transform flex-col overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all dark:bg-gray-700 lg:max-w-2xl">
                  <Dialog.Title
                    as="div"
                    className="flex items-center justify-between p-4"
                  >
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                      Tafsir {surat.namaLatin} Ayat {openedTafsir.nomorAyat}
                    </h3>
                    <button
                      className="rounded-full p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                      onClick={() => setIsOpenModal(false)}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </Dialog.Title>
                  <div className="overflow-y-auto px-4">
                    <p className="mb-4 text-right font-indopak text-3xl leading-snug dark:text-white lg:mb-6">
                      {openedTafsir.ayat}
                    </p>
                    <div
                      className="innerHTML text-sm text-gray-600 dark:text-white"
                      dangerouslySetInnerHTML={{
                        __html: openedTafsir.teksTafsir,
                      }}
                    />
                  </div>

                  <div className="p-4">
                    {openedTafsir.nomorAyat != 1 && (
                      <button
                        type="button"
                        className="float-left inline-flex rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 "
                        onClick={prevTafsir}
                      >
                        <ChevronLeftIcon className="-ml-1 mr-2 h-5 w-5" />
                        Ayat Sebelumnya
                      </button>
                    )}

                    {openedTafsir.nomorAyat !== surat.ayat.length && (
                      <button
                        type="button"
                        className="float-right inline-flex rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 "
                        onClick={nextTafsir}
                      >
                        Ayat Berikutnya
                        <ChevronRightIcon className="-mr-1 ml-2 h-5 w-5" />
                      </button>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <style jsx global>{`
        .innerHTML h2,
        .innerHTML p {
          margin-bottom: 16px !important;
          margin-top: 16px !important;
        }
        .innerHTML h2 {
          font-weight: bold !important;
        }
      `}</style>
    </>
  );
}

export async function getStaticPaths() {
  const res = await fetch('https://equran.id/api/v2/surat');
  const { data } = await res.json();

  const paths = data.map((surat) => ({
    params: { id: surat.nomor.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://equran.id/api/v2/surat/${params.id}`);
  const jsonSurat = await res.json();

  const res2 = await fetch(`https://equran.id/api/v2/tafsir/${params.id}`);
  const jsonTafsir = await res2.json();

  return { props: { surat: jsonSurat.data, tafsir: jsonTafsir.data.tafsir } };
}
