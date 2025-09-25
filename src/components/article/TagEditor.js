"use client";
import React, { useState } from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";

export default function TagEditor({ tags, onAdd, onRemove }) {
  const [value, setValue] = useState("");
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800"
          >
            #{t}
            <button
              className="rounded-full p-1 hover:bg-slate-200 dark:hover:bg-slate-700"
              onClick={() => onRemove(t)}
              title="Remove"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Input
          placeholder="Add a tag and press Enter"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd(value);
              setValue("");
            }
          }}
        />
        <Button
          variant="outline"
          onClick={() => {
            onAdd(value);
            setValue("");
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
