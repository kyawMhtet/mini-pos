"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBulkRestock } from "@/hooks/useStock";
import { useT } from "@/lib/i18n";
import type { ProductWithCategory } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  products: ProductWithCategory[];
}

export function RestockAllDialog({ open, onClose, products }: Props) {
  const [values, setValues] = useState<Record<number, string>>({});
  const { mutate: bulkRestock, isPending } = useBulkRestock();
  const { t } = useT();

  useEffect(() => {
    if (open) {
      const initial: Record<number, string> = {};
      products.forEach((p) => { initial[p.id] = String(p.stock); });
      setValues(initial);
    }
  }, [open, products]);

  function handleSave() {
    const items = products
      .map((p) => ({ id: p.id, stock: Math.max(0, parseInt(values[p.id] ?? String(p.stock), 10) || 0) }))
      .filter((item, i) => item.stock !== products[i].stock);

    if (items.length === 0) { onClose(); return; }
    bulkRestock(items, { onSuccess: onClose });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && !isPending) onClose(); }}>
      <DialogContent className="max-w-2xl flex flex-col max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{t("stock.restockAllTitle")}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-2">
          <div className="divide-y divide-gray-100">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.sku}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400 whitespace-nowrap">{t("stock.current")}{p.stock}</span>
                  <Input
                    type="number"
                    min={0}
                    value={values[p.id] ?? String(p.stock)}
                    onChange={(e) => setValues((prev) => ({ ...prev, [p.id]: e.target.value }))}
                    className="w-28 h-8 text-sm text-right tabular-nums"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>{t("action.cancel")}</Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isPending ? t("state.saving") : t("action.saveChanges")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
