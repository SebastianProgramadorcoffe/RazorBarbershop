#variables de entrada
nombre_Producto = input("Ingrese nombre del produto: ")
precio_Producto = float(input("Ingrese el precio del producto: "))
Cantidad_productos = int(input("Ingrese la cantidad: "))

IMPUESTO = 0.16 #Impuesto del 16%
precio_cantidad = precio_Producto * Cantidad_productos
impuesto_Producto = precio_cantidad * IMPUESTO
print("***Factura electronica***")
print(f"""Nombre del Producto: {nombre_Producto}\n
Precio final del producto: {precio_cantidad + impuesto_Producto}\n
Cantidad comprada: {Cantidad_productos}        
""")