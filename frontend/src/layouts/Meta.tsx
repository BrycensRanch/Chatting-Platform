import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import { AppConfig } from '@/utils/AppConfig';

type IMetaProps = {
  title: string;
  description: string;
  canonical?: string;
};

const Meta = (props: IMetaProps) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta charSet="UTF-8" key="charset" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
          key="viewport"
        />
        <link
          rel="apple-touch-icon"
          href={`${router.basePath}/apple-touch-icon.png`}
          key="apple"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${router.basePath}/favicon-32x32.png`}
          key="icon32"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${router.basePath}/favicon-16x16.png`}
          key="icon16"
        />
        <link
          rel="icon"
          href={`${router.basePath}/favicon.ico`}
          key="favicon"
        />
        <meta name="application-name" content={`${AppConfig.site_name}`} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={`${props.title}`} />
        <meta name="description" content={`${AppConfig.description}`} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="msapplication-config"
          content={`${router.basePath}/icons/browserconfig.xml`}
        />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link
          rel="apple-touch-icon"
          href={`${router.basePath}/icons/touch-icon-iphone.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href={`${router.basePath}/icons/touch-icon-ipad.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${router.basePath}/icons/touch-icon-iphone-retina.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href={`${router.basePath}/icons/touch-icon-ipad-retina.png`}
        />

        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${router.basePath}/icons/favicon-16x16.png`}
        />
        <link rel="manifest" href={`${router.basePath}/manifest.json`} />
        <link
          rel="mask-icon"
          href={`${router.basePath}/icons/safari-pinned-tab.svg`}
          color="#5bbad5"
        />
        <link rel="shortcut icon" href={`${router.basePath}/favicon.ico`} />
      </Head>
      <NextSeo
        title={props.title}
        description={props.description}
        canonical={props.canonical}
        openGraph={{
          title: props.title,
          description: props.description,
          url: props.canonical,
          locale: AppConfig.locale,
          site_name: AppConfig.site_name,
        }}
      />
    </>
  );
};

export { Meta };
