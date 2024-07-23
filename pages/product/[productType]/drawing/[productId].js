import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Index from "@/components/client/productDrawing";

const ProductDetailPage = () => {
  const router = useRouter();
  const { productType, drawing, productId } = router.query;

  return (
    <>
      <Index pid={productId} />
    </>
  );
};

export default ProductDetailPage;
