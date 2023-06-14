import type { AppProps } from 'next/app'
import { QueryClientProvider, Hydrate } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'
import { queryClient } from '../src/shared/queryClient'
import '../src/shared/styles/globals.css'
import 'normalize.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '../src/shared/styles/common.scss'
import { Header } from '../src/widgets/header'
import styles from './_app.module.scss'
import { useRequestInterceptor } from '../src/shared'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  useRequestInterceptor()

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <div className={styles.wrap}>
          <Header />
          <div className={styles.container}>
            {getLayout(<Component {...pageProps} />)}
          </div>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </Hydrate>
    </QueryClientProvider>
  )
}

export default App
