import React, { useEffect } from "react";
import PortnoxKeyManager from "@/components/portnox/PortnoxKeyManager";
import PortnoxApiExplorer from "@/components/portnox/PortnoxApiExplorer";

const Portnox: React.FC = () => {
  useEffect(() => {
    document.title = "Portnox API Key Manager & Explorer"; // SEO title
  }, []);

  return (
    <main>
      <header className="container mx-auto px-6 pt-8">
        <h1 className="text-2xl font-semibold">Portnox API Key Manager & Explorer</h1>
        <p className="text-muted-foreground mt-1">Configure keys, test connections, and explore endpoints.</p>
      </header>
      <section className="container mx-auto px-6 py-8 grid gap-6 lg:grid-cols-2">
        <PortnoxKeyManager />
        <PortnoxApiExplorer />
      </section>
    </main>
  );
};

export default Portnox;
