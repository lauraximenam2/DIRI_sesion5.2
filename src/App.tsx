/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, Suspense } from 'react';
import { MenuItem } from './entities/entities';
import './App.css';
import FoodOrder from './components/FoodOrder';
import { MenuProvider, useMenu } from './context/MenuContext'; 

//Usamos React.lazy para cargar el componente Foods de forma diferida
const LazyFoods = React.lazy(() => import("./components/Foods"));

  //Estado inicial de los elementos del menú
  const initialMenuItemsData: MenuItem[] = [    
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
    }
  ];


function App() { // Ahora, el estado menuItems y ls lógica de updateStock está en MENUPROVIDER

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
    setSelectedFoodItem(null); // Limpia la selección vuelve a la vista Foods
  };

// LA FUNCIÓN handleUpdateStock SE HA MOVIDO AL MenuProvider.

  return (
  <MenuProvider initialItems={initialMenuItemsData}>
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

      {/* Ahora la vista de disponibilidad leerá menuITems del conexto*/}
      {!isChooseFoodPage && (
          <AvailableStockView /> // Componente que consume el contexto para mostrar stock
        )}

        {isChooseFoodPage && (
          <>
            {!selectedFoodItem && (
              <Suspense fallback={<div className="loadingFallback">Cargando carta ......</div>}>
                {/* LazyFoods podría también tomar menuItems del contexto */}
                <LazyFoods
                  onFoodSelected={handleSelectFood}
                />
              </Suspense>
            )}

            {selectedFoodItem && (
              <FoodOrder
                food={selectedFoodItem}
                onReturnToMenu={handleReturnToMenu}
              />
            )}
          </>
        )}
      </div>
    </MenuProvider>
  );
}

// Componente separado para mostrar el stock disponible usando el contexto
const AvailableStockView = () => {
  const { menuItems } = useMenu(); 

  return (
    <>
      <h4 className="subTitle">Menús Disponibles</h4>
      <ul className="ulApp">
        {menuItems.map((item) => (
          <li key={item.id} className="liApp">
            <p>{item.name}</p>
            <p>#{item.quantity}</p>
          </li>
        ))}
      </ul>
    </>
  );
};


export default App;