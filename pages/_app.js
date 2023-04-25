//  import global  css
import '../styles/globals.css';
import "../styles/surahname.css"

// import layout  components form components folder
import Layout from '../components/layout';
export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
