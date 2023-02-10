import type { NextPage } from "next";

const Blackbox: NextPage<{ stdout: string; stderr: string }> = () => {
  return <div>Blackbox</div>;
};

export async function getServerSideProps() {
  // const { stdout, stderr } = await fetch(
  //   process.env.NEXT_PUBLIC_APP_URL + "/api/blackbox",
  //   {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "X-Password": process.env.NEXT_PUBLIC_PASSWORD || "",
  //     },
  //   }
  // ).then((res) => res.json());

  return {
    props: {
      stdout: {},
      stderr: {},
    },
  };
}

export default Blackbox;
