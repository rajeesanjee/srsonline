"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";

import TamilKeyboard from "@/components/TamilKeyboard";
import { transliterateTamil } from "@/lib/tamil-transliterate";

type ProductData = {
  id: string;
  productCode: string | null;
  barcode: string | null;
  name: string;
  nameTamil: string | null;
  category: string;
  unit: string;
  purchasePrice: string | number;
  mrp: string | number;
  wholesaleProfitPercent: string | number | null;
  wholesalePrice: string | number | null;
  retailProfitPercent: string | number | null;
  retailPrice: string | number;
  cardProfitPercent: string | number | null;
  cardPrice: string | number | null;
  gstRate: string | number;
  hsnCode: string | null;
  stock: string | number;
  allowDecimal: boolean;
  supplierName: string | null;
  counter: number;
  discountPercent: string | number | null;
};

const emptyForm = {
  productCode: "",
  barcode: "",
  name: "",
  nameTamil: "",
  category: "",
  unit: "PCS",
  purchasePrice: "",
  mrp: "",
  wholesaleProfitPercent: "",
  wholesalePrice: "",
  retailProfitPercent: "",
  retailPrice: "",
  cardProfitPercent: "",
  cardPrice: "",
  gstRate: "0",
  hsnCode: "",
  stock: "",
  allowDecimal: false,
  supplierName: "",
  counter: "0",
  discountPercent: "",
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const id = String(params.id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showTamilKeyboard, setShowTamilKeyboard] =
    useState(false);

  function updateField(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function valueToString(
    value: string | number | null | undefined
  ) {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value);
  }

  function calculatePrice(
    purchasePrice: string,
    profitPercent: string
  ) {
    const purchase = Number(purchasePrice);
    const profit = Number(profitPercent);

    if (
      !Number.isFinite(purchase) ||
      !Number.isFinite(profit)
    ) {
      return "";
    }

    return (
      purchase +
      (purchase * profit) / 100
    ).toFixed(2);
  }

  function updatePurchasePrice(value: string) {
    setForm((current) => ({
      ...current,
      purchasePrice: value,
      wholesalePrice: calculatePrice(
        value,
        current.wholesaleProfitPercent
      ),
      retailPrice: calculatePrice(
        value,
        current.retailProfitPercent
      ),
      cardPrice: calculatePrice(
        value,
        current.cardProfitPercent
      ),
    }));
  }

  function updateProfit(
    profitField:
      | "wholesaleProfitPercent"
      | "retailProfitPercent"
      | "cardProfitPercent",
    priceField:
      | "wholesalePrice"
      | "retailPrice"
      | "cardPrice",
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [profitField]: value,
      [priceField]: calculatePrice(
        current.purchasePrice,
        value
      ),
    }));
  }

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/products/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load product"
          );
        }

        const product = data as ProductData;

        setForm({
          productCode: product.productCode || "",
          barcode: product.barcode || "",
          name: product.name,
          nameTamil: product.nameTamil || "",
          category: product.category,
          unit: product.unit,
          purchasePrice: valueToString(
            product.purchasePrice
          ),
          mrp: valueToString(product.mrp),
          wholesaleProfitPercent: valueToString(
            product.wholesaleProfitPercent
          ),
          wholesalePrice: valueToString(
            product.wholesalePrice
          ),
          retailProfitPercent: valueToString(
            product.retailProfitPercent
          ),
          retailPrice: valueToString(
            product.retailPrice
          ),
          cardProfitPercent: valueToString(
            product.cardProfitPercent
          ),
          cardPrice: valueToString(
            product.cardPrice
          ),
          gstRate: valueToString(product.gstRate),
          hsnCode: product.hsnCode || "",
          stock: valueToString(product.stock),
          allowDecimal: product.allowDecimal,
          supplierName: product.supplierName || "",
          counter: String(product.counter),
          discountPercent: valueToString(
            product.discountPercent
          ),
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update product"
        );
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      if (
        event.ctrlKey &&
        event.key.toLowerCase() === "s"
      ) {
        event.preventDefault();

        const productForm =
          document.getElementById(
            "edit-product-form"
          ) as HTMLFormElement | null;

        productForm?.requestSubmit();
      }

      if (event.key === "Escape") {
        if (showTamilKeyboard) {
          setShowTamilKeyboard(false);
          return;
        }

        router.push("/admin/products");
      }
    }

    window.addEventListener("keydown", handleKeyboard);

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
  }, [router, showTamilKeyboard]);

  if (loading) {
    return (
      <div className="p-4 text-sm font-semibold text-stone-600">
        Loading product...
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <div className="mb-2 flex items-center justify-between border-b pb-2">
        <div>
          <h1 className="text-xl font-extrabold text-red-800">
            Edit Product Information
          </h1>

          <p className="text-xs text-stone-500">
            Update product master details
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            form="edit-product-form"
            disabled={saving}
            className="h-9 rounded bg-red-800 px-6 text-sm font-bold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/admin/products")
            }
            className="h-9 rounded border bg-white px-6 text-sm font-bold"
          >
            Close
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-2 rounded bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <form
        id="edit-product-form"
        onSubmit={handleSubmit}
        className="border bg-white p-3 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Panel title="Product Details">
            <Row label="Product Code">
              <TextInput
                value={form.productCode}
                disabled
              />
            </Row>

            <Row label="Barcode">
              <TextInput
                value={form.barcode}
                onChange={(value) =>
                  updateField("barcode", value)
                }
              />
            </Row>

            <Row label="Product Name">
              <TextInput
                value={form.name}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    name: value,
                    nameTamil:
                      transliterateTamil(value),
                  }))
                }
                required
              />
            </Row>

            <Row label="தமிழ் பெயர்">
              <div className="relative flex min-w-0 gap-2">
                <TextInput
                  value={form.nameTamil}
                  onChange={(value) =>
                    updateField("nameTamil", value)
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowTamilKeyboard(
                      (current) => !current
                    )
                  }
                  className="shrink-0 rounded border border-red-200 bg-red-50 px-3 text-sm font-bold text-red-800"
                >
                  ⌨ தமிழ்
                </button>

                {showTamilKeyboard && (
                  <TamilKeyboard
                    onCharacter={(character) =>
                      updateField(
                        "nameTamil",
                        form.nameTamil + character
                      )
                    }
                    onSpace={() =>
                      updateField(
                        "nameTamil",
                        `${form.nameTamil} `
                      )
                    }
                    onBackspace={() =>
                      updateField(
                        "nameTamil",
                        Array.from(form.nameTamil)
                          .slice(0, -1)
                          .join("")
                      )
                    }
                    onClear={() =>
                      updateField("nameTamil", "")
                    }
                    onClose={() =>
                      setShowTamilKeyboard(false)
                    }
                  />
                )}
              </div>
            </Row>

            <Row label="Category">
              <TextInput
                value={form.category}
                onChange={(value) =>
                  updateField("category", value)
                }
                required
              />
            </Row>

            <Row label="Unit">
              <SelectInput
                value={form.unit}
                onChange={(value) =>
                  updateField("unit", value)
                }
                options={[
                  "PCS",
                  "KG",
                  "GRAM",
                  "LITRE",
                  "ML",
                  "PACK",
                  "BOX",
                  "BAG",
                ]}
              />
            </Row>

            <Row label="Opening Stock">
              <NumberInput
                value={form.stock}
                onChange={(value) =>
                  updateField("stock", value)
                }
                step={
                  form.allowDecimal ? "0.001" : "1"
                }
                required
              />
            </Row>

            <Row label="Decimal Qty">
              <label className="flex h-8 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.allowDecimal}
                  onChange={(event) =>
                    updateField(
                      "allowDecimal",
                      event.target.checked
                    )
                  }
                />

                Allow decimal quantity
              </label>
            </Row>
          </Panel>

          <Panel title="Tax, Supplier and Counter Details">
            <Row label="GST">
              <select
                value={form.gstRate}
                onChange={(event) =>
                  updateField(
                    "gstRate",
                    event.target.value
                  )
                }
                className="h-8 w-full rounded border px-2 text-sm"
              >
                <option value="0">
                  Non-Taxable Items
                </option>

                <option value="5">5%</option>

                <option value="18">18%</option>
              </select>
            </Row>

            <Row label="HSN Code">
              <TextInput
                value={form.hsnCode}
                onChange={(value) =>
                  updateField("hsnCode", value)
                }
              />
            </Row>

            <Row label="Supplier Name">
              <TextInput
                value={form.supplierName}
                onChange={(value) =>
                  updateField(
                    "supplierName",
                    value
                  )
                }
              />
            </Row>

            <Row label="Counter">
              <SelectInput
                value={form.counter}
                onChange={(value) =>
                  updateField("counter", value)
                }
                options={["0", "1", "2", "3"]}
              />
            </Row>

            <Row label="Purchase Price">
              <NumberInput
                value={form.purchasePrice}
                onChange={updatePurchasePrice}
                required
              />
            </Row>

            <Row label="MRP">
              <NumberInput
                value={form.mrp}
                onChange={(value) =>
                  updateField("mrp", value)
                }
              />
            </Row>
          </Panel>
        </div>

        <section className="mt-3 border p-3">
          <h2 className="mb-3 border-b pb-2 text-sm font-extrabold text-red-800">
            Pricing Details
          </h2>

          <div className="overflow-hidden rounded border">
            <table className="w-full table-fixed text-sm">
              <thead className="bg-stone-100">
                <tr>
                  <th className="px-3 py-2 text-left">
                    Price Category
                  </th>

                  <th className="px-3 py-2 text-left">
                    Profit %
                  </th>

                  <th className="px-3 py-2 text-left">
                    Calculated Price
                  </th>
                </tr>
              </thead>

              <tbody>
                <PriceRow
                  label="Wholesale Price"
                  profit={form.wholesaleProfitPercent}
                  price={form.wholesalePrice}
                  onProfit={(value) =>
                    updateProfit(
                      "wholesaleProfitPercent",
                      "wholesalePrice",
                      value
                    )
                  }
                  onPrice={(value) =>
                    updateField(
                      "wholesalePrice",
                      value
                    )
                  }
                />

                <PriceRow
                  label="Retail Price"
                  profit={form.retailProfitPercent}
                  price={form.retailPrice}
                  onProfit={(value) =>
                    updateProfit(
                      "retailProfitPercent",
                      "retailPrice",
                      value
                    )
                  }
                  onPrice={(value) =>
                    updateField("retailPrice", value)
                  }
                />

                <PriceRow
                  label="Credit Card Price"
                  profit={form.cardProfitPercent}
                  price={form.cardPrice}
                  onProfit={(value) =>
                    updateProfit(
                      "cardProfitPercent",
                      "cardPrice",
                      value
                    )
                  }
                  onPrice={(value) =>
                    updateField("cardPrice", value)
                  }
                />
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-3 flex items-center justify-between border-t pt-2">
          <p className="text-xs font-semibold text-stone-500">
            CTRL+S - Update | ESC - Close | Product Code -
            Read Only
          </p>

          <button
            type="submit"
            disabled={saving}
            className="h-8 rounded bg-red-800 px-6 text-sm font-bold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 border p-3">
      <h2 className="mb-3 border-b pb-2 text-sm font-extrabold text-red-800">
        {title}
      </h2>

      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[135px_minmax(0,1fr)] items-center gap-3">
      <label className="text-right text-sm font-semibold text-stone-700">
        {label}
      </label>

      <div className="min-w-0">{children}</div>
    </div>
  );
}

type TextInputProps = {
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
};

function TextInput({
  value,
  onChange,
  disabled = false,
  required = false,
}: TextInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) =>
        onChange?.(event.target.value)
      }
      disabled={disabled}
      required={required}
      className="h-8 w-full min-w-0 rounded border px-2 text-sm disabled:bg-stone-100 disabled:text-stone-500"
    />
  );
}

function NumberInput({
  value,
  onChange,
  step = "0.01",
  required = false,
}: {
  value: string;
  onChange: (value: string) => void;
  step?: string;
  required?: boolean;
}) {
  return (
    <input
      type="number"
      min="0"
      step={step}
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      required={required}
      placeholder="0"
      className="h-8 w-full min-w-0 rounded border px-2 text-sm"
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className="h-8 w-full rounded border px-2 text-sm"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function PriceRow({
  label,
  profit,
  price,
  onProfit,
  onPrice,
}: {
  label: string;
  profit: string;
  price: string;
  onProfit: (value: string) => void;
  onPrice: (value: string) => void;
}) {
  return (
    <tr className="border-t">
      <td className="px-3 py-2 font-bold">
        {label}
      </td>

      <td className="px-3 py-2">
        <NumberInput
          value={profit}
          onChange={onProfit}
        />
      </td>

      <td className="px-3 py-2">
        <NumberInput
          value={price}
          onChange={onPrice}
        />
      </td>
    </tr>
  );
}