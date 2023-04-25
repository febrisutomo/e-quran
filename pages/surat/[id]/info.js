import * as React from 'react';

export default function Info({ info }) {
  const elRef = React.useRef();

  // React.useEffect(() => {
  //   if (elRef.current) {
  //     const nodes = elRef.current.getElementsByTagName('P');
  //     console.log(nodes.length);
  //     for (let i = 0; i < nodes.length; i++) {
  //       nodes[i].style.marginBottom = 24;
  //     }
  //   }
  // });

  return (
    <>
      <div className="lg:flex flex-row">
        <div className="basis-1/4"></div>
        <div
          className="info basis-3/4 dark:text-white"
          dangerouslySetInnerHTML={{ __html: info.text }}
        />
      </div>
      <style jsx global>{`
        .info h2,
        .info p {
          margin-bottom: 16px !important;
          margin-top: 16px !important;
        }
        .info h2 {
          font-weight: bold !important;
        }
      `}</style>
    </>
  );
}

export async function getStaticPaths() {
  const res = await fetch('https://api.quran.com/api/v4/chapters?language=id');
  const { chapters } = await res.json();

  const paths = chapters.map((chapter) => ({
    params: { id: chapter.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  // Dapatkan ID surat dari params
  const { id } = params;

  // Lakukan fetch data untuk informasi surat dengan ID tertentu
  const res = await fetch(
    `https://api.quran.com/api/v4/chapters/${id}/info?language=id`
  );
  const { chapter_info } = await res.json();

  // Kembalikan objek props dengan data informasi surat
  return { props: { info: chapter_info } };
}
