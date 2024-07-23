import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Index from "@/components/client/productCategory";

const ProductDetailPage = () => {
  const router = useRouter();
  const { productCategoryType, productCatgoryId } = router.query;
  console.log(router.query);
  
  return (
    <Index cid={productCatgoryId} />
  );
};

export default ProductDetailPage;
