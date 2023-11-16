import React from "react";
import Container from "../../Features/categories/Container";
import CategoryProvider from "../../Features/categories/Context";
import SubCategoryProvider from "../../Features/categories/components/subcategoryContext";
const Categories = () => {
  return <CategoryProvider>
    <SubCategoryProvider>
    <Container />
   </SubCategoryProvider>
    
  </CategoryProvider> ;
};

export default Categories;
