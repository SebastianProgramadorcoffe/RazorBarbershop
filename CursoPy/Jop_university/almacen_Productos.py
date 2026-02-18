#Primero creamos una lista para almacenar los datos que ingresen
lista_Productos = []

while True:
    nombre_Producto = input("Ingrese el producto (salir para terminar): ")
    if nombre_Producto.lower() == "salir":
        break
    precio = float(input("Precio del producto: "))
    lista_Productos.append((nombre_Producto, precio))
print("***Lista de productos***")
print("--------------------------------")
for nombre_Producto, precio in lista_Productos:
    print(nombre_Producto, "-", precio)
print("--------------------------------")
#Lista ordenada
print("***Lista ordenada***")
print("--------------------------------")

lista_ordenada = sorted(lista_Productos)

for nombre_Producto, precio in lista_ordenada:
    print(nombre_Producto, "-", precio)
print("--------------------------------")