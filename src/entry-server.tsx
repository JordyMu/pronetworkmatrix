import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import App from './App';

export function render(url: string) {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );

  const { helmet } = helmetContext;
  const head = helmet
    ? [helmet.title, helmet.meta, helmet.link, helmet.script]
        .map((el) => (el ? el.toString() : ''))
        .join('\n')
    : '';

  return { html, head };
}
