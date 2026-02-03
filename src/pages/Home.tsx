import { Layout } from "../components/Layout";

export function Home() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Welcome</h1>
        <p className="mt-2 text-gray-600">You are logged in.</p>
      </div>
    </Layout>
  );
}
