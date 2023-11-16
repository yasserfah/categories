import React, { createContext, useContext, useState, useEffect } from "react";

export const CategoryContext = createContext();

 const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch all products
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/categories");
        const data = await response.json();
        const categoriesWithId = data.map((category, index) => ({
          ...category,
          id: category._id,
          
        }));
        setCategories(categoriesWithId);
        console.log(categoriesWithId)
        console.log(data)
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const categoryContextValue = {
    categories,
    // categoriesWithId,
  };
  return (
    <CategoryContext.Provider value={categoryContextValue}>
      {children}
    </CategoryContext.Provider>
  );
};
export default CategoryProvider


