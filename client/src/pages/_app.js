import '@/styles/globals.css';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import axios from 'axios'; // Import Axios

// --- FIX FOR NGROK ---
// This tells Ngrok "I am a real developer, let me in!"
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
// ---------------------

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // List of pages where we DO NOT want the sidebar
  const noSidebarRoutes = ['/', '/auth'];

  const showSidebar = !noSidebarRoutes.includes(router.pathname);

  return showSidebar ? (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  ) : (
    <Component {...pageProps} />
  );
}

