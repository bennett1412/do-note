import { GetServerSideProps } from 'next';

export default function Home() {
  return (
    <></>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      permanent: false,
      destination: "/auth"
    }
  }
}
