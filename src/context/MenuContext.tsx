// src/context/MenuContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MenuItem } from '../entities/entities';

// Tipo para el valor del contexto
interface MenuContextType {
  menuItems: MenuItem[];
  updateStock: (id: number, orderedQuantity: number) => void;
}

// Creamos el contexto con un valor por defecto 
export const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Hook personalizado para usar el contexto 
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

// Componente Proveedor
interface MenuProviderProps {
  children: ReactNode;
  initialItems: MenuItem[]; // Para pasar los items iniciales desde App
}

export const MenuProvider: React.FC<MenuProviderProps> = ({ children, initialItems }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialItems);

  const updateStock = (id: number, orderedQuantity: number) => {
    console.log(`CONTEXT: Pedido recibido - ID: ${id}, Cantidad: ${orderedQuantity}`);
    setMenuItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity - orderedQuantity;
          console.log(`CONTEXT: Actualizando stock para ${item.name}. Antes: ${item.quantity}, Pedido: ${orderedQuantity}, Ahora: ${newQuantity}`);
          return {
            ...item,
            quantity: newQuantity >= 0 ? newQuantity : 0,
          };
        }
        return item;
      })
    );
  };

  return (
    <MenuContext.Provider value={{ menuItems, updateStock }}>
      {children}
    </MenuContext.Provider>
  );
};