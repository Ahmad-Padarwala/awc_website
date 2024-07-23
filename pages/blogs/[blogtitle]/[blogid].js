import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Index from "@/components/client/blogView";

const BlogDetail = () => {
  const router = useRouter();
  const { blogtitle, blogid } = router.query;
  console.log(router.query);
  
  return (
    <Index bid={blogid} />
  );
};

export default BlogDetail;