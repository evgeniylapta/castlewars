import type { AppProps } from 'next/app'
import { QueryClientProvider, Hydrate } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { NextPage } from 'next'
import {
  ReactElement, ReactNode
} from 'react'
import { useRouter } from 'next/router'
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
import {
  AuthGuard,
  unauthorisedInterceptorInit,
  UserDataProvider,
  useSubscribeOnRefreshTokenFail
} from '../src/entities/auth'

unauthorisedInterceptorInit()

export type NextPageExtended<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
  onlyAuthenticated?: boolean
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageExtended
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  const { push } = useRouter()

  useSubscribeOnRefreshTokenFail(() => {
    console.log('test')
    push('login')
  })

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <UserDataProvider allowToFetch={Component.onlyAuthenticated || false}>
          <AuthGuard onlyAuthenticated={Component.onlyAuthenticated}>
            <div className={styles.wrap}>
              <Header />
              <div className={styles.container}>
                {getLayout(<Component {...pageProps} />)}
              </div>
            </div>
          </AuthGuard>
        </UserDataProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </Hydrate>
    </QueryClientProvider>
  )
}

export default App
