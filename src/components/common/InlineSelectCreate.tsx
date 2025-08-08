import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCatalogItems, useCreateCatalogItem, CatalogItem, CatalogCategoryKey } from "@/hooks/useCatalog";
import { Plus, Search, CheckCircle } from "lucide-react";

interface InlineSelectCreateProps {
  categoryKey: CatalogCategoryKey;
  label: string;
  description?: string;
  value: CatalogItem[];
  onChange: (items: CatalogItem[]) => void;
}

const InlineSelectCreate: React.FC<InlineSelectCreateProps> = ({
  categoryKey,
  label,
  description,
  value,
  onChange,
}) => {
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", vendor: "", model: "", firmware_version: "" });
  const { data: options = [], isLoading } = useCatalogItems(categoryKey, search);
  const createItem = useCreateCatalogItem();

  const selectedIds = useMemo(() => new Set(value.map((v) => v.id)), [value]);

  const toggleSelect = (item: CatalogItem) => {
    const exists = selectedIds.has(item.id);
    if (exists) {
      onChange(value.filter((v) => v.id !== item.id));
    } else {
      onChange([...value, item]);
    }
  };

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    const payload = {
      category_key: categoryKey as CatalogCategoryKey,
      name: form.name.trim(),
      vendor: form.vendor || null,
      model: form.model || null,
      firmware_version: form.firmware_version || null,
      labels: [],
      tags: [],
      metadata: {},
      is_active: true,
      created_by: undefined,
      created_at: "",
      updated_at: "",
    } as unknown as Omit<CatalogItem, "id" | "created_at" | "updated_at">;

    const item = await createItem.mutateAsync(payload);
    onChange([...value, item]);
    setForm({ name: "", vendor: "", model: "", firmware_version: "" });
    setAdding(false);
    setSearch("");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>{label}</span>
          <Badge variant="outline">{value.length} selected</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search or filter"
              className="pl-8"
            />
          </div>
          <Button variant="outline" onClick={() => setAdding((s) => !s)}>
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </div>

        {adding && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 border rounded-md p-3 bg-muted/30">
            <Input
              placeholder="Name*"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Input
              placeholder="Vendor (optional)"
              value={form.vendor}
              onChange={(e) => setForm((f) => ({ ...f, vendor: e.target.value }))}
            />
            <Input
              placeholder="Model (optional)"
              value={form.model}
              onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
            />
            <div className="flex gap-2">
              <Input
                placeholder="Firmware (opt)"
                value={form.firmware_version}
                onChange={(e) => setForm((f) => ({ ...f, firmware_version: e.target.value }))}
              />
              <Button onClick={handleAdd} disabled={!form.name.trim() || createItem.isPending}>
                Save
              </Button>
            </div>
          </div>
        )}

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-auto">
          {isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
          {!isLoading && options.length === 0 && (
            <div className="text-sm text-muted-foreground">No items yet. Add one above.</div>
          )}
          {options.map((opt) => {
            const active = selectedIds.has(opt.id);
            return (
              <div
                key={opt.id}
                className={`p-2 rounded border cursor-pointer transition-colors ${
                  active ? "bg-primary/10 border-primary" : "hover:bg-muted"
                }`}
                onClick={() => toggleSelect(opt)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{opt.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {opt.vendor || ""} {opt.model ? `• ${opt.model}` : ""} {opt.firmware_version ? `• FW ${opt.firmware_version}` : ""}
                    </div>
                  </div>
                  {active && <CheckCircle className="h-4 w-4 text-primary" />}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default InlineSelectCreate;
