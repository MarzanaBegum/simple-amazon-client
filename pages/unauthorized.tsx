import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout";

const UnauthorizedPage = () => {
  const router = useRouter();
  const { message } = router.query;
  return (
    <Layout title="Unauthorized Page">
      <div>
        <h2 className="text-xl">Access Denied</h2>
        {message && <div className="mb-4 text-red-500">{message}</div>}
      </div>
    </Layout>
  );
};

export default UnauthorizedPage;

