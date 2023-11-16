import React, { createContext, useContext, useState, useEffect } from "react";
export const SubCategoryContext = createContext();

 const SubCategoryProvider = ({ children }) => {
  const [subcategories, setSubCategories] = useState([]);

  useEffect(() => {
    // Fetch all products
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/subcategories");
        const data = await response.json();
        const subcategoriesWithId = data.data?.map((subcategory, index) => ({
          ...subcategory,
          id: subcategory._id,
          
        }));
        setSubCategories(subcategoriesWithId);
        console.log(subcategoriesWithId)
        console.log(data)
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const SubCategoryContextValue = {
    subcategories,
    // categoriesWithId,
  };
  return (
    <SubCategoryContext.Provider value={SubCategoryContextValue}>
      {children}
    </SubCategoryContext.Provider>
  );
};
export default SubCategoryProvider