import React, { useEffect } from "react";
import PortnoxKeyManager from "@/components/portnox/PortnoxKeyManager";
import PortnoxApiExplorer from "@/components/portnox/PortnoxApiExplorer";
import BulkApiRunner from "@/components/portnox/BulkApiRunner";

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
      <section className="container mx-auto px-6 py-8 grid gap-6 lg:grid-cols-3">
        <PortnoxKeyManager />
        <PortnoxApiExplorer />
        <BulkApiRunner />
      </section>
    </main>
  );
};

export default Portnox;
