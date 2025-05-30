import React from 'react';
import { MenuItem } from '../entities/entities';
import './Foods.css'; 

interface FoodsProps {
    foodItems: MenuItem[];
    // Función para notificar al padre que se seleccionó un item
     onFoodSelected: (food: MenuItem) => void;
  }
  
  function Foods(props: FoodsProps) {
    return (
      <>
        <h4 className="foodTitle">Carta</h4>
        <ul className="ulFoods">
          {props.foodItems.map((item) => (
            <li key={item.id} className="liFoods">
              <img
                className="foodImg"
                src={`/images/${item.image}`}
                alt={item.name}
              />
              <div className="foodItem">
                <p className="foodDesc">{item.desc}</p>
                <p className="foodPrice">{item.price.toFixed(2)}$</p>
              </div>
               {/* BOTÓN PARA SELECCIONAR */}
               <button
                 className="selectFoodButton"
                 onClick={() => props.onFoodSelected(item)}
                 disabled={item.quantity <= 0}
               >
                 {item.quantity > 0 ? 'Pedir este plato' : 'Agotado'}
               </button>
            </li>
          ))}
        </ul>
      </>
    );
  }
  
  export default Foods;
  