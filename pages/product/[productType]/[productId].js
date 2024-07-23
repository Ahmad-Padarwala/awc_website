import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Index from "@/components/client/productView";

const ProductDetailPage = () => {
  const router = useRouter();
  const { productType, productId } = router.query;
  console.log(productId)
  return (
    <>
      <Index pid={productId} />
    </>
  );
};

export default ProductDetailPage;
