import { Home } from '../features/home'
// import { dehydrate, QueryClient } from 'react-query'
// import { prefetchCastlesData } from '../features/castle';
// import { prefetchAuthData } from '../features/auth'

export default function () {
  return <Home />
}

// export async function getServerSideProps() {
//   // const queryClient = new QueryClient();
//
//   // const userData: any = await prefetchAuthData(queryClient)
//   //
//   // console.log(userData?.id);
//   //
//   // await prefetchCastlesData(queryClient)
//
//   return {
//     props: {
//       // dehydratedState: dehydrate(queryClient)
//     }
//   }
// }
