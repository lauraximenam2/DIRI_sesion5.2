
import React, { useState, ChangeEvent, MouseEventHandler, useEffect } from 'react';
import { MenuItem } from '../entities/entities';
import './FoodOrder.css'; 

interface FoodOrderProps {
  food: MenuItem; // El item de comida seleccionado para pedir
  // Función para notificar al padre que se ha enviado un pedido (con ID y cantidad)
  onQuantityUpdated: (id: number, quantity: number) => void;
  // Función para notificar al padre que se quiere volver al menú
  onReturnToMenu: MouseEventHandler<HTMLButtonElement>; 
}

function FoodOrder(props: FoodOrderProps) {

  // Estado para la cantidad que el usuario quiere pedir
  const [orderQuantity, setOrderQuantity] = useState<number>(1); // Empezar pidiendo 1 por defecto

  // Estado para el mensaje de confirmación
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [isOrderSent, setIsOrderSent] = useState<boolean>(false); // 

  // Calcula el precio total basado en la cantidad
  const totalPrice = (props.food.price * orderQuantity).toFixed(2);

  // cambios en el input de cantidad
  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    
    const quantity = parseInt(event.target.value, 10);
    // Valida que sea un número positivo y no mayor al stock 
    if (!isNaN(quantity) && quantity >= 0 ) {
       setOrderQuantity(quantity);
       setConfirmationMessage(''); // Limpia mensaje al cambiar cantidad
    } else if (event.target.value === '') {
        setOrderQuantity(0); 
        setConfirmationMessage('');
    }
  };

  // Manejador para enviar el pedido
  const handleSubmitOrder = () => {
    // Valida que la cantidad sea mayor que 0 antes de enviar
    if (orderQuantity <= 0) {
        setConfirmationMessage('Por favor, introduce una cantidad válida.');
        return;
    }
     // Validar contra stock si se quiere 
    
    if (orderQuantity > props.food.quantity) {
        setConfirmationMessage(`Lo sentimos, solo quedan ${props.food.quantity} disponibles.`);
        return;
    }
    
    // Llama a la función del padre para actualizar la cantidad/stock
    props.onQuantityUpdated(props.food.id, orderQuantity);

    // Requisito AC 5.1 - Mostrar mensaje de confirmación
    setConfirmationMessage(`Pedido de ${orderQuantity} x ${props.food.name} enviado. ¡Gracias!`);
    setIsOrderSent(true); //Pedido enviado
  };

  // Resetea el mensaje si el 'food' prop cambia 
  useEffect(() => {
    setConfirmationMessage('');
    setOrderQuantity(1); // Resetea cantidad al cambiar de item
    setIsOrderSent(false);
  }, [props.food]);


  return (
    <div className="foodOrderContainer">
      <h3>Detalles del Pedido</h3>
      <div className="orderDetails">
        <img
          className="orderFoodImg"
          src={`/images/${props.food.image}`}
          alt={props.food.name}
        />
        <div className="orderInfo">
          <h4>{props.food.name}</h4>
          <p className="orderDesc">{props.food.desc}</p>
          <p className="orderBasePrice">Precio unitario: {props.food.price.toFixed(2)}$</p>

          {/* Input para la cantidad */}
          <div className="quantityControl">
            <label htmlFor={`quantity-${props.food.id}`}>Cantidad:</label>
            <input
              type="number"
              id={`quantity-${props.food.id}`}
              name="quantity"
              min="0" 
              value={orderQuantity}
              onChange={handleQuantityChange}
              className="quantityInput"
              disabled={isOrderSent} 
            />
          </div>

          {/* Precio total calculado */}
          <p className="orderTotalPrice">Precio Total: {totalPrice}$</p>
        </div>
      </div>

      {/* Mensaje de confirmación */}
      {/* Requisito AC 5.1 - Área para mensaje de confirmación */}
      {confirmationMessage && (
        <p className={`confirmationMessage ${isOrderSent && confirmationMessage.includes('enviado') ? 'success' : 'error'}`}>
          {confirmationMessage}
        </p>
      )}

      {/* Botones de acción */}
      <div className="orderActions">
        {/*Requisito AC 5.1 - Botón Enviar Pedido */}
        <button
          onClick={handleSubmitOrder}
          className="submitOrderButton"
          disabled={orderQuantity <= 0 || isOrderSent} // Deshabilitar si cantidad es 0 o si ya se envió
        >
          {isOrderSent ? 'Pedido Enviado' : 'Enviar Pedido'}
        </button>
        <button onClick={props.onReturnToMenu} className="returnMenuButton">
          Volver al menú
        </button>
      </div>
    </div>
  );
}

export default FoodOrder;
