import React from 'react';
import './Foods.css'; 
import { useMenu } from '../context/MenuContext'; 
import { MenuItem } from '../entities/entities'; 

interface FoodsProps {
  onFoodSelected: (food: MenuItem) => void;
}
  
  function Foods(props: FoodsProps) {
    const { menuItems } = useMenu(); // Obtenemos menuItems del contexto

    return (
      <>
        <h4 className="foodTitle">Carta</h4> 
        <ul className="ulFoods">
          {menuItems.map((item) => ( // Usamos menuItems del contexto
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
  