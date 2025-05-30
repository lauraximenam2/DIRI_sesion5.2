/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, Suspense } from 'react';
import { MenuItem } from './entities/entities';
import './App.css';
import FoodOrder from './components/FoodOrder';

//Usamos React.lazy para cargar el componente Foods de forma diferida
const LazyFoods = React.lazy(() => import("./components/Foods"));

function App() {

  //Estado inicial de los elementos del menú
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 1,
      name: "Hamburguesa de Pollo",
      quantity: 40,
      desc: "Hamburguesa de pollo frito crujiente con lechuga, tomate y mayonesa especial.",
      price: 30,
      image: "cb.png",
    },
    {
      id: 2,
      name: "Patatas Fritas",
      quantity: 40,
      desc: "Patatas Fritas simples, crujientes y doradas.",
      price: 15,
      image: "chips.png",
    },
    {
      id: 3,
      name: "Hamburguesas Vegetarianas",
      quantity: 40,
      desc: "Hamburguesas verde, lechuga, tomate, queso vegano y mayonesa vegana.",
      price: 20,
      image: "hv.png",
    },
    {
      id: 4,
      name: "Helado",
      quantity: 40,
      desc: "Helado de fresa, chocolate o vainilla.",
      price: 5,
      image: "ice.png",
    },
  ]);

  //Estado para controlar la vista principal (Disponibilidad o Pedir Comida)
  const [isChooseFoodPage, setIsChooseFoodPage] = useState(false); 

  //Guarda el item seleccionado para pedir
  const [selectedFoodItem, setSelectedFoodItem] = useState<MenuItem | null>(null);

  //Función para manejar la selección de un item desde Foods
  const handleSelectFood = (food: MenuItem) => {
    setSelectedFoodItem(food);

  };

  // Función para manejar la vuelta al menú desde FoodOrder
  const handleReturnToMenu = () => {
    setSelectedFoodItem(null); // Limpiar la selección vuelve a la vista Foods
  };

  // Función para actualizar el stock cuando se confirma un pedido
  // Requisito AC 5.1 - Propagar cambios al padre (App)
  const handleUpdateStock = (id: number, orderedQuantity: number) => {
    console.log(`APP: Pedido recibido - ID: ${id}, Cantidad: ${orderedQuantity}`);
    setMenuItems(prevItems => {

      // Creamos una NUEVA copia del array para actualizar el estado
      const newItems = prevItems.map(item => {
        if (item.id === id) {
          // Si es el item correcto, crea un NUEVO objeto item con la cantidad actualizada
          const newQuantity = item.quantity - orderedQuantity;
          console.log(`APP: Actualizando stock para ${item.name}. Antes: ${item.quantity}, Pedido: ${orderedQuantity}, Ahora: ${newQuantity}`); // Log
          return {
            ...item, // Copia las propiedades existentes
            quantity: newQuantity >= 0 ? newQuantity : 0 // Actualiza la cantidad
          };
        }
        return item;
      });
      return newItems; 
    });


  };

  return (
    <div className="App">
      <button
        className="toggleButton"
        onClick={() => {
            setIsChooseFoodPage(!isChooseFoodPage);
            setSelectedFoodItem(null); // Limpia selección al cambiar de vista principal
        }}
      >
        {isChooseFoodPage ? "Ver Disponibilidad" : "Pedir Comida"}
      </button>

      <h3 className="title">Comida Rápida Online</h3>

      {/* Vista de Disponibilidad */}
      {!isChooseFoodPage && (
        <>
          <h4 className="subTitle">Menús Disponibles</h4>
          <ul className="ulApp">
            {menuItems.map((item) => (
              <li key={item.id} className="liApp">
                <p>{item.name}</p>
                {/* Requisito AC 5.1 - Mostrar stock actualizado */}
                <p>#{item.quantity}</p>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Vista de Pedir Comida (Carta o Detalles del pedido) */}
      {isChooseFoodPage && (
        <> {}
          {/* Si NO hay un item seleccionado, muestra la carta (LazyFoods) */}
          {!selectedFoodItem && (
            <Suspense fallback={<div className="loadingFallback">Cargando carta ......</div>}>
              <LazyFoods
                foodItems={menuItems}
                onFoodSelected={handleSelectFood} // Pasar la función de selección
              />
            </Suspense>
          )}

          {/* Si HAY un item seleccionado, muestra el formulario de pedido (FoodOrder) */}
          {selectedFoodItem && (
            <FoodOrder
              food={selectedFoodItem} // Pasar el item seleccionado
              onQuantityUpdated={handleUpdateStock} // Pasar la función de actualizar stock
              onReturnToMenu={handleReturnToMenu} // Pasar la función para volver
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;