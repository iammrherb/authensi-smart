import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Contact {
  name: string;
  email: string;
}

interface Props {
  label: string;
  value: Contact[];
  onChange: (value: Contact[]) => void;
}

const OwnerContactsEditor: React.FC<Props> = ({ label, value, onChange }) => {
  const add = () => onChange([...(value || []), { name: "", email: "" }]);
  const update = (idx: number, field: keyof Contact, v: string) => {
    const next = [...(value || [])];
    next[idx] = { ...next[idx], [field]: v } as Contact;
    onChange(next);
  };
  const remove = (idx: number) => {
    const next = [...(value || [])];
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {(value || []).map((c, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
            <Input
              className="md:col-span-2"
              placeholder="Name"
              value={c.name}
              onChange={(e) => update(i, "name", e.target.value)}
            />
            <Input
              className="md:col-span-2"
              placeholder="Email"
              type="email"
              value={c.email}
              onChange={(e) => update(i, "email", e.target.value)}
            />
            <Button variant="outline" onClick={() => remove(i)}>Remove</Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="secondary" onClick={add}>Add Contact</Button>
    </div>
  );
};

export default OwnerContactsEditor;
