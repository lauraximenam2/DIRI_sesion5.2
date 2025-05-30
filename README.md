# Entrega 5.2 

## Contexto generado:

## Sin Context, nuesta app realiza lo siguiente:
- App pasa handleUpdateStock como prop a su hijo
- FoodPage (que no usa handleUpdateStock directamente) lo pasa como prop a su hijo LazyFoods.
- LazyFoods (que tampoco lo usa) lo pasa como prop a su hijo FoodOrder.
- Finalmente, FoodOrder usa handleUpdateStock.
- Este proceso pasa props a través de múltiples niveles de componentes que no las necesitan directamente. Todo estp hace que el código sea más difícil de seguir y de refactorizar.

## Para solucionar esto, hemos aplicado un contexto:
- Creamos (src/context/MenuContext.tsx):
  createContext<MenuContextType | undefined>(undefined):
  Esto crea el objeto Context. Le damos un tipo (MenuContextType) que define la "forma" de los datos que este contexto proporcionará (en nuestro caso, menuItems y la función updateStock).

- MenuContextType (Interfaz):
  Define qué contendrá el contexto.
  
- MenuProvider (Componente Proveedor):
  Este es el componente crucial que posee el estado (menuItems usando useState) y la lógica para modificar ese estado (la función updateStock).
  Todo lo que esté envuelto por este Provider (y sus descendientes) tendrá acceso al value que le pasamos.Recibe initialItems para que App pueda definir los datos iniciales del menú.

- useMenu (Hook Personalizado):
  Es una abstracción para consumir el contexto. Hace dos cosas:
  Llama a useContext(MenuContext) para obtener el valor actual del contexto.
  Verifica si el contexto es undefined. Si lo es, significa que el hook se está usando fuera de un MenuProvider, lo cual es un error, por lo que lanza una excepción clara. Esto ayuda a detectar errores de         
  configuración temprano.
  
- Envolver la Aplicación con el MenuProvider (App.tsx):
  Al envolver el contenido principal de App con MenuProvider, todos los componentes descendientes (como AvailableStockView, LazyFoods, FoodOrder) ahora tienen la posibilidad de acceder a menuItems y updateStock     proporcionados por MenuContext.
  App.tsx ya no necesita mantener el estado menuItems ni la función handleUpdateStock directamente, ya que esa responsabilidad se ha delegado a MenuProvider.
  
- Consumir el Contexto en los Componentes Hijos:
  FoodOrder.tsx: Accede a updateStock directamente
  En handleSubmitOrder:
  updateStock(props.food.id, orderQuantity); // Llama a la función del contexto

- FoodOrder ya no recibe onQuantityUpdated como prop. En su lugar, usa el hook useMenu() para obtener la función updateStock directamente del contexto. Cuando se envía un pedido, llama a esta función updateStock    del contexto, la cual modificará el estado menuItems que vive en MenuProvider.
  
- Foods.tsx y AvailableStockView.tsx: Estos componentes ahora obtienen la lista menuItems directamente del contexto usando useMenu(), en lugar de recibirla como prop.
