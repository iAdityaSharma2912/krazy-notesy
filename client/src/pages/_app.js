import '@/styles/globals.css';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // List of pages where we DO NOT want the sidebar
  // Now '/' is the landing page, so we hide sidebar there too
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