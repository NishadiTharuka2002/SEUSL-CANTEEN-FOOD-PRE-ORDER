/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 2: Shopping Cart & Pre-Order Management
 * DEVELOPER: W.G.G.U Weerasiri (SEU/IS/22/ICT/062)
 * FILE: frontend/src/context/CartContext.jsx
 * ====================================================================
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('canteen_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('canteen_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.menuItemId === item._id);
      if (existing) {
        return prevItems.map((i) =>
          i.menuItemId === item._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        return [
          ...prevItems,
          {
            menuItemId: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category,
            quantity: quantity
          }
        ];
      }
    });
  };

  const removeFromCart = (menuItemId) => {
    setCartItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId, qty) => {
    if (qty <= 0) {
      removeFromCart(menuItemId);
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity: qty } : i))
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('canteen_cart');
  };

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
