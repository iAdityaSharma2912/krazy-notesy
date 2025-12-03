import '@/styles/globals.css';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import axios from 'axios';

// Fix for Ngrok warning on Vercel deployment and CORS issues.
// This header tells the backend service that the request is legitimate.
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // List of pages where we DO NOT want the sidebar (Public Routes)
  // '/' is the Starry Night Landing Page. '/auth' is the login/signup form.
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