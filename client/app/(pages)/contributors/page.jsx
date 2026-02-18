import React, { Suspense } from "react";
import Collaborators from "../../../components/contributors";
import Footer from "../../../components/footer";

const contributorsPage = () => {
  return (
    <main className="grid h-screen overscroll-y-auto min-w-full">
      <Suspense>
        <Collaborators />
        <Footer />
      </Suspense>
    </main>
  );
};

export default contributorsPage;
