import React from "react";
import { usePage, Head } from "@inertiajs/react";
import NavBar from "@/Components/NavBar";
import Container from "@/Components/Container";
import ItemPack from "@/Components/Item-pack";

const SearchResult = () => {
  const { props } = usePage();
  const query = props.query ?? "";
  const results = Array.isArray(props.results) ? props.results : [];

  return (
    <>
      <Head title="مركز وسائل الإيضاح" />
      <NavBar page_name="search" />

      <Container>
        {/* 🔹 Top heading */}
        <h2 style={{ marginTop: "20px", marginBottom: "10px" }}>
          Search results for "<strong>{query}</strong>"
        </h2>
        <div className="mt-0">
          {results.length > 0 ? (
            <div
              style={{
                display: "grid",
                gap: "20px",
              }}
            >
              {results.map((p) => (
                <ItemPack
                  key={p.product_id}
                  category_name=""
                  products={[
                    {
                      id: p.product_id,
                      title: p.pr_name,
                      brand: p.brand,
                      description: p.pr_description,
                      price: p.pr_price,
                      image:
                        p.images && p.images.length > 0
                          ? `storage/${p.images[0].photo}`
                          : "imgs/shopping.webp",
                    },
                  ]}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          ) : (
            <p style={{ marginTop: 40 }}>
              No results found for "<strong>{query}</strong>"
            </p>
          )}
        </div>
      </Container>
    </>
  );
};

export default SearchResult;
